import { useState } from 'react';
import { Plus, AlertTriangle, CheckCircle2, Search, ExternalLink, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { toast } from 'sonner';
import { CertifiedMaterial, MaterialUsage } from '../../types/compliance';

interface CertifiedMaterialsEntryProps {
  jobId: string;
  materials: MaterialUsage[];
  onMaterialsChange: (materials: MaterialUsage[]) => void;
  onUncertifiedWarning?: (material: MaterialUsage) => void;
}

// Mock certified materials database
const CERTIFIED_MATERIALS_DB: CertifiedMaterial[] = [
  {
    id: '1',
    name: 'Tuyau PEX rouge 1/2"',
    category: 'Tuyauterie',
    manufacturer: 'Uponor',
    certificationBody: 'CSA',
    certificationNumber: 'CSA-B137.5',
    isCertified: true,
    lastVerified: '2024-01-15',
  },
  {
    id: '2',
    name: 'Réservoir chauffe-eau électrique 40 gal',
    category: 'Chauffe-eau',
    manufacturer: 'GSW',
    certificationBody: 'CSA',
    certificationNumber: 'CSA-C191',
    isCertified: true,
    lastVerified: '2024-02-20',
  },
  {
    id: '3',
    name: 'Robinet lavabo chromé',
    category: 'Robinetterie',
    manufacturer: 'Moen',
    certificationBody: 'CSA',
    certificationNumber: 'CSA-B125.1',
    isCertified: true,
    lastVerified: '2024-01-10',
  },
  {
    id: '4',
    name: 'Soupape de sûreté 150 PSI',
    category: 'Sécurité',
    manufacturer: 'Watts',
    certificationBody: 'CSA',
    certificationNumber: 'CSA-B137',
    isCertified: true,
    lastVerified: '2024-03-01',
  },
  {
    id: '5',
    name: 'Raccord laiton 3/4"',
    category: 'Raccords',
    manufacturer: 'Generic',
    certificationBody: 'ULC',
    certificationNumber: 'ULC-S102',
    isCertified: true,
    lastVerified: '2024-01-05',
  },
];

export function CertifiedMaterialsEntry({ 
  jobId, 
  materials, 
  onMaterialsChange,
  onUncertifiedWarning 
}: CertifiedMaterialsEntryProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<CertifiedMaterial | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('unité');
  const [customMaterial, setCustomMaterial] = useState({
    name: '',
    quantity: '1',
    unit: 'unité',
  });
  const [showCustomEntry, setShowCustomEntry] = useState(false);

  const handleAddCertifiedMaterial = () => {
    if (!selectedMaterial) return;

    const newMaterial: MaterialUsage = {
      materialId: selectedMaterial.id,
      materialName: selectedMaterial.name,
      quantity: parseFloat(quantity),
      unit: unit,
      isCertified: selectedMaterial.isCertified,
      certificationNumber: selectedMaterial.certificationNumber,
      warningIssued: false,
      addedAt: new Date().toISOString(),
      addedBy: 'current-user-id', // Replace with actual user ID
    };

    onMaterialsChange([...materials, newMaterial]);
    
    // Reset form
    setSelectedMaterial(null);
    setQuantity('1');
    setSearchValue('');
    
    toast.success(`${selectedMaterial.name} ajouté`);
  };

  const handleAddCustomMaterial = () => {
    if (!customMaterial.name.trim()) {
      toast.error('Veuillez entrer un nom de matériau');
      return;
    }

    const newMaterial: MaterialUsage = {
      materialId: `custom-${Date.now()}`,
      materialName: customMaterial.name,
      quantity: parseFloat(customMaterial.quantity),
      unit: customMaterial.unit,
      isCertified: false,
      warningIssued: true,
      addedAt: new Date().toISOString(),
      addedBy: 'current-user-id',
    };

    onMaterialsChange([...materials, newMaterial]);
    
    // Trigger warning
    if (onUncertifiedWarning) {
      onUncertifiedWarning(newMaterial);
    }
    
    toast.warning('Matériau non certifié ajouté - Alerte envoyée au répartiteur', {
      duration: 5000,
    });

    // Reset form
    setCustomMaterial({ name: '', quantity: '1', unit: 'unité' });
    setShowCustomEntry(false);
  };

  const handleRemoveMaterial = (index: number) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    onMaterialsChange(updatedMaterials);
    toast.success('Matériau retiré');
  };

  const filteredMaterials = CERTIFIED_MATERIALS_DB.filter(m =>
    m.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(searchValue.toLowerCase()) ||
    m.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  const uncertifiedCount = materials.filter(m => !m.isCertified).length;

  return (
    <div className="space-y-6">
      {/* Header with warnings */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Matériaux utilisés</h3>
          <p className="text-sm text-gray-600">
            Sélectionnez des matériaux certifiés pour assurer la conformité
          </p>
        </div>
        {uncertifiedCount > 0 && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {uncertifiedCount} non certifié{uncertifiedCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Alerts */}
      {uncertifiedCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {uncertifiedCount} matériau{uncertifiedCount > 1 ? 'x' : ''} non certifié{uncertifiedCount > 1 ? 's' : ''} détecté{uncertifiedCount > 1 ? 's' : ''}. 
            Une alerte a été envoyée au répartiteur. Veuillez vérifier la conformité avant de terminer le travail.
          </AlertDescription>
        </Alert>
      )}

      {/* Add Certified Material */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Ajouter un matériau certifié
          </CardTitle>
          <CardDescription>
            Recherchez dans la base de données des matériaux certifiés CSA / ULC / Intertek
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label>Matériau certifié</Label>
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedMaterial ? selectedMaterial.name : "Rechercher un matériau..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Rechercher matériau, fabricant..." 
                      value={searchValue}
                      onValueChange={setSearchValue}
                    />
                    <CommandList>
                      <CommandEmpty>Aucun matériau trouvé.</CommandEmpty>
                      <CommandGroup>
                        {filteredMaterials.map((material) => (
                          <CommandItem
                            key={material.id}
                            value={material.name}
                            onSelect={() => {
                              setSelectedMaterial(material);
                              setSearchOpen(false);
                            }}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                <span className="font-medium">{material.name}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {material.manufacturer} - {material.certificationBody} {material.certificationNumber}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedMaterial && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-green-900">{selectedMaterial.name}</div>
                      <div className="text-green-700">
                        {selectedMaterial.manufacturer} - Certifié {selectedMaterial.certificationBody}
                      </div>
                      <div className="text-green-600 text-xs">
                        Numéro de certification: {selectedMaterial.certificationNumber}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="quantity">Quantité</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unité</Label>
                <Input
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="unité"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAddCertifiedMaterial}
              disabled={!selectedMaterial}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter le matériau
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.open('https://www.csagroup.org/search/', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Rechercher sur CSA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Custom/Uncertified Material */}
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            Ajouter un matériau non certifié
          </CardTitle>
          <CardDescription>
            ⚠️ L'utilisation de matériaux non certifiés peut entraîner des problèmes de conformité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showCustomEntry ? (
            <Button
              variant="outline"
              onClick={() => setShowCustomEntry(true)}
              className="w-full border-yellow-300 hover:bg-yellow-100"
            >
              Ajouter un matériau non certifié
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="customName">Nom du matériau</Label>
                  <Input
                    id="customName"
                    value={customMaterial.name}
                    onChange={(e) => setCustomMaterial({ ...customMaterial, name: e.target.value })}
                    placeholder="Décrivez le matériau..."
                  />
                </div>
                <div>
                  <Label htmlFor="customQuantity">Quantité</Label>
                  <Input
                    id="customQuantity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={customMaterial.quantity}
                    onChange={(e) => setCustomMaterial({ ...customMaterial, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="customUnit">Unité</Label>
                  <Input
                    id="customUnit"
                    value={customMaterial.unit}
                    onChange={(e) => setCustomMaterial({ ...customMaterial, unit: e.target.value })}
                    placeholder="unité"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAddCustomMaterial}
                  variant="outline"
                  className="border-yellow-600 text-yellow-700 hover:bg-yellow-100 gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Ajouter (avec alerte)
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowCustomEntry(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Materials List */}
      {materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Matériaux utilisés ({materials.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {materials.map((material, index) => (
                <div
                  key={index}
                  className={`flex items-start justify-between p-3 rounded-lg border ${
                    material.isCertified 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-300'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {material.isCertified ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{material.materialName}</div>
                      <div className="text-sm text-gray-600">
                        Quantité: {material.quantity} {material.unit}
                      </div>
                      {material.isCertified && material.certificationNumber && (
                        <div className="text-xs text-green-700 mt-1">
                          Certification: {material.certificationNumber}
                        </div>
                      )}
                      {!material.isCertified && (
                        <div className="text-xs text-yellow-700 mt-1 font-medium">
                          ⚠️ Non certifié - Alerte envoyée au répartiteur
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMaterial(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certification Lookup Links */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Liens de vérification des certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.csagroup.org/search/', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              CSA Group
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://canada.ul.com/services/', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              ULC (UL Canada)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.intertek.com/canada/', '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              Intertek Canada
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
