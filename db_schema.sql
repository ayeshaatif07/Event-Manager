
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create table for site settings
CREATE TABLE IF NOT EXISTS organiser_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_name TEXT NOT NULL,
  site_description TEXT NOT NULL
);

-- Create a table to store event details
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  status TEXT CHECK(status IN ('draft', 'published')) NOT NULL DEFAULT 'draft',
  created_at TEXT,
  updated_at TEXT,
  published_at TEXT,
  full_price_qty INTEGER DEFAULT 0,
  full_price REAL DEFAULT 0.0,
  concession_qty INTEGER DEFAULT 0,
  concession_price REAL DEFAULT 0.0
);

-- Create a table to store bookings for events
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER,
  attendee_name TEXT NOT NULL,
  full_price_qty_booked INTEGER DEFAULT 0,
  concession_qty_booked INTEGER DEFAULT 0,
  created_at TEXT,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Insert default site settings
INSERT INTO organiser_settings (site_name, site_description)
VALUES ('Stretch Yoga', 'Yoga classes for all ages and abilities');

COMMIT;

