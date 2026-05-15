import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Task, TasksState } from '@/types';

const initialState: TasksState = { items: [], loading: false, error: null };

export const fetchTasks = createAsyncThunk('tasks/fetchByProject', async (projectId: string, { rejectWithValue }) => {
  try {
    const { data } = await api.get<Task[]>(`/api/projects/${projectId}/tasks`);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const createTask = createAsyncThunk(
  'tasks/create',
  async ({ projectId, payload }: { projectId: string; payload: Partial<Task> }, { rejectWithValue }) => {
    try {
      const { data } = await api.post<Task>(`/api/projects/${projectId}/tasks`, payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }: { id: string; status: Task['status'] }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<Task>(`/api/tasks/${id}/status`, { status });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update');
    }
  }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/api/tasks/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    moveTaskOptimistic(state, action: PayloadAction<{ id: string; status: Task['status'] }>) {
      const task = state.items.find(t => t.id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
    addTaskFromSocket(state, action: PayloadAction<Task>) {
      const exists = state.items.find(t => t.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
    },
    updateTaskFromSocket(state, action: PayloadAction<Task>) {
      const idx = state.items.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending,         (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTasks.fulfilled,       (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchTasks.rejected,        (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(createTask.fulfilled,       (s, a) => { s.items.push(a.payload); })
      .addCase(updateTaskStatus.fulfilled, (s, a) => {
        const idx = s.items.findIndex(t => t.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteTask.fulfilled,       (s, a) => { s.items = s.items.filter(t => t.id !== a.payload); });
  },
});

export const { moveTaskOptimistic, addTaskFromSocket, updateTaskFromSocket } = tasksSlice.actions;
export default tasksSlice.reducer;
