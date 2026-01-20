import { useState, useRef, useEffect } from 'react';
import { Send, X, User, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  sender: 'admin' | 'client';
  message: string;
  timestamp: Date;
}

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientId?: string;
}

export default function ChatModal({ 
  open, 
  onClose, 
  clientName,
  clientEmail,
  clientPhone,
  clientId 
}: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'admin',
      message: `Bonjour ${clientName}! Comment puis-je vous aider aujourd'hui?`,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'admin',
      message: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // In production, this would send via WebSocket/API
    toast.success('Message envoyé');

    // Simulate client response (for demo)
    setTimeout(() => {
      const clientResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'client',
        message: 'Merci pour votre message. Je vous répondrai bientôt.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, clientResponse]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-[var(--primary)] text-white">
                  {getInitials(clientName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle>{clientName}</DialogTitle>
                <div className="flex items-center gap-4 mt-1">
                  {clientPhone && (
                    <a
                      href={`tel:${clientPhone}`}
                      className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {clientPhone}
                    </a>
                  )}
                  {clientEmail && (
                    <span className="text-xs text-gray-600">{clientEmail}</span>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'admin'
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Quick Responses */}
        <div className="p-3 bg-gray-50 border-t">
          <p className="text-xs text-gray-600 mb-2">Réponses rapides:</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewMessage('Merci de votre intérêt. Un technicien vous contactera sous peu.')}
            >
              Confirmation contact
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewMessage('Votre soumission est en cours de préparation. Vous la recevrez dans les prochaines 24h.')}
            >
              Soumission en cours
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewMessage('Quand seriez-vous disponible pour une visite?')}
            >
              Planifier visite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
