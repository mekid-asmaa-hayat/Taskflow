import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '@/components/layout/Layout';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchProjects, createProject, deleteProject } from '@/store/slices/projectsSlice';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

type ProjectForm = { name: string; description?: string };

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    'bg-green-100 text-green-700',
  ON_HOLD:   'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  ARCHIVED:  'bg-gray-100 text-gray-600',
};

export default function DashboardPage() {
  useAuth();
  const dispatch  = useAppDispatch();
  const router    = useRouter();
  const { items: projects, loading } = useAppSelector((s) => s.projects);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectForm>();

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const onSubmit = async (data: ProjectForm) => {
    await dispatch(createProject(data));
    reset();
    setShowModal(false);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + New project
        </button>
      </div>

      {/* Projects grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading…</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No projects yet</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/projects/${p.id}`)}
              className="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate pr-2">
                  {p.name}
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[p.status]}`}>
                  {p.status}
                </span>
              </div>
              {p.description && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{p.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                <span>{p.taskCount} task{p.taskCount !== 1 ? 's' : ''}</span>
                <span>{p.memberCount} member{p.memberCount !== 1 ? 's' : ''}</span>
                <span>{format(new Date(p.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New project modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New project</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="input"
                  placeholder="My awesome project"
                  autoFocus
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  {...register('description')}
                  className="input resize-none"
                  rows={3}
                  placeholder="What is this project about?"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
