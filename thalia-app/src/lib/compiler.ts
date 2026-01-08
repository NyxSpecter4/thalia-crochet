import { calculateEnneperStitchProgression } from './geometry'

export interface CrochetPattern {
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  materials: string[]
  abbreviations: Record<string, string>
  instructions: RowInstruction[]
  notes: string[]
  culturalContext?: string
  assemblyParts?: AssemblyPart[]
}

export interface RowInstruction {
  round: number
  stitchCount: number
  instruction: string
  specialNotes?: string[]
}

export interface AssemblyPart {
  partName: string
  instructions: RowInstruction[]
  joinInstructions?: string
}

export interface PatternParameters {
  curvature: number
  baseStitches: number
  rows: number
  stylePreset?: 'irish_famine_rose' | 'hyper_realistic_botanical' | 'amigurumi_core' | 'oya_lace' | 'default' | 'enneper_minimal' | 'boys_surface' | 'roman_surface'
}

export function compilePattern(params: PatternParameters): CrochetPattern {
  const { curvature, baseStitches, rows, stylePreset = 'default' } = params
  
  // Handle multi-part surfaces
  if (stylePreset === 'boys_surface' || stylePreset === 'roman_surface') {
    return compileMultiPartSurface(params)
  }
  
  // Calculate stitch progression
  let stitchProgression: number[]
  if (stylePreset === 'enneper_minimal') {
    // Use Enneper's minimal surface progression
    stitchProgression = calculateEnneperStitchProgression(baseStitches, rows, Math.abs(curvature))
  } else {
    stitchProgression = calculateStitchProgression(curvature, baseStitches, rows)
  }
  
  // Determine skill level based on complexity
  const skillLevel = determineSkillLevel(curvature, rows, stylePreset)
  
  // Get materials based on style preset
  const materials = getMaterialsForPreset(stylePreset)
  
  // Get abbreviations
  const abbreviations = getStandardAbbreviations()
  
  // Generate instructions for each row
  const instructions = generateRowInstructions(stitchProgression, curvature, stylePreset)
  
  // Generate notes
  const notes = generatePatternNotes(curvature, stylePreset)
  
  // Get cultural context if applicable
  const culturalContext = getCulturalContext(stylePreset)
  
  return {
    skillLevel,
    materials,
    abbreviations,
    instructions,
    notes,
    culturalContext
  }
}

// Helper functions
function calculateStitchProgression(curvature: number, baseStitches: number, rows: number): number[] {
  const progression: number[] = [baseStitches]
  const type = curvature < 0 ? 'hyperbolic' : curvature > 0 ? 'spherical' : 'euclidean'
  
  for (let i = 1; i < rows; i++) {
    let nextStitches = baseStitches
    
    switch (type) {
      case 'hyperbolic':
        // K < 0: Increase stitches (n:n+1)
        const hyperbolicRate = Math.abs(curvature) * 2
        nextStitches = Math.floor(baseStitches * (1 + hyperbolicRate * i / rows))
        break
      case 'spherical':
        // K > 0: Decrease stitches (n:n-1)
        const sphericalRate = curvature * 1.5
        nextStitches = Math.max(1, Math.floor(baseStitches * (1 - sphericalRate * i / rows)))
        break
      case 'euclidean':
        // K = 0: Maintain stitch count
        nextStitches = baseStitches
        break
    }
    
    progression.push(nextStitches)
  }
  
  return progression
}

function determineSkillLevel(
  curvature: number, 
  rows: number, 
  stylePreset: string
): CrochetPattern['skillLevel'] {
  const complexity = Math.abs(curvature) * rows
  
  if (stylePreset === 'irish_famine_rose' || stylePreset === 'oya_lace') {
    return 'Expert'
  }
  
  if (complexity > 5 || rows > 15) {
    return 'Advanced'
  } else if (complexity > 2 || rows > 8) {
    return 'Intermediate'
  }
  
  return 'Beginner'
}

