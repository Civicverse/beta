import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Craig - CivicVerse AI Assistant' });
});

// Craig AI endpoints
app.get('/api/missions/nearby', (req, res) => {
  const { lat, lng } = req.query;
  res.json({ 
    missions: [],
    message: 'Nearby missions for your location'
  });
});

app.post('/api/craig/suggest', (req, res) => {
  const { context, userRep } = req.body;
  res.json({ 
    suggestion: 'Craig is analyzing your civic profile...',
    options: []
  });
});

app.get('/api/craig/dao-proposal/:id', (req, res) => {
  res.json({ 
    proposal: { id: req.params.id },
    interpretation: 'Interpreting DAO proposal...'
  });
});

app.get('/api/craig/fryboy-test', (req, res) => {
  res.json({ 
    status: 'Protocol Integrity Check',
    ethical_alignment: 'PASSED'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Craig AI Assistant running on port ${PORT}`);
});
