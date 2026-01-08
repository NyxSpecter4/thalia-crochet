// DALL-E 3 Design Forge API
// Generates museum-quality hyper-realistic crochet art for Cindy's visual revolution

interface ForgeRequest {
  era: string;
  motif: string;
  K: number; // curvature
  style?: string;
  resolution?: '1024x1024' | '1792x1024' | '1024x1792';
}

interface ForgeResponse {
  success: boolean;
  imageUrl: string;
  prompt: string;
  era: string;
  motif: string;
  curvature: number;
  generatedAt: string;
  error?: string;
}

// Generate DALL-E 3 prompt with museum-quality specifications and era-specific texture logic
function generateForgePrompt(era: string, motif: string, K: number): string {
  // Format era with proper capitalization
  const formattedEra = era.charAt(0).toUpperCase() + era.slice(1);
  
  // Era-specific material texture logic
  let materialTexture = 'silk texture';
  
  switch (era.toLowerCase()) {
    case 'ancient':
      materialTexture = 'ancient silk texture';
      break;
    case 'modern':
      materialTexture = 'modern synthetic texture';
      break;
    case 'future':
      materialTexture = 'silver-plated nylon texture';
      break;
    default:
      materialTexture = 'silk texture';
  }
  
  // Use the EXACT prompt format requested: "A museum-quality 3D macro photo of [Tradition] crochet, [K] curvature, [Material] texture, cinematic lighting, obsidian background."
  return `A museum-quality 3D macro photo of ${formattedEra} ${motif} crochet, ${K.toFixed(2)} curvature, ${materialTexture}, cinematic lighting, obsidian background.`;
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
    const body: ForgeRequest = req.body;
    
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
      
      // Format era for display
      const formattedEra = era.charAt(0).toUpperCase() + era.slice(1);
      
      // Generate mock image URL (using a placeholder service)
      const mockImageUrl = `https://placehold.co/1024x1024/4f46e5/ffffff?text=${encodeURIComponent(`MASTERPIECE\n${formattedEra} ${motif}\nK=${K.toFixed(2)}\nCinematic Lighting`)}`;
      const prompt = generateForgePrompt(era, motif, K);
      
      const mockResponse: ForgeResponse = {
        success: true,
        imageUrl: mockImageUrl,
        prompt,
        era,
        motif,
        curvature: K,
        generatedAt: new Date().toISOString()
      };
      
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return res.status(200).json(mockResponse);
    }

    // Generate the MASTERPIECE prompt
    const prompt = generateForgePrompt(era, motif, K);
    
    // Call OpenAI DALL-E 3 API with premium settings
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
    
    const apiResponse: ForgeResponse = {
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
    console.error('Error in Design Forge:', error);
    
    // Fallback to mock response on error
    const { era, motif, K } = req.body || { era: 'modern', motif: 'pattern', K: -0.5 };
    const formattedEra = era.charAt(0).toUpperCase() + era.slice(1);
    const fallbackUrl = `https://placehold.co/1024x1024/ef4444/ffffff?text=${encodeURIComponent(`Design Forge Failed\n${formattedEra} ${motif}\nK=${K.toFixed(2)}`)}`;
    
    const errorResponse: ForgeResponse = {
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