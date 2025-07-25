-- Disable RLS for testimonials table to allow public access
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;

-- Ensure realtime is enabled
alter publication supabase_realtime add table testimonials;
