import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://diurandrwkqhefhwclyv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-wW999bVAki7iV8KJjiNng_goaBCqlI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);