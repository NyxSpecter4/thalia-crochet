-- Create jury_critiques table for storing AI-generated expert critiques
CREATE TABLE IF NOT EXISTS jury_critiques (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Pattern metadata
  curvature DECIMAL NOT NULL,
  era VARCHAR(20) NOT NULL CHECK (era IN ('ancient', 'modern', 'future')),
  total_stitches INTEGER NOT NULL,
  rows INTEGER NOT NULL DEFAULT 5,
  motif_name VARCHAR(100) NOT NULL,
  style_preset VARCHAR(50) NOT NULL,
  
  -- AI-generated critiques (stored as JSONB for flexibility)
  critiques JSONB NOT NULL DEFAULT '[]',
  
  -- Optional user association (if authenticated)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Indexes for faster queries
  INDEX idx_jury_critiques_created_at (created_at DESC),
  INDEX idx_jury_critiques_curvature (curvature),
  INDEX idx_jury_critiques_era (era)
);

-- Add table description
COMMENT ON TABLE jury_critiques IS 'Stores AI-generated expert critiques for crochet patterns from the Council of Thalia';

-- Add column comments
COMMENT ON COLUMN jury_critiques.curvature IS 'Pattern curvature (K-value) at time of critique';
COMMENT ON COLUMN jury_critiques.era IS 'Era theme (ancient, modern, future)';
COMMENT ON COLUMN jury_critiques.total_stitches IS 'Total number of stitches in the pattern';
COMMENT ON COLUMN jury_critiques.rows IS 'Number of rows in the pattern';
COMMENT ON COLUMN jury_critiques.motif_name IS 'Name of the cultural motif used';
COMMENT ON COLUMN jury_critiques.style_preset IS 'Style preset (e.g., irish_famine_rose, hyper_realistic_botanical)';
COMMENT ON COLUMN jury_critiques.critiques IS 'JSON array of expert critiques with expertName, role, and feedback';
COMMENT ON COLUMN jury_critiques.user_id IS 'Optional reference to authenticated user';

-- Enable Row Level Security (RLS)
ALTER TABLE jury_critiques ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert critiques (for anonymous users)
CREATE POLICY "Allow anonymous inserts" ON jury_critiques
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read critiques (for analytics)
CREATE POLICY "Allow public reads" ON jury_critiques
  FOR SELECT USING (true);

-- Allow users to update/delete their own critiques if authenticated
CREATE POLICY "Allow user updates" ON jury_critiques
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow user deletes" ON jury_critiques
  FOR DELETE USING (auth.uid() = user_id);