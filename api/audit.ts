// Strategic Audit API for V3 Dashboard
// This endpoint handles the 3 strategic audit questions for professional peer-review

interface AuditRequest {
  curvature: number;
  rows: number;
  stitches: number[];
  patternType: 'hyperbolic' | 'spherical' | 'euclidean';
  era: 'modern' | 'ancient' | 'future';
  motifName: string;
}

interface ExpertAuditResult {
  expertId: string;
  expertName: string;
  role: string;
  specialty: string;
  verdict: 'PASS' | 'WARNING' | 'FAIL';
  score: number; // 0-100
  feedback: string;
  recommendations: string[];
}

interface StrategicAuditResponse {
  auditResults: ExpertAuditResult[];
  strategicAnswers: {
    question1: string;
    question2: string;
    question3: string;
  };
  overallVerdict: 'PASS' | 'WARNING' | 'FAIL' | 'PENDING';
  averageScore: number;
  generatedAt: string;
}

// Mock expert data matching the AuditDashboard
const EXPERTS = [
  {
    id: 'textile-cad',
    name: 'Dr. Elara Vance',
    role: 'Textile CAD Specialist',
    specialty: 'Digital Fabrication & Material Simulation',
    color: '#3B82F6',
    icon: '🧵'
  },
  {
    id: 'physicist',
    name: 'Prof. Aris Thorne',
    role: 'Theoretical Physicist',
    specialty: 'Continuum Mechanics & Topology',
    color: '#EF4444',
    icon: '⚛️'
  },
  {
    id: 'hci',
    name: 'Dr. Maya Chen',
    role: 'HCI & Cognitive Scientist',
    specialty: 'Human‑Centered Design & Pattern Recognition',
    color: '#10B981',
    icon: '🧠'
  },
  {
    id: 'geometer',
    name: 'Dr. Silas Reed',
    role: 'Differential Geometer',
    specialty: 'Non‑Euclidean Geometry & Curvature Analysis',
    color: '#8B5CF6',
    icon: '📐'
  },
  {
    id: 'ethno-math',
    name: 'Dr. Amara Okoro',
    role: 'Ethno‑Mathematician',
    specialty: 'Cultural Pattern Systems & Symbolic Encoding',
    color: '#F59E0B',
    icon: '🌍'
  }
];

// Generate strategic answers based on curvature
function generateStrategicAnswers(curvature: number, patternType: string) {
  return {
    question1: curvature < 0 
      ? '✅ Yes: Hyperbolic expansion permits retroactive stitches due to negative curvature.' 
      : '⚠️ Limited: Spherical closure restricts post-stitch capacity.',
    
    question2: curvature > 0.3 
      ? `⚠️ Estimated at K = 0.45 (current: ${curvature.toFixed(2)} - close to collapse)` 
      : `✅ Safe: Material collapse point estimated at K = 0.65 (current: ${curvature.toFixed(2)})`,
    
    question3: curvature < 0 
      ? '✅ Yes: Hyperbolic expansion maintains single live stitch per row.' 
      : '⚠️ Requires slip-stitch joins at decreases to maintain constraint.'
  };
}

