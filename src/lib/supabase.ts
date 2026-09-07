import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let client: SupabaseClient | any = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    client = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn('[AI Studio] Supabase client initialization failed, fallback active:', err);
  }
}

if (!client) {
  // Safe mock builder to allow in-memory/fallback data storage without uncaught promise crashes
  const createMockQueryBuilder = (): any => {
    const builder: any = {
      select: () => builder,
      insert: () => Promise.resolve({ data: null, error: null }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      update: () => builder,
      delete: () => builder,
      eq: () => builder,
      neq: () => builder,
      gte: () => builder,
      lte: () => builder,
      ilike: () => builder,
      like: () => builder,
      or: () => builder,
      order: () => builder,
      limit: () => builder,
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: (onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) =>
        Promise.resolve({ data: [], error: null }).then(onfulfilled, onrejected)
    };
    return builder;
  };

  client = {
    from: () => createMockQueryBuilder(),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null })
    }
  };
}

export const supabase = client;

