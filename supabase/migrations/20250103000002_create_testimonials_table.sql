-- Create testimonials table (simplified to avoid timeout)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL,
  text TEXT NOT NULL,
  location TEXT DEFAULT 'Raleigh Area',
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple index
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at DESC);

-- Enable realtime (only if not already added)
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'testimonials'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;
    END IF;
END $;
