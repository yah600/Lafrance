import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { AfterSalesPriority, AfterSalesClaimType } from '../../types/aftersales';

interface PlumberClaimResponseProps {
  claim: {
    id: string;
    type: AfterSalesClaimType;
    priority: AfterSalesPriority;
    description: string;
    photos: any[];
    createdAt: Date;
    holdAmount: number;
    clientName: string;
    address: string;
  };
  onAccept: (response: string, appointmentDate?: Date) => void;
  onDispute: (response: string) => void;
}

export function PlumberClaimResponse({
  claim,
  onAccept,
  onDispute,
}: PlumberClaimResponseProps) {
  const [response, setResponse] = useState('');
  const [action, setAction] = useState<'accept' | 'dispute' | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate deadline based on priority
  const getDeadline = () => {
    const created = new Date(claim.createdAt);
    switch (claim.priority) {
      case AfterSalesPriority.URGENT:
        return new Date(created.getTime() + 60 * 60 * 1000); // 1 hour
      case AfterSalesPriority.IMPORTANT:
        return new Date(created.getTime() + 48 * 60 * 60 * 1000); // 48 hours
      case AfterSalesPriority.AESTHETIC:
        return new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      default:
        return new Date();
    }
  };

  const deadline = getDeadline();

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const difference = deadline.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0 });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ hours, minutes });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [deadline]);

  const isOverdue = timeLeft.hours === 0 && timeLeft.minutes === 0;

  const handleSubmit = async () => {
    if (!action) {
      toast.error('Veuillez choisir une action');
      return;
    }

    if (!response.trim()) {
      toast.error('Veuillez fournir une réponse');
      return;
    }

    if (action === 'accept' && !appointmentDate) {
      toast.error('Veuillez sélectionner une date de rendez-vous');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (action === 'accept') {
        onAccept(response, appointmentDate ? new Date(appointmentDate) : undefined);
        toast.success('Réclamation acceptée', {
          description: 'Le client sera notifié de votre rendez-vous.',
        });
      } else {
        onDispute(response);
        toast.success('Contestation soumise', {
          description: 'Un administrateur va examiner la réclamation.',
        });
      }
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (type: AfterSalesClaimType): string => {
    switch (type) {
      case AfterSalesClaimType.WARRANTY:
        return 'Garantie';
      case AfterSalesClaimType.DAMAGE:
        return 'Dommage';
      case AfterSalesClaimType.DISSATISFACTION:
        return 'Insatisfaction';
      default:
        return type;
    }
  };

  const getPriorityLabel = (priority: AfterSalesPriority): string => {
    switch (priority) {
      case AfterSalesPriority.URGENT:
        return 'Urgent (1h)';
      case AfterSalesPriority.IMPORTANT:
        return 'Important (48h)';
      case AfterSalesPriority.AESTHETIC:
        return 'Esthétique (7j)';
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-6">
      {/* Deadline Warning */}
      <Card className={isOverdue ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50'}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            {isOverdue ? (
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
            ) : (
              <Clock className="h-6 w-6 text-orange-600 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${isOverdue ? 'text-red-900' : 'text-orange-900'}`}>
                {isOverdue ? 'Délai dépassé!' : 'Temps restant pour répondre'}
              </h3>
              {isOverdue ? (
                <p className="text-sm text-red-800">
                  Le délai de réponse est écoulé. La réclamation sera automatiquement escaladée à un
                  administrateur.
                </p>
              ) : (
                <>
                  <p className="text-sm text-orange-800 mb-2">
                    <span className="text-3xl font-bold tabular-nums">
                      {timeLeft.hours}h {String(timeLeft.minutes).padStart(2, '0')}m
                    </span>
                  </p>
                  <p className="text-xs text-orange-700">
                    Date limite: {deadline.toLocaleString('fr-CA')}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Hold Notice */}
      <Card className="border-amber-300 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm text-amber-800">
                <span className="font-bold">{claim.holdAmount.toFixed(2)} $</span> est retenu de votre
                paiement jusqu'à la résolution de cette réclamation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claim Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Réclamation {claim.id}</CardTitle>
              <CardDescription>{claim.clientName}</CardDescription>
            </div>
            <div className="text-right space-y-1">
              <Badge
                className={
                  claim.type === AfterSalesClaimType.DAMAGE
                    ? 'bg-red-600'
                    : claim.type === AfterSalesClaimType.WARRANTY
                    ? 'bg-orange-600'
                    : 'bg-yellow-600'
                }
              >
                {getTypeLabel(claim.type)}
              </Badge>
              <Badge
                className={
                  claim.priority === AfterSalesPriority.URGENT
                    ? 'bg-red-600'
                    : claim.priority === AfterSalesPriority.IMPORTANT
                    ? 'bg-orange-600'
                    : 'bg-yellow-600'
                }
              >
                {getPriorityLabel(claim.priority)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-gray-600">Adresse:</span>
            <p className="font-medium">{claim.address}</p>
          </div>

          <div>
            <span className="text-sm text-gray-600">Date de soumission:</span>
            <p className="font-medium">{new Date(claim.createdAt).toLocaleString('fr-CA')}</p>
          </div>

          <Separator />

          <div>
            <span className="text-sm font-semibold text-gray-700 block mb-2">
              Description du client:
            </span>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{claim.description}</p>
          </div>

          {/* Photos */}
          {claim.photos.length > 0 && (
            <div>
              <span className="text-sm font-semibold text-gray-700 block mb-2">
                Photos du problème ({claim.photos.length}):
              </span>
              <div className="grid grid-cols-3 gap-3">
                {claim.photos.map((photo) => (
                  <div key={photo.id} className="bg-gray-200 rounded-lg h-24 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Selection */}
      {!isOverdue && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Votre réponse</CardTitle>
              <CardDescription>Acceptez la réclamation ou contestez-la</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={action === 'accept' ? 'default' : 'outline'}
                  className={action === 'accept' ? 'bg-green-600 hover:bg-green-700' : ''}
                  onClick={() => setAction('accept')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accepter
                </Button>
                <Button
                  variant={action === 'dispute' ? 'default' : 'outline'}
                  className={action === 'dispute' ? 'bg-red-600 hover:bg-red-700' : ''}
                  onClick={() => setAction('dispute')}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Contester
                </Button>
              </div>

              {action === 'accept' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      En acceptant, vous vous engagez à résoudre le problème. Proposez une date de
                      rendez-vous pour effectuer les corrections.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date de rendez-vous proposée
                    </label>
                    <input
                      type="datetime-local"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {action === 'dispute' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-sm text-red-800">
                    En contestant, la réclamation sera examinée par un administrateur. Fournissez une
                    explication détaillée avec preuves si possible.
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Votre explication
                </label>
                <Textarea
                  rows={6}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder={
                    action === 'accept'
                      ? 'Confirmez que vous allez effectuer les corrections et expliquez comment...'
                      : action === 'dispute'
                      ? 'Expliquez pourquoi vous contestez cette réclamation avec des détails précis...'
                      : 'Choisissez d\'abord une action (Accepter ou Contester)'
                  }
                  disabled={!action}
                  className="resize-none"
                />
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={!action || isSubmitting || !response.trim()}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre la réponse'}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
