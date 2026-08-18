import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: "SUPABASE_URL" | "SUPABASE_SECRET_KEY") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is required.`);
  }

  return value;
}

export const supabase = createClient(
  requiredEnv("SUPABASE_URL"),
  requiredEnv("SUPABASE_SECRET_KEY"),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);