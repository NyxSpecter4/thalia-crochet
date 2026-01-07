export interface CulturalMotif {
  id: string;
  name: string;
  culturalOrigin: string;
  description: string;
  historicalPeriod: string;
  geometricProperties: {
    curvatureRange: [number, number];
    symmetryType: string;
    repetitionPattern: string;
    dimensionalComplexity: number; // 1-5
  };
  stitchCharacteristics: {
    primaryStitches: string[];
    tension: 'very tight' | 'tight' | 'medium' | 'loose';
    yarnWeight: string;
    hookSize: string;
    specialTechniques: string[];
  };
  symbolicMeaning: string[];
  modernApplications: string[];
  technicalRecipe: string;
  visualCharacteristics: string[];
}

export const culturalMotifs: CulturalMotif[] = [
  {
    id: 'irish_famine_lace',
    name: 'Irish Famine Rose',
    culturalOrigin: 'Ireland (1845-1852)',
    description: 'Raised, padded motifs worked separately and joined with mesh, developed during the Great Famine as a cottage industry. Characterized by dimensional roses, leaves, and stems that stand in relief against a net background.',
    historicalPeriod: 'Mid-19th Century',
    geometricProperties: {
      curvatureRange: [-0.7, -0.2],
      symmetryType: 'Radial with organic variation',
      repetitionPattern: 'Motif-based with irregular spacing',
      dimensionalComplexity: 4
    },
    stitchCharacteristics: {
      primaryStitches: ['Chain', 'Double Crochet', 'Picot', 'Slip Stitch'],
      tension: 'tight',
      yarnWeight: 'Thread (size 10-30)',
      hookSize: '1.0mm - 1.5mm',
      specialTechniques: ['Padding cord', 'Motif construction', 'Joining with bars', 'Starching']
    },
    symbolicMeaning: [
      'Resilience in hardship',
      'Beauty born from struggle',
      'Feminine labor as economic survival',
      'Botanical symbolism (rose = love, shamrock = hope)'
    ],
    modernApplications: [
      'Wedding veils and accessories',
      'High fashion embellishment',
      'Art installations about labor',
      'Contemporary lace sculpture'
    ],
    technicalRecipe: '1. Create padding cord by twisting 3 strands of thread. 2. Work foundation chain over cord to create raised outline. 3. Fill motif with dense dc clusters. 4. Create picot edges for delicate finish. 5. Starch aggressively for structural integrity.',
    visualCharacteristics: [
      'Three-dimensional relief',
      'Organic, botanical forms',
      'High contrast against net ground',
      'Fine, delicate threadwork'
    ]
  },
  {
    id: 'oya_lace',
    name: 'Turkish Oya',
    culturalOrigin: 'Anatolia (Ottoman Empire)',
    description: 'Tiny crocheted motifs, often floral, used as edging on headscarves. Each pattern conveys specific messages through its symbolism. Traditionally made with fine silk thread and often embellished with beads.',
    historicalPeriod: '17th Century - Present',
    geometricProperties: {
      curvatureRange: [-0.3, 0.3],
      symmetryType: 'Bilateral with radial elements',
      repetitionPattern: 'Small repeating motifs',
      dimensionalComplexity: 3
    },
    stitchCharacteristics: {
      primaryStitches: ['Chain', 'Single Crochet', 'Slip Stitch', 'Bead incorporation'],
      tension: 'very tight',
      yarnWeight: 'Silk thread (size 20-40)',
      hookSize: '0.75mm - 1.25mm',
      specialTechniques: ['Bead crochet', 'Color gradation', 'Micro-motif construction', 'Edge finishing']
    },
    symbolicMeaning: [
      'Orange blossoms = happiness, marriage',
      'Pomegranates = fertility, abundance',
      'Purple flowers = mourning, respect',
      'Chrysanthemums = longevity',
      'Geometric patterns = protection'
    ],
    modernApplications: [
      'Bridal headpiece edging',
      'Jewelry and wearable art',
      'Textile conservation',
      'Contemporary fiber art'
    ],
    technicalRecipe: '1. Thread beads onto silk thread before starting. 2. Work foundation chain incorporating beads every 3-5 stitches. 3. Build floral motifs using sc clusters. 4. Create dimensional petals with increases. 5. Finish with picot edge containing seed beads.',
    visualCharacteristics: [
      'Micro-scale precision',
      'Bead embellishment',
      'Floral and geometric motifs',
      'Delicate, wearable scale'
    ]
  },
  {
    id: 'navajo_storm',
    name: 'Navajo Storm Pattern',
    culturalOrigin: 'Diné (Navajo) Nation, Southwestern US',
    description: 'Textile geometry representing the Navajo cosmos: four sacred mountains, rain, lightning, and protective symbols. Woven traditionally but translated to crochet through geometric stitch patterns.',
    historicalPeriod: '19th Century - Present',
    geometricProperties: {
      curvatureRange: [0, 0], // Euclidean
      symmetryType: 'Four-fold rotational',
      repetitionPattern: 'Central motif with four quadrants',
      dimensionalComplexity: 2
    },
    stitchCharacteristics: {
      primaryStitches: ['Single Crochet', 'Half Double Crochet', 'Color changes'],
      tension: 'medium',
      yarnWeight: 'Worsted weight wool',
      hookSize: '4.0mm - 5.0mm',
      specialTechniques: ['Intarsia colorwork', 'Geometric precision', 'Symbolic color coding', 'Border traditions']
    },
    symbolicMeaning: [
      'Four sacred mountains',
      'Rain and lightning = life force',
      'Corn pollen path = blessing way',
      'Protective symbols = safety in journey'
    ],
    modernApplications: [
      'Contemporary blanket designs',
      'Graphic textile art',
      'Cultural education through craft',
      'Fashion with cultural respect'
    ],
    technicalRecipe: '1. Chart design on grid paper. 2. Work in rows with frequent color changes. 3. Maintain consistent tension for flat fabric. 4. Emphasize four-quadrant symmetry. 5. Finish with traditional border pattern.',
    visualCharacteristics: [
      'Bold geometric patterns',
      'Earth tone color palette',
      'Four-fold symmetry',
      'Graphic, symbolic representation'
    ]
  },
  {
    id: 'japanese_amigurumi',
    name: 'Amigurumi Core',
    culturalOrigin: 'Japan (Post-war)',
    description: 'Spherical and sculptural crochet for creating stuffed toys, characterized by tight stitches to prevent stuffing show-through and mathematical shaping for cuteness (kawaii) aesthetic.',
    historicalPeriod: 'Late 20th Century - Present',
    geometricProperties: {
      curvatureRange: [0.3, 0.8],
      symmetryType: 'Spherical with facial asymmetry',
      repetitionPattern: 'Continuous rounds with strategic increases/decreases',
      dimensionalComplexity: 3
    },
    stitchCharacteristics: {
      primaryStitches: ['Single Crochet', 'Invisible Decrease', 'Magic Ring'],
      tension: 'very tight',
      yarnWeight: 'DK or Sport weight acrylic',
      hookSize: '2.5mm - 3.5mm',
      specialTechniques: ['Magic ring start', 'Continuous spirals', 'Invisible joins', 'Sculptural stuffing']
    },
    symbolicMeaning: [
      'Kawaii (cuteness) culture',
      'Comfort and nostalgia',
      'Anthropomorphism of objects',
      'Playfulness and creativity'
    ],
    modernApplications: [
      'Stuffed toys and collectibles',
      'Character merchandise',
      'Therapeutic objects',
      'Educational tools'
    ],
    technicalRecipe: '1. Start with magic ring of 6 sc. 2. Increase evenly each round to create sphere. 3. Work even rounds for cylindrical sections. 4. Decrease strategically for shaping. 5. Stuff firmly as you go, closing with mattress stitch.',
    visualCharacteristics: [
      'Smooth, seamless surfaces',
      'Anthropomorphic features',
      'Bright, cheerful colors',
      'Precise mathematical shaping'
    ]
  }
];

export function getMotifById(id: string): CulturalMotif | undefined {
  return culturalMotifs.find(motif => motif.id === id);
}

export function getMotifsByCurvature(curvature: number): CulturalMotif[] {
  return culturalMotifs.filter(motif => {
    const [min, max] = motif.geometricProperties.curvatureRange;
    return curvature >= min && curvature <= max;
  });
}

export function getMotifsByOrigin(origin: string): CulturalMotif[] {
  return culturalMotifs.filter(motif => 
    motif.culturalOrigin.toLowerCase().includes(origin.toLowerCase())
  );
}