import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Image as ImageIcon,
  DollarSign,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { mockDataService } from '../../services/mockDataService';
import { JobUrgency } from '../../types/bidding';

export default function AdminReviewQueue() {
  const navigate = useNavigate();
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [adminNote, setAdminNote] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    loadPendingJobs();
    // Refresh every 10 seconds for new jobs
    const interval = setInterval(loadPendingJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadPendingJobs = () => {
    const jobs = mockDataService.getJobsByStatus('pending_review');
    setPendingJobs(jobs);
  };

  const handleApprove = async (job: any) => {
    try {
      // Calculate bidding times
      const now = new Date();
      const biddingDuration = job.urgency === JobUrgency.URGENT ? 5 * 60 * 1000 : 2 * 60 * 60 * 1000;
      const biddingEndTime = new Date(now.getTime() + biddingDuration);

      // Transition to in_bet status
      const updated = mockDataService.updateJob(job.id, {
        status: 'in_bet',
        biddingStartTime: now,
        biddingEndTime,
        adminNote,
        approvedBy: 'admin-1', // Would come from auth context
        approvedAt: now,
      });

      if (updated) {
        toast.success(`Job ${job.id} approuvé et envoyé au BET marketplace`);
        toast.info(
          job.urgency === JobUrgency.URGENT
            ? 'Période d\'enchère: 5 minutes'
            : 'Période d\'enchère: 2 heures'
        );

        loadPendingJobs();
        setSelectedJob(null);
        setAdminNote('');
      }
    } catch (error) {
      console.error('Error approving job:', error);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (job: any) => {
    if (!adminNote.trim()) {
      toast.error('Veuillez entrer une raison pour le rejet');
      return;
    }

    try {
      const updated = mockDataService.updateJob(job.id, {
        status: 'cancelled',
        cancelReason: adminNote,
        cancelledBy: 'admin-1',
        cancelledAt: new Date(),
      });

      if (updated) {
        toast.success(`Job ${job.id} rejeté`);
        toast.info('Le client sera notifié par email');

        loadPendingJobs();
        setSelectedJob(null);
        setAdminNote('');
      }
    } catch (error) {
      console.error('Error rejecting job:', error);
      toast.error('Erreur lors du rejet');
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      message: chatMessage,
      timestamp: new Date(),
    };

    setChatHistory([...chatHistory, message]);
    setChatMessage('');
    toast.success('Message envoyé au client');

    // Simulate client response after 2 seconds
    setTimeout(() => {
      const clientResponse = {
        id: `msg-${Date.now()}`,
        sender: 'client',
        message: 'Merci pour votre réponse. Je reste disponible pour toute question.',
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, clientResponse]);
    }, 2000);
  };

  const getUrgencyBadge = (urgency: JobUrgency) => {
    switch (urgency) {
      case JobUrgency.URGENT:
        return <Badge variant="destructive">URGENT</Badge>;
      case JobUrgency.NORMAL:
        return <Badge variant="secondary">Non-urgent</Badge>;
      default:
        return <Badge variant="outline">Soumission</Badge>;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `Il y a ${seconds}s`;
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)}min`;
    return `Il y a ${Math.floor(seconds / 3600)}h`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            File d'attente de révision
          </h1>
          <p className="text-gray-600 mt-2">
            Approuvez ou rejetez les demandes de service des clients
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-3xl font-bold">{pendingJobs.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgents</p>
                  <p className="text-3xl font-bold text-red-600">
                    {pendingJobs.filter((j) => j.urgency === JobUrgency.URGENT).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Temps moyen</p>
                  <p className="text-3xl font-bold">8min</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Job Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Demandes en attente ({pendingJobs.length})
            </h2>

            {pendingJobs.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune demande en attente</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Toutes les demandes ont été traitées
                  </p>
                </CardContent>
              </Card>
            )}

            {pendingJobs.map((job) => (
              <Card
                key={job.id}
                className={`cursor-pointer transition-all ${
                  selectedJob?.id === job.id ? 'ring-2 ring-primary' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {job.id}
                        {getUrgencyBadge(job.urgency)}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Soumis {formatTimeAgo(job.createdAt)}
                      </CardDescription>
                    </div>
                    {job.urgency === JobUrgency.URGENT && (
                      <Badge variant="destructive" className="animate-pulse">
                        ⚡ URGENT
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{job.address}</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 line-clamp-2">{job.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <ImageIcon className="h-4 w-4" />
                      {job.photos?.length || 0} photos
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      {job.estimatedPrice} $
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                      }}
                    >
                      Réviser
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Column - Job Details */}
          <div className="lg:sticky lg:top-6 h-fit">
            {selectedJob ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Détails de la demande</span>
                    {getUrgencyBadge(selectedJob.urgency)}
                  </CardTitle>
                  <CardDescription>{selectedJob.id}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Job Info */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">
                        {selectedJob.description}
                      </p>
                    </div>

                    {selectedJob.originalDescription && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Description originale du client
                        </Label>
                        <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg">
                          {selectedJob.originalDescription}
                        </p>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Adresse</Label>
                      <p className="text-sm text-gray-900 mt-1">{selectedJob.address}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Photos</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {selectedJob.photos?.map((photo: string, index: number) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chat (Mock) */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Chat avec le client
                    </Label>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3 h-32 overflow-y-auto space-y-2">
                      {chatHistory.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Aucun message. Démarrez la conversation.
                        </p>
                      )}
                      {chatHistory.map((msg) => (
                        <div
                          key={msg.id}
                          className={`text-sm p-2 rounded ${
                            msg.sender === 'admin'
                              ? 'bg-blue-100 text-blue-900 ml-4'
                              : 'bg-white text-gray-900 mr-4'
                          }`}
                        >
                          <p className="font-medium text-xs mb-1">
                            {msg.sender === 'admin' ? 'Vous' : 'Client'}
                          </p>
                          <p>{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Message au client..."
                        rows={2}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={handleSendMessage} disabled={!chatMessage.trim()}>
                        Envoyer
                      </Button>
                    </div>
                  </div>

                  {/* Admin Note */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Note interne (optionnel)</Label>
                    <Textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Ajouter une note interne..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={() => handleApprove(selectedJob)}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Approuver
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      size="lg"
                      onClick={() => handleReject(selectedJob)}
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Rejeter
                    </Button>
                  </div>

                  {selectedJob.urgency === JobUrgency.URGENT && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800 font-medium">
                        ⏱️ Appel urgent: 5 minutes de période d'enchère
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        Le plombier gagnant doit arriver dans l'heure
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Sélectionnez une demande pour voir les détails</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium ${className}`}>{children}</label>;
}