function getMaterialsForPreset(stylePreset: string): string[] {
  const baseMaterials = [
    'Worsted weight yarn (approx. 200g)',
    '4.0mm crochet hook',
    'Stitch markers',
    'Yarn needle',
    'Scissors'
  ]
  
  switch (stylePreset) {
    case 'irish_famine_rose':
      return [
        'Fine cotton thread (size 10)',
        '1.5mm steel crochet hook',
        'Stiffening agent (optional)',
        'Padding cord for raised motifs',
        'Blocking pins and board'
      ]
    case 'hyper_realistic_botanical':
      return [
        'Variegated botanical-dyed yarn',
        '3.5mm crochet hook',
        'Green wire for stems (optional)',
        'Fabric stiffener',
        'Embroidery floss for details'
      ]
    case 'amigurumi_core':
      return [
        'Acrylic yarn for structure',
        '3.0mm crochet hook',
        'Polyester fiberfill',
        'Safety eyes (optional)',
        'Stitch markers for increases/decreases'
      ]
    case 'oya_lace':
      return [
        'Silk or mercerized cotton thread',
        '1.75mm steel crochet hook',
        'Beads for embellishment (optional)',
        'Starch for blocking',
        'Fine sewing needle'
      ]
    case 'enneper_minimal':
      return [
        'Fine merino wool yarn (approx. 150g)',
        '3.5mm crochet hook',
        'Stitch markers',
        'Blocking wires for precise shaping',
        'Mathematical diagram of Enneper’s surface (optional)',
        'Yarn needle',
        'Scissors'
      ]
    case 'boys_surface':
      return [
        'Fine cotton or wool yarn (approx. 300g)',
        '3.0mm crochet hook',
        'Stitch markers (multiple colors for lobe identification)',
        'Yarn needle for grafting',
        'Polyester fiberfill for central sphere',
        'Mathematical diagram of Boy\'s Surface (optional)',
        'Blocking wires and board',
        'Fabric stiffener for structural integrity',
        'Scissors'
      ]
    case 'roman_surface':
      return [
        'Fine cotton yarn (approx. 250g)',
        '3.5mm crochet hook',
        'Stitch markers for lobe alignment',
        'Yarn needle for assembly',
        'Blocking pins and wires',
        'Mathematical diagram of Steiner\'s Roman Surface (optional)',
        'Starch for shaping',
        'Scissors'
      ]
    default:
      return baseMaterials
  }
}

function getStandardAbbreviations(): Record<string, string> {
  return {
    'ch': 'chain',
    'sc': 'single crochet',
    'dc': 'double crochet',
    'hdc': 'half double crochet',
    'tr': 'treble crochet',
    'sl st': 'slip stitch',
    'inc': 'increase (2 stitches in same stitch)',
    'dec': 'decrease (2 stitches together)',
    'dc2tog': 'double crochet 2 together',
    'BLO': 'back loop only',
    'FLO': 'front loop only',
    'rep': 'repeat',
    'rnd': 'round',
    'sp': 'space',
    'st(s)': 'stitch(es)'
  }
}

