-- Final fix for testimonials table
-- Ensure table exists and RLS is properly disabled

-- Drop and recreate table to ensure clean state
DROP TABLE IF EXISTS testimonials CASCADE;

-- Create testimonials table with proper constraints
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) > 0),
  email TEXT NOT NULL CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL CHECK (length(text) > 0),
  location TEXT DEFAULT 'Raleigh Area' CHECK (length(location) > 0),
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS completely for public access
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON testimonials TO anon;
GRANT ALL ON testimonials TO authenticated;
GRANT ALL ON testimonials TO service_role;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;

-- Insert sample data for testing (only if table is empty)
INSERT INTO testimonials (name, email, rating, text, location, is_approved) 
SELECT * FROM (
  VALUES 
    ('Sarah Johnson', 'sarah@example.com', 5, 'Serene Wings has been a blessing for our family. The caregiver they provided for my mother is compassionate, professional, and truly cares about her wellbeing.', 'North Raleigh', true),
    ('Michael Chen', 'michael@example.com', 5, 'The Alzheimer''s care program gave us peace of mind. Their specialized approach and 24/7 support made all the difference during a difficult time.', 'Cary', true),
    ('Linda Rodriguez', 'linda@example.com', 5, 'Professional, reliable, and caring. Our caregiver has become like family to us. I highly recommend Serene Wings to anyone needing quality care.', 'Wake Forest', true)
) AS sample_data(name, email, rating, text, location, is_approved)
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);
