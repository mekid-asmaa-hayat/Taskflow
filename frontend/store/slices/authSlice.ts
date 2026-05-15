import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { AuthState } from '@/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/login', credentials);
      localStorage.setItem('token', data.token);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { email: string; password: string; firstName: string; lastName: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/auth/register', payload);
      localStorage.setItem('token', data.token);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    restoreSession(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending  = (state: AuthState) => { state.loading = true; state.error = null; };
    const handleFulfilled = (state: AuthState, action: any) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = { id: action.payload.id, email: action.payload.email,
        firstName: action.payload.firstName, lastName: action.payload.lastName,
        role: action.payload.role };
      state.isAuthenticated = true;
    };
    const handleRejected = (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(login.pending,    handlePending)
      .addCase(login.fulfilled,  handleFulfilled)
      .addCase(login.rejected,   handleRejected)
      .addCase(register.pending,   handlePending)
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected,  handleRejected);
  },
});

export const { logout, restoreSession, clearError } = authSlice.actions;
export default authSlice.reducer;