function generateRowInstructions(
  stitchProgression: number[],
  curvature: number,
  stylePreset: string
): RowInstruction[] {
  const instructions: RowInstruction[] = []
  const type = curvature < 0 ? 'hyperbolic' : curvature > 0 ? 'spherical' : 'euclidean'
  
  for (let i = 0; i < stitchProgression.length; i++) {
    const round = i + 1
    const stitchCount = stitchProgression[i]
    let instruction = ''
    const specialNotes: string[] = []
    
    // First round is special
    if (round === 1) {
      instruction = `Ch ${stitchCount}, join with sl st to form ring.`
      if (stylePreset === 'irish_famine_rose') {
        instruction += ' Work over padding cord for raised effect.'
        specialNotes.push('Use thicker cord or multiple strands for pronounced relief')
      }
    } else {
      const prevCount = stitchProgression[i - 1]
      
      switch (type) {
        case 'hyperbolic':
          if (stitchCount > prevCount) {
            const increaseCount = stitchCount - prevCount
            const spacing = Math.floor(prevCount / increaseCount)
            instruction = `Rnd ${round}: Ch 3 (counts as dc), *${spacing > 1 ? `dc in next ${spacing - 1} sts, inc in next st` : 'inc in each st'}, repeat from * around. Join with sl st to top of ch-3. (${stitchCount} sts)`
            specialNotes.push(`Increase rate: ${increaseCount} stitches added this round`)
          } else {
            instruction = `Rnd ${round}: Ch 3 (counts as dc), dc in each st around. Join with sl st. (${stitchCount} sts)`
          }
          break
          
        case 'spherical':
          if (stitchCount < prevCount) {
            const decreaseCount = prevCount - stitchCount
            const spacing = Math.floor(prevCount / decreaseCount)
            instruction = `Rnd ${round}: Ch 3 (counts as dc), *${spacing > 1 ? `dc in next ${spacing - 1} sts, dc2tog` : 'dc2tog'}, repeat from * around. Join with sl st. (${stitchCount} sts)`
            specialNotes.push(`Decrease rate: ${decreaseCount} stitches decreased this round`)
          } else {
            instruction = `Rnd ${round}: Ch 3 (counts as dc), dc in each st around. Join with sl st. (${stitchCount} sts)`
          }
          break
          
        case 'euclidean':
          instruction = `Rnd ${round}: Ch 3 (counts as dc), dc in each st around. Join with sl st. (${stitchCount} sts)`
          break
      }
    }
    
    // Add style-specific modifications
    if (stylePreset === 'hyper_realistic_botanical' && round % 3 === 0) {
      instruction += ' Change to variegated yarn section for leaf effect.'
      specialNotes.push('Allow color transitions to occur naturally for organic look')
    }
    
    if (stylePreset === 'amigurumi_core' && curvature > 0.3) {
      if (round > stitchProgression.length / 2) {
        instruction += ' Begin stuffing lightly as you go.'
        specialNotes.push('Maintain even tension to prevent stuffing from showing through')
      }
    }

    // Enneper's minimal surface special note
    if (stylePreset === 'enneper_minimal' && round > 1 && stitchCount > stitchProgression[round - 2]) {
      specialNotes.push(`Row ${round}: Increasing to achieve minimal surface curvature.`)
    }
    
    instructions.push({
      round,
      stitchCount,
      instruction,
      specialNotes: specialNotes.length > 0 ? specialNotes : undefined
    })
  }
  
  return instructions
}

function generatePatternNotes(curvature: number, stylePreset: string): string[] {
  const notes: string[] = []
  const type = curvature < 0 ? 'hyperbolic' : curvature > 0 ? 'spherical' : 'euclidean'
  
  // General notes based on curvature
  switch (type) {
    case 'hyperbolic':
      notes.push('This pattern creates a ruffled, expanding fabric perfect for collars, edgings, or sculptural pieces.')
      notes.push('Maintain loose tension to allow the natural expansion of the hyperbolic geometry.')
      notes.push('Block aggressively to open up the ruffles and show the mathematical structure.')
      break
    case 'spherical':
      notes.push('This pattern creates a domed or spherical shape suitable for hats, bowls, or amigurumi.')
      notes.push('Use tight tension to maintain the spherical form without gaps.')
      notes.push('Consider using stitch markers to track decrease points for symmetry.')
      break
    case 'euclidean':
      notes.push('This pattern creates a flat, circular fabric suitable for coasters, doilies, or motifs.')
      notes.push('Maintain even tension throughout for a perfectly flat result.')
      notes.push('Block under tension if a perfectly circular shape is desired.')
      break
  }
  
  // Style-specific notes
  switch (stylePreset) {
    case 'irish_famine_rose':
      notes.push('Traditional Irish crochet lace technique: work motifs separately then join with mesh.')
      notes.push('Use padding cord under foundation chain for raised, relief effect characteristic of famine lace.')
      notes.push('Starch heavily after completion for structural integrity in wearable pieces.')
      notes.push('Historical context: This pattern honors the lacemakers of the Irish Famine who created intricate work under dire circumstances.')
      break
    case 'hyper_realistic_botanical':
      notes.push('Allow yarn color variations to dictate "leaf" and "petal" placement for organic realism.')
      notes.push('Consider wiring some elements for poseable botanical accuracy.')
      notes.push('Vary stitch height occasionally to create natural texture variations.')
      break
    case 'amigurumi_core':
      notes.push('Work in continuous rounds (without joining) for seamless spherical shapes.')
      notes.push('Use "invisible decreases" (dc2tog through front loops only) for smoother shaping.')
      notes.push('Stuff firmly but evenly, adding more stuffing as the piece closes.')
      break
    case 'oya_lace':
      notes.push('Traditional Turkish Oya technique: tiny motifs often embellished with beads.')
      notes.push('Use fine thread and tiny hooks for delicate, wearable lace.')
      notes.push('Incorporate beads on every 3rd or 5th stitch for traditional embellishment.')
      notes.push('Cultural note: Oya is traditionally worn as edging on headscarves, each pattern conveying specific messages.')
      break
    case 'enneper_minimal':
      notes.push('Enneper’s minimal surface: a classic mathematical surface with zero mean curvature.')
      notes.push('Stitch progression follows trigonometric arc‑length growth to approximate the surface’s geometry.')
      notes.push('Block under tension to reveal the self‑intersecting saddle shape.')
      notes.push('Mathematical note: This pattern visualizes the parametric equations (u cos v, u sin v, u² cos 2v) through crochet.')
      break
  }
  
  // Mathematical note
  notes.push(`Mathematical curvature parameter: K = ${curvature.toFixed(3)}`)
  if (Math.abs(curvature) > 0.7) {
    notes.push('High curvature value: pattern will exhibit strong geometric effects.')
  }
  
  return notes
}

