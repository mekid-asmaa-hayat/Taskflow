import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '@/store';
import { restoreSession } from '@/store/slices/authSlice';
import '@/styles/globals.css';

function SessionRestorer() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          store.dispatch(restoreSession({
            token,
            user: {
              id: payload.sub,
              email: payload.sub,
              firstName: '',
              lastName: '',
              role: 'MEMBER',
            },
          }));
        } else {
          localStorage.removeItem('token');
        }
      } catch {}
    }
  }, []);
  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <SessionRestorer />
      <Component {...pageProps} />
    </Provider>
  );
}
