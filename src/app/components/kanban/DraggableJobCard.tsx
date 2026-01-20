import { useDrag } from 'react-dnd';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { GripVertical } from 'lucide-react';
import { Job } from '../../types';

interface DraggableJobCardProps {
  job: Job;
  onClick?: () => void;
}

const ItemTypes = {
  JOB: 'job'
};

export function DraggableJobCard({ job, onClick }: DraggableJobCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.JOB,
    item: { id: job.id, status: job.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={drag}
      className={`cursor-move hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        {/* Priority Color Bar */}
        <div
          className={`h-1 rounded-full mb-2 ${
            job.priority === 'urgent'
              ? 'bg-red-500 animate-pulse'
              : job.priority === 'high'
              ? 'bg-orange-400'
              : 'bg-blue-400'
          }`}
        />

        {/* Drag Handle */}
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {/* Client Name */}
            <h4 className="font-semibold text-sm mb-1 truncate">{job.client.name}</h4>

            {/* Time */}
            <p className="text-xs text-muted-foreground mb-2">{job.scheduledTime}</p>

            {/* Service Type & Technician */}
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className="text-xs truncate">
                {job.serviceType}
              </Badge>
              {job.technician && (
                <div
                  className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  title={job.technician.name}
                >
                  {job.technician.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { ItemTypes };
