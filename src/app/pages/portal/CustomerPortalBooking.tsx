import { useState } from 'react';
import { Calendar, Clock, Wrench, MapPin, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

const services = [
  { id: 'drain', name: 'Débouchage', price: 150, duration: '1h', icon: '💧' },
  { id: 'heater', name: 'Chauffe-eau', price: 800, duration: '3h', icon: '🔥' },
  { id: 'faucet', name: 'Robinetterie', price: 200, duration: '1.5h', icon: '🚿' },
  { id: 'emergency', name: 'Urgence 24h', price: 300, duration: '1h', icon: '⚡' },
  { id: 'inspection', name: 'Inspection', price: 120, duration: '45min', icon: '🔍' }
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
];

export default function CustomerPortalBooking() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [description, setDescription] = useState('');

  const handleBooking = () => {
    toast.success('Service réservé avec succès!');
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: 'Service' },
          { num: 2, label: 'Date & Heure' },
          { num: 3, label: 'Détails' },
          { num: 4, label: 'Confirmation' }
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className={`flex flex-col items-center ${idx !== 0 ? 'flex-1' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s.num 
                  ? 'bg-[var(--primary)] text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.num ? <Check className="h-5 w-5" /> : s.num}
              </div>
              <span className="text-sm mt-2 text-center">{s.label}</span>
            </div>
            {idx < 3 && (
              <div className={`h-0.5 flex-1 mx-2 ${
                step > s.num ? 'bg-[var(--primary)]' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Choisissez un service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map(service => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedService === service.id
                    ? 'border-[var(--primary)] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{service.icon}</span>
                    <div>
                      <h3 className="font-bold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Durée: {service.duration}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${service.price}</p>
                    {selectedService === service.id && (
                      <Check className="h-5 w-5 text-[var(--primary)] ml-auto mt-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedService}
              className="w-full mt-6 bg-[var(--primary)]"
              size="lg"
            >
              Continuer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Choisissez une date et heure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Date</Label>
              <input
                type="date"
                className="w-full mt-2 p-2 border rounded-lg"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <Label>Heure disponible</Label>
              <div className="grid grid-cols-4 gap-3 mt-2">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 border-2 rounded-lg font-medium transition-all ${
                      selectedTime === time
                        ? 'border-[var(--primary)] bg-blue-50 text-[var(--primary)]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Retour
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 bg-[var(--primary)]"
              >
                Continuer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Détails supplémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Description du problème</Label>
              <Textarea
                placeholder="Décrivez le problème en détail..."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Résumé de votre réservation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">
                    {services.find(s => s.id === selectedService)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heure:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">
                    ${services.find(s => s.id === selectedService)?.price}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Retour
              </Button>
              <Button
                onClick={handleBooking}
                className="flex-1 bg-[var(--primary)]"
              >
                Confirmer la réservation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Réservation confirmée!</h2>
            <p className="text-muted-foreground mb-8">
              Nous avons bien reçu votre demande. Un technicien vous contactera sous peu.
            </p>

            <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg text-left mb-8">
              <h3 className="font-bold mb-4">Détails de votre rendez-vous</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-semibold">
                      {services.find(s => s.id === selectedService)?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date et heure</p>
                    <p className="font-semibold">{selectedDate} à {selectedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-semibold">123 Rue Principale, Montréal</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setStep(1)}>
                Nouvelle réservation
              </Button>
              <Button className="bg-[var(--primary)]">
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
