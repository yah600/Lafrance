import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Send, AlertCircle, Home, Building2, Factory, Search, ChevronDown, ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { SERVICE_CATEGORIES } from '../../data/services';

export default function NewClientRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['urgences']);

  const [formData, setFormData] = useState({
    serviceCategory: '',
    specificService: '',
    propertyType: 'residential' as 'residential' | 'commercial' | 'industrial',
    description: '',
    urgency: 'normal',
    preferredDate: '',
    preferredTime: '',
    address: '',
    contactPhone: user?.phone || '',
    additionalNotes: ''
  });

  // Get filtered services based on search
  const getFilteredServices = () => {
    if (!searchTerm) {
      return SERVICE_CATEGORIES;
    }

    return SERVICE_CATEGORIES.map(category => ({
      ...category,
      services: category.services.filter(service =>
        service.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    })).filter(category => category.services.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.specificService || !formData.description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get service label
    const selectedCategoryData = SERVICE_CATEGORIES.find(cat => cat.id === formData.serviceCategory);
    const selectedServiceData = selectedCategoryData?.services.find(s => s.value === formData.specificService);

    // Store the request (in production, this would go to backend)
    const request = {
      id: `REQ-${Date.now()}`,
      clientId: user?.id,
      clientName: user?.name,
      clientEmail: user?.email,
      clientPhone: formData.contactPhone,
      serviceCategory: selectedCategoryData?.label,
      specificService: selectedServiceData?.label,
      propertyType: formData.propertyType,
      description: formData.description,
      urgency: formData.urgency,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      address: formData.address,
      additionalNotes: formData.additionalNotes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in localStorage (in production, this would be API call)
    const existingRequests = JSON.parse(localStorage.getItem('clientRequests') || '[]');
    localStorage.setItem('clientRequests', JSON.stringify([...existingRequests, request]));

    setIsSubmitting(false);
    toast.success('Demande soumise avec succès! Notre équipe vous contactera bientôt.');
    
    setTimeout(() => {
      navigate('/client-portal/requests');
    }, 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceSelect = (categoryId: string, serviceValue: string) => {
    setFormData(prev => ({
      ...prev,
      serviceCategory: categoryId,
      specificService: serviceValue,
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const selectedServiceLabel = () => {
    if (!formData.specificService) return 'Aucun service sélectionné';
    
    const category = SERVICE_CATEGORIES.find(cat => cat.id === formData.serviceCategory);
    const service = category?.services.find(s => s.value === formData.specificService);
    
    return service?.label || 'Aucun service sélectionné';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/client-portal')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle demande de service</h1>
          <p className="text-gray-600 mt-1">Sélectionnez le service dont vous avez besoin</p>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Notre équipe vous contactera rapidement</p>
          <p>Pour les urgences, appelez directement notre ligne d'urgence 24/7 au <strong>514-555-URGENT</strong></p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Service Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Selection Card */}
            <Card>
              <CardHeader>
                <CardTitle>Sélection du service</CardTitle>
                <CardDescription>Choisissez le service de plomberie dont vous avez besoin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Service Categories Accordion */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {getFilteredServices().map((category) => {
                    const Icon = category.icon;
                    const isExpanded = expandedCategories.includes(category.id);
                    
                    return (
                      <div key={category.id} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                        {/* Category Header */}
                        <button
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-gray-700" />
                            <span className="font-semibold text-gray-900">{category.label}</span>
                            <Badge variant="secondary" className="text-xs">
                              {category.services.length}
                            </Badge>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          )}
                        </button>

                        {/* Category Services */}
                        {isExpanded && (
                          <div className="p-3 space-y-2 bg-white">
                            {category.services.map((service) => (
                              <button
                                key={service.value}
                                type="button"
                                onClick={() => handleServiceSelect(category.id, service.value)}
                                className={`w-full text-left p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                                  formData.specificService === service.value
                                    ? 'border-[var(--primary)] bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">{service.label}</h4>
                                    {service.description && (
                                      <p className="text-sm text-gray-600">{service.description}</p>
                                    )}
                                  </div>
                                  {formData.specificService === service.value && (
                                    <Badge className="bg-[var(--primary)] hover:bg-[var(--primary)]">
                                      Sélectionné
                                    </Badge>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {searchTerm && getFilteredServices().length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun service trouvé pour "{searchTerm}"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Détails de la demande</CardTitle>
                <CardDescription>Fournissez plus d'informations sur votre besoin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Type */}
                <div className="space-y-3">
                  <Label>Type de propriété <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange('propertyType', 'residential')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.propertyType === 'residential'
                          ? 'border-[var(--primary)] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Home className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                      <p className="font-medium text-sm">Résidentiel</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('propertyType', 'commercial')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.propertyType === 'commercial'
                          ? 'border-[var(--primary)] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Building2 className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                      <p className="font-medium text-sm">Commercial</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('propertyType', 'industrial')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.propertyType === 'industrial'
                          ? 'border-[var(--primary)] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Factory className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                      <p className="font-medium text-sm">Industriel</p>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description du problème <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez le problème ou le service requis en détail..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                {/* Urgency */}
                <div className="space-y-3">
                  <Label>Niveau d'urgence</Label>
                  <RadioGroup
                    value={formData.urgency}
                    onValueChange={(value) => handleChange('urgency', value)}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="font-normal cursor-pointer flex-1">
                        <span className="font-medium">Basse</span>
                        <span className="text-sm text-gray-600 block">Peut attendre quelques jours</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal" className="font-normal cursor-pointer flex-1">
                        <span className="font-medium">Normale</span>
                        <span className="text-sm text-gray-600 block">Dans les prochains jours</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="font-normal cursor-pointer flex-1">
                        <span className="font-medium">Haute</span>
                        <span className="text-sm text-gray-600 block">Dès que possible</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 border-red-200 bg-red-50">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent" className="font-normal cursor-pointer flex-1">
                        <span className="font-medium text-red-700">Urgente</span>
                        <span className="text-sm text-red-600 block">Intervention immédiate requise</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Preferred Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Date préférée</Label>
                    <Input
                      type="date"
                      id="preferredDate"
                      value={formData.preferredDate}
                      onChange={(e) => handleChange('preferredDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Heure préférée</Label>
                    <Select
                      value={formData.preferredTime}
                      onValueChange={(value) => handleChange('preferredTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une heure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Matin (8h-12h)</SelectItem>
                        <SelectItem value="afternoon">Après-midi (12h-17h)</SelectItem>
                        <SelectItem value="evening">Soir (17h-20h)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Adresse du service <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Rue Example, Montréal, QC H1A 1A1"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">
                    Téléphone de contact <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+1 514-555-0000"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    required
                  />
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Notes additionnelles</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Ajoutez toute information supplémentaire qui pourrait être utile..."
                    value={formData.additionalNotes}
                    onChange={(e) => handleChange('additionalNotes', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
                <CardDescription>Vérifiez votre demande</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Service */}
                <div>
                  <Label className="text-xs text-gray-600">Service sélectionné</Label>
                  <p className="font-semibold mt-1">
                    {formData.specificService ? selectedServiceLabel() : (
                      <span className="text-gray-400">Aucun service sélectionné</span>
                    )}
                  </p>
                </div>

                {/* Property Type */}
                <div>
                  <Label className="text-xs text-gray-600">Type de propriété</Label>
                  <p className="font-semibold mt-1 capitalize">
                    {formData.propertyType === 'residential' && 'Résidentiel'}
                    {formData.propertyType === 'commercial' && 'Commercial'}
                    {formData.propertyType === 'industrial' && 'Industriel'}
                  </p>
                </div>

                {/* Urgency */}
                <div>
                  <Label className="text-xs text-gray-600">Urgence</Label>
                  <Badge 
                    className={`mt-1 ${
                      formData.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                      formData.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                      formData.urgency === 'normal' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {formData.urgency === 'urgent' && 'Urgente'}
                    {formData.urgency === 'high' && 'Haute'}
                    {formData.urgency === 'normal' && 'Normale'}
                    {formData.urgency === 'low' && 'Basse'}
                  </Badge>
                </div>

                {/* Preferred Date/Time */}
                {formData.preferredDate && (
                  <div>
                    <Label className="text-xs text-gray-600">Date souhaitée</Label>
                    <p className="font-semibold mt-1">
                      {new Date(formData.preferredDate).toLocaleDateString('fr-CA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {formData.preferredTime && (
                  <div>
                    <Label className="text-xs text-gray-600">Heure préférée</Label>
                    <p className="font-semibold mt-1">
                      {formData.preferredTime === 'morning' && 'Matin (8h-12h)'}
                      {formData.preferredTime === 'afternoon' && 'Après-midi (12h-17h)'}
                      {formData.preferredTime === 'evening' && 'Soir (17h-20h)'}
                      {formData.preferredTime === 'flexible' && 'Flexible'}
                    </p>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="pt-4 border-t space-y-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.specificService}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Soumettre la demande
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/client-portal')}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Annuler
                  </Button>
                </div>

                {/* Help */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-600 mb-2">Besoin d'aide?</p>
                  <Button variant="outline" size="sm" className="w-full text-xs" type="button">
                    Appeler le 514-555-URGENT
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}