/*
  # Streaming Platform Content Schema

  Creates tables for managing movies, TV shows, anime, seasons, and episodes.

  ## Tables Created
  
  ### movies
  - `id` (bigserial, primary key)
  - `title` (text) - Movie title
  - `year` (integer) - Release year
  - `thumbnail` (text) - URL to poster image
  - `description` (text) - Movie description
  - `tags` (text) - Comma-separated tags
  - `draft` (boolean, default false) - Visibility status
  - `video_source_type` (text) - "mp4" or "embed"
  - `video_source` (text) - Video URL
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### shows
  - `id` (bigserial, primary key)
  - `title` (text) - Show title
  - `description` (text) - Show description
  - `thumbnail` (text) - URL to poster image
  - `year` (integer) - Release year
  - `tags` (text) - Comma-separated tags
  - `draft` (boolean, default false) - Visibility status
  - `type` (text, default 'show') - "show" or "anime"
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### seasons
  - `id` (bigserial, primary key)
  - `show_id` (bigint, foreign key to shows)
  - `season_number` (integer) - Season number
  - `draft` (boolean, default false) - Visibility status
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### episodes
  - `id` (bigserial, primary key)
  - `season_id` (bigint, foreign key to seasons)
  - `episode_number` (integer) - Episode number
  - `title` (text) - Episode title
  - `duration` (text) - Episode duration
  - `draft` (boolean, default false) - Visibility status
  - `video_source_type` (text) - "mp4" or "embed"
  - `video_source` (text) - Video URL
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ## Security
  - RLS enabled on all tables
  - Public read access for non-draft content
  - Authenticated users can manage content
*/

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  year integer NOT NULL,
  thumbnail text NOT NULL,
  description text NOT NULL,
  tags text DEFAULT '',
  draft boolean DEFAULT false,
  video_source_type text NOT NULL CHECK (video_source_type IN ('mp4', 'embed')),
  video_source text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shows table
CREATE TABLE IF NOT EXISTS shows (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  thumbnail text NOT NULL,
  year integer NOT NULL,
  tags text DEFAULT '',
  draft boolean DEFAULT false,
  type text DEFAULT 'show' CHECK (type IN ('show', 'anime')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create seasons table
CREATE TABLE IF NOT EXISTS seasons (
  id bigserial PRIMARY KEY,
  show_id bigint NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  season_number integer NOT NULL,
  draft boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(show_id, season_number)
);

-- Create episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id bigserial PRIMARY KEY,
  season_id bigint NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  episode_number integer NOT NULL,
  title text NOT NULL,
  duration text NOT NULL,
  draft boolean DEFAULT false,
  video_source_type text NOT NULL CHECK (video_source_type IN ('mp4', 'embed')),
  video_source text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(season_id, episode_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_movies_draft ON movies(draft);
CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(year);
CREATE INDEX IF NOT EXISTS idx_shows_draft ON shows(draft);
CREATE INDEX IF NOT EXISTS idx_shows_type ON shows(type);
CREATE INDEX IF NOT EXISTS idx_seasons_show_id ON seasons(show_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season_id ON episodes(season_id);

-- Enable Row Level Security
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

-- Movies policies
CREATE POLICY "Public can view published movies"
  ON movies FOR SELECT
  USING (draft = false);

CREATE POLICY "Authenticated users can view all movies"
  ON movies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert movies"
  ON movies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update movies"
  ON movies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete movies"
  ON movies FOR DELETE
  TO authenticated
  USING (true);

-- Shows policies
CREATE POLICY "Public can view published shows"
  ON shows FOR SELECT
  USING (draft = false);

CREATE POLICY "Authenticated users can view all shows"
  ON shows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert shows"
  ON shows FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update shows"
  ON shows FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete shows"
  ON shows FOR DELETE
  TO authenticated
  USING (true);

-- Seasons policies
CREATE POLICY "Public can view published seasons"
  ON seasons FOR SELECT
  USING (
    draft = false 
    AND EXISTS (
      SELECT 1 FROM shows 
      WHERE shows.id = seasons.show_id 
      AND shows.draft = false
    )
  );

CREATE POLICY "Authenticated users can view all seasons"
  ON seasons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert seasons"
  ON seasons FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update seasons"
  ON seasons FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete seasons"
  ON seasons FOR DELETE
  TO authenticated
  USING (true);

-- Episodes policies
CREATE POLICY "Public can view published episodes"
  ON episodes FOR SELECT
  USING (
    draft = false 
    AND EXISTS (
      SELECT 1 FROM seasons 
      JOIN shows ON shows.id = seasons.show_id
      WHERE seasons.id = episodes.season_id 
      AND seasons.draft = false 
      AND shows.draft = false
    )
  );

CREATE POLICY "Authenticated users can view all episodes"
  ON episodes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert episodes"
  ON episodes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update episodes"
  ON episodes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete episodes"
  ON episodes FOR DELETE
  TO authenticated
  USING (true);
