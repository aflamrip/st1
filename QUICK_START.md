# Quick Start Guide

## 🎉 Your Streaming Website is Now Database-Powered!

Your website now uses **Supabase PostgreSQL database** instead of JSON files. Content updates **instantly** without rebuilding!

## ✅ What Changed

### Before (JSON Files)
- Content stored in `src/content/*.json`
- Required rebuild after every change
- Static site generation

### Now (Supabase Database)
- Content stored in PostgreSQL database
- **No rebuild needed** - changes appear immediately
- Server-side rendering (SSR)
- **Unlimited** seasons and episodes

## 🚀 How to Add Content

### Method 1: Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project
   - Click "Table Editor"

2. **Add a Movie**
   - Click on `movies` table
   - Click "Insert row"
   - Fill in the fields:
     - title: "Movie Name"
     - year: 2024
     - thumbnail: "https://image-url.com/poster.jpg"
     - description: "Movie description"
     - tags: "action, thriller"
     - draft: false (uncheck to publish)
     - video_source_type: "embed"
     - video_source: "https://www.youtube.com/embed/VIDEO_ID"
   - Click "Save"
   - **Content appears instantly on your website!**

3. **Add a TV Show**

   **Step 1 - Add the Show:**
   - Click on `shows` table
   - Click "Insert row"
   - Fill in:
     - title: "Show Name"
     - description: "Show description"
     - thumbnail: "https://image-url.com/poster.jpg"
     - year: 2024
     - tags: "drama, mystery"
     - draft: false
     - type: "show" (or "anime" for anime)
   - Click "Save"
   - **Note the ID number** (e.g., 5)

   **Step 2 - Add Season:**
   - Click on `seasons` table
   - Click "Insert row"
   - Fill in:
     - show_id: 5 (use the ID from Step 1)
     - season_number: 1
     - draft: false
   - Click "Save"
   - **Note the season ID** (e.g., 10)

   **Step 3 - Add Episodes:**
   - Click on `episodes` table
   - Click "Insert row"
   - Fill in:
     - season_id: 10 (use the season ID from Step 2)
     - episode_number: 1
     - title: "Episode 1 Title"
     - duration: "45 minutes"
     - draft: false
     - video_source_type: "embed"
     - video_source: "https://www.youtube.com/embed/VIDEO_ID"
   - Click "Save"
   - **Repeat for each episode** (change episode_number to 2, 3, 4...)

### Method 2: SQL Editor (Advanced)

1. Go to Supabase Dashboard → SQL Editor
2. Paste your SQL query
3. Click "Run"

**Example - Add Movie:**
```sql
INSERT INTO movies (title, year, thumbnail, description, tags, draft, video_source_type, video_source)
VALUES (
  'Action Hero',
  2024,
  'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=400',
  'An action-packed thriller',
  'action, thriller, adventure',
  false,
  'embed',
  'https://www.youtube.com/embed/VIDEO_ID'
);
```

**Example - Add Complete Show with Season and Episodes:**
```sql
-- Add show
INSERT INTO shows (title, description, thumbnail, year, tags, draft, type)
VALUES ('Detective Series', 'Mystery detective show', 'https://...', 2024, 'mystery, crime', false, 'show')
RETURNING id;
-- Note the returned ID (e.g., 5)

-- Add season (replace 5 with your show ID)
INSERT INTO seasons (show_id, season_number, draft)
VALUES (5, 1, false)
RETURNING id;
-- Note the returned ID (e.g., 10)

-- Add episodes (replace 10 with your season ID)
INSERT INTO episodes (season_id, episode_number, title, duration, draft, video_source_type, video_source)
VALUES
(10, 1, 'Episode 1', '45 min', false, 'embed', 'https://youtube.com/embed/VIDEO1'),
(10, 2, 'Episode 2', '45 min', false, 'embed', 'https://youtube.com/embed/VIDEO2'),
(10, 3, 'Episode 3', '45 min', false, 'embed', 'https://youtube.com/embed/VIDEO3');
```

## 📊 Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| movies | Standalone movies | id, title, video_source |
| shows | TV shows & anime | id, title, type ('show' or 'anime') |
| seasons | Show seasons | id, show_id, season_number |
| episodes | Season episodes | id, season_id, episode_number, video_source |

## 🔑 Important Fields

### draft (boolean)
- `false` = Content is visible on website ✅
- `true` = Content is hidden 🚫

### type (shows table)
- `show` = Appears in TV Shows section
- `anime` = Appears in Anime section

### video_source_type
- `mp4` = Direct video file URL
- `embed` = Embedded player (YouTube, Vimeo, etc.)

