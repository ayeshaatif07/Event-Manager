const express = require('express');
const router = express.Router();
const db = require('../db.js'); // Import the SQLite database

// <!-----------------------------------------------------------------------MY OWN CODE ------------------------------------------------------------------------------>

// GET organiser Home Page
//loads the organiser dashboard with lists of draft and published events + site settings
router.get('/', async (req, res) => {
  try {
    const publishedEvents = await db.all(`SELECT * FROM events WHERE status = 'published' ORDER BY date ASC`);
    const draftEvents = await db.all(`SELECT * FROM events WHERE status = 'draft' ORDER BY date ASC`);
    const siteSettings = await db.get(`SELECT * FROM organiser_settings LIMIT 1`);

    res.render('organiser/home', {
      publishedEvents,
      draftEvents,
      siteSettings
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//GET show empty form to create a new event
router.get('/event/new', (req, res) => {
  const emptyEvent = {
    title: '',
    description: '',
    date: '',
    full_price_qty: 0,
    full_price: 0,
    concession_qty: 0,
    concession_price: 0
  };
  res.render('organiser/create_event', { event: emptyEvent });
});

//POST save a new draft event to the database
router.post('/event/new', async (req, res) => {
  const { title, description, date, full_price_qty, full_price, concession_qty, concession_price } = req.body;
  try {
    const now = new Date().toISOString();
    await db.run(
      `INSERT INTO events (title, description, date, status, created_at, updated_at, full_price_qty, full_price, concession_qty, concession_price) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, date, "draft", now, now, full_price_qty, full_price, concession_qty, concession_price]
    );
    res.redirect(`/organiser`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating event');
  }
});

//GET load an existing event into the edit form
router.get('/event/:id/edit', async (req, res) => {
  try {
    const event = await db.get(`SELECT * FROM events WHERE id = ?`, [req.params.id]);
    res.render('organiser/edit_event', { event });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading event');
  }
});

// POST save updates to an event
router.post('/event/:id/update', async (req, res) => {
  try {
    const {
      title,
      description,
      date, 
      full_price_qty,
      full_price,
      concession_qty,
      concession_price
    } = req.body;

    const now = new Date().toISOString();

    await db.run(`
      UPDATE events 
      SET title = ?, description = ?, date = ?, full_price_qty = ?, full_price = ?, 
          concession_qty = ?, concession_price = ?, updated_at = ?
      WHERE id = ?
    `, [
      title,
      description,
      date, 
      full_price_qty,
      full_price,
      concession_qty,
      concession_price,
      now,
      req.params.id
    ]);

    res.redirect('/organiser');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating event');
  }
});

//GET load the Site Settings form
router.get('/settings', async (req, res) => {
  try {
    const settings = await db.get(`SELECT * FROM organiser_settings LIMIT 1`);
    res.render('organiser/site_settings', { settings });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading settings');
  }
});

//save changes to the Site Settings (insert or update)
router.post('/settings', async (req, res) => {
  try {
    const { site_name, site_description } = req.body;
    const existing = await db.get(`SELECT * FROM organiser_settings LIMIT 1`);
    
    if (existing) {
      // Update existing settings
      await db.run(`UPDATE organiser_settings SET site_name = ?, site_description = ? WHERE id = ?`,
        [site_name, site_description, existing.id]);
    } else {
      // Insert settings if none exist yet
      await db.run(`INSERT INTO organiser_settings (site_name, site_description) VALUES (?, ?)`,
        [site_name, site_description]);
    }
    res.redirect('/organiser');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating settings');
  }
});

// POST  Publish a draft event
router.post('/event/:id/publish', async (req, res) => {
  try {
    const now = new Date().toISOString();
    await db.run(`
      UPDATE events 
      SET status = 'published', published_at = ?
      WHERE id = ? AND status = 'draft'
    `, [now, req.params.id]);

    res.redirect('/organiser');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error publishing event');
  }
});

// POST Delete an event
router.post('/event/:id/delete', async (req, res) => {
  console.log(req.params.id);
  try {
    await db.run(`DELETE FROM events WHERE id = ?`, [req.params.id]);
    res.redirect('/organiser');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting event');
  }
});

// GET Show a list of all bookings for all events
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await db.all(`
      SELECT 
        b.id, b.attendee_name, b.concession_qty_booked, b.full_price_qty_booked, b.created_at,
        e.title AS event_title
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      ORDER BY b.created_at DESC
    `);

    res.render('organiser/bookings', { bookings });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading bookings');
  }
});

// <!-----------------------------------------------------------------------MY OWN CODE ------------------------------------------------------------------------------>

module.exports = router;

