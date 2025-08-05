const express = require('express');
const pool = require('../db');
const authMiddleware = require('../authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const creatorId = req.user;

    const newEvent = await pool.query(
      'INSERT INTO events (title, description, creator_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, creatorId]
    );

    res.status(201).json(newEvent.rows[0]);
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ msg: 'Server error creating event' });
  }
});


router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await pool.query(
      `SELECT e.*, COUNT(ev.id) AS volunteers_count
       FROM events e
       LEFT JOIN event_volunteers ev ON e.id = ev.event_id
       GROUP BY e.id
       ORDER BY e.created_at DESC`
    );
    res.json(events.rows);
  } catch (err) {
    console.error('Fetch events error:', err);
    res.status(500).json({ msg: 'Server error fetching events' });
  }
});


router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'INSERT INTO event_volunteers (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.params.id, req.user]
    );
    res.json({ msg: 'Joined event' });
  } catch (err) {
    console.error('Join error:', err);
    res.status(500).json({ msg: 'Server error joining event' });
  }
});


router.post('/:id/leave', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM event_volunteers WHERE event_id = $1 AND user_id = $2',
      [req.params.id, req.user]
    );
    res.json({ msg: 'Left event' });
  } catch (err) {
    console.error('Leave error:', err);
    res.status(500).json({ msg: 'Server error leaving event' });
  }
});


router.get('/my', authMiddleware, async (req, res) => {
  try {
    const myEvents = await pool.query(
      `SELECT e.*
       FROM events e
       JOIN event_volunteers ev ON e.id = ev.event_id
       WHERE ev.user_id = $1`,
      [req.user]
    );
    res.json(myEvents.rows);
  } catch (err) {
    console.error('My events error:', err);
    res.status(500).json({ msg: 'Server error fetching my events' });
  }
});

module.exports = router;
