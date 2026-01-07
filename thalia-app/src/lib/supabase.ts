import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Using mock mode.')
}

// Create Supabase client with error handling
export const supabase = createClient(
  supabaseUrl || 'https://mock.supabase.co',
  supabaseAnonKey || 'mock-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)

// Test connection function
export async function testSupabaseConnection(): Promise<{
  success: boolean
  error?: string
  tables?: string[]
}> {
  try {
    // Try to fetch from a table that should exist (profiles, patterns, or stitch_library)
    const { data: _data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (error) {
      // Try patterns table as fallback
      const { error: patternError } = await supabase
        .from('patterns')
        .select('id')
        .limit(1)
      
      if (patternError) {
        return {
          success: false,
          error: `Connection test failed: ${error.message} (also tried patterns: ${patternError.message})`
        }
      }
    }
    
    return {
      success: true,
      tables: ['profiles', 'patterns', 'stitch_library'] // Assuming these tables exist
    }
  } catch (err: any) {
    return {
      success: false,
      error: `Connection error: ${err.message}`
    }
  }
}

// Helper functions for Thalia app
export async function fetchPatterns() {
  const { data, error } = await supabase
    .from('patterns')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching patterns:', error)
    return []
  }
  
  return data
}

export async function savePattern(patternData: any) {
  const { data, error } = await supabase
    .from('patterns')
    .insert([{
      name: patternData.name || 'Unnamed Pattern',
      curvature: patternData.curvature,
      base_stitches: patternData.baseStitches,
      rows: patternData.rows,
      stitch_progression: patternData.stitches,
      type: patternData.type,
      description: patternData.description,
      created_at: new Date().toISOString()
    }])
    .select()
  
  if (error) {
    console.error('Error saving pattern:', error)
    return null
  }
  
  return data?.[0]
}

export async function fetchStitchLibrary() {
  const { data, error } = await supabase
    .from('stitch_library')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching stitch library:', error)
    return []
  }
  
  return data
}

// Cultural Research Table Functions
export async function ensureCulturalResearchTable() {
  try {
    // Try to select from the table to see if it exists
    const { error } = await supabase
      .from('cultural_research')
      .select('id')
      .limit(1)
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.warn('cultural_research table does not exist. Please create it in Supabase with the following schema:')
      console.warn(`
        CREATE TABLE IF NOT EXISTS cultural_research (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          title TEXT NOT NULL,
          description TEXT,
          category TEXT,
          tags TEXT[],
          content JSONB,
          source_url TEXT,
          author TEXT,
          cultural_context TEXT,
          stitch_patterns JSONB,
          geometry_data JSONB,
          notes TEXT,
          status TEXT DEFAULT 'draft'
        );
        
        -- Enable Row Level Security
        ALTER TABLE cultural_research ENABLE ROW LEVEL SECURITY;
        
        -- Create policies as needed
        CREATE POLICY "Enable read access for all users" ON cultural_research
          FOR SELECT USING (true);
          
        CREATE POLICY "Enable insert for authenticated users" ON cultural_research
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      `)
      return { exists: false, message: 'Table needs to be created' }
    }
    
    return { exists: true }
  } catch (err: any) {
    console.error('Error checking cultural_research table:', err)
    return { exists: false, error: err.message }
  }
}

export async function saveCulturalResearch(data: any) {
  const { data: result, error } = await supabase
    .from('cultural_research')
    .insert([{
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
  
  if (error) {
    console.error('Error saving cultural research:', error)
    return null
  }
  
  return result?.[0]
}

export async function fetchCulturalResearch() {
  const { data, error } = await supabase
    .from('cultural_research')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching cultural research:', error)
    return []
  }
  
  return data
}