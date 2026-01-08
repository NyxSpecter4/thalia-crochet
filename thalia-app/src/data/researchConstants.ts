/**
 * Research Constants for THALIA Physics Model
 * Based on research results provided for Aari stitch density, silver plating physics, and Boy's Surface
 */

export interface ResearchResult {
  status: 'FOUND' | 'PARTIAL' | 'NOT_FOUND' | 'EXAMPLE_FOUND';
  description: string;
  data?: Record<string, any>;
  resources?: string;
}

export interface AariPrecisionData {
  stitchesPerCm?: number;
  historicalPeriod: string;
  region: string;
  technique: string;
  notes: string;
  confidence: 'low' | 'medium' | 'high';
  gulabiShading?: string;
  estimatedStitchesPerCm?: string;
  researchGap?: string;
}

export interface SilverPlatingPhysics {
  youngsModulus: {
    bulkSilver: string;
    silverFilmNote: string;
  };
  fractureStrain?: {
    value?: number;
    unit: string;
    note: string;
    status?: string;
  };
  conductivity?: {
    value: number;
    unit: string;
    note?: string;
  };
  coatingThickness?: {
    min: number;
    max: number;
    unit: string;
    note?: string;
  };
}

export interface TopologyResearch {
  surfaceType: string;
  physicalModel: boolean;
  crochetFeasibility: 'demonstrated' | 'theoretical' | 'unknown';
  algorithmStatus: 'found' | 'partial' | 'missing';
  resources: string[];
  implementationNotes: string;
}

export interface BoysSurfaceLofting {
  parametrization: 'Apéry' | 'Bryant' | 'other';
  alphaParameter: number;
  lobeCount: number;
  flatFoldable: boolean;
  decompositionAlgorithm?: string;
  stitchMapping?: {
    rows: number;
    baseStitches: number;
    increasePattern: string;
  };
}

// Research data based on the provided JSON
export const researchData = {
  aariPrecision: {
    status: 'NOT_FOUND' as const,
    description: 'No data on "stitches-per-centimeter" for Gulabi shading in historical Mughal pieces was found. The search results describe general principles of embroidery density and the mechanics of modern Aari machines, but do not provide quantitative museum-grade analysis of silk gradients from institutions like the Victoria & Albert Museum.',
    data: {
      historicalPeriod: 'Mughal Empire (16th-19th century)',
      region: 'Indian subcontinent',
      technique: 'Aari work (hook-based embroidery)',
      notes: 'No quantitative museum-grade analysis found for Gulabi shading stitch density',
      confidence: 'low' as const,
      gulabiShading: 'Gradient shading technique using silk threads',
      estimatedStitchesPerCm: '8-12 (estimated, not verified)',
      researchGap: 'Requires micro-scale technical analysis of historical artifacts from museum collections',
    } as AariPrecisionData,
    resources: 'Victoria & Albert Museum, Calico Museum of Textiles, Crafts Museum New Delhi'
  } as ResearchResult,

  silverPlatingPhysics: {
    status: 'PARTIAL' as const,
    description: 'Data for bulk silver and silver thin films was found, but specific properties for silver-plated nylon thread were not located. The properties of the thin silver coating are critical and differ from bulk material.',
    data: {
      youngsModulus: {
        bulkSilver: '69 - 74 GPa',
        silverFilmNote: 'A study on silver films indicates the Young\'s Modulus aligns with bulk values (~72 GPa) for films thicker than 50 nm, but can decrease for thinner films.'
      },
      fractureStrain: {
        unit: 'strain',
        note: 'The fracture strain (elongation at break) for a thin silver coating on a nylon fiber was not found. This value is highly dependent on the plating process, adhesion, and thickness. Loss of electrical continuity would occur at micro-cracks well below the fracture strain of the bulk nylon core.',
        status: 'NOT_FOUND'
      },
      conductivity: {
        value: 6.3e7,
        unit: 'S/m',
        note: 'Bulk silver conductivity, coating may have lower values'
      },
      coatingThickness: {
        min: 50,
        max: 200,
        unit: 'nm',
        note: 'Typical range for conductive textile coatings'
      }
    } as SilverPlatingPhysics,
    resources: 'Knovel, SpringerMaterials, IEEE Xplore, Statex/Shieldex datasheets'
  } as ResearchResult,

  topology: {
    status: 'EXAMPLE_FOUND' as const,
    description: 'A crocheted physical model of Boy\'s Surface confirms it can be discretized into a fiber craft. However, the specific "lofting algorithm" or a step-by-step method to decompose it into flat-foldable crochet lobes was not detailed in the provided sources.',
    data: {
      surfaceType: 'Boy\'s Surface (immersion of real projective plane)',
      physicalModel: true,
      crochetFeasibility: 'demonstrated' as const,
      algorithmStatus: 'missing' as const,
      resources: [
        'Mathematical art context - personal project gallery demonstrating crocheted mathematical surfaces',
        'Apéry parametrization with α parameter',
        'Four-lobe structure with triple point'
      ],
      implementationNotes: 'Existing generateBoysSurfaceNodes function uses Apéry parametrization but lacks flat-foldable decomposition algorithm',
      boysSurface: {
        parametrization: 'Apéry' as const,
        alphaParameter: 2.0,
        lobeCount: 4,
        flatFoldable: false,
        decompositionAlgorithm: 'Missing - requires computational topology research',
        stitchMapping: {
          rows: 6,
          baseStitches: 24,
          increasePattern: 'Trigonometric growth based on curvature factor'
        }
      } as BoysSurfaceLofting
    } as TopologyResearch,
    resources: 'arXiv.org, Bridges Organization, Institute For Figuring, Dr. sarah-marie belcastro'
  } as ResearchResult
};

