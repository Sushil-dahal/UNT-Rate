-- Simplified professors table setup that matches the application code
-- This creates a table structure that works with the current application

-- Drop existing table if it exists (BE CAREFUL - this will delete all data)
-- DROP TABLE IF EXISTS public.professors CASCADE;

-- Create professors table with simplified structure
CREATE TABLE IF NOT EXISTS public.professors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT,
    office_location TEXT,
    courses TEXT, -- Simple text field, not array
    bio TEXT,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_professors_department ON public.professors(department);
CREATE INDEX IF NOT EXISTS idx_professors_created_at ON public.professors(created_at);
CREATE INDEX IF NOT EXISTS idx_professors_created_by ON public.professors(created_by);

-- Enable Row Level Security (RLS)
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view professors" ON public.professors;
DROP POLICY IF EXISTS "Authenticated users can add professors" ON public.professors;
DROP POLICY IF EXISTS "Users can update their own professors" ON public.professors;

-- RLS Policies for professors table
-- Anyone can read professors (public access)
CREATE POLICY "Everyone can view professors" ON public.professors
    FOR SELECT USING (true);

-- Only authenticated users can insert professors
CREATE POLICY "Authenticated users can add professors" ON public.professors
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

-- Only the creator can update their professors  
CREATE POLICY "Users can update their own professors" ON public.professors
    FOR UPDATE USING (auth.uid() = created_by);

-- Only the creator can delete their professors
CREATE POLICY "Users can delete their own professors" ON public.professors
    FOR DELETE USING (auth.uid() = created_by);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on professors table
DROP TRIGGER IF EXISTS update_professors_updated_at ON public.professors;
CREATE TRIGGER update_professors_updated_at
    BEFORE UPDATE ON public.professors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();