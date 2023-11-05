import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vgihlvmvlpcegxzqippr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

// Create a single supabase client for interacting with your database
export const supabaseClient = createClient(supabaseUrl, supabaseKey);
