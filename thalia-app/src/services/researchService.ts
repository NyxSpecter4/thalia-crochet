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

export async function fetchExpertQuotesForNode(nodeId: number): Promise<CulturalResearchItem[]> {
  // Assuming there's a column 'node_id' or we can filter by tags
  const { data, error } = await supabase
    .from('cultural_research')
    .select('*')
    .eq('category', 'expert')
    .contains('tags', [`node_${nodeId}`])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching expert quotes for node:', error);
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