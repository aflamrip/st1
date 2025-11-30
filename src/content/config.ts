import { defineCollection, z } from 'astro:content';

const movies = defineCollection({
  type: 'data',
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
  type: 'data',
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
  type: 'data',
  schema: z.object({
    tv: z.number(),
    se: z.number(),
    draft: z.boolean().default(false),
  }),
});

const episodes = defineCollection({
  type: 'data',
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
  type: 'data',
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
  type: 'data',
  schema: z.object({
    tv: z.number(),
    se: z.number(),
    draft: z.boolean().default(false),
  }),
});

const animeEpisodes = defineCollection({
  type: 'data',
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
