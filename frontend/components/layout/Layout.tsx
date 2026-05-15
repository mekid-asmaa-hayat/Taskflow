import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold text-primary-600">
            TaskFlow
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-gray-600">
              {user.firstName || user.email}
            </span>
          )}
          <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
