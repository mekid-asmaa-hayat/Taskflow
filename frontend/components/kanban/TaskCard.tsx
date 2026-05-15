import { Draggable } from '@hello-pangea/dnd';
import { Task } from '@/types';

const PRIORITY_STYLES: Record<string, string> = {
  LOW:      'bg-gray-100 text-gray-600',
  MEDIUM:   'bg-blue-100 text-blue-700',
  HIGH:     'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

interface Props {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

export default function TaskCard({ task, index, onClick }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`bg-white rounded-lg border p-3 cursor-pointer transition-shadow
            ${snapshot.isDragging
              ? 'shadow-lg border-primary-300 rotate-1'
              : 'border-gray-200 hover:border-primary-200 hover:shadow-sm'
            }`}
        >
          <p className="text-sm font-medium text-gray-800 mb-2 leading-snug">{task.title}</p>

          {task.description && (
            <p className="text-xs text-gray-400 mb-2 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}>
              {task.priority}
            </span>
            {task.assigneeName && (
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs flex items-center justify-center font-medium">
                {task.assigneeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
