# Event Manager

A web application for running events and taking bookings, built with Node.js, Express, EJS and SQLite. An organiser creates and publishes events and manages site settings, and attendees browse published events and book tickets. The sample site is set up as "Stretch Yoga", a yoga class business.

## Features

### Organiser

- Dashboard listing draft and published events.
- Create, edit, publish and delete events.
- Set ticket quantities and prices for full price and concession tickets.
- Edit the site name and description.
- View all bookings across events.

### Attendee

- Home page showing the site name, description and upcoming published events.
- Event page with the details and ticket availability.
- Book full price and concession tickets by entering a name and quantities.
- Booking reduces the available ticket count, and a message confirms success.
- Bookings with zero tickets are rejected.

## Tech Stack

- [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/)
- [EJS](https://ejs.co/) templates with [Bootstrap](https://getbootstrap.com/) styling
- [SQLite](https://www.sqlite.org/) through the `sqlite3` package

## Pages

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/organiser` | Organiser dashboard |
| `/organiser/event/new` | Create an event |
| `/organiser/event/:id/edit` | Edit an event |
| `/organiser/settings` | Site settings |
| `/organiser/bookings` | All bookings |
| `/attendee` | Attendee home with published events |
| `/attendee/event/:id` | Event details and booking form |

## Database

The schema is in `db_schema.sql` and has three tables:

- `organiser_settings`: site name and description.
- `events`: title, description, date, status (`draft` or `published`), timestamps, and ticket quantities and prices for full price and concession tickets.
- `bookings`: the event, the attendee name, tickets booked and a timestamp.

## Run Locally

You need [Node.js](https://nodejs.org/) 16 or newer and the `sqlite3` command-line tool.

```bash
git clone https://github.com/ayeshaatif07/Event-Manager.git
cd Event-Manager
npm install
npm run build-db
npm run start
```

Then open http://localhost:3000 in your browser. Press `Ctrl+C` in the terminal to stop the server.

On Windows, use `npm run build-db-win` instead of `npm run build-db`.

To reset the data, run `npm run clean-db` (or `npm run clean-db-win` on Windows) and then build the database again.

## Project Structure

| File / folder | Purpose |
|---------------|---------|
| `index.js` | App entry point: Express setup, database connection and routes |
| `db.js` | Promise-based helpers (`get`, `all`, `run`) for SQLite |
| `db_schema.sql` | Database schema and default site settings |
| `routes/organiser.js` | Organiser routes |
| `routes/attendee.js` | Attendee routes |
| `views/` | EJS templates for the landing, organiser and attendee pages |
| `public/` | Static files |
| `Working with this Template.pdf` | Course template guide |

## Author and Credits

- **Author:** Ayesha Atif
- **Coursework:** Database, Networks and Web (CM2040) – Midterm
- Starting template provided by the course.
- Built with [Express](https://expressjs.com/), [EJS](https://ejs.co/), [SQLite](https://www.sqlite.org/) and [Bootstrap](https://getbootstrap.com/).