// Generate expert audit results based on curvature
function generateExpertAudits(curvature: number, patternType: string, stitches: number[]): ExpertAuditResult[] {
  const totalStitches = stitches.reduce((a, b) => a + b, 0);
  
  return EXPERTS.map(expert => {
    let verdict: 'PASS' | 'WARNING' | 'FAIL' = 'PASS';
    let score = 85;
    let feedback = '';
    let recommendations: string[] = [];
    
    switch (expert.id) {
      case 'textile-cad':
        score = curvature < -0.3 ? 90 : curvature > 0.3 ? 70 : 85;
        verdict = score > 80 ? 'PASS' : score > 60 ? 'WARNING' : 'FAIL';
        feedback = `Material stress distribution ${curvature < 0 ? 'optimal for hyperbolic expansion' : 'requires reinforcement at decrease points'}.`;
        recommendations = curvature < 0 
          ? ['Increase stitch density by 15% at row transitions', 'Use medium-weight yarn for structural integrity']
          : ['Implement slip‑stitch joins at every 4th stitch', 'Consider double‑crochet reinforcement'];
        break;
        
      case 'physicist':
        score = Math.abs(curvature) > 0.7 ? 65 : Math.abs(curvature) < 0.2 ? 75 : 85;
        verdict = score > 80 ? 'PASS' : score > 60 ? 'WARNING' : 'FAIL';
        feedback = `Hoop stress (σ) = ${(Math.abs(curvature) * 12.5).toFixed(1)} MPa. ${curvature > 0.5 ? 'Risk of spherical collapse at K > 0.5' : 'Within safe parameters'}.`;
        recommendations = ['Monitor tension at row 4-5 transition', 'Validate against Euler‑Bernoulli beam theory'];
        break;
        
      case 'hci':
        score = 88;
        verdict = 'PASS';
        feedback = 'Pattern complexity aligns with expert‑artisan cognitive load. Visual hierarchy effectively communicates stitch progression.';
        recommendations = ['Add tactile markers for visually impaired crafters', 'Consider color‑coding for different curvature zones'];
        break;
        
      case 'geometer':
        score = Math.abs(curvature) > 0.1 ? 92 : 68;
        verdict = score > 80 ? 'PASS' : score > 60 ? 'WARNING' : 'FAIL';
        feedback = `Gaussian curvature K = ${curvature.toFixed(3)} creates ${curvature < 0 ? 'hyperbolic saddle' : 'spherical dome'} topology.`;
        recommendations = ['Verify Gauss‑Bonnet theorem compliance', 'Check for singularities at stitch junctions'];
        break;
        
      case 'ethno-math':
        score = 95;
        verdict = 'PASS';
        feedback = 'Pattern encodes cultural resonance through Fibonacci‑based stitch progression. Symbolic density appropriate for ceremonial use.';
        recommendations = ['Document symbolic mapping for cultural preservation', 'Consider adding "hidden message" stitches'];
        break;
    }
    
    return {
      expertId: expert.id,
      expertName: expert.name,
      role: expert.role,
      specialty: expert.specialty,
      verdict,
      score,
      feedback,
      recommendations
    };
  });
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
    const body: AuditRequest = req.body;
    
    // Validate required fields
    if (typeof body.curvature !== 'number') {
      return res.status(400).json({ error: 'Missing required field: curvature' });
    }

    const { curvature, rows = 5, stitches = [6, 9, 12, 15, 18], patternType = curvature < 0 ? 'hyperbolic' : curvature > 0 ? 'spherical' : 'euclidean', era = 'modern', motifName = 'Strategic Audit Pattern' } = body;

    // Generate expert audit results
    const auditResults = generateExpertAudits(curvature, patternType, stitches);
    
    // Generate strategic answers
    const strategicAnswers = generateStrategicAnswers(curvature, patternType);
    
    // Calculate overall verdict
    const fails = auditResults.filter(r => r.verdict === 'FAIL').length;
    const warnings = auditResults.filter(r => r.verdict === 'WARNING').length;
    const overallVerdict = fails > 0 ? 'FAIL' : warnings > 0 ? 'WARNING' : 'PASS';
    
    // Calculate average score
    const averageScore = Math.round(auditResults.reduce((sum, r) => sum + r.score, 0) / auditResults.length);

    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response: StrategicAuditResponse = {
      auditResults,
      strategicAnswers,
      overallVerdict,
      averageScore,
      generatedAt: new Date().toISOString()
    };

    // Try to save to Supabase if possible
    await saveAuditToSupabaseIfPossible({
      curvature,
      rows,
      stitches,
      patternType,
      era,
      motifName,
      auditResults,
      strategicAnswers,
      overallVerdict,
      averageScore
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error generating strategic audit:', error);
    return res.status(500).json({ 
      error: 'Failed to generate strategic audit',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function saveAuditToSupabaseIfPossible(params: {
  curvature: number;
  rows: number;
  stitches: number[];
  patternType: string;
  era: string;
  motifName: string;
  auditResults: ExpertAuditResult[];
  strategicAnswers: any;
  overallVerdict: string;
  averageScore: number;
}) {
  const { curvature, rows, stitches, patternType, era, motifName, auditResults, strategicAnswers, overallVerdict, averageScore } = params;
  
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
      .from('strategic_audits')
      .insert({
        curvature,
        rows,
        stitches: stitches.join(','),
        pattern_type: patternType,
        era,
        motif_name: motifName,
        audit_results: auditResults,
        strategic_answers: strategicAnswers,
        overall_verdict: overallVerdict,
        average_score: averageScore,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving strategic audit to Supabase:', error);
      
      // If table doesn't exist, log the migration SQL
      if (error.code === '42P01') {
        console.log(`
          The 'strategic_audits' table doesn't exist. Please run this SQL in Supabase:
          
          CREATE TABLE IF NOT EXISTS strategic_audits (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            curvature DECIMAL NOT NULL,
            rows INTEGER NOT NULL DEFAULT 5,
            stitches TEXT NOT NULL,
            pattern_type VARCHAR(20) NOT NULL,
            era VARCHAR(20) NOT NULL CHECK (era IN ('ancient', 'modern', 'future')),
            motif_name VARCHAR(100) NOT NULL,
            audit_results JSONB NOT NULL DEFAULT '[]',
            strategic_answers JSONB NOT NULL DEFAULT '{}',
            overall_verdict VARCHAR(10) NOT NULL,
            average_score INTEGER NOT NULL,
            user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
          );
          
          ALTER TABLE strategic_audits ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Allow anonymous inserts" ON strategic_audits
            FOR INSERT WITH CHECK (true);
            
          CREATE POLICY "Allow public reads" ON strategic_audits
            FOR SELECT USING (true);
        `);
      }
    } else {
      console.log('Successfully saved strategic audit to Supabase');
    }
  } catch (dbError) {
    console.error('Database connection error:', dbError);
  }
}