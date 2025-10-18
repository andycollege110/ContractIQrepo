// Exports a preconfiged Supabase client your routes can reuse to read/write the database.


import { createClient } from "@supabase/supabase-js"; // supabase for js
import "dotenv/config";

export const supabase = createClient (
    process.env.SUPABASE_URL, // project's URL
    process.env.SUPABASE_SERVICE_ROLE, // service role key (server only) // inserts/updates without needed to do user authaticaon
    {
        auth: { persistSession: false} // doesn't keep any session in memory (stateless server)
    }
); 