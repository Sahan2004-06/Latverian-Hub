import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types.js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fail loudly at startup instead of with a confusing error on the first request.
if (!url || !serviceKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env locally, or set them in Vercel project settings."
  );
}

// Passing <Database> makes every query typed: column names, row shapes,
// and enum values all come from the generated types.
// The service-role key bypasses Row Level Security, so it must ONLY ever live on the server.
export const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false },
});
