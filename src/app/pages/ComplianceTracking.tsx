/**
 * Quebec Compliance & Certification Tracking
 * Tracks RBQ licenses, certifications, insurance, and regulatory compliance
 */

import { useState } from 'react';
import { FileCheck, AlertTriangle, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface ComplianceItem {
  id: string;
  type: 'license' | 'certification' | 'insurance' | 'training';
  name: string;
  division: string;
  holder: string; // Person or company
  number: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring-soon' | 'expired';
  authority: string; // RBQ, CCQ, CMMTQ, etc.
  documents?: string[];
}

export default function ComplianceTracking() {
  const { activeDivision } = useAuth();
  const { technicians } = useApp();

  // Mock compliance data
  const [complianceItems] = useState<ComplianceItem[]>([
    {
      id: 'rbq-001',
      type: 'license',
      name: 'Licence RBQ - Entrepreneur en plomberie',
      division: 'plomberie',
      holder: 'Plomberie Michael Lacoste Inc.',
      number: '5672-2312-01',
      issueDate: '2023-01-15',
      expiryDate: '2027-01-15',
      status: 'valid',
      authority: 'RBQ (Régie du bâtiment du Québec)',
      documents: ['rbq-license.pdf', 'insurance-proof.pdf']
    },
    {
      id: 'rbq-002',
      type: 'license',
      name: 'Licence RBQ - Entrepreneur en toiture',
      division: 'toitures',
      holder: 'Toitures Jonathan Isabel Inc.',
      number: '5672-5510-01',
      issueDate: '2022-06-01',
      expiryDate: '2026-06-01',
      status: 'valid',
      authority: 'RBQ',
      documents: ['rbq-toiture.pdf']
    },
    {
      id: 'ins-001',
      type: 'insurance',
      name: 'Assurance responsabilité civile',
      division: 'plomberie',
      holder: 'Toutes divisions',
      number: 'ARC-2024-8876',
      issueDate: '2024-01-01',
      expiryDate: '2025-01-01',
      status: 'expiring-soon',
      authority: 'Intact Assurance',
      documents: ['insurance-2024.pdf']
    },
    {
      id: 'cert-001',
      type: 'certification',
      name: 'Certification gaz naturel',
      division: 'plomberie',
      holder: 'Marc Leblanc',
      number: 'GN-45678',
      issueDate: '2020-03-15',
      expiryDate: '2025-03-15',
      status: 'valid',
      authority: 'CMMTQ',
      documents: ['cert-gaz.pdf']
    },
    {
      id: 'train-001',
      type: 'training',
      name: 'Formation SIMDUT 2024',
      division: 'plomberie',
      holder: 'Équipe technique',
      number: 'SIMDUT-2024',
      issueDate: '2024-01-10',
      expiryDate: '2026-02-15',
      status: 'expiring-soon',
      authority: 'CNESST',
      documents: ['simdut-cert.pdf']
    },
  ]);

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✓ Valide</Badge>;
      case 'expiring-soon':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠ Expire bientôt</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 border-red-200">✗ Expiré</Badge>;
    }
  };

  const getTypeIcon = (type: ComplianceItem['type']) => {
    switch (type) {
      case 'license': return <FileCheck className="h-5 w-5 text-blue-600" />;
      case 'certification': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'insurance': return <AlertCircle className="h-5 w-5 text-purple-600" />;
      case 'training': return <Clock className="h-5 w-5 text-orange-600" />;
    }
  };

  const filteredItems = activeDivision 
    ? complianceItems.filter(item => item.division === activeDivision || item.division === 'all')
    : complianceItems;

  const stats = {
    total: filteredItems.length,
    valid: filteredItems.filter(i => i.status === 'valid').length,
    expiringSoon: filteredItems.filter(i => i.status === 'expiring-soon').length,
    expired: filteredItems.filter(i => i.status === 'expired').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conformité RBQ & Certifications</h1>
          <p className="text-gray-600">Suivi des licences, certifications et assurances</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Téléverser document
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Rapport de conformité
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileCheck className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valides</p>
                <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expire bientôt</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expirés</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="licenses">Licences RBQ</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="insurance">Assurances</TabsTrigger>
          <TabsTrigger value="training">Formations</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Expiring Soon Alert */}
          {stats.expiringSoon > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm font-semibold text-yellow-800">
                  {stats.expiringSoon} certification{stats.expiringSoon > 1 ? 's' : ''} expire{stats.expiringSoon === 1 ? '' : 'nt'} bientôt!
                </p>
              </div>
            </div>
          )}

          {/* Compliance Items List */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Licences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredItems.map((item) => {
                  const daysLeft = getDaysUntilExpiry(item.expiryDate);
                  
                  return (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getTypeIcon(item.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              {getStatusBadge(item.status)}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                              <div>
                                <span className="font-medium">Titulaire:</span> {item.holder}
                              </div>
                              <div>
                                <span className="font-medium">Numéro:</span> {item.number}
                              </div>
                              <div>
                                <span className="font-medium">Autorité:</span> {item.authority}
                              </div>
                              <div>
                                <span className="font-medium">Expiration:</span>{' '}
                                {new Date(item.expiryDate).toLocaleDateString('fr-CA')}
                                {item.status === 'expiring-soon' && (
                                  <span className="text-yellow-600 font-semibold ml-1">
                                    ({daysLeft} jours)
                                  </span>
                                )}
                              </div>
                            </div>

                            {item.documents && item.documents.length > 0 && (
                              <div className="mt-3 flex gap-2">
                                {item.documents.map((doc, idx) => (
                                  <Button key={idx} variant="outline" size="sm">
                                    <Download className="h-3 w-3 mr-1" />
                                    {doc}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licenses">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredItems.filter(i => i.type === 'license').map(item => (
                  <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">N° {item.number} - Expire le {new Date(item.expiryDate).toLocaleDateString('fr-CA')}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredItems.filter(i => i.type === 'certification').map(item => (
                  <div key={item.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Titulaire: {item.holder}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredItems.filter(i => i.type === 'insurance').map(item => (
                  <div key={item.id} className="border-l-4 border-purple-500 pl-4 py-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Police: {item.number}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {filteredItems.filter(i => i.type === 'training').map(item => (
                  <div key={item.id} className="border-l-4 border-orange-500 pl-4 py-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Formation complétée le {new Date(item.issueDate).toLocaleDateString('fr-CA')}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
