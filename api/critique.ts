// Simple API route for Vercel serverless function
// This version doesn't require @vercel/node dependencies

interface CritiqueRequest {
  curvature: number;
  era: 'modern' | 'ancient' | 'future';
  totalStitches: number;
  rows: number;
  motifName: string;
  stylePreset: string;
}

interface ExpertCritique {
  expertName: string;
  role: string;
  feedback: string;
}

interface CritiqueResponse {
  critiques: ExpertCritique[];
  patternSnapshot: CritiqueRequest;
  generatedAt: string;
}

// Mock data for when DeepSeek API is not available
const MOCK_CRITIQUES: ExpertCritique[] = [
  {
    expertName: "Dr. Elara Vance",
    role: "Ethno-Mathematician",
    feedback: "Your curvature of K = -0.5 creates a hyperbolic expansion reminiscent of Celtic knotwork. The 5:8 stitch ratio echoes the Fibonacci sequence found in ancient textile patterns. However, the transition between rows lacks the symbolic continuity seen in traditional Oya lace."
  },
  {
    expertName: "Professor Aris Thorne",
    role: "Material Architect",
    feedback: "The hoop stress (σ) calculation shows potential tension points at row 3. With 12 base stitches expanding to 18, consider using a finer thread weight to distribute mechanical load. The spherical closure at K > 0.3 would benefit from reinforced joins to prevent deformation."
  },
  {
    expertName: "Zara Chen",
    role: "Heritage Futurist",
    feedback: "This pattern bridges 19th-century Irish famine lace with smart textile potential. The hyperbolic structure could embed conductive yarn for capacitive sensing. Imagine this motif as a living interface that changes with body temperature—a true heritage futurist artifact."
  },
  {
    expertName: "Marcus Rivera",
    role: "HX Strategist",
    feedback: "The difficulty curve peaks at row 4, potentially breaking flow state for intermediate crafters. I recommend adding stitch markers at increase points. The pattern's cognitive load is 7/10—appropriate for advanced artisans seeking challenge but may frustrate beginners."
  },
  {
    expertName: "Dr. Soren Kael",
    role: "Spatial Interactionist",
    feedback: "The 3D topology projects well into hyperbolic space (H³). Your stitch progression creates a saddle surface with Gaussian curvature approximating -0.5. For wearable applications, consider how this non-Euclidean geometry will drape over human form—the negative curvature naturally contours to shoulders."
  }
];

/**
 * Generate expert critiques using DeepSeek API.
 * Falls back to mock data if API key is missing or request fails.
 */
