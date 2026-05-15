import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import TaskModal from '@/components/kanban/TaskModal';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchProject } from '@/store/slices/projectsSlice';
import { fetchTasks, createTask } from '@/store/slices/tasksSlice';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Task } from '@/types';

export default function ProjectPage() {
  useAuth();
  const router   = useRouter();
  const { id }   = router.query as { id: string };
  const dispatch = useAppDispatch();

  const { current: project, loading: projLoading } = useAppSelector((s) => s.projects);
  const { items: tasks,     loading: tasksLoading } = useAppSelector((s) => s.tasks);

  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'view'; status?: Task['status']; task?: Task }>({
    open: false, mode: 'create',
  });

  useWebSocket(id || null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProject(id));
      dispatch(fetchTasks(id));
    }
  }, [id, dispatch]);

  const handleAddTask = (status: Task['status']) => {
    setModal({ open: true, mode: 'create', status });
  };

  const handleTaskClick = (task: Task) => {
    setModal({ open: true, mode: 'view', task });
  };

  const handleCreateTask = (data: Partial<Task>) => {
    if (!id) return;
    dispatch(createTask({
      projectId: id,
      payload: { ...data, status: modal.status || 'TODO' },
    }));
  };

  if (projLoading || !project) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20 text-gray-400">Loading…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb + header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <Link href="/dashboard" className="hover:text-gray-600">Projects</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{project.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="text-gray-500 text-sm mt-0.5">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{tasks.length} tasks</span>
            <span>{project.memberCount} members</span>
            <button
              onClick={() => setModal({ open: true, mode: 'create', status: 'TODO' })}
              className="btn-primary"
            >
              + New task
            </button>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      {tasksLoading ? (
        <div className="text-center py-20 text-gray-400">Loading tasks…</div>
      ) : (
        <KanbanBoard
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
        />
      )}

      {/* Task modal */}
      {modal.open && (
        <TaskModal
          mode={modal.mode}
          defaultStatus={modal.status}
          task={modal.task}
          onSubmit={handleCreateTask}
          onClose={() => setModal({ open: false, mode: 'create' })}
        />
      )}
    </Layout>
  );
}
