import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from './useAppDispatch';
import { addTaskFromSocket, updateTaskFromSocket } from '@/store/slices/tasksSlice';
import { Task } from '@/types';

let socket: Socket | null = null;

export const useWebSocket = (projectId: string | null) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!projectId) return;

    const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3001';
    socket = io(GATEWAY);

    socket.on('connect', () => {
      socket?.emit('joinProject', projectId);
    });

    socket.on('taskCreated', (task: Task) => {
      dispatch(addTaskFromSocket(task));
    });

    socket.on('taskUpdated', (task: Task) => {
      dispatch(updateTaskFromSocket(task));
    });

    return () => {
      socket?.emit('leaveProject', projectId);
      socket?.disconnect();
      socket = null;
    };
  }, [projectId, dispatch]);
};
