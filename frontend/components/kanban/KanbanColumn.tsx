import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Task } from '@/types';

const COLUMN_STYLES: Record<string, { header: string; dot: string }> = {
  TODO:        { header: 'text-gray-700',   dot: 'bg-gray-400' },
  IN_PROGRESS: { header: 'text-blue-700',   dot: 'bg-blue-500' },
  IN_REVIEW:   { header: 'text-yellow-700', dot: 'bg-yellow-500' },
  DONE:        { header: 'text-green-700',  dot: 'bg-green-500' },
};

const COLUMN_LABELS: Record<string, string> = {
  TODO:        'To do',
  IN_PROGRESS: 'In progress',
  IN_REVIEW:   'In review',
  DONE:        'Done',
};

interface Props {
  status: Task['status'];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: Task['status']) => void;
}

export default function KanbanColumn({ status, tasks, onTaskClick, onAddTask }: Props) {
  const style = COLUMN_STYLES[status];

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${style.dot}`} />
          <span className={`text-sm font-semibold ${style.header}`}>
            {COLUMN_LABELS[status]}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="text-gray-400 hover:text-primary-600 text-lg leading-none transition-colors"
          title="Add task"
        >
          +
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-24 flex flex-col gap-2 p-2 rounded-xl transition-colors
              ${snapshot.isDraggingOver ? 'bg-primary-50' : 'bg-gray-100/60'}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