function getCulturalContext(stylePreset: string): string | undefined {
  switch (stylePreset) {
    case 'irish_famine_rose':
      return 'Irish Famine Lace (c. 1845-1852): Developed during the Great Famine as a cottage industry to provide income. Characterized by raised, padded motifs resembling flora, worked separately and joined with mesh. Each rose motif represents resilience and beauty born from hardship.'
    case 'oya_lace':
      return 'Turkish Oya: Traditional needle lace dating to the Ottoman Empire. Tiny floral and geometric motifs, often with bead embellishments, worn as edging on headscarves. Patterns convey messages—orange blossoms for happiness, pomegranates for fertility, purple for mourning.'
    case 'hyper_realistic_botanical':
      return 'Contemporary botanical art movement: Blends scientific illustration precision with fiber arts. Inspired by the 17th-century "Florilegium" tradition of documenting plant species through detailed artwork.'
    case 'amigurumi_core':
      return 'Japanese amigurumi: Modern crochet technique for creating stuffed toys, characterized by tight stitches and spherical shaping. Emerged in post-war Japan as part of kawaii (cute) culture, now a global phenomenon.'
    case 'enneper_minimal':
      return 'Enneper’s minimal surface (1864): Discovered by German mathematician Alfred Enneper, this surface is a classic example of a minimal surface with zero mean curvature. Its parametric equations produce a self‑intersecting saddle shape that has inspired both mathematicians and artists. Crocheting this surface demonstrates the tangible beauty of differential geometry.'
    default:
      return 'Geometric crochet: Mathematical approach to fiber arts that visualizes curvature through stitch progression. Part of the "mathematical knitting" movement that bridges craft and computational design.'
  }
}

