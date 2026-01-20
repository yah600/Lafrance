import { useState } from 'react';
import { 
  MessageSquare, Send, Search, Paperclip, Image as ImageIcon, 
  Phone, Video, MoreVertical, User, CheckCheck, Clock, AlertCircle,
  Archive, Trash2, Star, Bell
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'technician' | 'dispatcher' | 'system';
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

interface Conversation {
  id: string;
  title: string;
  participants: {
    id: string;
    name: string;
    role: 'client' | 'technician' | 'dispatcher';
    avatar?: string;
    online?: boolean;
  }[];
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  relatedTo?: {
    type: 'request' | 'invoice';
    id: string;
    title: string;
  };
}

export default function ClientPortalMessages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Mock data
  const [conversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      title: 'Support - Réparation fuite',
      participants: [
        {
          id: 'tech-1',
          name: 'Marc Tremblay',
          role: 'technician',
          online: true,
        },
      ],
      lastMessage: {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'tech-1',
        senderName: 'Marc Tremblay',
        senderRole: 'technician',
        content: 'Je suis en route, j\'arrive dans environ 15 minutes.',
        timestamp: new Date('2025-12-17T13:45:00'),
        isRead: false,
      },
      unreadCount: 2,
      isPinned: true,
      relatedTo: {
        type: 'request',
        id: 'REQ-2025-001',
        title: 'Réparation fuite robinet cuisine',
      },
    },
    {
      id: 'conv-2',
      title: 'Installation chauffe-eau',
      participants: [
        {
          id: 'tech-2',
          name: 'Jean Lapointe',
          role: 'technician',
          online: false,
        },
      ],
      lastMessage: {
        id: 'msg-2',
        conversationId: 'conv-2',
        senderId: 'client',
        senderName: 'Vous',
        senderRole: 'client',
        content: 'Parfait, merci pour la confirmation!',
        timestamp: new Date('2025-12-16T11:30:00'),
        isRead: true,
      },
      unreadCount: 0,
      isPinned: false,
      relatedTo: {
        type: 'request',
        id: 'REQ-2025-002',
        title: 'Installation chauffe-eau',
      },
    },
    {
      id: 'conv-3',
      title: 'Service client',
      participants: [
        {
          id: 'disp-1',
          name: 'Sophie Martin',
          role: 'dispatcher',
          online: true,
        },
      ],
      lastMessage: {
        id: 'msg-3',
        conversationId: 'conv-3',
        senderId: 'disp-1',
        senderName: 'Sophie Martin',
        senderRole: 'dispatcher',
        content: 'Bien sûr! Je peux vous aider avec votre demande.',
        timestamp: new Date('2025-12-15T16:20:00'),
        isRead: true,
      },
      unreadCount: 0,
      isPinned: false,
    },
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'conv-1': [
      {
        id: 'msg-1-1',
        conversationId: 'conv-1',
        senderId: 'client',
        senderName: 'Vous',
        senderRole: 'client',
        content: 'Bonjour, le robinet fuit toujours. Pouvez-vous venir aujourd\'hui?',
        timestamp: new Date('2025-12-17T13:00:00'),
        isRead: true,
      },
      {
        id: 'msg-1-2',
        conversationId: 'conv-1',
        senderId: 'tech-1',
        senderName: 'Marc Tremblay',
        senderRole: 'technician',
        content: 'Bonjour! Oui, je peux passer cet après-midi. Je confirme pour 14h00.',
        timestamp: new Date('2025-12-17T13:15:00'),
        isRead: true,
      },
      {
        id: 'msg-1-3',
        conversationId: 'conv-1',
        senderId: 'client',
        senderName: 'Vous',
        senderRole: 'client',
        content: 'Parfait, merci beaucoup!',
        timestamp: new Date('2025-12-17T13:20:00'),
        isRead: true,
      },
      {
        id: 'msg-1-4',
        conversationId: 'conv-1',
        senderId: 'tech-1',
        senderName: 'Marc Tremblay',
        senderRole: 'technician',
        content: 'Je suis en route, j\'arrive dans environ 15 minutes.',
        timestamp: new Date('2025-12-17T13:45:00'),
        isRead: false,
      },
      {
        id: 'msg-1-5',
        conversationId: 'conv-1',
        senderId: 'system',
        senderName: 'Système',
        senderRole: 'system',
        content: 'Le technicien Marc Tremblay a commencé l\'intervention.',
        timestamp: new Date('2025-12-17T14:05:00'),
        isRead: false,
      },
    ],
    'conv-2': [
      {
        id: 'msg-2-1',
        conversationId: 'conv-2',
        senderId: 'tech-2',
        senderName: 'Jean Lapointe',
        senderRole: 'technician',
        content: 'Bonjour, je vous confirme le rendez-vous pour l\'installation du chauffe-eau le 19 décembre à 9h00.',
        timestamp: new Date('2025-12-16T11:00:00'),
        isRead: true,
      },
      {
        id: 'msg-2-2',
        conversationId: 'conv-2',
        senderId: 'client',
        senderName: 'Vous',
        senderRole: 'client',
        content: 'Parfait, merci pour la confirmation!',
        timestamp: new Date('2025-12-16T11:30:00'),
        isRead: true,
      },
    ],
    'conv-3': [
      {
        id: 'msg-3-1',
        conversationId: 'conv-3',
        senderId: 'client',
        senderName: 'Vous',
        senderRole: 'client',
        content: 'Bonjour, je voudrais avoir des informations sur vos services d\'entretien annuel.',
        timestamp: new Date('2025-12-15T16:00:00'),
        isRead: true,
      },
      {
        id: 'msg-3-2',
        conversationId: 'conv-3',
        senderId: 'disp-1',
        senderName: 'Sophie Martin',
        senderRole: 'dispatcher',
        content: 'Bien sûr! Je peux vous aider avec votre demande.',
        timestamp: new Date('2025-12-15T16:20:00'),
        isRead: true,
      },
    ],
  });

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);

    // Create new message
    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation,
      senderId: 'client',
      senderName: 'Vous',
      senderRole: 'client',
      content: newMessage,
      timestamp: new Date(),
      isRead: true,
    };

    // Add to messages
    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), message],
    }));

    setNewMessage('');
    
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSending(false);
    
    toast.success('Message envoyé');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}m`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    
    return new Intl.DateTimeFormat('fr-CA', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatMessageTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-CA', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'technician':
        return 'bg-blue-100 text-blue-700';
      case 'dispatcher':
        return 'bg-purple-100 text-purple-700';
      case 'system':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            Communiquez avec nos techniciens et notre équipe
          </p>
        </div>
        {totalUnread > 0 && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {totalUnread} non lu{totalUnread > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Main messaging interface */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="border-r flex flex-col h-full">
              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher une conversation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune conversation trouvée</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedConversation === conv.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback className={getRoleColor(conv.participants[0].role)}>
                              {getInitials(conv.participants[0].name)}
                            </AvatarFallback>
                          </Avatar>
                          {conv.participants[0].online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm truncate">
                                {conv.participants[0].name}
                              </h4>
                              {conv.isPinned && (
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatTime(conv.lastMessage.timestamp)}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 mb-1 truncate">{conv.title}</p>

                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-gray-600 truncate">
                              {conv.lastMessage.senderId === 'client' ? 'Vous: ' : ''}
                              {conv.lastMessage.content}
                            </p>
                            {conv.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>

                          {conv.relatedTo && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {conv.relatedTo.type === 'request' ? 'Demande' : 'Facture'}: {conv.relatedTo.id}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Messages View */}
            <div className="col-span-2 flex flex-col h-full">
              {selectedConv ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback className={getRoleColor(selectedConv.participants[0].role)}>
                            {getInitials(selectedConv.participants[0].name)}
                          </AvatarFallback>
                        </Avatar>
                        {selectedConv.participants[0].online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedConv.participants[0].name}</h3>
                        <p className="text-xs text-gray-600">
                          {selectedConv.participants[0].online ? 'En ligne' : 'Hors ligne'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" disabled>
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" disabled>
                        <Video className="h-5 w-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            Épingler la conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell className="h-4 w-4 mr-2" />
                            Désactiver les notifications
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {currentMessages.map((message, index) => {
                      const isOwn = message.senderId === 'client';
                      const isSystem = message.senderRole === 'system';
                      const showAvatar = !isOwn && (index === 0 || currentMessages[index - 1].senderId !== message.senderId);

                      if (isSystem) {
                        return (
                          <div key={message.id} className="flex items-center justify-center">
                            <div className="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-full flex items-center gap-2">
                              <AlertCircle className="h-3 w-3" />
                              {message.content}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                        >
                          {!isOwn && (
                            <div className="flex-shrink-0">
                              {showAvatar ? (
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className={getRoleColor(message.senderRole)}>
                                    {getInitials(message.senderName)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="h-8 w-8" />
                              )}
                            </div>
                          )}

                          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                            {showAvatar && !isOwn && (
                              <span className="text-xs text-gray-600 mb-1">{message.senderName}</span>
                            )}
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isOwn
                                  ? 'bg-[var(--primary)] text-white'
                                  : 'bg-white text-gray-900'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs text-gray-500">
                                {formatMessageTime(message.timestamp)}
                              </span>
                              {isOwn && (
                                <CheckCheck className={`h-3 w-3 ${message.isRead ? 'text-blue-500' : 'text-gray-400'}`} />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex items-end gap-2">
                      <Button variant="ghost" size="icon" className="flex-shrink-0" disabled>
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="flex-shrink-0" disabled>
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Textarea
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 min-h-[80px] max-h-[200px] resize-none"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                        className="flex-shrink-0 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                      >
                        {isSending ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Sélectionnez une conversation
                    </h3>
                    <p className="text-gray-600">
                      Choisissez une conversation pour commencer à discuter
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Besoin d'aide urgente?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Pour les urgences, appelez-nous directement au <strong>514-555-URGENT</strong> (24/7)
              </p>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Appeler maintenant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
