import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, TrendingUp, FileText, Users, MapPin, Settings } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { cn } from '../lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const commands = [
  { id: '1', name: 'Dashboard', path: '/', icon: TrendingUp, category: 'Navigation' },
  { id: '2', name: 'Techniciens', path: '/technicians', icon: Users, category: 'Navigation' },
  { id: '3', name: 'Clients', path: '/clients', icon: Users, category: 'Navigation' },
  { id: '4', name: 'Carte GPS', path: '/map', icon: MapPin, category: 'Navigation' },
  { id: '5', name: 'Factures', path: '/invoices', icon: FileText, category: 'Navigation' },
  { id: '6', name: 'Paramètres', path: '/settings', icon: Settings, category: 'Navigation' },
  { id: '7', name: 'Rapports', path: '/analytics', icon: TrendingUp, category: 'Navigation' },
  { id: '8', name: 'Soumissions', path: '/soumissions', icon: FileText, category: 'Navigation' },
];

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredCommands[selectedIndex].path);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-2xl">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher une page..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <kbd className="ml-auto text-xs text-gray-500 border rounded px-2 py-1">ESC</kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>Aucun résultat trouvé</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                    index === selectedIndex
                      ? 'bg-[var(--primary)] text-white'
                      : 'hover:bg-gray-100'
                  )}
                >
                  <cmd.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">{cmd.name}</p>
                    <p className={cn(
                      'text-sm',
                      index === selectedIndex ? 'text-white/80' : 'text-gray-500'
                    )}>
                      {cmd.category}
                    </p>
                  </div>
                  {index === selectedIndex && (
                    <kbd className="text-xs border rounded px-2 py-1 bg-white/20">↵</kbd>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-4 py-2 text-xs text-gray-500 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="border rounded px-1.5 py-0.5">↑</kbd>
            <kbd className="border rounded px-1.5 py-0.5">↓</kbd>
            Navigation
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border rounded px-1.5 py-0.5">↵</kbd>
            Sélectionner
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border rounded px-1.5 py-0.5">ESC</kbd>
            Fermer
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
