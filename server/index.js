require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helloRoutes = require('./routes/hello');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// API routes
app.use('/api', helloRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`POST endpoint: http://localhost:${PORT}/api/hello`);
  console.log(`GET  endpoint: http://localhost:${PORT}/api/interactions`);
});
