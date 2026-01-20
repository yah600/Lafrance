import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import DivisionIntakeRouter from '../intake/DivisionIntakeRouter';

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateJobModal({ open, onOpenChange }: CreateJobModalProps) {
  const { addClient, addJob } = useApp();
  const { activeDivision } = useAuth();

  const handleFormSubmit = (data: any) => {
    // Create client if new
    let clientId = data.clientId;
    if (!clientId && data.clientName) {
      const newClient = {
        name: data.clientName,
        phone: data.clientPhone,
        email: data.clientEmail || '',
        address: `${data.address}, ${data.city}, QC ${data.postalCode}`,
        type: data.buildingType || 'residential' as 'residential' | 'commercial',
        totalSpent: 0,
        equipment: [],
      };
      addClient(newClient);
      // In real app, would get ID from addClient return value
      clientId = `client-${Date.now()}`;
    }

    // Create job
    const newJob = {
      clientId: clientId,
      client: {
        name: data.clientName,
        address: `${data.address}, ${data.city}`,
        phone: data.clientPhone,
      },
      division: activeDivision || 'plomberie',
      status: 'pending' as const,
      priority: data.emergencyLevel || data.urgency || 'normal' as 'low' | 'normal' | 'high' | 'urgent',
      serviceType: data.problemType || data.jobType || 'installation' as any,
      description: data.description || data.problemDescription || '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00',
      duration: 60,
      location: {
        lat: 45.5017,
        lng: -73.5673,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addJob(newJob);
    toast.success('Demande de service créée avec succès!');
    onOpenChange(false);
  };

  if (!activeDivision) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sélectionner une division</DialogTitle>
            <DialogDescription>
              Veuillez vous connecter et sélectionner une division pour créer une demande de service.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de service</DialogTitle>
          <DialogDescription>
            Formulaire spécifique à la division sélectionnée
          </DialogDescription>
        </DialogHeader>
        
        <DivisionIntakeRouter
          division={activeDivision}
          onSubmit={handleFormSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}