import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CivicVerse Mining Service' });
});

// Mining status endpoint
app.get('/api/mining/status', (req, res) => {
  res.json({ 
    mining: false,
    network: 'monero',
    hashrate: 0,
    shares: 0
  });
});

// Start mining endpoint
app.post('/api/mining/start', (req, res) => {
  res.json({ message: 'Mining started', status: 'mining' });
});

// Stop mining endpoint
app.post('/api/mining/stop', (req, res) => {
  res.json({ message: 'Mining stopped', status: 'idle' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mining service running on port ${PORT}`);
});
