import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const shows = await getCollection('shows');
  const data = shows
    .filter(s => !s.data.draft)
    .map(s => ({
      tv: s.data.tv,
      title: s.data.title,
      year: s.data.year,
      thumbnail: s.data.thumbnail,
      description: s.data.description,
      tags: s.data.tags,
    }));

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
