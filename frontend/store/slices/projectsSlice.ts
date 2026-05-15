import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Project, ProjectsState } from '@/types';

const initialState: ProjectsState = { items: [], current: null, loading: false, error: null };

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<Project[]>('/api/projects');
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects');
  }
});

export const fetchProject = createAsyncThunk('projects/fetchOne', async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await api.get<Project>(`/api/projects/${id}`);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Project not found');
  }
});

export const createProject = createAsyncThunk(
  'projects/create',
  async (payload: { name: string; description?: string; dueDate?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post<Project>('/api/projects', payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create project');
    }
  }
);

export const deleteProject = createAsyncThunk('projects/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/api/projects/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete');
  }
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrent(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchProjects.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(fetchProject.pending,    (s) => { s.loading = true; })
      .addCase(fetchProject.fulfilled,  (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchProject.rejected,   (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(createProject.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(deleteProject.fulfilled, (s, a) => { s.items = s.items.filter(p => p.id !== a.payload); });
  },
});

export const { clearCurrent } = projectsSlice.actions;
export default projectsSlice.reducer;
