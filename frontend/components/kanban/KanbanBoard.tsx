import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { Task } from '@/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { moveTaskOptimistic, updateTaskStatus } from '@/store/slices/tasksSlice';

const COLUMNS: Task['status'][] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: Task['status']) => void;
}

export default function KanbanBoard({ tasks, onTaskClick, onAddTask }: Props) {
  const dispatch = useAppDispatch();

  const tasksByStatus = (status: Task['status']) =>
    tasks.filter((t) => t.status === status)
         .sort((a, b) => a.position - b.position);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Task['status'];

    // Optimistic update
    dispatch(moveTaskOptimistic({ id: draggableId, status: newStatus }));

    // Persist to backend
    dispatch(updateTaskStatus({ id: draggableId, status: newStatus }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-5 overflow-x-auto pb-4">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus(status)}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
