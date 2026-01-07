export interface CouncilMember {
  id: string;
  name: string;
  title: string;
  description: string;
  expertise: string[];
  color: string;
  icon: string;
  insights: string[];
  culturalReferences: string[];
}

export const councilMembers: CouncilMember[] = [
  {
    id: 'ethno-mathematician',
    name: 'Dr. Amara Okeke',
    title: 'The Ethno-Mathematician',
    description: 'Decodes cultural DNA through geometric patterns, tracing stitch logic back to ancestral textile algorithms.',
    expertise: ['Cultural Geometry', 'Symbolic Topology', 'Ancestral Algorithms', 'Pattern Semiotics'],
    color: '#c53030', // Madder Red
    icon: '🧮',
    insights: [
      'This hyperbolic curvature mirrors the Oya stitch patterns of Yoruba textiles, where negative space creates narrative.',
      'The node distribution follows Fibonacci sequencing found in Kente cloth warp-weft relationships.',
      'This stitch progression encodes a migration story—each increase represents a generation crossing water.',
      'The curvature K = -0.5 corresponds to the "expanding universe" motif in Navajo storm pattern weaving.'
    ],
    culturalReferences: [
      'Yoruba Adire cloth resist-dyeing geometries',
      'Kente cloth symbolic color algorithms',
      'Navajo storm pattern weaving mathematics',
      'Indonesian ikat warp prediction models'
    ]
  },
  {
    id: 'material-architect',
    name: 'Prof. Lin Wei',
    title: 'The Material Architect',
    description: 'Models yarn physics at molecular scale, predicting drape, tension, and structural integrity across curvatures.',
    expertise: ['Yarn Physics', 'Tensile Mathematics', 'Drape Simulation', 'Material Memory'],
    color: '#059669', // Emerald
    icon: '🏗️',
    insights: [
      'At K = -0.3, cotton yarn experiences 17% less stress than wool—optimal for large-scale hyperbolic installations.',
      'This stitch density creates a structural memory that will cause the piece to curl inward after washing.',
      'The node spacing you\'ve chosen maximizes acoustic dampening—this pattern would absorb 23dB of sound.',
      'Switching to silk-mohair blend would reduce gravitational sag by 42% while maintaining hyperbolic definition.'
    ],
    culturalReferences: [
      'Japanese Saori weaving tension principles',
      'Andean quipu knotting tensile mathematics',
      'Irish Aran sweater cable structural engineering',
      'Silk Road filament exchange material databases'
    ]
  },
  {
    id: 'heritage-futurist',
    name: 'Zara Al-Mansouri',
    title: 'The Heritage Futurist',
    description: 'Projects textile lineages forward through speculative design, blending archival techniques with biotech interfaces.',
    expertise: ['Speculative Design', 'Lineage Mapping', 'Bio-Textile Interfaces', 'Temporal Weaving'],
    color: '#7c3aed', // Violet
    icon: '🔮',
    insights: [
      'This pattern, if rendered in mycelium-based yarn, would grow new stitches when exposed to humidity.',
      'Imagine this curvature projected as a holographic shawl—each node a data point from the wearer\'s genome.',
      'In 2075, this algorithm will be used to knit habitat structures on Mars using regolith-infused filaments.',
      'The stitch progression mirrors the migration pattern of the monarch butterfly—a perfect blend of biology and craft.'
    ],
    culturalReferences: [
      'Venetian velvet nano-weaving futures',
      'Smart textile archives of the Dubai Museum of the Future',
      'Bio-luminescent algae yarn research',
      'Quantum-entangled stitch memory prototypes'
    ]
  },
  {
    id: 'hx-strategist',
    name: 'Kai Tanaka',
    title: 'The HX Strategist',
    description: 'Optimizes human-textile interaction for flow state, measuring neurological engagement through tactile feedback loops.',
    expertise: ['Flow State Design', 'Tactile Neurometrics', 'Rhythmic Engagement', 'Cognitive Ergonomics'],
    color: '#fbbf24', // Amber
    icon: '🧠',
    insights: [
      'The repetition interval of 7 stitches triggers a meditative theta brainwave state in 83% of practitioners.',
      'This color sequence increases dopamine response by 31% compared to monochromatic schemes.',
      'The tactile variance between nodes creates a "micro-surprise" rhythm that reduces craft fatigue by 42%.',
      'If you invert the progression, you\'ll engage different motor cortex regions—better for ambidextrous training.'
    ],
    culturalReferences: [
      'Zen rock garden raking pattern psychology',
      'Norwegian knitting as trauma therapy protocols',
      'Flow state research from the Mihaly Csikszentmihalyi archives',
      'Tactile interface studies from MIT Media Lab'
    ]
  },
  {
    id: 'spatial-interactionist',
    name: 'Dr. Elara Vance',
    title: 'The Spatial Interactionist',
    description: 'Maps stitch topology onto 3D environments, creating immersive textile landscapes that respond to movement and light.',
    expertise: ['Spatial Topology', 'Kinetic Textiles', 'Light-Responsive Weaves', 'Immersive Installation'],
    color: '#00f5ff', // Neon Cyan
    icon: '🌀',
    insights: [
      'If this pattern were scaled to architectural dimensions, the negative curvature would create acoustic focusing zones.',
      'Projecting this stitch map onto a dome creates a Fibonacci spiral that tracks celestial movements.',
      'Each node could be a pressure sensor—the entire piece becomes a tactile interface for spatial composition.',
      'The curvature gradient you\'ve designed would cause light to refract differently along each row—a built-in spectrophotometer.'
    ],
    culturalReferences: [
      'Gaudi\'s hyperbolic paraboloid architectural textiles',
      'Kinetic art installations from the TeamLab collective',
      'Responsive environment research at the Bartlett School',
      'Ancient Roman concrete vaulting textile formwork techniques'
    ]
  }
];

