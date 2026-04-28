import { supabase } from '../supabase';

/**
 * Generate a public Supabase image URL
 * @param {string} bucket - Supabase bucket name
 * @param {string} path - Path to the image file in the bucket
 * @returns {string} Public URL
 */
export const getSupabaseImageUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
};

/**
 * Services images configuration
 * Map local paths to Supabase bucket paths
 */
export const servicesImagesMap = {
  'website-development': 'website-development.webp',
  'corporate-events': 'corporate-events.webp',
  'bars-restaurants': 'bars-restaurants.webp',
  'real-estate': 'real-estate.webp',
  'testimonials': 'testimonials.webp',
  'digital-marketing': 'digital-marketing.webp',
  'social-media': 'social-media.webp',
  'influencer-marketing': 'influencer-marketing.webp',
  'podcast': 'podcast.webp',
};

/**
 * Website projects images configuration
 */
export const websiteProjectsImagesMap = {
  'home': 'home.png',
  'about': 'about.png',
  'works': 'works.png',
};
