import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import ubiRoutes from './routes/ubiRoutes.js';
import { initPoller } from './services/poller.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection (optional for demo mode)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/civicverse';
mongoose.connect(mongoUri, { maxPoolSize: 1 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error (falling back to in-memory):', err.message));

// Mount API routes
app.use('/api', ubiRoutes);

// Start on-chain poller
initPoller();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CivicVerse Backend' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
