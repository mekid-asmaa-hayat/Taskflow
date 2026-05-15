import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from './useAppDispatch';

export const useAuth = (redirectTo = '/auth/login') => {
  const { isAuthenticated, user, loading } = useAppSelector((s) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  return { isAuthenticated, user, loading };
};
