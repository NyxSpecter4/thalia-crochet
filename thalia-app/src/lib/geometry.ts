export type CurvatureType = 'hyperbolic' | 'spherical' | 'euclidean'

export interface PatternData {
  stitches: number[]
  rows: number
  curvature: number
  type: CurvatureType
  description: string
}

export interface StitchNode {
  x: number
  y: number
  size: number
  color: string
  curvature: number
}

export function determineCurvatureType(curvature: number): CurvatureType {
  if (curvature < 0) return 'hyperbolic'
  if (curvature > 0) return 'spherical'
  return 'euclidean'
}

export function getCurvatureDescription(curvature: number): string {
  if (curvature < -0.7) return 'Strong Hyperbolic (Ruffles/Corals)'
  if (curvature < -0.3) return 'Moderate Hyperbolic (Waves)'
  if (curvature < 0) return 'Mild Hyperbolic (Gentle Expansion)'
  if (curvature === 0) return 'Euclidean (Flat Surface)'
  if (curvature < 0.3) return 'Mild Spherical (Gentle Contraction)'
  if (curvature < 0.7) return 'Moderate Spherical (Domes)'
  return 'Strong Spherical (Hats/Balls)'
}

export function calculateStitchProgression(
  curvature: number,
  baseStitches: number,
  rows: number
): number[] {
  const progression: number[] = [baseStitches]
  const type = determineCurvatureType(curvature)
  
  for (let i = 1; i < rows; i++) {
    let nextStitches = baseStitches
    
    switch (type) {
      case 'hyperbolic':
        // K < 0: Increase stitches (n:n+1)
        // More negative curvature = faster expansion
        const hyperbolicRate = Math.abs(curvature) * 2
        nextStitches = Math.floor(baseStitches * (1 + hyperbolicRate * i / rows))
        break
      case 'spherical':
        // K > 0: Decrease stitches (n:n-1)
        // More positive curvature = faster contraction
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

export function generatePattern(
  curvature: number = -0.5,
  baseStitches: number = 8,
  rows: number = 12
): PatternData {
  const stitches = calculateStitchProgression(curvature, baseStitches, rows)
  const type = determineCurvatureType(curvature)
  
  return {
    stitches,
    rows,
    curvature,
    type,
    description: getCurvatureDescription(curvature)
  }
}

export function generateHyperbolicNodes(
  curvature: number = -0.5,
  count: number = 24
): StitchNode[] {
  const nodes: StitchNode[] = []
  const centerX = 400
  const centerY = 300
  const baseRadius = 150
  
  for (let i = 0; i < count; i++) {
    const angle = (i * 2 * Math.PI) / count
    const radius = baseRadius * (1 + Math.abs(curvature) * Math.sin(i * 0.5))
    
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    
    // Size based on distance from center (hyperbolic expansion)
    const size = 6 + Math.abs(curvature) * 8
    
    // Color gradient based on curvature
    let color = '#059669' // emerald default
    if (curvature < -0.7) color = '#fbbf24' // gold for strong hyperbolic
    else if (curvature < 0) color = '#10b981' // light emerald for mild hyperbolic
    
    nodes.push({
      x,
      y,
      size,
      color,
      curvature
    })
  }
  
  return nodes
}

export function calculateTotalStitches(pattern: PatternData): number {
  return pattern.stitches.reduce((sum, count) => sum + count, 0)
}

export function calculatePatternDensity(pattern: PatternData): number {
  const totalStitches = calculateTotalStitches(pattern)
  const maxPossible = pattern.rows * Math.max(...pattern.stitches)
  return totalStitches / maxPossible
}

// Curvature math verification
export function verifyCurvatureLogic(): { [key: string]: boolean } {
  const tests = {
    hyperbolic_increases: false,
    spherical_decreases: false,
    euclidean_constant: false
  }
  
  // Test 1: Hyperbolic should increase stitches
  const hyperbolicPattern = generatePattern(-0.5, 10, 5)
  tests.hyperbolic_increases = 
    hyperbolicPattern.stitches[hyperbolicPattern.stitches.length - 1] > hyperbolicPattern.stitches[0]
  
  // Test 2: Spherical should decrease stitches
  const sphericalPattern = generatePattern(0.5, 10, 5)
  tests.spherical_decreases = 
    sphericalPattern.stitches[sphericalPattern.stitches.length - 1] < sphericalPattern.stitches[0]
  
  // Test 3: Euclidean should maintain stitches
  const euclideanPattern = generatePattern(0, 10, 5)
  tests.euclidean_constant = 
    euclideanPattern.stitches.every(stitch => stitch === 10)
  
  return tests
}