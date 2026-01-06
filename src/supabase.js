import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://rrwbwviwesnczadgjhde.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_JcEPZ33wrf_WHa_U75L7Dw_AosVNuio";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);