-- Database initialization script for Netlify DB
-- This file creates the necessary tables for the biolink application

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    bio TEXT NOT NULL,
    profile_picture TEXT,
    background_image TEXT
);

CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- Insert default profile if none exists
INSERT INTO profiles (username, bio, profile_picture, background_image) 
SELECT 'renegade raider', 'Professional gamer • Content creator • Streaming daily', '', ''
WHERE NOT EXISTS (SELECT 1 FROM profiles);

-- Insert default links if none exist
INSERT INTO links (title, url, description, icon, color, "order") 
SELECT * FROM (VALUES 
    ('Twitch', '#', 'Watch me live stream', 'fab fa-twitch', 'bg-gaming-purple', 1),
    ('YouTube', '#', 'Gaming highlights & tutorials', 'fab fa-youtube', 'bg-red-600', 2),
    ('Twitter', '#', 'Latest updates & thoughts', 'fab fa-twitter', 'bg-gaming-cyan', 3),
    ('Discord', '#', 'Join the community', 'fab fa-discord', 'bg-indigo-600', 4),
    ('Spotify', '#', 'My gaming playlists', 'fab fa-spotify', 'bg-green-600', 5)
) AS default_links(title, url, description, icon, color, "order")
WHERE NOT EXISTS (SELECT 1 FROM links);