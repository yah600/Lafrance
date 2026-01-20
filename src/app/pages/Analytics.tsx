import { Download, TrendingUp, Calendar, ChevronRight, DollarSign, Wrench, Clock, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const revenueData = [
  { name: 'Lun', value: 2400 },
  { name: 'Mar', value: 3200 },
  { name: 'Mer', value: 2800 },
  { name: 'Jeu', value: 4200 },
  { name: 'Ven', value: 3800 },
  { name: 'Sam', value: 4600 },
  { name: 'Dim', value: 2200 }
];

const serviceData = [
  { name: 'Débouchage', value: 35, color: '#0B5394' },
  { name: 'Chauffe-eau', value: 25, color: '#2E86AB' },
  { name: 'Robinetterie', value: 20, color: '#5DADE2' },
  { name: 'Urgences', value: 15, color: '#E67E22' },
  { name: 'Inspection', value: 5, color: '#28A745' }
];

const techPerformance = [
  { name: 'Marc T.', jobs: 45, revenue: 12400 },
  { name: 'Sophie G.', jobs: 38, revenue: 10200 },
  { name: 'Jean-Pierre D.', jobs: 42, revenue: 11800 },
  { name: 'Marie B.', jobs: 52, revenue: 14600 },
  { name: 'Luc F.', jobs: 36, revenue: 9800 }
];

const COLORS = ['#0B5394', '#2E86AB', '#5DADE2', '#E67E22', '#28A745'];

// Export helper functions
const exportToCSV = (data: any[], filename: string) => {
  const csvContent = Object.keys(data[0]).join(',') + '\n' + 
    data.map(row => Object.values(row).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  toast.success(`Rapport ${filename} exporté!`);
};

const exportToPDF = (reportType: string) => {
  // Simulate PDF generation
  toast.success(`Génération du PDF ${reportType}...`);
  setTimeout(() => {
    toast.success(`PDF ${reportType} téléchargé!`);
  }, 1000);
};

// Detailed service breakdown data
const serviceBreakdown = [
  {
    id: 1,
    name: 'Débouchage de drains',
    category: 'Débouchage',
    icon: '🚰',
    jobs: 135,
    revenue: 43650,
    avgValue: 323,
    avgDuration: '1.5h',
    completionRate: 98,
    trend: '+15%',
    color: '#0B5394'
  },
  {
    id: 2,
    name: 'Installation chauffe-eau',
    category: 'Chauffe-eau',
    icon: '🔥',
    jobs: 68,
    revenue: 31200,
    avgValue: 459,
    avgDuration: '3.2h',
    completionRate: 100,
    trend: '+22%',
    color: '#2E86AB'
  },
  {
    id: 3,
    name: 'Réparation robinetterie',
    category: 'Robinetterie',
    icon: '🔧',
    jobs: 96,
    revenue: 18720,
    avgValue: 195,
    avgDuration: '1.0h',
    completionRate: 95,
    trend: '+8%',
    color: '#5DADE2'
  },
  {
    id: 4,
    name: 'Urgences 24/7',
    category: 'Urgences',
    icon: '🚨',
    jobs: 58,
    revenue: 29870,
    avgValue: 515,
    avgDuration: '2.5h',
    completionRate: 100,
    trend: '+18%',
    color: '#E67E22'
  }
];

export default function Analytics() {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const handleExport = () => {
    toast.success('Rapport exporté avec succès', {
      description: 'Le fichier PDF a été téléchargé'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports & Analytics</h1>
          <p className="text-gray-600 mt-1">Analysez les performances de votre entreprise</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">90 derniers jours</SelectItem>
              <SelectItem value="365">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="lg" onClick={handleExport}>
            <Download className="h-5 w-5 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Revenus</p>
            <p className="text-3xl font-bold">$124,500</p>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>+12%</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Travaux complétés</p>
            <p className="text-3xl font-bold">387</p>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>+8%</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Valeur moyenne</p>
            <p className="text-3xl font-bold">$322</p>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>+3%</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Satisfaction</p>
            <p className="text-3xl font-bold">4.8/5</p>
            <p className="text-sm text-muted-foreground mt-2">⭐⭐⭐⭐⭐</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#0B5394" strokeWidth={2} name="Revenus ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Travaux par type de service</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance des techniciens</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={techPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="jobs" fill="#2E86AB" name="Travaux" />
              <Bar yAxisId="right" dataKey="revenue" fill="#28A745" name="Revenus ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Service Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Analyse détaillée par service
          </CardTitle>
          <CardDescription>
            Performance et statistiques complètes pour chaque type de service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {serviceBreakdown.map(service => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  selectedService === service.id ? 'ring-2 ring-blue-400 border-blue-400' : 'border-gray-200'
                }`}
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{service.icon}</span>
                      <Badge variant="outline" className="text-xs">
                        {service.category}
                      </Badge>
                    </div>
                    <Badge
                      className="text-xs font-semibold"
                      style={{ backgroundColor: service.color, color: 'white' }}
                    >
                      {service.trend}
                    </Badge>
                  </div>

                  {/* Service Name */}
                  <h3 className="font-semibold text-sm leading-tight">{service.name}</h3>

                  {/* Stats Grid */}
                  <div className="space-y-2">
                    {/* Revenue */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        <span>Revenus</span>
                      </div>
                      <span className="font-bold" style={{ color: service.color }}>
                        ${service.revenue.toLocaleString()}
                      </span>
                    </div>

                    {/* Jobs Count */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Travaux</span>
                      </div>
                      <span className="font-semibold">{service.jobs}</span>
                    </div>

                    {/* Average Value */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Valeur moy.</span>
                      <span className="font-medium">${service.avgValue}</span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Durée moy.</span>
                      </div>
                      <span className="font-medium">{service.avgDuration}</span>
                    </div>

                    {/* Completion Rate */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Taux de réalisation</span>
                        <span className="font-semibold">{service.completionRate}%</span>
                      </div>
                      <Progress value={service.completionRate} className="h-1.5" />
                    </div>
                  </div>

                  {/* Expand Indicator */}
                  {selectedService === service.id && (
                    <div className="pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Rapport détaillé disponible bientôt');
                        }}
                      >
                        Voir rapport détaillé
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}