import { useState } from 'react';
import { FileText, Phone, Mail, User, Calendar, CheckCircle2, Clock, XCircle, AlertCircle, MessageSquare, UserPlus, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ChatModal from '../components/ChatModal';
import type { QuoteStatus, QuoteServiceType, QuoteClientType } from '../types';

const statusConfig: Record<QuoteStatus, { label: string; color: string; icon: typeof Clock }> = {
  new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  contacted: { label: 'Contacté', color: 'bg-purple-100 text-purple-800', icon: Phone },
  quoted: { label: 'Devis envoyé', color: 'bg-yellow-100 text-yellow-800', icon: FileText },
  accepted: { label: 'Accepté', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  rejected: { label: 'Refusé', color: 'bg-red-100 text-red-800', icon: XCircle },
  completed: { label: 'Complété', color: 'bg-gray-100 text-gray-800', icon: CheckCircle2 }
};

const serviceTypeLabels: Record<QuoteServiceType, string> = {
  'depannage-reparation': 'Dépannage et réparation',
  'entretien': 'Entretien',
  'renovation-construction': 'Rénovation / Construction',
  'installation': 'Installation'
};

const clientTypeLabels: Record<QuoteClientType, string> = {
  'residential': 'Résidentiel',
  'commercial': 'Commercial',
  'industriel': 'Industriel'
};

export default function Soumissions() {
  const { quoteSubmissions, updateQuoteSubmission } = useApp();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'in-progress' | 'completed'>('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [selectedQuoteForInvite, setSelectedQuoteForInvite] = useState<string | null>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedChatQuote, setSelectedChatQuote] = useState<any>(null);
  const navigate = useNavigate();

  const filteredQuotes = quoteSubmissions.filter(quote => {
    if (activeTab === 'all') return true;
    if (activeTab === 'new') return quote.status === 'new';
    if (activeTab === 'in-progress') return ['contacted', 'quoted'].includes(quote.status);
    if (activeTab === 'completed') return ['accepted', 'rejected', 'completed'].includes(quote.status);
    return true;
  });

  const handleStatusChange = (quoteId: string, newStatus: QuoteStatus) => {
    const updates: any = { status: newStatus };
    
    if (newStatus === 'contacted' && !quoteSubmissions.find(q => q.id === quoteId)?.contactedAt) {
      updates.contactedAt = new Date().toISOString();
    }
    
    updateQuoteSubmission(quoteId, updates);
    toast.success(`Statut mis à jour: ${statusConfig[newStatus].label}`);
  };

  const handleAddNote = (quoteId: string) => {
    if (!notes.trim()) {
      toast.error('Veuillez entrer une note');
      return;
    }

    const quote = quoteSubmissions.find(q => q.id === quoteId);
    const existingNotes = quote?.notes || '';
    const timestamp = new Date().toLocaleString('fr-CA');
    const newNote = `[${timestamp}] ${notes}\n${existingNotes}`;
    
    updateQuoteSubmission(quoteId, { notes: newNote });
    setNotes('');
    toast.success('Note ajoutée');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const newCount = quoteSubmissions.filter(q => q.status === 'new').length;
  const inProgressCount = quoteSubmissions.filter(q => ['contacted', 'quoted'].includes(q.status)).length;
  const completedCount = quoteSubmissions.filter(q => ['accepted', 'rejected', 'completed'].includes(q.status)).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demandes de soumission</h1>
          <p className="text-muted-foreground mt-1">Gérez les demandes de devis des clients potentiels</p>
        </div>
        <Button
          onClick={() => navigate('/soumissions/new')}
          className="bg-[var(--primary)] hover:bg-[var(--accent-blue)]"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle soumission
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{quoteSubmissions.length}</p>
              </div>
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nouveaux</p>
                <p className="text-3xl font-bold text-blue-600">{newCount}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-3xl font-bold text-yellow-600">{inProgressCount}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Complétés</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList>
          <TabsTrigger value="all">Toutes ({quoteSubmissions.length})</TabsTrigger>
          <TabsTrigger value="new">Nouvelles ({newCount})</TabsTrigger>
          <TabsTrigger value="in-progress">En cours ({inProgressCount})</TabsTrigger>
          <TabsTrigger value="completed">Complétées ({completedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQuotes.length === 0 ? (
              <Card className="col-span-2">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune demande de soumission</p>
                </CardContent>
              </Card>
            ) : (
              filteredQuotes.map((quote) => {
                const StatusIcon = statusConfig[quote.status].icon;
                
                return (
                  <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            {quote.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={statusConfig[quote.status].color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[quote.status].label}
                            </Badge>
                            <Badge variant="outline">
                              {serviceTypeLabels[quote.serviceType]}
                            </Badge>
                            <Badge variant="secondary">
                              {clientTypeLabels[quote.clientType]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a href={`tel:${quote.phone}`} className="hover:underline text-blue-600">
                            {quote.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a href={`mailto:${quote.email}`} className="hover:underline text-blue-600">
                            {quote.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(quote.createdAt)}
                        </div>
                        {quote.contactedAt && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Contacté le {formatDate(quote.contactedAt)}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium mb-1">Description:</p>
                        <p className="text-sm text-gray-700">{quote.description}</p>
                      </div>

                      {/* Notes */}
                      {quote.notes && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium mb-1 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Notes:
                          </p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="space-y-3">
                        {/* Communication buttons */}
                        <div className="flex flex-wrap gap-2 pb-3 border-b">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              window.location.href = `tel:${quote.phone}`;
                              toast.success(`Appel en cours vers ${quote.phone}`);
                            }}
                            className="flex-1"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Appeler
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              window.location.href = `mailto:${quote.email}?subject=Demande de soumission - ${serviceTypeLabels[quote.serviceType]}`;
                              toast.success('Ouverture du client email...');
                            }}
                            className="flex-1"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setChatModalOpen(true);
                              setSelectedChatQuote(quote);
                            }}
                            className="flex-1"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </div>

                        {/* Send Portal Invitation */}
                        {quote.status === 'accepted' && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">\
                            <p className="text-sm font-medium text-green-900 mb-2">Client accepté - Créer un accès portail</p>
                            <Button
                              size="sm"
                              onClick={() => {
                                // Generate temporary password
                                const tempPassword = Math.random().toString(36).slice(-8);
                                
                                // Store client credentials (in production, this would be API call)
                                const clientData = {
                                  email: quote.email,
                                  name: quote.name,
                                  phone: quote.phone,
                                  password: tempPassword,
                                  role: 'client',
                                  createdAt: new Date().toISOString()
                                };
                                
                                const existingClients = JSON.parse(localStorage.getItem('clientPortalUsers') || '[]');
                                if (!existingClients.find((c: any) => c.email === quote.email)) {
                                  localStorage.setItem('clientPortalUsers', JSON.stringify([...existingClients, clientData]));
                                }
                                
                                // Send email notification (simulated)
                                const emailBody = `Bonjour ${quote.name},\\n\\nVotre accès au portail client Plomberie D'Experts est maintenant actif !\\n\\nVoici vos identifiants :\\nEmail: ${quote.email}\\nMot de passe temporaire: ${tempPassword}\\n\\nConnectez-vous sur: ${window.location.origin}/client-portal\\n\\nCordialement,\\nL'équipe Plomberie D'Experts`;
                                
                                // Open email client with pre-filled message
                                window.location.href = `mailto:${quote.email}?subject=Accès au portail client - Plomberie D'Experts&body=${encodeURIComponent(emailBody)}`;
                                
                                toast.success("Email d'invitation envoyé avec succès!", {
                                  description: `Mot de passe temporaire: ${tempPassword}`
                                });
                              }}
                              className="bg-green-600 hover:bg-green-700 w-full"
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Envoyer accès portail client
                            </Button>
                          </div>
                        )}

                        {/* Status buttons */}
                        <div className="flex flex-wrap gap-2">
                          {quote.status === 'new' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(quote.id, 'contacted')}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Marquer contacté
                              </Button>
                            </>
                          )}
                          {quote.status === 'contacted' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(quote.id, 'quoted')}
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Devis envoyé
                            </Button>
                          )}
                          {quote.status === 'quoted' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(quote.id, 'accepted')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Accepté
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(quote.id, 'rejected')}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Refusé
                              </Button>
                            </>
                          )}
                          {['accepted', 'rejected'].includes(quote.status) && quote.status !== 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(quote.id, 'completed')}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Marquer complété
                            </Button>
                          )}
                        </div>

                        {/* Add note section */}
                        {selectedQuote === quote.id ? (
                          <div className="space-y-2">
                            <Label>Ajouter une note</Label>
                            <Textarea
                              placeholder="Entrez vos notes ici..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAddNote(quote.id)}
                              >
                                Sauvegarder
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedQuote(null);
                                  setNotes('');
                                }}
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedQuote(quote.id)}
                            className="w-full"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Ajouter une note
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inviter un client</DialogTitle>
            <DialogDescription>
              Ajoutez un client à votre liste de soumissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowInviteDialog(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!inviteName || !inviteEmail) {
                  toast.error('Veuillez remplir tous les champs');
                  return;
                }
                const newQuoteId = `quote-${Date.now()}`;
                updateQuoteSubmission(newQuoteId, {
                  id: newQuoteId,
                  name: inviteName,
                  email: inviteEmail,
                  phone: '',
                  description: '',
                  status: 'new',
                  serviceType: 'depannage-reparation',
                  clientType: 'residential',
                  createdAt: new Date().toISOString(),
                  contactedAt: null,
                  notes: ''
                });
                toast.success('Client invité avec succès');
                setShowInviteDialog(false);
                setInviteName('');
                setInviteEmail('');
              }}
            >
              Inviter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      {selectedChatQuote && (
        <ChatModal
          open={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false);
            setSelectedChatQuote(null);
          }}
          clientName={selectedChatQuote.name}
          clientEmail={selectedChatQuote.email}
          clientPhone={selectedChatQuote.phone}
          clientId={selectedChatQuote.id}
        />
      )}
    </div>
  );
}