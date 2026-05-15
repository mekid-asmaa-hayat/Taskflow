const setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a project room to receive real-time updates
    socket.on('joinProject', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`Socket ${socket.id} joined project:${projectId}`);
    });

    socket.on('leaveProject', (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

// Emit a task update to all members of a project
const notifyTaskUpdate = (io, projectId, event, data) => {
  io.to(`project:${projectId}`).emit(event, data);
};

module.exports = { setupWebSocket, notifyTaskUpdate };
