import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface SendEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientEmail: string;
  recipientName: string;
}

const EMAIL_TEMPLATES = {
  custom: { subject: '', body: '' },
  reminder: {
    subject: 'Rappel: Rendez-vous à venir',
    body: 'Bonjour,\n\nCeci est un rappel concernant votre rendez-vous à venir.\n\nCordialement,\nPlomberie D\'Experts'
  },
  follow_up: {
    subject: 'Suivi de votre intervention',
    body: 'Bonjour,\n\nNous espérons que votre expérience avec notre service était satisfaisante.\n\nCordialement,\nPlomberie D\'Experts'
  },
  update: {
    subject: 'Mise à jour concernant votre travail',
    body: 'Bonjour,\n\nNous vous écrivons pour vous informer d\'une mise à jour concernant votre travail.\n\nCordialement,\nPlomberie D\'Experts'
  }
};

export function SendEmailModal({ open, onOpenChange, recipientEmail, recipientName }: SendEmailModalProps) {
  const [template, setTemplate] = useState<keyof typeof EMAIL_TEMPLATES>('custom');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleTemplateChange = (value: string) => {
    const templateKey = value as keyof typeof EMAIL_TEMPLATES;
    setTemplate(templateKey);
    const selected = EMAIL_TEMPLATES[templateKey];
    setSubject(selected.subject);
    setBody(selected.body);
  };

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    // Simulate sending email
    toast.success(`Email envoyé à ${recipientName}!`);
    onOpenChange(false);
    
    // Reset form
    setTemplate('custom');
    setSubject('');
    setBody('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Envoyer un email</DialogTitle>
          <DialogDescription>
            Envoyer un email à {recipientName} ({recipientEmail})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Modèle</Label>
            <Select value={template} onValueChange={handleTemplateChange}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Choisir un modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Message personnalisé</SelectItem>
                <SelectItem value="reminder">Rappel de rendez-vous</SelectItem>
                <SelectItem value="follow_up">Suivi d'intervention</SelectItem>
                <SelectItem value="update">Mise à jour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Objet</Label>
            <Input
              id="subject"
              placeholder="Objet de l'email..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Écrivez votre message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>

          <div className="text-xs text-gray-500">
            <p>💡 Astuce: Vous pouvez personnaliser les modèles avant d'envoyer.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSend} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
            Envoyer l'email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
