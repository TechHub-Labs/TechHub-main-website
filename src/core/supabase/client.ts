import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

// Note: we omit the Database generic because our lean type definition
// doesn't include all fields Supabase's GenericSchema requires
// (Views, Functions, Enums, Relationships). We cast data at call sites instead.
export const supabase = createClient(supabaseUrl, supabaseKey);
