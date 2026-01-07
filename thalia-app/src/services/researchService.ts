import { supabase } from '../lib/supabase';

export interface CulturalResearchItem {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string;
  category: 'ancient' | 'modern' | 'future' | 'expert';
  tags: string[];
  content: any; // JSONB field
  source_url?: string;
  author?: string;
  cultural_context?: string;
  stitch_patterns?: any;
  geometry_data?: any;
  notes?: string;
  status: string;
}

export async function fetchResearchByCategory(category: 'ancient' | 'modern' | 'future' | 'expert'): Promise<CulturalResearchItem[]> {
  const { data, error } = await supabase
    .from('cultural_research')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching research for category ${category}:`, error);
    return [];
  }
  return data as CulturalResearchItem[];
}

export async function fetchResearchByTags(tags: string[]): Promise<CulturalResearchItem[]> {
  const { data, error } = await supabase
    .from('cultural_research')
    .select('*')
    .contains('tags', tags)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching research by tags:', error);
    return [];
  }
  return data as CulturalResearchItem[];
}

export async function fetchExpertQuotesForNode(nodeId: number, era?: 'ancient' | 'modern' | 'future' | 'expert'): Promise<CulturalResearchItem[]> {
  // Build query based on node and era
  let query = supabase
    .from('cultural_research')
    .select('*')
    .contains('tags', [`node_${nodeId}`])
    .order('created_at', { ascending: false });

  // If era is provided, filter by category (which corresponds to era)
  if (era) {
    query = query.eq('category', era);
  } else {
    // Default to 'expert' category for backward compatibility
    query = query.eq('category', 'expert');
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching expert quotes for node:', error);
    return [];
  }
  return data as CulturalResearchItem[];
}

export async function fetchEraSpecificResearch(era: 'ancient' | 'modern' | 'future'): Promise<CulturalResearchItem[]> {
  const { data, error } = await supabase
    .from('cultural_research')
    .select('*')
    .eq('category', era)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${era} era research:`, error);
    return [];
  }
  return data as CulturalResearchItem[];
}

export async function fetchAllResearch(): Promise<CulturalResearchItem[]> {
  const { data, error } = await supabase
    .from('cultural_research')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all research:', error);
    return [];
  }
  return data as CulturalResearchItem[];
}

// Helper to extract technical recipe from content
export function extractTechnicalRecipe(item: CulturalResearchItem): string {
  if (item.content && typeof item.content === 'object') {
    return item.content.technical_recipe || item.content.recipe || item.content.description || 'No technical details available.';
  }
  return 'No technical details available.';
}

// Helper to extract meaning/symbolism
export function extractMeaning(item: CulturalResearchItem): string {
  if (item.content && typeof item.content === 'object') {
    return item.content.meaning || item.content.symbolism || item.content.description || 'No meaning data.';
  }
  return 'No meaning data.';
}

/**
 * Save the user's selected era to their profile in the Supabase profiles table.
 * Requires the user to be authenticated.
 */
export async function saveSelectedEra(era: 'ancient' | 'modern' | 'future'): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn('User not authenticated, cannot save selected era');
      return { success: false, error: 'User not authenticated' };
    }

    // Upsert into profiles table
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        selected_era: era,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('Error saving selected era:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error in saveSelectedEra:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}