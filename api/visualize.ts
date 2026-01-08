// Generative Art Forge API
// Uses DALL-E 3 to generate hyper-realistic crochet art based on mathematical parameters

interface VisualizeRequest {
  era: string;
  motif: string;
  K: number; // curvature
  style?: string;
  resolution?: '1024x1024' | '1792x1024' | '1024x1792';
}

interface VisualizeResponse {
  success: boolean;
  imageUrl: string;
  prompt: string;
  era: string;
  motif: string;
  curvature: number;
  generatedAt: string;
  error?: string;
}

// Generate DALL-E 3 prompt based on parameters
function generatePrompt(era: string, motif: string, K: number): string {
  // Format era with proper capitalization
  const formattedEra = era.charAt(0).toUpperCase() + era.slice(1);
  
  // Use the exact prompt format requested
  return `A breathtaking, museum-quality 3D macro photograph of a ${formattedEra} crochet ${motif} with intricate fiber textures, ${K.toFixed(2)} curvature, cinematic lighting, obsidian background.`;
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
    const body: VisualizeRequest = req.body;
    
    // Validate required fields
    if (!body.era || !body.motif || body.K === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: era, motif, K (curvature)' 
      });
    }

    const { era, motif, K, style = 'cinematic', resolution = '1024x1024' } = body;
    
    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.warn('OPENAI_API_KEY not found in environment, using mock response');
      
      // Generate mock image URL (using a placeholder service)
      const mockImageUrl = `https://placehold.co/1024x1024/4f46e5/ffffff?text=${encodeURIComponent(`Crochet ${motif}\nK=${K.toFixed(2)}\n${era} era`)}`;
      const prompt = generatePrompt(era, motif, K);
      
      const mockResponse: VisualizeResponse = {
        success: true,
        imageUrl: mockImageUrl,
        prompt,
        era,
        motif,
        curvature: K,
        generatedAt: new Date().toISOString()
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return res.status(200).json(mockResponse);
    }

    // Generate the prompt
    const prompt = generatePrompt(era, motif, K);
    
    // Call OpenAI DALL-E 3 API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: resolution,
        quality: 'hd',
        style: 'vivid'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    const apiResponse: VisualizeResponse = {
      success: true,
      imageUrl,
      prompt,
      era,
      motif,
      curvature: K,
      generatedAt: new Date().toISOString()
    };

    return res.status(200).json(apiResponse);
    
  } catch (error) {
    console.error('Error generating art:', error);
    
    // Fallback to mock response on error
    const { era, motif, K } = req.body || { era: 'modern', motif: 'pattern', K: -0.5 };
    const fallbackUrl = `https://placehold.co/1024x1024/ef4444/ffffff?text=${encodeURIComponent(`Art Generation Failed\n${motif} (K=${K})`)}`;
    
    const errorResponse: VisualizeResponse = {
      success: false,
      imageUrl: fallbackUrl,
      prompt: `Failed to generate: ${error instanceof Error ? error.message : 'Unknown error'}`,
      era,
      motif,
      curvature: K,
      generatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return res.status(500).json(errorResponse);
  }
}