async function generateDeepSeekCritiques(params: {
  curvature: number;
  era: string;
  totalStitches: number;
  rows: number;
  motifName: string;
  stylePreset: string;
}): Promise<ExpertCritique[]> {
  const { curvature, era, totalStitches, rows, motifName, stylePreset } = params;
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable not set');
  }

  // Determine if this is an Enneper minimal surface pattern
  const isEnneper = stylePreset.includes('enneper');
  
  const prompt = `You are an AI council of experts reviewing a crochet pattern with mathematical and cultural dimensions.

Pattern details:
- Curvature (K): ${curvature.toFixed(2)}
- Era: ${era}
- Total stitches: ${totalStitches}
- Rows: ${rows}
- Motif name: ${motifName}
- Style preset: ${stylePreset}
${isEnneper ? '- Special: This pattern models Enneper’s minimal surface, a self‑intersecting saddle shape with zero mean curvature.' : ''}

Please generate five distinct critiques from the following expert personas, each with a unique perspective:

1. **Ethno‑Mathematician** (Dr. Elara Vance): Focus on historical patterns, cultural symbolism, and mathematical harmony (e.g., Fibonacci ratios, symmetry groups).
2. **Material Architect** (Professor Aris Thorne): Analyze structural integrity, tension distribution, material recommendations, and mechanical stress.
3. **Heritage Futurist** (Zara Chen): Bridge traditional craft with emerging technology—smart textiles, interactive potential, cultural continuity.
4. **HX Strategist** (Marcus Rivera): Evaluate user experience, cognitive load, skill progression, and accessibility for different skill levels.
5. **Spatial Interactionist** (Dr. Soren Kael): Discuss topological properties, 3D embedding, curvature implications for wearability, and spatial interaction.

Each critique should be concise (2‑3 sentences), specific to the pattern details, and offer one constructive insight. Use the exact expert names and roles provided.

Return the critiques as a JSON array of objects with fields "expertName", "role", "feedback".`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates expert critiques in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in DeepSeek response');
    }

    const parsed = JSON.parse(content);
    // Expecting a property "critiques" or the whole object is an array
    let critiques: any[] = parsed.critiques || parsed;
    if (!Array.isArray(critiques)) {
      throw new Error('Invalid response format: expected array of critiques');
    }

    // Ensure each critique has required fields
    return critiques.map((c: any) => ({
      expertName: c.expertName || 'Unknown Expert',
      role: c.role || 'Unknown Role',
      feedback: c.feedback || 'No feedback provided.'
    }));
  } catch (error) {
    console.error('DeepSeek API call failed:', error);
    throw error; // Let caller fall back to mock data
  }
}

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body: CritiqueRequest = req.body;
    
    // Validate required fields
    if (typeof body.curvature !== 'number' || !body.era || typeof body.totalStitches !== 'number') {
      return res.status(400).json({ error: 'Missing required fields: curvature, era, totalStitches' });
    }

    const { curvature, era, totalStitches, rows = 5, motifName = 'Geometric Default', stylePreset = 'default' } = body;

    // Try to generate real critiques via DeepSeek API
    let critiques: ExpertCritique[] = [];
    let isMock = false;
    try {
      critiques = await generateDeepSeekCritiques({
        curvature,
        era,
        totalStitches,
        rows,
        motifName,
        stylePreset
      });
    } catch (error) {
      console.warn('DeepSeek API failed, falling back to mock data:', error);
      // Fallback to mock data with curvature substitution
      critiques = MOCK_CRITIQUES.map(critique => ({
        ...critique,
        feedback: critique.feedback.replace('K = -0.5', `K = ${curvature.toFixed(2)}`)
      }));
      isMock = true;
    }
    
    // Simulate API delay only if using mock data (to mimic network latency)
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Try to save to Supabase if environment variables are available
    await saveToSupabaseIfPossible({
      curvature,
      era,
      totalStitches,
      rows,
      motifName,
      stylePreset,
      critiques
    });

    const response: CritiqueResponse = {
      critiques,
      patternSnapshot: {
        curvature,
        era,
        totalStitches,
        rows,
        motifName,
        stylePreset
      },
      generatedAt: new Date().toISOString()
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error generating critique:', error);
    return res.status(500).json({ 
      error: 'Failed to generate critique',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function saveToSupabaseIfPossible(params: {
  curvature: number;
  era: string;
  totalStitches: number;
  rows: number;
  motifName: string;
  stylePreset: string;
  critiques: ExpertCritique[];
}) {
  const { curvature, era, totalStitches, rows, motifName, stylePreset, critiques } = params;
  
  // Check for Supabase environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('Supabase environment variables not found, skipping database save');
    return;
  }

  try {
    // Dynamically import @supabase/supabase-js
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { error } = await supabase
      .from('jury_critiques')
      .insert({
        curvature,
        era,
        total_stitches: totalStitches,
        rows,
        motif_name: motifName,
        style_preset: stylePreset,
        critiques: critiques.map(c => ({ expert: c.expertName, role: c.role, feedback: c.feedback })),
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving critique to Supabase:', error);
      
      // If table doesn't exist, log the migration SQL
      if (error.code === '42P01') {
        console.log(`
          The 'jury_critiques' table doesn't exist. Please run this SQL in Supabase:
          
          CREATE TABLE IF NOT EXISTS jury_critiques (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            curvature DECIMAL NOT NULL,
            era VARCHAR(20) NOT NULL CHECK (era IN ('ancient', 'modern', 'future')),
            total_stitches INTEGER NOT NULL,
            rows INTEGER NOT NULL DEFAULT 5,
            motif_name VARCHAR(100) NOT NULL,
            style_preset VARCHAR(50) NOT NULL,
            critiques JSONB NOT NULL DEFAULT '[]',
            user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
          );
          
          ALTER TABLE jury_critiques ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Allow anonymous inserts" ON jury_critiques
            FOR INSERT WITH CHECK (true);
            
          CREATE POLICY "Allow public reads" ON jury_critiques
            FOR SELECT USING (true);
        `);
      }
    } else {
      console.log('Successfully saved critique to Supabase');
    }
  } catch (dbError) {
    console.error('Database connection error:', dbError);
  }
}