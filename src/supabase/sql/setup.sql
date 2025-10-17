-- Create professors table
CREATE TABLE IF NOT EXISTS professors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT,
    office_location TEXT,
    courses TEXT[],
    bio TEXT,
    average_rating NUMERIC(3,2),
    total_reviews INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create professor_ratings table
CREATE TABLE IF NOT EXISTS professor_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    professor_id UUID REFERENCES professors(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    course TEXT,
    UNIQUE(professor_id, user_id)
);

-- Create saved_professors table
CREATE TABLE IF NOT EXISTS saved_professors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    professor_id UUID REFERENCES professors(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(user_id, professor_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_professors_department ON professors(department);
CREATE INDEX IF NOT EXISTS idx_professors_created_at ON professors(created_at);
CREATE INDEX IF NOT EXISTS idx_professor_ratings_professor_id ON professor_ratings(professor_id);
CREATE INDEX IF NOT EXISTS idx_professor_ratings_user_id ON professor_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_professors_user_id ON saved_professors(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_professors_professor_id ON saved_professors(professor_id);

-- Enable Row Level Security (RLS)
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE professor_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_professors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professors table
-- Anyone can read professors
CREATE POLICY "Everyone can view professors" ON professors
    FOR SELECT USING (true);

-- Only authenticated users can insert professors
CREATE POLICY "Authenticated users can add professors" ON professors
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only the creator can update their professors
CREATE POLICY "Users can update their own professors" ON professors
    FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for professor_ratings table
-- Users can only see their own ratings
CREATE POLICY "Users can view their own ratings" ON professor_ratings
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own ratings
CREATE POLICY "Users can add their own ratings" ON professor_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update their own ratings" ON professor_ratings
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete their own ratings" ON professor_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for saved_professors table
-- Users can only see their own saved professors
CREATE POLICY "Users can view their own saved professors" ON saved_professors
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own saved professors
CREATE POLICY "Users can save professors" ON saved_professors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved professors
CREATE POLICY "Users can unsave professors" ON saved_professors
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update professor average rating
CREATE OR REPLACE FUNCTION update_professor_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the professor's average rating and total reviews
    UPDATE professors
    SET 
        average_rating = (
            SELECT AVG(rating)::NUMERIC(3,2)
            FROM professor_ratings
            WHERE professor_id = COALESCE(NEW.professor_id, OLD.professor_id)
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM professor_ratings
            WHERE professor_id = COALESCE(NEW.professor_id, OLD.professor_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.professor_id, OLD.professor_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to update professor ratings
CREATE TRIGGER update_professor_rating_on_insert
    AFTER INSERT ON professor_ratings
    FOR EACH ROW EXECUTE FUNCTION update_professor_rating();

CREATE TRIGGER update_professor_rating_on_update
    AFTER UPDATE ON professor_ratings
    FOR EACH ROW EXECUTE FUNCTION update_professor_rating();

CREATE TRIGGER update_professor_rating_on_delete
    AFTER DELETE ON professor_ratings
    FOR EACH ROW EXECUTE FUNCTION update_professor_rating();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on professors table
CREATE TRIGGER update_professors_updated_at
    BEFORE UPDATE ON professors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();