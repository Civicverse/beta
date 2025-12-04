import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/civicverse';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CivicVerse Backend' });
});

// API routes placeholder
app.get('/api/missions', (req, res) => {
  res.json({ missions: [] });
});

app.get('/api/users/:id', (req, res) => {
  res.json({ user: { id: req.params.id } });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
