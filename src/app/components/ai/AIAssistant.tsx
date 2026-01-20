import { useState } from 'react';
import { Sparkles, Send, X, Mic, Lightbulb, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  action?: {
    type: 'create_job' | 'show_stats' | 'assign_tech';
    data?: any;
  };
}

export default function AIAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour! Je suis votre assistant IA de dispatch. Comment puis-je vous aider aujourd\'hui?',
      suggestions: [
        'Créer un nouveau travail',
        'Qui est disponible cet après-midi?',
        'Statistiques du mois',
        'Optimiser les routes'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      let assistantMessage: Message;

      // Simple keyword detection for demo
      if (input.toLowerCase().includes('disponible') || input.toLowerCase().includes('available')) {
        assistantMessage = {
          role: 'assistant',
          content: 'Actuellement, 3 techniciens sont disponibles cet après-midi:\n\n• Jean-Pierre Dubois (3/3 travaux terminés)\n• Luc Fortin (2/2 travaux terminés)\n• Sophie Gagnon (disponible dès 14h00)\n\nVoulez-vous assigner un travail à l\'un d\'entre eux?'
        };
      } else if (input.toLowerCase().includes('statistiques') || input.toLowerCase().includes('stats')) {
        assistantMessage = {
          role: 'assistant',
          content: '📊 Statistiques de décembre 2025:\n\n• Revenus: $124,500 (+12% vs nov)\n• Travaux complétés: 387\n• Taux de satisfaction: 4.8/5\n• Valeur moyenne: $322\n\nSouhaitez-vous un rapport détaillé?',
          action: {
            type: 'show_stats'
          }
        };
      } else if (input.toLowerCase().includes('créer') || input.toLowerCase().includes('nouveau')) {
        assistantMessage = {
          role: 'assistant',
          content: 'Je peux vous aider à créer un nouveau travail. Pour qui est-ce? Dites-moi le nom du client ou "nouveau client".',
          suggestions: ['Restaurant Le Gourmet', 'Jean Dupont', 'Nouveau client']
        };
      } else if (input.toLowerCase().includes('optimis') || input.toLowerCase().includes('route')) {
        assistantMessage = {
          role: 'assistant',
          content: '🚗 J\'ai analysé les routes d\'aujourd\'hui. Je peux réorganiser les travaux de Marc Tremblay pour économiser 45 minutes de déplacement. Voulez-vous que j\'applique ces changements?',
          suggestions: ['Appliquer', 'Voir les détails', 'Annuler']
        };
      } else {
        assistantMessage = {
          role: 'assistant',
          content: 'Je peux vous aider avec:\n\n• Créer et planifier des travaux\n• Trouver des techniciens disponibles\n• Optimiser les routes\n• Analyser les statistiques\n• Répondre aux urgences\n\nQue souhaitez-vous faire?',
          suggestions: [
            'Créer un travail urgent',
            'Voir les stats',
            'Optimiser les routes',
            'Techniciens disponibles'
          ]
        };
      }

      setMessages(prev => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1000);
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Assistant IA Dispatch</h3>
                <p className="text-sm text-muted-foreground">Alimenté par l'intelligence artificielle</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>

                  {message.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleSuggestion(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  {message.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 gap-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Voir le rapport
                    </Button>
                  )}
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      AD
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="p-4 border-t bg-gray-50">
          <div className="grid grid-cols-4 gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2 gap-1"
              onClick={() => setInput('Créer un nouveau travail')}
            >
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Travail</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2 gap-1"
              onClick={() => setInput('Qui est disponible?')}
            >
              <Users className="h-4 w-4" />
              <span className="text-xs">Techniciens</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2 gap-1"
              onClick={() => setInput('Statistiques du jour')}
            >
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Stats</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2 gap-1"
              onClick={() => setInput('Optimiser les routes')}
            >
              <Lightbulb className="h-4 w-4" />
              <span className="text-xs">Optimiser</span>
            </Button>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Mic className="h-5 w-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Posez une question ou commande..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="bg-gradient-to-r from-purple-500 to-blue-500"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