### video_source (URL formats)
- **YouTube embed**: `https://www.youtube.com/embed/VIDEO_ID`
- **MP4 file**: `/uploads/video.mp4` or full URL

## 📝 Common Tasks

### Add More Seasons to a Show
```sql
-- Show ID 1, add Season 2
INSERT INTO seasons (show_id, season_number, draft)
VALUES (1, 2, false);

-- Add Season 3
INSERT INTO seasons (show_id, season_number, draft)
VALUES (1, 3, false);
```

### Add 10 Episodes at Once
```sql
-- Season ID 5, add episodes 1-10
INSERT INTO episodes (season_id, episode_number, title, duration, draft, video_source_type, video_source)
VALUES
(5, 1, 'Ep 1', '45 min', false, 'embed', 'URL1'),
(5, 2, 'Ep 2', '45 min', false, 'embed', 'URL2'),
(5, 3, 'Ep 3', '45 min', false, 'embed', 'URL3'),
(5, 4, 'Ep 4', '45 min', false, 'embed', 'URL4'),
(5, 5, 'Ep 5', '45 min', false, 'embed', 'URL5'),
(5, 6, 'Ep 6', '45 min', false, 'embed', 'URL6'),
(5, 7, 'Ep 7', '45 min', false, 'embed', 'URL7'),
(5, 8, 'Ep 8', '45 min', false, 'embed', 'URL8'),
(5, 9, 'Ep 9', '45 min', false, 'embed', 'URL9'),
(5, 10, 'Ep 10', '45 min', false, 'embed', 'URL10');
```

### Hide/Show Content
```sql
-- Hide a movie
UPDATE movies SET draft = true WHERE id = 1;

-- Show a movie
UPDATE movies SET draft = false WHERE id = 1;
```

### Update Video URL
```sql
UPDATE episodes
SET video_source = 'https://new-url.com'
WHERE id = 1;
```

### Delete Content
```sql
-- Delete a movie
DELETE FROM movies WHERE id = 1;

-- Delete a show (also deletes all its seasons and episodes)
DELETE FROM shows WHERE id = 1;
```

## 🔍 View Your Content

### Check What's Published
```sql
SELECT COUNT(*) as total FROM movies WHERE draft = false;
SELECT COUNT(*) as total FROM shows WHERE draft = false;
SELECT COUNT(*) as total FROM episodes WHERE draft = false;
```

### List All Shows with Episode Count
```sql
SELECT
  s.id,
  s.title,
  s.type,
  COUNT(DISTINCT se.id) as seasons,
  COUNT(e.id) as episodes
FROM shows s
LEFT JOIN seasons se ON se.show_id = s.id
LEFT JOIN episodes e ON e.season_id = se.id
WHERE s.draft = false
GROUP BY s.id, s.title, s.type;
```

## ⚠️ Common Issues

### Content Not Appearing?
1. ✅ Check `draft = false`
2. ✅ For episodes: parent season and show must also have `draft = false`
3. ✅ Verify foreign keys (show_id, season_id) are correct
4. ✅ Refresh your browser

### Can't Add Episode?
1. ✅ Season must exist first
2. ✅ Check season_id is correct
3. ✅ Episode number must be unique within that season

### Video Not Playing?
1. ✅ Use YouTube embed format: `https://www.youtube.com/embed/VIDEO_ID`
2. ✅ Don't use watch URL: ~~`https://www.youtube.com/watch?v=VIDEO_ID`~~
3. ✅ Check video URL is accessible

## 📱 Accessing Supabase

**Dashboard URL**: https://supabase.com/dashboard

**Your Project**:
- URL: Check `.env` file for `VITE_SUPABASE_URL`
- The URL format is: `https://[project-id].supabase.co`

## 🎯 Next Steps

1. **Add Your Content**: Use Supabase Dashboard to add movies/shows
2. **Test It**: Visit your website and see content appear instantly
3. **Customize**: Update thumbnails, descriptions, and videos
4. **Expand**: Add unlimited seasons and episodes

## 📚 More Information

- **Full Database Guide**: See `DATABASE_GUIDE.md`
- **Supabase Docs**: https://supabase.com/docs

## 💡 Tips

1. **Image URLs**: Use Pexels, Unsplash, or upload to Supabase Storage
2. **Video URLs**: YouTube embed works best
3. **Tags**: Use comma-separated values: "action, thriller, sci-fi"
4. **Thumbnails**: Optimize images (recommended: 300-400px width)
5. **Testing**: Set `draft = true` while preparing content

---

**🎬 Start adding your content and enjoy your dynamic streaming platform!**
