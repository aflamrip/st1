import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const anime = await getCollection('anime');
  const data = anime
    .filter(a => !a.data.draft)
    .map(a => ({
      tv: a.data.tv,
      title: a.data.title,
      year: a.data.year,
      thumbnail: a.data.thumbnail,
      description: a.data.description,
      tags: a.data.tags,
    }));

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
