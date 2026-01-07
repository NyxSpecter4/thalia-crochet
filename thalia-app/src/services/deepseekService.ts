/**
 * DeepSeek API Service for Thalia AI Panel
 * Provides AI-powered feedback and mentorship guidance
 */

export interface DeepSeekRequest {
  beginnerQuestion: string;
  beginnerSkillLevel: 'novice' | 'intermediate' | 'advanced-beginner';
  expertSpecialty: string;
  patternContext?: string;
  conversationHistory?: Array<{
    role: 'beginner' | 'expert' | 'ai';
    content: string;
  }>;
}

export interface DeepSeekResponse {
  aiAnalysis: string;
  expertGuidance: string;
  practiceExercises: string[];
  commonMistakes: string[];
  confidenceScore: number;
  nextSteps: string;
}

/**
 * Mock DeepSeek API call for development
 * In production, this would call the actual DeepSeek API
 */
export const callDeepSeekAPI = async (request: DeepSeekRequest): Promise<DeepSeekResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { beginnerQuestion, beginnerSkillLevel, expertSpecialty } = request;

  // Generate mock responses based on input
  const responses: Record<string, DeepSeekResponse> = {
    'novice': {
      aiAnalysis: `Analyzing beginner question: "${beginnerQuestion}". Skill level: ${beginnerSkillLevel}. Expert specialty: ${expertSpecialty}. The issue appears to be foundational tension control and stitch consistency.`,
      expertGuidance: `As a ${expertSpecialty} expert, I recommend starting with basic swatches. Focus on consistent hook grip and yarn tension. Practice the same stitch for 10 rows before moving to patterns.`,
      practiceExercises: [
        '10x10 single crochet swatch with consistent tension',
        'Foundation chain practice with stitch markers every 5 stitches',
        'Turning chain practice maintaining edge straightness'
      ],
      commonMistakes: [
        'Inconsistent yarn tension throughout row',
        'Skipping the first stitch after turning chain',
        'Working too tightly into foundation chain'
      ],
      confidenceScore: 0.85,
      nextSteps: 'Complete tension swatch, then move to increasing exercises in the round.'
    },
    'intermediate': {
      aiAnalysis: `Intermediate skill detected. Question: "${beginnerQuestion}". This involves technique refinement rather than foundational issues. Expert ${expertSpecialty} guidance needed for advanced nuances.`,
      expertGuidance: `For intermediate practitioners, the key is understanding the "why" behind techniques. In ${expertSpecialty}, we focus on structural integrity and aesthetic flow. Try the "slow-motion" practice method.`,
      practiceExercises: [
        'Complex stitch pattern swatch with color changes',
        '3D shape construction with increasing/decreasing',
        'Reading and interpreting advanced pattern charts'
      ],
      commonMistakes: [
        'Misreading pattern abbreviations for specialty stitches',
        'Inconsistent gauge when switching hook sizes',
        'Poor join techniques in continuous rounds'
      ],
      confidenceScore: 0.92,
      nextSteps: 'Practice the specific technique with scrap yarn before applying to main project.'
    },
    'advanced-beginner': {
      aiAnalysis: `Advanced-beginner transitioning to intermediate. Question shows understanding of basics but need for advanced application: "${beginnerQuestion}". ${expertSpecialty} expertise will bridge this gap.`,
      expertGuidance: `You're at the threshold of mastery! In ${expertSpecialty}, we embrace imperfections as learning opportunities. Your question shows you're ready for conceptual understanding, not just mechanical repetition.`,
      practiceExercises: [
        'Design your own simple pattern based on mathematical principles',
        'Reverse-engineer a finished piece to understand construction',
        'Experiment with unconventional materials and hook sizes'
      ],
      commonMistakes: [
        'Overcomplicating solutions when simplicity works',
        'Neglecting to document successful techniques',
        'Rushing through the learning curve to advanced projects'
      ],
      confidenceScore: 0.78,
      nextSteps: 'Begin a "technique journal" to track progress and insights.'
    }
  };

  // Return appropriate response based on skill level
  return responses[beginnerSkillLevel] || responses['novice'];
};

/**
 * Generate AI feedback for a specific conversation context
 */
export const generateAIFeedback = async (
  conversation: Array<{ role: string; content: string }>,
  context: {
    curvature?: number;
    stitchCount?: number;
    patternType?: string;
  } = {}
): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const lastMessage = conversation[conversation.length - 1]?.content || '';
  const hasExpertResponse = conversation.some(msg => msg.role === 'expert');
  
  if (hasExpertResponse) {
    return `Based on the expert advice and the pattern context (curvature: ${context.curvature || 'N/A'}, stitches: ${context.stitchCount || 'N/A'}), I recommend: 1) Practice the suggested technique with a tension gauge, 2) Document your progress with photos, 3) Compare results after 3 attempts to identify improvement patterns.`;
  }

  return `I've analyzed your question about "${lastMessage.substring(0, 50)}...". For optimal learning: 1) Break the problem into smaller components, 2) Isolate the most challenging aspect, 3) Practice that component separately before reintegrating. The mathematical principles suggest ${context.curvature ? (context.curvature < 0 ? 'hyperbolic' : 'spherical') : 'balanced'} curvature management.`;
};

/**
 * Match beginner with appropriate expert based on question analysis
 */
export const matchExpert = async (
  beginnerQuestion: string,
  _skillLevel: string
): Promise<{
  expertId: string;
  matchScore: number;
  reasoning: string;
}> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  // Simple keyword matching for demo
  const keywords = beginnerQuestion.toLowerCase();
  let expertId = 'e1'; // Default to Maria
  
  if (keywords.includes('amigurumi') || keywords.includes('3d') || keywords.includes('toy')) {
    expertId = 'e2'; // David
  } else if (keywords.includes('historical') || keywords.includes('cultural') || keywords.includes('traditional')) {
    expertId = 'e3'; // Lin
  } else if (keywords.includes('lace') || keywords.includes('hyperbolic') || keywords.includes('math')) {
    expertId = 'e1'; // Maria
  }

  return {
    expertId,
    matchScore: 0.87,
    reasoning: `Matched based on keyword analysis: "${beginnerQuestion.substring(0, 30)}..." aligns with expert specialty.`
  };
};

export default {
  callDeepSeekAPI,
  generateAIFeedback,
  matchExpert
};