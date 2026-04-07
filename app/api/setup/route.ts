import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Create the table if it doesn't exist
    const { error: createError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.page_views (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          path TEXT NOT NULL,
          referrer TEXT,
          user_agent TEXT,
          ip_address TEXT,
          country TEXT,
          city TEXT,
          device_type TEXT,
          browser TEXT,
          os TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);

        ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow public inserts" ON public.page_views;
        CREATE POLICY "Allow public inserts" ON public.page_views
          FOR INSERT
          WITH CHECK (true);

        DROP POLICY IF EXISTS "Allow authenticated users to view" ON public.page_views;
        CREATE POLICY "Allow authenticated users to view" ON public.page_views
          FOR SELECT
          USING (true);
      `
    })

    if (createError && !createError.message.includes('already exists')) {
      console.error('Table creation error:', createError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Analytics table initialized' 
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize analytics table' },
      { status: 500 }
    )
  }
}