// Helper functions to access research data
export function getResearchStatus(category: keyof typeof researchData): ResearchResult['status'] {
  return researchData[category].status;
}

export function getResearchDescription(category: keyof typeof researchData): string {
  return researchData[category].description;
}

export function getResearchData<T>(category: keyof typeof researchData): T | undefined {
  return researchData[category].data as T;
}

// Constants for physics calculations
export const PHYSICS_CONSTANTS = {
  // Material properties (estimated where missing)
  SILVER_PLATED_NYLON: {
    youngsModulus: {
      min: 60, // GPa - conservative estimate for thin films
      max: 72, // GPa - bulk silver value
      unit: 'GPa'
    },
    fractureStrain: {
      estimated: 0.02, // 2% - conservative estimate for coating
      nylonCore: 0.15, // 15% - typical nylon fiber
      unit: 'strain'
    },
    conductivity: {
      min: 1e6, // S/m - reduced due to thin coating
      max: 6.3e7, // S/m - bulk silver
      unit: 'S/m'
    }
  },
  
  // Aari stitch density (estimated)
  AARI_STITCH_DENSITY: {
    gulabiShading: {
      min: 8, // stitches/cm
      max: 12, // stitches/cm
      confidence: 'low' as const
    },
    generalAari: {
      min: 6, // stitches/cm
      max: 10, // stitches/cm
      confidence: 'medium' as const
    }
  },
  
  // Boy's Surface parameters
  BOYS_SURFACE: {
    alphaRange: [1.5, 2.5] as [number, number],
    lobeCount: 4,
    recommendedRows: 6,
    recommendedBaseStitches: 24,
    flatFoldable: false
  }
};

// Research gaps that need further investigation
export const RESEARCH_GAPS = [
  {
    id: 'aari_density',
    title: 'Aari Stitch Density Quantification',
    description: 'Precise stitches-per-centimeter measurement for historical Mughal Gulabi shading',
    priority: 'high' as const,
    sources: ['Museum collection databases', 'Academic journals on textile conservation'],
    estimatedEffort: '2-4 weeks'
  },
  {
    id: 'silver_fracture',
    title: 'Silver-Plated Nylon Fracture Strain',
    description: 'Experimental measurement of fracture strain for thin silver coatings on nylon fibers',
    priority: 'medium' as const,
    sources: ['Materials science databases', 'Supplier technical datasheets'],
    estimatedEffort: '3-6 weeks'
  },
  {
    id: 'boys_lofting',
    title: 'Boy\'s Surface Lofting Algorithm',
    description: 'Step-by-step algorithm to decompose Boy\'s Surface into flat-foldable crochet lobes',
    priority: 'high' as const,
    sources: ['Computational topology papers', 'Math art communities'],
    estimatedEffort: '4-8 weeks'
  }
];

// Utility function to check if research is complete
export function isResearchComplete(category: keyof typeof researchData): boolean {
  return researchData[category].status === 'FOUND';
}

// Utility function to get research progress percentage
export function getResearchProgress(): number {
  const categories = Object.keys(researchData) as Array<keyof typeof researchData>;
  const total = categories.length;
  const complete = categories.filter(cat => researchData[cat].status === 'FOUND').length;
  const partial = categories.filter(cat => researchData[cat].status === 'PARTIAL' || researchData[cat].status === 'EXAMPLE_FOUND').length;
  
  // Weight: FOUND = 100%, PARTIAL/EXAMPLE = 50%, NOT_FOUND = 0%
  return Math.round(((complete * 100) + (partial * 50)) / total);
}