function compileMultiPartSurface(params: PatternParameters): CrochetPattern {
  const { curvature, baseStitches, rows, stylePreset } = params
  
  const skillLevel = 'Expert'
  const materials = getMaterialsForPreset(stylePreset!)
  const abbreviations = getStandardAbbreviations()
  
  let assemblyParts: AssemblyPart[] = []
  let notes: string[] = []
  let culturalContext: string | undefined
  
  if (stylePreset === 'boys_surface') {
    // Boy's Surface: 3 lobes + central sphere + grafting assembly
    assemblyParts = [
      {
        partName: 'Part 1: The 3 Lobes',
        instructions: generateLobeInstructions(baseStitches, rows, curvature),
        joinInstructions: 'Join lobes at Triple-Point (1,1,1) with 90-degree coordinate rotations. Use mattress stitch for seamless grafting.'
      },
      {
        partName: 'Part 2: The Central Sphere',
        instructions: generateSphereInstructions(Math.floor(baseStitches * 0.6), Math.floor(rows * 0.7), curvature),
        joinInstructions: 'Attach to lobe junctions using whip stitch. Ensure sphere sits at the triple self-intersection point.'
      },
      {
        partName: 'Part 3: The Grafting Assembly',
        instructions: generateGraftingInstructions(baseStitches, rows),
        joinInstructions: 'Weave through all three lobes and central sphere using yarn needle. Follow Apéry parametrization: (cos u cos v, sin u cos v, cos 2u sin v).'
      }
    ]
    
    notes = [
      'Boy\'s Surface: A non-orientable surface with triple self-intersection.',
      'Work each lobe separately using hyperbolic increases for the saddle shape.',
      'Join at Triple-Point (1,1,1) with 90-degree coordinate rotations.',
      'Use the Apéry parametrization: (cos u cos v, sin u cos v, cos 2u sin v) with α = 0.5.',
      'Grafting requires precise alignment—use stitch markers at intersection points.',
      'Mathematical note: This is a model of the real projective plane in ℝ³.'
    ]
    
    culturalContext = 'Boy\'s Surface (1901): Discovered by German mathematician Werner Boy while studying David Hilbert\'s problem on immersions of the projective plane. Named after Boy, this surface has exactly three lobes meeting at a triple point—a topological marvel that can be physically realized through crochet.'
    
  } else if (stylePreset === 'roman_surface') {
    // Roman Surface: Steiner's Roman Surface
    assemblyParts = [
      {
        partName: 'Part 1: The Cross-Cap Structure',
        instructions: generateCrossCapInstructions(baseStitches, rows, curvature),
        joinInstructions: 'Join cross-cap halves along the self-intersection line using backstitch.'
      },
      {
        partName: 'Part 2: The Four Lobes',
        instructions: generateRomanLobeInstructions(baseStitches, rows, curvature),
        joinInstructions: 'Attach lobes at cardinal points (N, S, E, W) with slip stitch joins.'
      },
      {
        partName: 'Part 3: The Central Disc',
        instructions: generateCentralDiscInstructions(Math.floor(baseStitches * 0.8), Math.floor(rows * 0.5), curvature),
        joinInstructions: 'Sew disc to center, gathering edges to create the Roman surface characteristic pinch.'
      }
    ]
    
    notes = [
      'Roman Surface: Steiner\'s Roman surface, a quartic surface with four lobes.',
      'Parametric equations: x = sin(2u) * cos²(v), y = sin(u) * sin(2v), z = cos(u) * sin(2v).',
      'Work cross-cap first, then attach lobes at 90-degree intervals.',
      'The central disc creates the characteristic self-intersection at the origin.',
      'Block aggressively to open up the lobes and reveal the mathematical structure.',
      'Historical note: Named "Roman" because Steiner discovered it while in Rome in 1844.'
    ]
    
    culturalContext = 'Steiner\'s Roman Surface (1844): Discovered by Swiss mathematician Jakob Steiner during his travels in Rome. A quartic surface with the remarkable property of being a projection of the Veronese surface. Its four lobes meet at a central self‑intersection, creating a visually striking representation of abstract algebraic geometry.'
  }
  
  // Add curvature note
  notes.push(`Mathematical curvature parameter: K = ${curvature.toFixed(3)}`)
  
  return {
    skillLevel,
    materials,
    abbreviations,
    instructions: [], // Main instructions are in assembly parts
    notes,
    culturalContext,
    assemblyParts
  }
}

