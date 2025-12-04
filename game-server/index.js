import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CivicVerse Game Server' });
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('player-join', (data) => {
    console.log('Player joined:', data);
    io.emit('player-joined', { playerId: socket.id, data });
  });

  socket.on('player-move', (data) => {
    socket.broadcast.emit('player-moved', { playerId: socket.id, position: data });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    io.emit('player-left', { playerId: socket.id });
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Game server running on port ${PORT}`);
});
