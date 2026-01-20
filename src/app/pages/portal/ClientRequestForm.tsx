import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CreditCard, MapPin, Clock, AlertTriangle, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { JobUrgency, Language } from '../../types/bidding';

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export default function ClientRequestForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [urgency, setUrgency] = useState<JobUrgency>(JobUrgency.NORMAL);
  const [description, setDescription] = useState('');
  const [reformulatedDescription, setReformulatedDescription] = useState('');
  const [isReformulating, setIsReformulating] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [languagePreference, setLanguagePreference] = useState<Language>(Language.FRENCH);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{
    date: '',
    startTime: '09:00',
    endTime: '17:00',
  }]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 6) {
      toast.error('Maximum 6 photos autorisées');
      return;
    }

    setPhotos((prev) => [...prev, ...files]);

    // Generate preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReformulate = async () => {
    if (!description.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setIsReformulating(true);

    // Simulate AI reformulation (in production, this would call an actual AI API)
    setTimeout(() => {
      const reformulated = `Service requis: ${description.trim()}. ${
        urgency === JobUrgency.URGENT ? 'URGENT - ' : ''
      }Le client nécessite une intervention professionnelle rapide. Photos disponibles: ${photos.length}. Adresse: ${address}.`;
      setReformulatedDescription(reformulated);
      setIsReformulating(false);
      toast.success('Description reformulée par l\'IA');
    }, 2000);
  };

  const addTimeSlot = () => {
    setTimeSlots((prev) => [
      ...prev,
      {
        date: '',
        startTime: '09:00',
        endTime: '17:00',
      },
    ]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    setTimeSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  const handleSubmit = () => {
    // Validation
    if (!description.trim()) {
      toast.error('Veuillez décrire votre demande');
      return;
    }

    if (photos.length === 0) {
      toast.error('Veuillez ajouter au moins une photo');
      return;
    }

    if (!address.trim()) {
      toast.error('Veuillez entrer votre adresse');
      return;
    }

    if (!cardNumber || !cardExpiry || !cardCvc) {
      toast.error('Veuillez entrer vos informations de paiement');
      return;
    }

    if (!acceptTerms) {
      toast.error('Veuillez accepter les conditions');
      return;
    }

    if (urgency === JobUrgency.NORMAL && !timeSlots.some((slot) => slot.date)) {
      toast.error('Veuillez sélectionner au moins une plage horaire');
      return;
    }

    // Submit request
    toast.success('Demande soumise! Les plombiers vont bientôt faire leurs offres');
    navigate('/portal/requests');
  };

  const getUrgencyPrice = () => {
    switch (urgency) {
      case JobUrgency.URGENT:
        return 150; // Premium for urgent
      case JobUrgency.NORMAL:
        return 100; // Standard
      case JobUrgency.QUOTE:
        return 50; // Lower for quotes
      default:
        return 100;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Nouvelle demande de service
          </h1>
          <p className="text-lg text-gray-600">
            Décrivez votre problème et recevez des offres de plombiers qualifiés
          </p>
        </div>

        {/* Urgency Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Type de demande
            </CardTitle>
            <CardDescription>
              Sélectionnez le niveau d'urgence de votre demande
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={urgency} onValueChange={(val) => setUrgency(val as JobUrgency)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    urgency === JobUrgency.URGENT
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <RadioGroupItem value={JobUrgency.URGENT} id="urgent" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-red-700">URGENT</span>
                      <Badge variant="destructive" className="ml-2">
                        +{getUrgencyPrice()} $
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Le plombier doit arriver dans l'heure. Temps de soumission: 5 minutes.
                    </p>
                    <p className="text-xs text-red-600 mt-2">
                      ⚡ Votre demande passe devant toutes les autres
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    urgency === JobUrgency.NORMAL
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <RadioGroupItem value={JobUrgency.NORMAL} id="normal" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-blue-700">Non-urgent</span>
                      <Badge variant="secondary" className="ml-2">
                        {getUrgencyPrice()} $
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Planifiez selon vos disponibilités. Temps de soumission: 2 heures.
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      📅 Choisissez vos plages horaires préférées
                    </p>
                  </div>
                </label>
              </div>
            </RadioGroup>

            {urgency === JobUrgency.URGENT && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">
                  ⏱️ Appel urgent: Le plombier gagnant doit arriver dans l'heure, sinon l'appel
                  devient non-urgent.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description & Photos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Description du problème
            </CardTitle>
            <CardDescription>
              Décrivez votre problème et ajoutez des photos. L'IA reformulera pour plus de clarté.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Votre description</Label>
              <Textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: J'ai une fuite d'eau sous mon évier de cuisine. L'eau coule lentement mais constamment..."
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleReformulate}
                disabled={isReformulating || !description.trim()}
              >
                {isReformulating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Reformulation en cours...
                  </>
                ) : (
                  <>Reformuler avec l'IA</>
                )}
              </Button>
            </div>

            {reformulatedDescription && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Label className="text-blue-900 font-medium">Description reformulée par l'IA:</Label>
                <p className="text-sm text-blue-800 mt-2">{reformulatedDescription}</p>
              </div>
            )}

            <div>
              <Label>Photos (minimum 1, maximum 6)</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {photoPreview.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {photos.length < 6 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Ajouter photo</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Adresse du service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea
                id="address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="1234 Rue Principale, Montréal, QC H1A 1A1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Time Slots (for non-urgent only) */}
        {urgency === JobUrgency.NORMAL && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Plages horaires disponibles
              </CardTitle>
              <CardDescription>
                Sélectionnez vos disponibilités ou choisissez "En tout temps"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-end gap-3">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={slot.date}
                        onChange={(e) => updateTimeSlot(index, 'date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>Début</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Fin</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                      />
                    </div>
                  </div>

                  {timeSlots.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeTimeSlot(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addTimeSlot}>
                + Ajouter une plage horaire
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Language Preference */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Préférence de langue</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={languagePreference}
              onValueChange={(val) => setLanguagePreference(val as Language)}
            >
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <RadioGroupItem value={Language.FRENCH} id="fr" />
                  <span>Français</span>
                </label>
                <label className="flex items-center space-x-2">
                  <RadioGroupItem value={Language.ENGLISH} id="en" />
                  <span>English</span>
                </label>
              </div>
            </RadioGroup>
            <p className="text-xs text-gray-500 mt-2">
              La plateforme essaiera de jumeler avec un plombier parlant votre langue
            </p>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Préautorisation de paiement
            </CardTitle>
            <CardDescription>
              Une préautorisation sera gelée. Vous ne serez facturé qu'après le service.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardExpiry">Expiration (MM/AA)</Label>
                <Input
                  id="cardExpiry"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="12/25"
                  maxLength={5}
                />
              </div>

              <div>
                <Label htmlFor="cardCvc">CVC</Label>
                <Input
                  id="cardCvc"
                  type="password"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                💳 Montant préautorisé: <span className="font-bold">{getUrgencyPrice()} $</span>
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Ce montant sera gelé temporairement. Le montant final sera facturé après le service.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Submit */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2 mb-6">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              />
              <label htmlFor="terms" className="text-sm">
                J'accepte les{' '}
                <a href="#" className="text-primary underline">
                  conditions d'utilisation
                </a>{' '}
                et je comprends les tarifs indiqués. Je comprends que l'appel urgent nécessite une
                arrivée dans l'heure, sinon il devient non-urgent.
              </label>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={!acceptTerms}
            >
              Soumettre la demande
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Votre demande sera envoyée aux plombiers qualifiés dans votre secteur
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