function generateLobeInstructions(baseStitches: number, rows: number, curvature: number): RowInstruction[] {
  const instructions: RowInstruction[] = []
  const lobeRows = Math.floor(rows * 0.8)
  
  for (let i = 0; i < lobeRows; i++) {
    const round = i + 1
    const stitchCount = Math.floor(baseStitches * (1 + Math.abs(curvature) * i / lobeRows * 1.5))
    
    let instruction = ''
    if (round === 1) {
      instruction = `Ch ${stitchCount}, join with sl st to form ring.`
    } else {
      const increaseRate = Math.floor(stitchCount / (round * 2))
      instruction = `Rnd ${round}: Ch 3 (counts as dc), *dc in next ${increaseRate} sts, inc in next st, repeat from * around. Join with sl st. (${stitchCount} sts)`
    }
    
    instructions.push({
      round,
      stitchCount,
      instruction,
      specialNotes: i === Math.floor(lobeRows / 2) ? ['Mid-lobe: maintain saddle shape for Boy\'s Surface curvature'] : undefined
    })
  }
  
  return instructions
}

function generateSphereInstructions(baseStitches: number, rows: number, curvature: number): RowInstruction[] {
  const instructions: RowInstruction[] = []
  
  for (let i = 0; i < rows; i++) {
    const round = i + 1
    let stitchCount = baseStitches
    
    if (i < rows / 2) {
      // Increasing phase
      stitchCount = Math.floor(baseStitches * (1 + (i / (rows / 2)) * 0.5))
    } else {
      // Decreasing phase
      stitchCount = Math.floor(baseStitches * (1.5 - ((i - rows / 2) / (rows / 2)) * 0.5))
    }
    
    let instruction = ''
    if (round === 1) {
      instruction = `Ch ${stitchCount}, join with sl st to form ring.`
    } else if (i < rows / 2) {
      instruction = `Rnd ${round}: Ch 3 (counts as dc), *dc in next 2 sts, inc in next st, repeat from * around. Join with sl st. (${stitchCount} sts)`
    } else {
      instruction = `Rnd ${round}: Ch 3 (counts as dc), *dc in next 2 sts, dc2tog, repeat from * around. Join with sl st. (${stitchCount} sts)`
    }
    
    instructions.push({
      round,
      stitchCount,
      instruction,
      specialNotes: i === Math.floor(rows / 2) ? ['Equator of central sphere: maintain even tension'] : undefined
    })
  }
  
  return instructions
}

function generateGraftingInstructions(baseStitches: number, rows: number): RowInstruction[] {
  return [
    {
      round: 1,
      stitchCount: baseStitches * 3,
      instruction: 'Using yarn needle and matching yarn, prepare grafting thread 3× the circumference.',
      specialNotes: ['Cut yarn 3× longer than needed to avoid running out during grafting']
    },
    {
      round: 2,
      stitchCount: 0,
      instruction: 'Thread needle and begin at Triple-Point (1,1,1). Weave through all three lobes following Apéry parametrization path.',
      specialNotes: ['Follow mathematical coordinates: (cos u cos v, sin u cos v, cos 2u sin v) with α = 0.5']
    },
    {
      round: 3,
      stitchCount: 0,
      instruction: 'Complete grafting by weaving back through central sphere and securing with multiple knots.',
      specialNotes: ['Hide knots inside central sphere for clean finish']
    }
  ]
}

function generateCrossCapInstructions(baseStitches: number, rows: number, curvature: number): RowInstruction[] {
  const instructions: RowInstruction[] = []
  const crossCapRows = Math.floor(rows * 0.6)
  
  for (let i = 0; i < crossCapRows; i++) {
    const round = i + 1
    const stitchCount = Math.floor(baseStitches * (1 - Math.abs(curvature) * i / crossCapRows * 0.7))
    
    let instruction = ''
    if (round === 1) {
      instruction = `Ch ${stitchCount}, join with sl st to form ring.`
    } else {
      const decreaseRate = Math.floor(stitchCount / (round * 2))
      instruction = `Rnd ${round}: Ch 3 (counts as dc), *dc in next ${decreaseRate} sts, dc2tog, repeat from * around. Join with sl st. (${stitchCount} sts)`
    }
    
    instructions.push({
      round,
      stitchCount,
      instruction,
      specialNotes: i === Math.floor(crossCapRows / 2) ? ['Cross-cap midpoint: creates self-intersection line'] : undefined
    })
  }
  
  return instructions
}

