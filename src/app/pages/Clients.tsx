import { Plus, Search, Phone, Mail, MapPin, Building2, Home, Filter, Download } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import CreateClientModal from '../components/modals/CreateClientModal';
import CreateJobModal from '../components/modals/CreateJobModal';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export default function Clients() {
  const navigate = useNavigate();
  const { clients } = useApp();
  const [createClientOpen, setCreateClientOpen] = useState(false);
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [selectedClientForJob, setSelectedClientForJob] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilter = () => {
    toast.info('Fonctionnalité de filtres avancés à venir');
  };

  const handleExport = () => {
    toast.success('Export des clients en cours...');
    // TODO: Implement CSV/PDF export
  };

  const handleViewClient = (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/clients/${clientId}`);
  };

  const handleScheduleJob = (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedClientForJob(clientId);
    setCreateJobOpen(true);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery) ||
    client.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="p-6 space-y-6">
      <CreateClientModal open={createClientOpen} onOpenChange={setCreateClientOpen} />
      <CreateJobModal 
        open={createJobOpen} 
        onOpenChange={setCreateJobOpen}
        preselectedClientId={selectedClientForJob}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">{clients.length} clients au total</p>
        </div>
        <Button size="lg" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90" onClick={() => setCreateClientOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Nouveau client
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="search"
            placeholder="Rechercher un client..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={handleFilter}>
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.map(client => (
          <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/clients/${client.id}`)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                {/* Client Info */}
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <Badge variant={client.type === 'commercial' ? 'default' : 'secondary'}>
                        {client.type === 'commercial' ? (
                          <><Building2 className="h-3 w-3 mr-1" />Commercial</>
                        ) : (
                          <><Home className="h-3 w-3 mr-1" />Résidentiel</>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{client.address}</span>
                      </div>
                    </div>

                    {/* Equipment */}
                    {client.equipment && client.equipment.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {client.equipment.map((eq, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats and Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${client.totalSpent.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total dépensé</p>
                  </div>
                  
                  {client.lastService && (
                    <p className="text-sm text-muted-foreground">
                      Dernier service: <span className="font-medium">{client.lastService}</span>
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={(e) => handleViewClient(client.id, e)}>Voir</Button>
                    <Button size="sm" onClick={(e) => handleScheduleJob(client.id, e)}>Planifier</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}