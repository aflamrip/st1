import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Movie {
  id: number;
  title: string;
  year: number;
  thumbnail: string;
  description: string;
  tags: string;
  draft: boolean;
  video_source_type: 'mp4' | 'embed';
  video_source: string;
  created_at: string;
  updated_at: string;
}

export interface Show {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  year: number;
  tags: string;
  draft: boolean;
  type: 'show' | 'anime';
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: number;
  show_id: number;
  season_number: number;
  draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: number;
  season_id: number;
  episode_number: number;
  title: string;
  duration: string;
  draft: boolean;
  video_source_type: 'mp4' | 'embed';
  video_source: string;
  created_at: string;
  updated_at: string;
}

export interface EpisodeWithRelations extends Episode {
  season?: Season & {
    show?: Show;
  };
}
