# Supabase Database Guide

## Overview

Your streaming website now uses **Supabase PostgreSQL database** for all content storage. Content updates **immediately** without rebuilding the site!

## Architecture

- **Frontend**: Astro with Server-Side Rendering (SSR)
- **Database**: Supabase PostgreSQL
- **Updates**: Real-time - add content and see it instantly

## Database Tables

### 1. Movies
Stores all movie content.

| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Auto-incrementing primary key |
| title | text | Movie title |
| year | integer | Release year |
| thumbnail | text | URL to poster image |
| description | text | Movie description |
| tags | text | Comma-separated tags |
| draft | boolean | false = visible, true = hidden |
| video_source_type | text | "mp4" or "embed" |
| video_source | text | Video URL |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

### 2. Shows
Stores TV shows and anime series.

| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Auto-incrementing primary key |
| title | text | Show/anime title |
| description | text | Show/anime description |
| thumbnail | text | URL to poster image |
| year | integer | Release year |
| tags | text | Comma-separated tags |
| draft | boolean | false = visible, true = hidden |
| type | text | "show" or "anime" |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

### 3. Seasons
Stores seasons for shows/anime.

| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Auto-incrementing primary key |
| show_id | bigint | Foreign key to shows table |
| season_number | integer | Season number (1, 2, 3, etc.) |
| draft | boolean | false = visible, true = hidden |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

**Constraints:**
- Unique combination of show_id + season_number
- Cascade delete: deleting a show deletes its seasons

### 4. Episodes
Stores episodes for seasons.

| Column | Type | Description |
|--------|------|-------------|
| id | bigserial | Auto-incrementing primary key |
| season_id | bigint | Foreign key to seasons table |
| episode_number | integer | Episode number (1, 2, 3, etc.) |
| title | text | Episode title |
| duration | text | Episode duration (e.g., "45 minutes") |
| draft | boolean | false = visible, true = hidden |
| video_source_type | text | "mp4" or "embed" |
| video_source | text | Video URL |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

**Constraints:**
- Unique combination of season_id + episode_number
- Cascade delete: deleting a season deletes its episodes

## Relationships

```
Show (type: "show" or "anime")
└── Season (season_number: 1, 2, 3...)
    └── Episode (episode_number: 1, 2, 3...)

Movie (standalone, no relationships)
```

## Adding Content

### Using SQL (Supabase Dashboard)

#### Add a Movie
```sql
INSERT INTO movies (
  title, year, thumbnail, description, tags,
  draft, video_source_type, video_source
) VALUES (
  'Movie Title',
  2024,
  'https://example.com/poster.jpg',
  'Movie description here',
  'action, adventure, thriller',
  false,
  'embed',
  'https://www.youtube.com/embed/VIDEO_ID'
);
```

#### Add a TV Show
```sql
-- Step 1: Insert the show
INSERT INTO shows (
  title, description, thumbnail, year, tags,
  draft, type
) VALUES (
  'Show Title',
  'Show description here',
  'https://example.com/poster.jpg',
  2024,
  'drama, mystery',
  false,
  'show'
) RETURNING id;  -- Note the returned ID

-- Step 2: Add season (use the show ID from above)
INSERT INTO seasons (show_id, season_number, draft)
VALUES (1, 1, false)  -- Replace 1 with actual show ID
RETURNING id;  -- Note the returned season ID

-- Step 3: Add episodes (use the season ID from above)
INSERT INTO episodes (
  season_id, episode_number, title, duration,
  draft, video_source_type, video_source
) VALUES
(1, 1, 'Episode 1 Title', '45 minutes', false, 'embed', 'https://youtube.com/embed/VIDEO_ID'),
(1, 2, 'Episode 2 Title', '42 minutes', false, 'embed', 'https://youtube.com/embed/VIDEO_ID');
-- Replace 1 with actual season ID
```

#### Add an Anime
Same as TV show, but use `type = 'anime'`:

```sql
INSERT INTO shows (
  title, description, thumbnail, year, tags,
  draft, type
) VALUES (
  'Anime Title',
  'Anime description here',
  'https://example.com/poster.jpg',
  2024,
  'sci-fi, action',
  false,
  'anime'  -- This makes it appear in anime section
);
```

## Security (Row Level Security)

The database has RLS policies configured:

### Public Access
- Can view movies where `draft = false`
- Can view shows where `draft = false`
- Can view seasons/episodes where all parent items are not draft

### Authenticated Users
- Full CRUD access to all content
- Can manage draft items

## Querying Data

### Get All Published Movies
```sql
SELECT * FROM movies
WHERE draft = false
ORDER BY created_at DESC;
```

### Get Show with Seasons and Episodes
```sql
SELECT
  s.id, s.title, s.description, s.thumbnail, s.year, s.tags, s.type,
  json_agg(
    json_build_object(
      'season_number', se.season_number,
      'episodes', (
        SELECT json_agg(
          json_build_object(
            'episode_number', e.episode_number,
            'title', e.title,
            'duration', e.duration,
            'video_source_type', e.video_source_type,
            'video_source', e.video_source
          ) ORDER BY e.episode_number
        )
        FROM episodes e
        WHERE e.season_id = se.id AND e.draft = false
      )
    ) ORDER BY se.season_number
  ) as seasons
FROM shows s
LEFT JOIN seasons se ON se.show_id = s.id AND se.draft = false
WHERE s.id = 1 AND s.draft = false
GROUP BY s.id;
```

