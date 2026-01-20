import { useDrop } from 'react-dnd';
import { Badge } from '../ui/badge';
import { ItemTypes } from './DraggableJobCard';

interface DroppableColumnProps {
  id: string;
  label: string;
  count: number;
  color: string;
  icon?: React.ReactNode;
  onDrop: (jobId: string, newStatus: string) => void;
  children: React.ReactNode;
}

export function DroppableColumn({
  id,
  label,
  count,
  color,
  icon,
  onDrop,
  children,
}: DroppableColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.JOB,
    drop: (item: { id: string; status: string }) => {
      if (item.status !== id) {
        onDrop(item.id, id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <div className="flex flex-col min-h-[600px]">
      {/* Column Header */}
      <div
        className={`rounded-lg p-3 mb-3 transition-all ${color} ${
          isActive ? 'ring-2 ring-blue-400 ring-offset-2' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold">{label}</h3>
          </div>
          <Badge variant="secondary" className="font-bold">
            {count}
          </Badge>
        </div>
      </div>

      {/* Droppable Area */}
      <div
        ref={drop}
        className={`space-y-3 flex-1 rounded-lg p-2 transition-colors ${
          isActive ? 'bg-blue-50 border-2 border-dashed border-blue-400' : 'bg-gray-50/50'
        }`}
      >
        {children}
        {count === 0 && !isActive && (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Aucun travail
          </div>
        )}
      </div>
    </div>
  );
}
