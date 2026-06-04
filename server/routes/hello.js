const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/hello — record a button press and return "Hi Hello"
router.post('/hello', async (req, res) => {
  const { user_action } = req.body;

  if (!user_action) {
    return res.status(400).json({ error: 'user_action is required in request body' });
  }

  console.log(`[${new Date().toISOString()}] Received interaction: user_action="${user_action}"`);

  try {
    const result = await pool.query(
      'INSERT INTO interactions (user_action, response) VALUES ($1, $2) RETURNING id, timestamp',
      [user_action, 'Hi Hello']
    );

    const { id, timestamp } = result.rows[0];

    console.log(`[${new Date().toISOString()}] Inserted row id=${id}`);

    res.json({
      message: 'Hi Hello',
      id,
      timestamp,
    });
  } catch (err) {
    console.error('Database error on POST /api/hello:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// GET /api/interactions — return all recorded interactions (for verification)
router.get('/interactions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM interactions ORDER BY timestamp DESC'
    );
    res.json({ interactions: result.rows, count: result.rowCount });
  } catch (err) {
    console.error('Database error on GET /api/interactions:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