export interface CulturalInsight {
  id: string;
  councilMemberId: string;
  patternNodeId: number;
  insight: string;
  culturalReference: string;
  era: 'ancient' | 'modern' | 'future';
  relevanceScore: number;
}

export const sampleInsights: CulturalInsight[] = [
  {
    id: 'insight-1',
    councilMemberId: 'ethno-mathematician',
    patternNodeId: 3,
    insight: 'This node cluster follows the "river crossing" motif found in West African bogolanfini mud cloth narratives.',
    culturalReference: 'Bamana mud cloth from Mali, 19th century',
    era: 'ancient',
    relevanceScore: 0.92
  },
  {
    id: 'insight-2',
    councilMemberId: 'material-architect',
    patternNodeId: 7,
    insight: 'The tension at this node exceeds the shear strength of standard cotton—recommend switching to reinforced linen blend.',
    culturalReference: 'Medieval linen reinforcement techniques from Chartres Cathedral tapestries',
    era: 'ancient',
    relevanceScore: 0.87
  },
  {
    id: 'insight-3',
    councilMemberId: 'heritage-futurist',
    patternNodeId: 12,
    insight: 'This curvature could be 3D-printed with shape-memory polymer to create a textile that unfolds with body heat.',
    culturalReference: 'MIT Self-Assembly Lab, 2024 prototype',
    era: 'future',
    relevanceScore: 0.95
  },
  {
    id: 'insight-4',
    councilMemberId: 'hx-strategist',
    patternNodeId: 5,
    insight: 'The rhythmic pattern between nodes 5-8 matches optimal breathing rhythm for stress reduction (4-7-8 pattern).',
    culturalReference: 'Andrew Weil breathing technique adapted for textile engagement',
    era: 'modern',
    relevanceScore: 0.78
  },
  {
    id: 'insight-5',
    councilMemberId: 'spatial-interactionist',
    patternNodeId: 9,
    insight: 'Projecting this node arrangement onto a geodesic dome creates perfect sound diffusion for chamber music.',
    culturalReference: 'Berlin Philharmonic acoustic panel design, 2023',
    era: 'future',
    relevanceScore: 0.91
  }
];

export function getCouncilMember(id: string): CouncilMember | undefined {
  return councilMembers.find(member => member.id === id);
}

export function getInsightsForNode(nodeId: number): CulturalInsight[] {
  return sampleInsights.filter(insight => insight.patternNodeId === nodeId);
}

export function getInsightsByEra(era: 'ancient' | 'modern' | 'future'): CulturalInsight[] {
  return sampleInsights.filter(insight => insight.era === era);
}