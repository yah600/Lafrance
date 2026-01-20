import * as React from 'react';
import { Search, Calendar, Users, MapPin, FileText, Settings, Plus, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent } from './dialog';
import { useNavigate } from 'react-router-dom';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Navigation
    { id: 'nav-dashboard', label: 'Aller au Dashboard', icon: <TrendingUp className="h-4 w-4" />, action: () => navigate('/'), category: 'Navigation' },
    { id: 'nav-dispatch', label: 'Aller au Dispatch', icon: <Calendar className="h-4 w-4" />, action: () => navigate('/dispatch'), category: 'Navigation' },
    { id: 'nav-technicians', label: 'Aller aux Techniciens', icon: <Users className="h-4 w-4" />, action: () => navigate('/technicians'), category: 'Navigation' },
    { id: 'nav-clients', label: 'Aller aux Clients', icon: <Users className="h-4 w-4" />, action: () => navigate('/clients'), category: 'Navigation' },
    { id: 'nav-map', label: 'Aller à la Carte', icon: <MapPin className="h-4 w-4" />, action: () => navigate('/map'), category: 'Navigation' },
    { id: 'nav-invoices', label: 'Aller aux Factures', icon: <FileText className="h-4 w-4" />, action: () => navigate('/invoices'), category: 'Navigation' },
    { id: 'nav-analytics', label: 'Aller aux Rapports', icon: <TrendingUp className="h-4 w-4" />, action: () => navigate('/analytics'), category: 'Navigation' },
    { id: 'nav-settings', label: 'Aller aux Paramètres', icon: <Settings className="h-4 w-4" />, action: () => navigate('/settings'), category: 'Navigation' },
    
    // Actions
    { id: 'action-new-job', label: 'Créer un nouveau travail', icon: <Plus className="h-4 w-4" />, action: () => navigate('/dispatch'), category: 'Actions', keywords: ['nouveau', 'job', 'travail'] },
    { id: 'action-new-client', label: 'Ajouter un client', icon: <Plus className="h-4 w-4" />, action: () => navigate('/clients'), category: 'Actions', keywords: ['nouveau', 'client'] },
    { id: 'action-new-invoice', label: 'Créer une facture', icon: <Plus className="h-4 w-4" />, action: () => navigate('/invoices'), category: 'Actions', keywords: ['nouvelle', 'facture', 'invoice'] },
  ];

  const filteredCommands = React.useMemo(() => {
    if (!search) return commands;
    
    const searchLower = search.toLowerCase();
    return commands.filter(cmd => 
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.category.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some(kw => kw.includes(searchLower))
    );
  }, [search]);

  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  React.useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }

      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredCommands, selectedIndex, onOpenChange]);

  const executeCommand = (cmd: CommandItem) => {
    cmd.action();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher des commandes..."
            className="flex-1 px-4 py-4 outline-none text-base"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Aucune commande trouvée
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} className="mb-4 last:mb-0">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {category}
                </div>
                <div className="space-y-1">
                  {items.map((cmd, idx) => {
                    const globalIndex = filteredCommands.indexOf(cmd);
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => executeCommand(cmd)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                          globalIndex === selectedIndex
                            ? 'bg-[var(--accent)] text-white'
                            : 'hover:bg-muted'
                        }`}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      >
                        <div className={globalIndex === selectedIndex ? 'text-white' : 'text-muted-foreground'}>
                          {cmd.icon}
                        </div>
                        <span className="flex-1 text-left">{cmd.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑↓</kbd>
            Navigation
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd>
            Sélectionner
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd>
            Fermer
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
