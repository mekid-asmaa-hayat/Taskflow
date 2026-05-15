export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'MEMBER';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  dueDate?: string;
  createdAt: string;
  ownerId: string;
  ownerName: string;
  memberCount: number;
  taskCount: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  position: number;
  dueDate?: string;
  createdAt: string;
  projectId: string;
  assigneeId?: string;
  assigneeName?: string;
  createdById: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

export interface ProjectsState {
  items: Project[];
  current: Project | null;
  loading: boolean;
  error: string | null;
}
