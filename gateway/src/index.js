require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes    = require('./routes/auth.routes');
const projectRoutes = require('./routes/projects.routes');
const taskRoutes    = require('./routes/tasks.routes');
const { rateLimiter } = require('./middleware/rateLimiter');
const { setupWebSocket } = require('./websocket/notificationHandler');

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});
setupWebSocket(io);
app.set('io', io);

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api',          taskRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));
