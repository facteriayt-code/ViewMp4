import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://diurandrwkqhefhwclyv.supabase.co';
const supabaseAnonKey = 'sb_publishable_-wW999bVAki7iV8KJjiNng_goaBCqlI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);