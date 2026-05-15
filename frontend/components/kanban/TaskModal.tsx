import { useForm } from 'react-hook-form';
import { Task } from '@/types';

interface Props {
  mode: 'create' | 'view';
  defaultStatus?: Task['status'];
  task?: Task;
  onSubmit?: (data: Partial<Task>) => void;
  onClose: () => void;
}

const PRIORITIES: Task['priority'][] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function TaskModal({ mode, defaultStatus = 'TODO', task, onSubmit, onClose }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Task>>({
    defaultValues: task || { priority: 'MEDIUM', status: defaultStatus },
  });

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'create' ? 'New task' : task?.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>

        {mode === 'view' && task ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{task.status}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{task.priority}</span>
            </div>
            {task.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
            )}
            {task.assigneeName && (
              <p className="text-sm text-gray-500">Assigned to: <span className="font-medium">{task.assigneeName}</span></p>
            )}
            <button onClick={onClose} className="btn-secondary w-full mt-4">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit((data) => { onSubmit?.(data); onClose(); })} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="input"
                placeholder="Task title"
                autoFocus
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                {...register('description')}
                className="input resize-none"
                rows={3}
                placeholder="Add more details…"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select {...register('priority')} className="input">
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Create task</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