### Get Latest Episodes
```sql
SELECT
  e.*,
  se.season_number,
  s.id as show_id,
  s.title as show_title,
  s.type as show_type
FROM episodes e
JOIN seasons se ON se.id = e.season_id
JOIN shows s ON s.id = se.show_id
WHERE e.draft = false
  AND se.draft = false
  AND s.draft = false
ORDER BY e.created_at DESC
LIMIT 10;
```

## Updating Content

### Update Movie
```sql
UPDATE movies
SET
  title = 'New Title',
  description = 'Updated description',
  updated_at = now()
WHERE id = 1;
```

### Update Episode
```sql
UPDATE episodes
SET
  title = 'New Episode Title',
  video_source = 'https://new-url.com',
  updated_at = now()
WHERE id = 1;
```

### Hide Content (Draft Mode)
```sql
-- Hide a movie
UPDATE movies SET draft = true WHERE id = 1;

-- Hide an entire show (hides all seasons and episodes too)
UPDATE shows SET draft = true WHERE id = 1;

-- Hide just one episode
UPDATE episodes SET draft = true WHERE id = 1;
```

## Deleting Content

### Delete Movie
```sql
DELETE FROM movies WHERE id = 1;
```

### Delete Show (and all its seasons/episodes)
```sql
-- This automatically deletes all seasons and episodes due to CASCADE
DELETE FROM shows WHERE id = 1;
```

### Delete Season (and all its episodes)
```sql
-- This automatically deletes all episodes due to CASCADE
DELETE FROM seasons WHERE id = 1;
```

### Delete Episode
```sql
DELETE FROM episodes WHERE id = 1;
```

## Adding Unlimited Content

### Multiple Seasons
```sql
-- Add Season 2 to show ID 1
INSERT INTO seasons (show_id, season_number, draft)
VALUES (1, 2, false);

-- Add Season 3
INSERT INTO seasons (show_id, season_number, draft)
VALUES (1, 3, false);
```

### Multiple Episodes
```sql
-- Add 10 episodes to season ID 5
INSERT INTO episodes (season_id, episode_number, title, duration, draft, video_source_type, video_source)
VALUES
(5, 1, 'Episode 1', '45 min', false, 'embed', 'URL'),
(5, 2, 'Episode 2', '45 min', false, 'embed', 'URL'),
(5, 3, 'Episode 3', '45 min', false, 'embed', 'URL'),
(5, 4, 'Episode 4', '45 min', false, 'embed', 'URL'),
(5, 5, 'Episode 5', '45 min', false, 'embed', 'URL'),
(5, 6, 'Episode 6', '45 min', false, 'embed', 'URL'),
(5, 7, 'Episode 7', '45 min', false, 'embed', 'URL'),
(5, 8, 'Episode 8', '45 min', false, 'embed', 'URL'),
(5, 9, 'Episode 9', '45 min', false, 'embed', 'URL'),
(5, 10, 'Episode 10', '45 min', false, 'embed', 'URL');
```

## Best Practices

1. **Always set draft = false** for content you want visible
2. **Use consistent naming** for titles and tags
3. **Optimize images** before uploading (keep thumbnails under 100KB)
4. **Use embed URLs** for YouTube videos: `https://www.youtube.com/embed/VIDEO_ID`
5. **Add tags** for better searchability
6. **Keep descriptions concise** but informative
7. **Use sequential numbering** for seasons and episodes

## Indexes

The database has indexes for performance:
- Movies: draft, year
- Shows: draft, type
- Seasons: show_id
- Episodes: season_id

## Connection String

Your Supabase connection details are in `.env`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Accessing Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Use "Table Editor" to view/edit data visually
4. Use "SQL Editor" to run custom queries
5. Use "Database" → "Migrations" to view schema

## Common Tasks

### Check Total Content
```sql
SELECT
  (SELECT COUNT(*) FROM movies WHERE draft = false) as total_movies,
  (SELECT COUNT(*) FROM shows WHERE draft = false AND type = 'show') as total_shows,
  (SELECT COUNT(*) FROM shows WHERE draft = false AND type = 'anime') as total_anime,
  (SELECT COUNT(*) FROM seasons WHERE draft = false) as total_seasons,
  (SELECT COUNT(*) FROM episodes WHERE draft = false) as total_episodes;
```

### Find Show by Title
```sql
SELECT * FROM shows WHERE title ILIKE '%search term%';
```

### List All Shows with Episode Counts
```sql
SELECT
  s.id,
  s.title,
  s.type,
  COUNT(DISTINCT se.id) as season_count,
  COUNT(e.id) as episode_count
FROM shows s
LEFT JOIN seasons se ON se.show_id = s.id AND se.draft = false
LEFT JOIN episodes e ON e.season_id = se.id AND e.draft = false
WHERE s.draft = false
GROUP BY s.id, s.title, s.type
ORDER BY s.created_at DESC;
```

## Troubleshooting

### Content not appearing?
1. Check `draft` field is `false`
2. For episodes, check parent season and show are also not draft
3. Verify foreign keys are correct (show_id, season_id)

### Can't add episode?
1. Ensure season exists first
2. Check season_id is correct
3. Verify episode_number doesn't already exist for that season

### Video not playing?
1. For YouTube, use embed URL format
2. Check video_source URL is accessible
3. Verify video_source_type matches the URL type

## Support

For database issues:
1. Check Supabase dashboard logs
2. Verify RLS policies allow your operation
3. Check foreign key constraints
4. Review error messages in browser console
