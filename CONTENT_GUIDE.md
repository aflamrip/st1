# Content Structure Guide

## Overview

This streaming website uses **JSON files** for all content. PagesCMS is configured to create and manage JSON files automatically.

## Directory Structure

```
src/content/
├── movies/           # Movie JSON files
├── shows/            # TV show JSON files
├── seasons/          # TV show season JSON files
├── episodes/         # TV show episode JSON files
├── anime/            # Anime series JSON files
├── animeSeasons/     # Anime season JSON files
└── animeEpisodes/    # Anime episode JSON files
```

## File Format

All content files are **JSON format** (`.json` extension).

### Movie Example (`movies/1.json`)

```json
{
  "id": 1,
  "title": "The Great Adventure",
  "year": 2023,
  "thumbnail": "https://example.com/image.jpg",
  "description": "Movie description here",
  "tags": "adventure, action, thriller",
  "draft": false,
  "video": {
    "source_type": "embed",
    "source": "https://www.youtube.com/embed/VIDEO_ID"
  }
}
```

### TV Show Example (`shows/1.json`)

```json
{
  "tv": 1,
  "title": "Mystery Detective",
  "description": "A thrilling detective series",
  "thumbnail": "https://example.com/poster.jpg",
  "year": 2023,
  "tags": "crime, thriller, mystery",
  "draft": false
}
```

### Season Example (`seasons/1-1.json`)

```json
{
  "tv": 1,
  "se": 1,
  "draft": false
}
```

### Episode Example (`episodes/1-1-1.json`)

```json
{
  "ep": 1,
  "tv": 1,
  "se": 1,
  "title": "The Beginning",
  "duration": "45 minutes",
  "draft": false,
  "video": {
    "source_type": "embed",
    "source": "https://www.youtube.com/embed/VIDEO_ID"
  }
}
```

### Anime Example (`anime/1.json`)

```json
{
  "tv": 1,
  "title": "Future Heroes",
  "description": "A sci-fi anime series",
  "thumbnail": "https://example.com/anime.jpg",
  "year": 2024,
  "tags": "sci-fi, action, adventure",
  "draft": false
}
```

### Anime Season Example (`animeSeasons/1-1.json`)

```json
{
  "tv": 1,
  "se": 1,
  "draft": false
}
```

### Anime Episode Example (`animeEpisodes/1-1-1.json`)

```json
{
  "ep": 1,
  "tv": 1,
  "se": 1,
  "title": "Episode 1: New Beginning",
  "duration": "24 minutes",
  "draft": false,
  "video": {
    "source_type": "embed",
    "source": "https://www.youtube.com/embed/VIDEO_ID"
  }
}
```

## Field Descriptions

### Common Fields

- **draft** (boolean): Set to `true` to hide from website, `false` to publish
- **tags** (string): Comma-separated tags for search and categorization

### Movie Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | Yes | Unique movie identifier |
| title | string | Yes | Movie title |
| year | number | Yes | Release year |
| thumbnail | string | Yes | URL to poster image |
| description | string | Yes | Movie description |
| tags | string | Yes | Comma-separated tags |
| draft | boolean | Yes | Visibility status |
| video | object | Yes | Video source information |
| video.source_type | string | Yes | "mp4" or "embed" |
| video.source | string | Yes | Video URL |

### Show/Anime Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tv | number | Yes | Unique show/anime identifier |
| title | string | Yes | Show/anime title |
| description | string | Yes | Show/anime description |
| thumbnail | string | Yes | URL to poster image |
| year | number | Yes | Release year |
| tags | string | Yes | Comma-separated tags |
| draft | boolean | Yes | Visibility status |

### Season Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tv | number | Yes | Parent show/anime ID |
| se | number | Yes | Season number |
| draft | boolean | Yes | Visibility status |

### Episode Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ep | number | Yes | Episode number |
| tv | number | Yes | Parent show/anime ID |
| se | number | Yes | Parent season number |
| title | string | Yes | Episode title |
| duration | string | Yes | Episode duration |
| draft | boolean | Yes | Visibility status |
| video | object | Yes | Video source information |
| video.source_type | string | Yes | "mp4" or "embed" |
| video.source | string | Yes | Video URL |

