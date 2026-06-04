-- Hello World App Database Schema
-- Run with: psql -d <your_database> -f schema.sql

CREATE TABLE IF NOT EXISTS interactions (
  id        SERIAL PRIMARY KEY,
  user_action TEXT NOT NULL,
  response  TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
