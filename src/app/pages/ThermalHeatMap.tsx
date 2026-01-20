/**
 * Thermal Heat Map Dashboard
 * Visualize building heat loss using thermal imaging data
 */

import { useState } from 'react';
import { Thermometer, AlertTriangle, TrendingDown, Map, Eye, Download, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { THERMAL_SCANS, getHeatLossCategory, HEAT_LOSS_CATEGORIES, getHighPriorityScans } from '../../data/thermalData';
import { useAuth } from '../context/AuthContext';

export default function ThermalHeatMap() {
  const { activeDivision } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScan, setSelectedScan] = useState(THERMAL_SCANS[0]);
  const [viewMode, setViewMode] = useState<'thermal' | 'comparison' | 'map' | 'zones'>('thermal');

  // Filter thermal scans by active division
  const filteredScans = THERMAL_SCANS.filter(scan => 
    !activeDivision || scan.division === activeDivision
  ).filter(scan =>
    scan.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highPriorityScans = getHighPriorityScans();
  const averageHeatLoss = Math.round(
    filteredScans.reduce((sum, scan) => sum + scan.heatLossRating, 0) / filteredScans.length
  );

  const getHeatLossColor = (rating: number) => {
    const category = getHeatLossCategory(rating);
    return HEAT_LOSS_CATEGORIES[category].color;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carte Thermique</h1>
          <p className="text-gray-600 mt-1">Visualisation des pertes de chaleur des bâtiments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter rapport
          </Button>
          <Button>
            <Thermometer className="h-4 w-4 mr-2" />
            Nouvelle analyse
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Analyses</CardTitle>
            <Thermometer className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredScans.length}</div>
            <p className="text-xs text-gray-500 mt-1">Propriétés scannées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Perte Moyenne</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{averageHeatLoss}/10</div>
            <p className="text-xs text-gray-500 mt-1">Indice de perte de chaleur</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Priorité Haute</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highPriorityScans.length}</div>
            <p className="text-xs text-gray-500 mt-1">Nécessitent intervention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Économies Potentielles</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${filteredScans.reduce((sum, scan) => sum + scan.potentialSavings, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Économies annuelles totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Propriétés Scannées</CardTitle>
            <CardDescription>Sélectionnez une propriété pour voir les détails</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredScans.map((scan) => {
                const category = getHeatLossCategory(scan.heatLossRating);
                const categoryData = HEAT_LOSS_CATEGORIES[category];
                const isSelected = selectedScan.id === scan.id;

                return (
                  <div
                    key={scan.id}
                    onClick={() => setSelectedScan(scan)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">{scan.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Scanné le {new Date(scan.scanDate).toLocaleDateString('fr-CA')}
                        </p>
                      </div>
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm"
                        style={{ backgroundColor: categoryData.color }}
                      >
                        {scan.heatLossRating}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(category)} variant="outline">
                        {categoryData.label}
                      </Badge>
                      {scan.heatLossRating >= 7 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Priorité
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Thermal Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedScan.address}</CardTitle>
                <CardDescription>
                  Analyse thermique du {new Date(selectedScan.scanDate).toLocaleDateString('fr-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </div>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl"
                style={{ backgroundColor: getHeatLossColor(selectedScan.heatLossRating) }}
              >
                {selectedScan.heatLossRating}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList className="mb-4">
                <TabsTrigger value="thermal">
                  <Thermometer className="h-4 w-4 mr-2" />
                  Vue Thermique
                </TabsTrigger>
                <TabsTrigger value="comparison">
                  <Eye className="h-4 w-4 mr-2" />
                  Comparaison
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="h-4 w-4 mr-2" />
                  Carte Satellite
                </TabsTrigger>
                <TabsTrigger value="zones">
                  <Map className="h-4 w-4 mr-2" />
                  Zones
                </TabsTrigger>
              </TabsList>

              {/* Thermal View */}
              <TabsContent value="thermal" className="space-y-4">
                {/* Heat Loss Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-red-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Indice de Perte de Chaleur</h3>
                    <Badge 
                      className="text-white"
                      style={{ backgroundColor: getHeatLossColor(selectedScan.heatLossRating) }}
                    >
                      {HEAT_LOSS_CATEGORIES[getHeatLossCategory(selectedScan.heatLossRating)].label}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Votre propriété</span>
                      <span className="font-semibold">{selectedScan.heatLossRating}/10</span>
                    </div>
                    <Progress 
                      value={selectedScan.heatLossRating * 10} 
                      className="h-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Moyenne du quartier</p>
                      <p className="font-semibold text-lg">{selectedScan.neighborhoodAverage}/10</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Vs. voisins</p>
                      <p className="font-semibold text-lg text-red-600">
                        +{Math.round(((selectedScan.heatLossRating - selectedScan.neighborhoodAverage) / selectedScan.neighborhoodAverage) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Energy Waste */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Gaspillage Annuel Estimé</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${selectedScan.estimatedAnnualWaste.toLocaleString()}/an
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Économies Potentielles</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${selectedScan.potentialSavings.toLocaleString()}/an
                    </p>
                  </div>
                </div>

                {/* Building Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Informations du Bâtiment</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {selectedScan.buildingAge && (
                      <div>
                        <p className="text-gray-600">Année de construction</p>
                        <p className="font-semibold">{new Date().getFullYear() - selectedScan.buildingAge}</p>
                      </div>
                    )}
                    {selectedScan.lastInsulationUpgrade && (
                      <div>
                        <p className="text-gray-600">Dernière isolation</p>
                        <p className="font-semibold">{selectedScan.lastInsulationUpgrade}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thermal Image Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <Thermometer className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Image Thermique</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Les zones rouges indiquent une perte de chaleur élevée
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded"></div>
                      <span className="text-xs text-gray-600">Faible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                      <span className="text-xs text-gray-600">Modéré</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded"></div>
                      <span className="text-xs text-gray-600">Élevé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-600 rounded"></div>
                      <span className="text-xs text-gray-600">Critique</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Comparison View */}
              <TabsContent value="comparison" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-900 text-white p-2 text-center text-sm font-medium">
                      Photo Visible
                    </div>
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <Eye className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-red-600 text-white p-2 text-center text-sm font-medium">
                      Image Thermique
                    </div>
                    <div className="aspect-video bg-gradient-to-br from-blue-200 via-yellow-200 to-red-200 flex items-center justify-center">
                      <Thermometer className="h-12 w-12 text-gray-600" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Comparaison côte-à-côte: Photo normale vs. Image infrarouge
                </p>
              </TabsContent>

              {/* Satellite Map View */}
              <TabsContent value="map" className="space-y-4">
                {/* Map Container */}
                <div className="border rounded-lg overflow-hidden bg-gray-100">
                  <div className="bg-gray-900 text-white p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Map className="h-4 w-4" />
                      <span className="text-sm font-medium">Vue Satellite avec Overlay Thermique</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        Satellite
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        Terrain
                      </Button>
                    </div>
                  </div>
                  
                  {/* Mock Satellite Map */}
                  <div className="relative aspect-[16/10] bg-gradient-to-br from-green-100 via-green-200 to-green-300">
                    {/* Mock satellite imagery pattern */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(34, 139, 34, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(34, 139, 34, 0.4) 0%, transparent 50%),
                        repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 50px,
                          rgba(0,0,0,0.03) 50px,
                          rgba(0,0,0,0.03) 100px
                        ),
                        repeating-linear-gradient(
                          90deg,
                          transparent,
                          transparent 50px,
                          rgba(0,0,0,0.03) 50px,
                          rgba(0,0,0,0.03) 100px
                        )
                      `
                    }} />
                    
                    {/* Property marker with thermal overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {/* Thermal heat overlay - pulsing red glow */}
                      <div className="absolute inset-0 -m-12 rounded-full bg-red-500 opacity-30 animate-pulse blur-xl" 
                           style={{ 
                             width: selectedScan.heatLossRating >= 7 ? '200px' : '120px',
                             height: selectedScan.heatLossRating >= 7 ? '200px' : '120px',
                             left: '50%',
                             top: '50%',
                             transform: 'translate(-50%, -50%)'
                           }} />
                      
                      {/* Property building outline */}
                      <div className="relative bg-gray-800 w-24 h-24 rounded shadow-lg border-2 border-white flex items-center justify-center">
                        <div 
                          className="w-16 h-16 rounded flex items-center justify-center text-white font-bold text-xl"
                          style={{ backgroundColor: getHeatLossColor(selectedScan.heatLossRating) }}
                        >
                          {selectedScan.heatLossRating}
                        </div>
                      </div>
                    </div>

                    {/* Heat loss indicators around property */}
                    {selectedScan.zones.slice(0, 4).map((zone, index) => {
                      const positions = [
                        { top: '25%', left: '50%' },
                        { top: '50%', right: '25%' },
                        { bottom: '25%', left: '50%' },
                        { top: '50%', left: '25%' }
                      ];
                      const pos = positions[index];
                      
                      return (
                        <div
                          key={zone.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={pos}
                        >
                          <div className={`px-3 py-2 rounded-lg shadow-lg text-xs font-medium border-2 ${
                            zone.severity === 'critical' ? 'bg-red-500 text-white border-red-700' :
                            zone.severity === 'high' ? 'bg-orange-500 text-white border-orange-700' :
                            zone.severity === 'moderate' ? 'bg-yellow-500 text-white border-yellow-700' :
                            'bg-green-500 text-white border-green-700'
                          }`}>
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{zone.name}</span>
                            </div>
                            <div className="text-xs opacity-90 mt-1">
                              {zone.heatLossIntensity}/10
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Map controls */}
                    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
                      <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Toggle Thermal
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                        Zoom +
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                        Zoom -
                      </Button>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
                      <p className="text-xs font-semibold mb-2 text-gray-900">Légende Thermique</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-xs text-gray-700">Faible (1-3)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          <span className="text-xs text-gray-700">Modéré (4-6)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-500 rounded"></div>
                          <span className="text-xs text-gray-700">Élevé (7-9)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-600 rounded"></div>
                          <span className="text-xs text-gray-700">Critique (10)</span>
                        </div>
                      </div>
                    </div>

                    {/* Address label */}
                    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2">
                      <p className="text-xs font-semibold text-gray-900">📍 {selectedScan.address}</p>
                      <p className="text-xs text-gray-600 mt-0.5">Cote de perte: {selectedScan.heatLossRating}/10</p>
                    </div>
                  </div>
                </div>

                {/* Map Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Map className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900">Vue Satellite avec Overlay Thermique</p>
                      <p className="text-sm text-blue-800 mt-1">
                        La carte montre la propriété avec un overlay thermique indiquant les zones de perte de chaleur.
                        Les zones rouges nécessitent une attention immédiate.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Zones View */}
              <TabsContent value="zones" className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Zones prioritaires identifiées (triées par priorité)
                </p>
                {selectedScan.zones
                  .sort((a, b) => a.priority - b.priority)
                  .map((zone) => (
                    <div key={zone.id} className={`border rounded-lg p-4 ${
                      zone.severity === 'critical' ? 'border-red-300 bg-red-50' :
                      zone.severity === 'high' ? 'border-orange-300 bg-orange-50' :
                      zone.severity === 'moderate' ? 'border-yellow-300 bg-yellow-50' :
                      'border-green-300 bg-green-50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{zone.name}</h4>
                            <Badge className={getSeverityColor(zone.severity)} variant="outline">
                              {zone.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Priorité {zone.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{zone.recommendation}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>🌡️ Intensité: {zone.heatLossIntensity}/10</span>
                            <span>💰 Coût estimé: ${zone.estimatedCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button className="flex-1">
                Demander une soumission
              </Button>
              <Button variant="outline" className="flex-1">
                Télécharger le rapport
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}