## Video Source Types

### 1. MP4 (Direct Video)
Use for self-hosted or direct video file URLs.

```json
{
  "video": {
    "source_type": "mp4",
    "source": "/uploads/video.mp4"
  }
}
```

### 2. Embed (Embedded Player)
Use for YouTube, Vimeo, or other embedded video players.

```json
{
  "video": {
    "source_type": "embed",
    "source": "https://www.youtube.com/embed/VIDEO_ID"
  }
}
```

**Important:** Use the embed URL, not the watch URL:
- ✅ Correct: `https://www.youtube.com/embed/VIDEO_ID`
- ❌ Wrong: `https://www.youtube.com/watch?v=VIDEO_ID`

## Content Relationships

Content items must be linked correctly using ID fields:

```
Show (tv: 1)
└── Season (tv: 1, se: 1)
    ├── Episode (tv: 1, se: 1, ep: 1)
    └── Episode (tv: 1, se: 1, ep: 2)
```

### Example Complete Show Setup

1. **Create Show** (`shows/detective-show.json`):
```json
{
  "tv": 5,
  "title": "Detective Mystery",
  "description": "...",
  "thumbnail": "...",
  "year": 2024,
  "tags": "...",
  "draft": false
}
```

2. **Create Season** (`seasons/5-1.json`):
```json
{
  "tv": 5,
  "se": 1,
  "draft": false
}
```

3. **Create Episodes** (`episodes/5-1-1.json`, `episodes/5-1-2.json`, etc.):
```json
{
  "ep": 1,
  "tv": 5,
  "se": 1,
  "title": "First Episode",
  "duration": "45 min",
  "draft": false,
  "video": { ... }
}
```

## File Naming Conventions

While PagesCMS can create files with any name, we recommend:

- **Movies**: `{id}.json` (e.g., `1.json`, `2.json`)
- **Shows/Anime**: `{tv}.json` (e.g., `1.json`, `2.json`)
- **Seasons**: `{tv}-{se}.json` (e.g., `1-1.json`, `1-2.json`)
- **Episodes**: `{tv}-{se}-{ep}.json` (e.g., `1-1-1.json`, `1-1-2.json`)

## Using PagesCMS

### Adding Content

1. Open PagesCMS admin interface
2. Select content type (افلام, مسلسلات, etc.)
3. Click "Add New"
4. Fill in all required fields
5. Save - PagesCMS creates the JSON file automatically

### Editing Content

1. Navigate to the content collection
2. Click on the item you want to edit
3. Make your changes
4. Save - PagesCMS updates the JSON file

### Media Management

Upload images and videos through PagesCMS:
- Input folder: `public/uploads/`
- Accessible at: `/uploads/filename.ext`
- Supported: JPG, PNG, JPEG, MP4

## Important Notes

- **All files must be JSON format** (`.json` extension)
- **ID fields must be unique**: Each movie needs unique `id`, each show/anime needs unique `tv`
- **Relationships matter**: Episodes must reference existing shows and seasons
- **Draft mode**: Set `draft: true` to hide content, `false` to publish
- **Tags**: Use comma-separated values for multiple tags
- **Build required**: After adding/editing content, rebuild the site to see changes

## Troubleshooting

### Content not appearing?
1. Check `draft` is set to `false`
2. Verify all required fields are filled
3. For episodes, ensure parent show and season exist with matching IDs
4. Rebuild the site: `npm run build`

### Images not loading?
1. Ensure images are in `public/uploads/`
2. Use correct path: `/uploads/image.jpg`
3. Check file permissions

### Video player issues?
1. For MP4: Verify file is accessible
2. For embeds: Use embed URL format
3. Check video source URL is correct

## Best Practices

1. **Consistent IDs**: Use sequential numbering (1, 2, 3...)
2. **Optimized Images**: Keep thumbnails under 100KB
3. **Descriptive Tags**: Use relevant, searchable tags
4. **Complete Data**: Fill all fields, even optional ones
5. **Test Locally**: Build and preview before deploying

## Need Help?

- Check the `.pages.yml` file for field configuration
- Review sample JSON files in each content directory
- Ensure JSON syntax is valid (use a JSON validator)
