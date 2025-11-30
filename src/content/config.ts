import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const movies = defineCollection({
  loader: glob({ base: './src/content/movies', pattern: '**/*.json' }),
  schema: z.object({
    id: z.number(),
    title: z.string(),
    year: z.number(),
    thumbnail: z.string(),
    description: z.string(),
    tags: z.string(),
    draft: z.boolean().default(false),
    video: z.object({
      source_type: z.enum(['mp4', 'embed']),
      source: z.string(),
    }),
  }),
});

const shows = defineCollection({
  loader: glob({ base: './src/content/shows', pattern: '**/*.json' }),
  schema: z.object({
    tv: z.number(),
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    year: z.number(),
    tags: z.string(),
    draft: z.boolean().default(false),
  }),
});

const seasons = defineCollection({
  loader: glob({ base: './src/content/seasons', pattern: '**/*.json' }),
  schema: z.object({
    tv: z.number(),
    se: z.number(),
    draft: z.boolean().default(false),
  }),
});

const episodes = defineCollection({
  loader: glob({ base: './src/content/episodes', pattern: '**/*.json' }),
  schema: z.object({
    ep: z.number(),
    tv: z.number(),
    se: z.number(),
    title: z.string(),
    duration: z.string(),
    draft: z.boolean().default(false),
    video: z.object({
      source_type: z.enum(['mp4', 'embed']),
      source: z.string(),
    }),
  }),
});

const anime = defineCollection({
  loader: glob({ base: './src/content/anime', pattern: '**/*.json' }),
  schema: z.object({
    tv: z.number(),
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    year: z.number(),
    tags: z.string(),
    draft: z.boolean().default(false),
  }),
});

const animeSeasons = defineCollection({
  loader: glob({ base: './src/content/animeSeasons', pattern: '**/*.json' }),
  schema: z.object({
    tv: z.number(),
    se: z.number(),
    draft: z.boolean().default(false),
  }),
});

const animeEpisodes = defineCollection({
  loader: glob({ base: './src/content/animeEpisodes', pattern: '**/*.json' }),
  schema: z.object({
    ep: z.number(),
    tv: z.number(),
    se: z.number(),
    title: z.string(),
    duration: z.string(),
    draft: z.boolean().default(false),
    video: z.object({
      source_type: z.enum(['mp4', 'embed']),
      source: z.string(),
    }),
  }),
});

export const collections = {
  movies,
  shows,
  seasons,
  episodes,
  anime,
  animeSeasons,
  animeEpisodes,
};
