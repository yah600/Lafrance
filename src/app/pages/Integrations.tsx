/**
 * Integrations Page
 * Manage CRM, Accounting, and other API integrations
 * 
 * Features:
 * - View all integrations
 * - Add new integrations
 * - Configure sync settings
 * - Test connections
 * - View sync history
 * - Manage webhooks
 */

import { useState, useEffect } from 'react';
import { 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Settings,
  Zap,
  TrendingUp,
  Activity,
  Calendar,
  ExternalLink,
  Trash2,
  Cloud,
  DollarSign,
  Building2,
  CreditCard,
  Database,
  Workflow
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { integrationService } from '../services/integrations/IntegrationService';
import type { Integration, IntegrationProvider, IntegrationStatus } from '../types/integrations';
import { toast } from 'sonner';

// Available integration providers with professional styling
const PROVIDERS = {
  crm: [
    { 
      id: 'salesforce', 
      name: 'Salesforce', 
      description: 'World\'s #1 CRM platform', 
      icon: Cloud,
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Contacts', 'Accounts', 'Opportunities']
    },
    { 
      id: 'hubspot', 
      name: 'HubSpot', 
      description: 'Inbound marketing & sales', 
      icon: Database,
      gradient: 'from-orange-500 to-red-500',
      features: ['Contacts', 'Deals', 'Companies']
    },
    { 
      id: 'pipedrive', 
      name: 'Pipedrive', 
      description: 'Sales pipeline management', 
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      features: ['Deals', 'Organizations', 'Activities']
    },
    { 
      id: 'zoho-crm', 
      name: 'Zoho CRM', 
      description: 'Complete CRM suite', 
      icon: Building2,
      gradient: 'from-red-500 to-pink-500',
      features: ['Leads', 'Accounts', 'Deals']
    }
  ],
  accounting: [
    { 
      id: 'quickbooks', 
      name: 'QuickBooks', 
      description: 'Industry-leading accounting', 
      icon: DollarSign,
      gradient: 'from-green-600 to-green-400',
      features: ['Invoices', 'Payments', 'Customers']
    },
    { 
      id: 'xero', 
      name: 'Xero', 
      description: 'Cloud accounting software', 
      icon: DollarSign,
      gradient: 'from-blue-600 to-blue-400',
      features: ['Invoices', 'Bills', 'Bank reconciliation']
    },
    { 
      id: 'sage', 
      name: 'Sage', 
      description: 'Financial management', 
      icon: Database,
      gradient: 'from-emerald-600 to-teal-500',
      features: ['Accounts', 'Invoicing', 'Expenses']
    },
    { 
      id: 'freshbooks', 
      name: 'FreshBooks', 
      description: 'Simple invoicing & accounting', 
      icon: DollarSign,
      gradient: 'from-cyan-600 to-blue-500',
      features: ['Invoices', 'Time tracking', 'Expenses']
    }
  ],
  propertyManagement: [
    { 
      id: 'rovida', 
      name: 'ROVIDA', 
      description: 'Property management (Quebec)', 
      icon: Building2,
      gradient: 'from-purple-600 to-indigo-500',
      features: ['Properties', 'Work orders', 'Tenants']
    },
    { 
      id: 'yardi', 
      name: 'Yardi', 
      description: 'Enterprise property management', 
      icon: Building2,
      gradient: 'from-indigo-600 to-purple-500',
      features: ['Properties', 'Maintenance', 'Residents']
    }
  ],
  payment: [
    { 
      id: 'stripe', 
      name: 'Stripe', 
      description: 'Online payment processing', 
      icon: CreditCard,
      gradient: 'from-purple-500 to-indigo-600',
      features: ['Payments', 'Subscriptions', 'Invoicing']
    },
    { 
      id: 'square', 
      name: 'Square', 
      description: 'Payment & POS solutions', 
      icon: CreditCard,
      gradient: 'from-gray-700 to-gray-900',
      features: ['Payments', 'POS', 'Online checkout']
    },
    { 
      id: 'financeit', 
      name: 'Financeit', 
      description: 'Consumer financing', 
      icon: DollarSign,
      gradient: 'from-yellow-600 to-orange-500',
      features: ['Financing', 'Applications', 'Approvals']
    }
  ]
};

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    const response = await integrationService.getIntegrations();
    if (response.success && response.data) {
      setIntegrations(response.data);
    }
    setLoading(false);
  };

  const handleTestConnection = async (id: string) => {
    toast.info('Test de connexion...', { duration: 2000 });
    
    const response = await integrationService.testIntegration(id);
    
    if (response.success && response.data) {
      if (response.data.connectionStatus === 'connected') {
        toast.success('Connexion réussie! ✅', {
          description: `Latence: ${response.data.latency}ms`
        });
      } else {
        toast.error('Échec de connexion', {
          description: response.data.authenticationStatus
        });
      }
    } else {
      toast.error('Erreur lors du test');
    }
  };

  const handleSyncNow = async (id: string) => {
    toast.info('Synchronisation en cours...', { duration: 2000 });
    
    const response = await integrationService.triggerSync(id);
    
    if (response.success && response.data) {
      toast.success('Synchronisation démarrée! 🔄', {
        description: `Job ID: ${response.data.id}`
      });
      
      // Reload to show updated stats
      setTimeout(loadIntegrations, 2000);
    } else {
      toast.error('Échec de synchronisation');
    }
  };

  const handleAddIntegration = async (provider: IntegrationProvider) => {
    setSelectedProvider(provider);
    
    // Check if OAuth is required
    if (['salesforce', 'hubspot', 'quickbooks', 'xero'].includes(provider)) {
      // Initiate OAuth flow
      const response = await integrationService.initiateOAuth(provider);
      
      if (response.success && response.data) {
        // Redirect to OAuth page
        window.location.href = response.data.authUrl;
      } else {
        toast.error('Impossible d\'initialiser OAuth');
      }
    } else {
      // Show API key configuration dialog
      setAddDialogOpen(true);
    }
  };

  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <Activity className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: IntegrationStatus) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      error: 'destructive',
      configuring: 'outline'
    };
    
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      error: 'Erreur',
      configuring: 'Configuration'
    };

    return (
      <Badge variant={variants[status] as any}>
        {labels[status]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des intégrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Intégrations</h1>
          <p className="text-gray-500 mt-1">
            Connectez vos outils CRM, comptabilité et paiements
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une intégration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intégrations actives</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => i.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              sur {integrations.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Syncs aujourd'hui</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.reduce((sum, i) => sum + i.stats.totalSyncs, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {integrations.reduce((sum, i) => sum + i.stats.successfulSyncs, 0)} réussis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enregistrements</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.reduce((sum, i) => sum + i.stats.recordsSynced, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              synchronisés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhooks actifs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => i.webhooksEnabled).length}
            </div>
            <p className="text-xs text-muted-foreground">
              en temps réel
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Intégrations configurées</CardTitle>
          <CardDescription>
            Gérez vos connexions aux systèmes externes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {integrations.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune intégration
              </h3>
              <p className="text-gray-500 mb-6">
                Connectez vos outils pour automatiser la synchronisation des données
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter votre première intégration
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {integrations.map((integration) => {
                // Map provider to icon
                const getProviderIcon = (provider: string) => {
                  switch (provider) {
                    case 'quickbooks':
                    case 'xero':
                    case 'sage':
                    case 'freshbooks':
                      return DollarSign;
                    case 'salesforce':
                    case 'hubspot':
                      return Cloud;
                    case 'pipedrive':
                      return TrendingUp;
                    case 'zoho-crm':
                    case 'rovida':
                    case 'yardi':
                      return Building2;
                    case 'stripe':
                    case 'square':
                    case 'financeit':
                      return CreditCard;
                    default:
                      return Database;
                  }
                };

                const ProviderIcon = getProviderIcon(integration.provider);
                
                return (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white">
                        <ProviderIcon className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                          {getStatusBadge(integration.status)}
                          {integration.webhooksEnabled && (
                            <Badge variant="outline" className="text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              Real-time
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            {getStatusIcon(integration.status)}
                            {integration.syncDirection}
                          </span>
                          {integration.lastSyncAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Last sync: {new Date(integration.lastSyncAt).toLocaleString('fr-CA')}
                            </span>
                          )}
                          <span>
                            {integration.stats.recordsSynced.toLocaleString()} records
                          </span>
                          {integration.stats.failedSyncs > 0 && (
                            <span className="text-red-600">
                              {integration.stats.failedSyncs} errors
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection(integration.id)}
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncNow(integration.id)}
                        disabled={integration.status !== 'active'}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Integration Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une intégration</DialogTitle>
            <DialogDescription>
              Sélectionnez un service à connecter à votre plateforme
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="crm" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="crm">CRM</TabsTrigger>
              <TabsTrigger value="accounting">Comptabilité</TabsTrigger>
              <TabsTrigger value="property">Immobilier</TabsTrigger>
              <TabsTrigger value="payment">Paiements</TabsTrigger>
            </TabsList>

            <TabsContent value="crm" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {PROVIDERS.crm.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleAddIntegration(provider.id as IntegrationProvider)}
                    className="p-4 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg ${provider.gradient} flex items-center justify-center text-2xl`}>
                        <provider.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{provider.name}</h3>
                        <p className="text-sm text-gray-600">{provider.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">OAuth 2.0</Badge>
                          <Badge variant="outline" className="text-xs">Temps réel</Badge>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="accounting" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {PROVIDERS.accounting.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleAddIntegration(provider.id as IntegrationProvider)}
                    className="p-4 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg ${provider.gradient} flex items-center justify-center text-2xl text-white`}>
                        <provider.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{provider.name}</h3>
                        <p className="text-sm text-gray-600">{provider.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">OAuth 2.0</Badge>
                          <Badge variant="outline" className="text-xs">Sync quotidien</Badge>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="property" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {PROVIDERS.propertyManagement.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleAddIntegration(provider.id as IntegrationProvider)}
                    className="p-4 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg ${provider.gradient} flex items-center justify-center text-2xl text-white`}>
                        <provider.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{provider.name}</h3>
                        <p className="text-sm text-gray-600">{provider.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">API Key</Badge>
                          <Badge variant="outline" className="text-xs">Webhooks</Badge>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {PROVIDERS.payment.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleAddIntegration(provider.id as IntegrationProvider)}
                    className="p-4 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg ${provider.gradient} flex items-center justify-center text-2xl text-white`}>
                        <provider.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{provider.name}</h3>
                        <p className="text-sm text-gray-600">{provider.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">OAuth 2.0</Badge>
                          <Badge variant="outline" className="text-xs">Temps réel</Badge>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}