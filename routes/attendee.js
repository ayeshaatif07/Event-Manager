//routes/attendee.js
const express = require('express');
const router = express.Router();
const db = require('../db.js'); // import database connection

// <!-----------------------------------------------------------------------MY OWN CODE ------------------------------------------------------------------------------>
//route: GET /attendee/
//this loads the Attendee Home Page with the site settings and upcoming published events
router.get('/', async (req, res) => {
  try {
    //get site settings (like site name and description)
    const siteSettings = await db.get('SELECT * FROM organiser_settings LIMIT 1');

    //get all published events sorted by date
    const events = await db.all(`SELECT id, title, date FROM events WHERE status = 'published' ORDER BY date ASC`);

    //render the attendee home page and pass the data to the view
    res.render('attendee/home', {
      siteSettings,
      events
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading attendee home');
  }
});

//route: GET /attendee/event/:id
//this loads a specific eventss detail page
router.get('/event/:id', async (req, res) => {
  try {
    //get the event details by ID
    const event = await db.get('SELECT * FROM events WHERE id = ?', [req.params.id]);

    //render the event page with optional success message (after booking)
    res.render('attendee/event', {
      event,
      success: req.query.success === 'true' // used to show popup on successful booking
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading event');
  }
});

// Route: POST /attendee/event/:id/book
//this handles booking tickets for a selected event
router.post('/event/:id/book', async (req, res) => {
  try {
    const { attendee_name, full_price_qty_booked, concession_qty_booked } = req.body;
    const eventId = req.params.id;

    //get the event and make sure it is published
    const event = await db.get(`SELECT * FROM events WHERE id = ? AND status = 'published'`, [eventId]);

    const fullQty = parseInt(full_price_qty_booked);
    const concessQty = parseInt(concession_qty_booked);

    //prevent bookings with 0 tickets
    if (fullQty === 0 && concessQty === 0) {
      return res.status(400).send('Tickets booked cannot be 0');
    }

    const now = new Date().toISOString();

    //insert the booking into the bookings table
    await db.run(`INSERT INTO bookings (event_id, attendee_name, full_price_qty_booked, concession_qty_booked, created_at) VALUES (?, ?, ?, ?, ?)`,
      [eventId, attendee_name, fullQty, concessQty, now]);

    //update the available ticket stock for the event
    await db.run(`UPDATE events 
       SET full_price_qty = full_price_qty - ?,
       concession_qty = concession_qty - ? WHERE id = ?`,
      [fullQty, concessQty, eventId]);

    //redirect back to the event page with success message
    res.redirect(`/attendee/event/${eventId}?success=true`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error booking tickets');
  }
});

// <!-----------------------------------------------------------------------MY OWN CODE ------------------------------------------------------------------------------>

module.exports = router;