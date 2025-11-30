import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const movies = await getCollection('movies');
  const data = movies
    .filter(m => !m.data.draft)
    .map(m => ({
      id: m.data.id,
      title: m.data.title,
      year: m.data.year,
      thumbnail: m.data.thumbnail,
      description: m.data.description,
      tags: m.data.tags,
    }));

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
