import { ArrowLeft, Phone, Mail, MapPin, Plus, FileText, Calendar, Building2, Home, Download, Wrench } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import CreateJobModal from '../components/modals/CreateJobModal';
import CreateInvoiceModal from '../components/modals/CreateInvoiceModal';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export default function ClientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { clients, jobs } = useApp();
  const [scheduleJobOpen, setScheduleJobOpen] = useState(false);
  const [generateInvoiceOpen, setGenerateInvoiceOpen] = useState(false);

  const client = clients.find(c => c.id === id);
  const clientJobs = jobs.filter(j => j.clientId === id);

  const handleScheduleMaintenance = () => {
    toast.info('Planification de maintenance à venir');
  };

  const handleAddEquipment = () => {
    toast.info('Ajout d\'équipement à venir');
  };

  const handleDownloadDocument = (docName: string) => {
    toast.success(`Téléchargement de ${docName}...`);
    // TODO: Implement document download
  };

  const handleAddDocument = () => {
    toast.info('Upload de document à venir');
  };

  const handleAddNote = () => {
    toast.info('Ajout de note à venir');
  };

  if (!client) {
    return (
      <div className="p-6">
        <p>Client non trouvé</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <CreateJobModal 
        open={scheduleJobOpen} 
        onOpenChange={setScheduleJobOpen}
        preselectedClientId={client.id}
      />
      <CreateInvoiceModal 
        open={generateInvoiceOpen} 
        onOpenChange={setGenerateInvoiceOpen}
        preselectedClientId={client.id}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Profil Client</h1>
        </div>
        <Button variant="outline" size="lg" onClick={() => setGenerateInvoiceOpen(true)}>
          <FileText className="h-5 w-5 mr-2" />
          Générer facture
        </Button>
        <Button size="lg" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90" onClick={() => setScheduleJobOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Planifier travail
        </Button>
      </div>

      {/* Client Info Card */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{client.name}</h2>
                <Badge variant={client.type === 'commercial' ? 'default' : 'secondary'}>
                  {client.type === 'commercial' ? 'Commercial' : 'Résidentiel'}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{client.address}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">${client.totalSpent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total dépensé</p>
              {client.lastService && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Dernier service</p>
                  <p className="font-medium">{client.lastService}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6 pt-6 border-t">
            <div>
              <p className="text-2xl font-bold">{clientJobs.length}</p>
              <p className="text-sm text-muted-foreground">Travaux totaux</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{clientJobs.filter(j => j.status === 'completed').length}</p>
              <p className="text-sm text-muted-foreground">Complétés</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{client.equipment.length}</p>
              <p className="text-sm text-muted-foreground">Équipements</p>
            </div>
            <div>
              <p className="text-2xl font-bold">4.9</p>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="equipment" className="w-full">
        <TabsList>
          <TabsTrigger value="equipment">Équipements</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {client.equipment.map((eq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    {eq}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Installation</span>
                      <span className="font-medium">2018-05-15</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dernier entretien</span>
                      <span className="font-medium">{client.lastService}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Garantie</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleScheduleMaintenance}>
                      Planifier maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px] cursor-pointer hover:bg-gray-50" onClick={handleAddEquipment}>
                <Plus className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Ajouter un équipement</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{job.serviceType}</h4>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{job.scheduledDate}</span>
                          {job.technician && <span>par {job.technician.name}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {job.status}
                      </Badge>
                      {job.amount && (
                        <p className="text-sm font-semibold mt-2">${job.amount}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Contrat de service - 2025', type: 'PDF', date: '2025-01-15', size: '245 KB' },
                  { name: 'Certificat de conformité', type: 'PDF', date: '2024-11-20', size: '180 KB' },
                  { name: 'Plans système plomberie', type: 'PDF', date: '2023-08-10', size: '1.2 MB' }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-muted-foreground">{doc.type} • {doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc.name)}>Télécharger</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={handleAddDocument}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes internes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { author: 'Admin User', date: '2025-12-15', note: 'Client préfère être contacté par email. Éviter les appels avant 9h.' },
                  { author: 'Marc Tremblay', date: '2025-12-10', note: 'Code d\'accès au sous-sol: 1234. Chien très gentil dans la cour.' },
                  { author: 'Sophie Gagnon', date: '2025-11-28', note: 'Client intéressé par un contrat d\'entretien annuel. À suivre.' }
                ].map((note, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{note.author}</span>
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{note.note}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={handleAddNote}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une note
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}