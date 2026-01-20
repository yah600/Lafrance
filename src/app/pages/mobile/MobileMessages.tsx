import { Search, Send } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

const conversations = [
  { id: 1, name: 'Dispatch Center', lastMessage: 'Nouveau travail assigné', time: '10:30', unread: 2 },
  { id: 2, name: 'Sophie Gagnon', lastMessage: 'As-tu les pièces pour demain?', time: '09:15', unread: 0 },
  { id: 3, name: 'Jean Dupont (Client)', lastMessage: 'Merci pour le service!', time: 'Hier', unread: 0 },
  { id: 4, name: 'Support Technique', lastMessage: 'Votre demande a été traitée', time: '15 Dec', unread: 0 }
];

export default function MobileMessages() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold mb-3">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map(conv => (
          <div 
            key={conv.id}
            className="flex items-center gap-3 p-4 border-b hover:bg-gray-50 cursor-pointer"
          >
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {conv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold truncate">{conv.name}</p>
                <span className="text-xs text-muted-foreground">{conv.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
            </div>
            {conv.unread > 0 && (
              <Badge className="bg-[var(--primary)]">{conv.unread}</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