function generateRomanLobeInstructions(baseStitches: number, rows: number, curvature: number): RowInstruction[] {
  const instructions: RowInstruction[] = []
  const lobeRows = Math.floor(rows * 0.5)
  
  for (let i = 0; i < lobeRows; i++) {
    const round = i + 1
    const stitchCount = Math.floor(baseStitches * (1 + Math.abs(curvature) * i / lobeRows * 0.8))
    
    let instruction = ''
    if (round === 1) {
      instruction = `Ch ${stitchCount}, join with sl st to form ring.`
    } else {
      const increaseRate = Math.floor(stitchCount / (round * 3))
      instruction = `Rnd ${round}: Ch 3 (counts as dc), *dc in next ${increaseRate} sts, inc in next st, repeat from * around. Join with sl st. (${stitchCount} sts)`
    }
    
    instructions.push({
      round,
      stitchCount,
      instruction,
      specialNotes: i === lobeRows - 1 ? ['Lobe tip: leave long tail for attaching to central disc'] : undefined
    })
  }
  
  return instructions
}

function generateCentralDiscInstructions(baseStitches: number, rows: number, curvature: number): RowInstruction[] {
  const instructions: RowInstruction[] = []
  
  for (let i = 0; i < rows; i++) {
    const round = i + 1
    const stitchCount = baseStitches
    
    let instruction = ''
    if (round === 1) {
      instruction = `Ch ${stitchCount}, join with sl st to form ring.`
    } else {
      instruction = `Rnd ${round}: Ch 3 (counts as dc), dc in each st around. Join with sl st. (${stitchCount} sts)`
    }
    
    instructions.push({
      round,
      stitchCount,
      instruction,
      specialNotes: i === rows - 1 ? ['Edge of disc: will be gathered to create Roman surface pinch'] : undefined
    })
  }
  
  return instructions
}

// Utility function to format pattern as text
export function formatPatternAsText(pattern: CrochetPattern): string {
  let text = `THALIA PATTERN COMPILER\n`
  text += `=======================\n\n`
  
  text += `SKILL LEVEL: ${pattern.skillLevel}\n\n`
  
  text += `MATERIALS:\n`
  pattern.materials.forEach(material => {
    text += `• ${material}\n`
  })
  text += `\n`
  
  text += `ABBREVIATIONS:\n`
  Object.entries(pattern.abbreviations).forEach(([abbr, meaning]) => {
    text += `${abbr} = ${meaning}\n`
  })
  text += `\n`
  
  // Include assembly parts if present
  if (pattern.assemblyParts && pattern.assemblyParts.length > 0) {
    text += `ASSEMBLY PARTS:\n`
    pattern.assemblyParts.forEach((part, index) => {
      text += `\n${part.partName}:\n`
      part.instructions.forEach(row => {
        text += `  Rnd ${row.round} (${row.stitchCount} sts): ${row.instruction}\n`
        if (row.specialNotes && row.specialNotes.length > 0) {
          row.specialNotes.forEach(note => {
            text += `    Note: ${note}\n`
          })
        }
      })
      if (part.joinInstructions) {
        text += `  Join: ${part.joinInstructions}\n`
      }
    })
    text += `\n`
  } else {
    text += `INSTRUCTIONS:\n`
    pattern.instructions.forEach(row => {
      text += `Rnd ${row.round} (${row.stitchCount} sts): ${row.instruction}\n`
      if (row.specialNotes && row.specialNotes.length > 0) {
        row.specialNotes.forEach(note => {
          text += `  Note: ${note}\n`
        })
      }
    })
    text += `\n`
  }
  
  text += `NOTES:\n`
  pattern.notes.forEach((note, index) => {
    text += `${index + 1}. ${note}\n`
  })
  text += `\n`
  
  if (pattern.culturalContext) {
    text += `CULTURAL CONTEXT:\n${pattern.culturalContext}\n`
  }
  
  return text
}

// Export a simplified version for quick pattern generation
export function generateQuickPattern(curvature: number, rows: number = 8): string {
  const pattern = compilePattern({
    curvature,
    baseStitches: 8,
    rows,
    stylePreset: 'default'
  })
  
  return formatPatternAsText(pattern)
}