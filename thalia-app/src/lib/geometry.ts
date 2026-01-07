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

export interface StitchNode {
  x: number
  y: number
  size: number
  color: string
  curvature: number
  row: number
  positionInRow: number
  totalInRow: number
  stitchInstruction?: string
  nodeId: string
  edges: StitchEdge[]
}

export type EdgeType = 'standard' | 'post_stitch' | 'increase' | 'decrease' | 'slip_stitch'

export interface StitchEdge {
  sourceId: string
  targetId: string
  type: EdgeType
  curvature: number
  rowSpan: number // How many rows this edge spans (1 = adjacent rows, 2 = post-stitch to row n-2, etc.)
  tension: number // 0-1 scale of tension/hoop stress
}

export function generateHyperbolicNodes(
  curvature: number = -0.5,
  baseCount: number = 12,
  rows: number = 5
): StitchNode[] {
  const nodes: StitchNode[] = []
  const centerX = 400
  const centerY = 300
  const baseRadius = 60
  
  // Calculate stitch progression using the formula: Row[n+1] = Row[n] * (1 + abs(K))
  const stitchProgression: number[] = [baseCount]
  for (let i = 1; i < rows; i++) {
    if (curvature < 0) {
      // Hyperbolic: increase stitches
      const increaseFactor = 1 + Math.abs(curvature)
      stitchProgression.push(Math.round(stitchProgression[i-1] * increaseFactor))
    } else if (curvature > 0) {
      // Spherical: decrease stitches
      const decreaseFactor = 1 - Math.abs(curvature)
      stitchProgression.push(Math.max(6, Math.round(stitchProgression[i-1] * decreaseFactor)))
    } else {
      // Euclidean: maintain stitches
      stitchProgression.push(baseCount)
    }
  }
  
  // First pass: create all nodes
  for (let row = 0; row < rows; row++) {
    const rowRadius = baseRadius + (row * 45) // Increase radius for each row
    const stitchesInRow = stitchProgression[row]
    
    for (let i = 0; i < stitchesInRow; i++) {
      const angle = (i * 2 * Math.PI) / stitchesInRow
      
      // Add some variation to make it look more organic
      const radiusVariation = 1 + (Math.abs(curvature) * 0.25 * Math.sin(row * 1.5 + i * 0.4))
      const radius = rowRadius * radiusVariation
      
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      
      // Size decreases slightly for outer rows
      const size = 9 - (row * 1.2) + Math.abs(curvature) * 5
      
      // Color based on row and curvature - using Emerald (#059669) and Gold (#fbbf24) palette
      let color = '#059669' // emerald default
      if (curvature < -0.7) {
        // Strong hyperbolic - gold gradient
        const intensity = 0.8 - (row / rows) * 0.4
        color = `rgb(${Math.floor(251 * intensity)}, ${Math.floor(191 * intensity)}, ${Math.floor(36 * intensity)})`
      } else if (curvature < 0) {
        // Mild hyperbolic - emerald gradient
        const intensity = 0.6 + (row / rows) * 0.4
        color = `rgb(${Math.floor(5 * intensity)}, ${Math.floor(150 * intensity)}, ${Math.floor(105 * intensity)})`
      } else if (curvature > 0) {
        // Spherical - blue-emerald gradient
        const intensity = 0.5 + (row / rows) * 0.5
        color = `rgb(${Math.floor(5 * intensity)}, ${Math.floor(120 * intensity)}, ${Math.floor(200 * intensity)})`
      } else {
        // Euclidean - gray-emerald
        const intensity = 0.4 + (row / rows) * 0.6
        color = `rgb(${Math.floor(80 * intensity)}, ${Math.floor(150 * intensity)}, ${Math.floor(120 * intensity)})`
      }
      
      // Generate stitch instruction based on position and curvature
      let stitchInstruction = ''
      const prevRowStitches = row > 0 ? stitchProgression[row-1] : stitchesInRow
      
      if (curvature < 0) {
        // Hyperbolic: increase stitches
        if (stitchesInRow > prevRowStitches) {
          const increaseEvery = Math.floor(prevRowStitches / (stitchesInRow - prevRowStitches))
          if (i % increaseEvery === 0 && row > 0) {
            stitchInstruction = '2 sc in next st'
          } else {
            stitchInstruction = 'sc in next st'
          }
        } else {
          stitchInstruction = 'sc in next st'
        }
      } else if (curvature > 0) {
        // Spherical: decrease stitches
        if (stitchesInRow < prevRowStitches) {
          const decreaseEvery = Math.floor(prevRowStitches / (prevRowStitches - stitchesInRow))
          if (i % decreaseEvery === 0 && row > 0) {
            stitchInstruction = 'sc2tog'
          } else {
            stitchInstruction = 'sc in next st'
          }
        } else {
          stitchInstruction = 'sc in next st'
        }
      } else {
        // Euclidean: maintain stitches
        stitchInstruction = 'sc in next st'
      }
      
      nodes.push({
        x,
        y,
        size: Math.max(4, size),
        color,
        curvature,
        row: row + 1, // 1-indexed for display
        positionInRow: i + 1,
        totalInRow: stitchesInRow,
        stitchInstruction,
        nodeId: `r${row + 1}_p${i + 1}`,
        edges: [] // Will be populated in second pass
      })
    }
  }
  
  // Second pass: create edges between nodes
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const edges: StitchEdge[] = []
    
    // Find nodes in previous row to connect to
    if (node.row > 1) {
      const prevRowNodes = nodes.filter(n => n.row === node.row - 1)
      
      if (prevRowNodes.length > 0) {
        // Connect to nearest node in previous row (standard edge)
        const nearestPrevNode = prevRowNodes.reduce((nearest, prevNode) => {
          const dist = Math.sqrt(
            Math.pow(node.x - prevNode.x, 2) + Math.pow(node.y - prevNode.y, 2)
          )
          return dist < nearest.dist ? { node: prevNode, dist } : nearest
        }, { node: prevRowNodes[0], dist: Infinity })
        
        edges.push({
          sourceId: node.nodeId,
          targetId: nearestPrevNode.node.nodeId,
          type: 'standard',
          curvature,
          rowSpan: 1,
          tension: Math.abs(curvature) * 0.7 + 0.3 // Higher tension with higher curvature
        })
        
        // For hyperbolic patterns, add post-stitch edges to row n-2
        if (curvature < 0 && node.row > 2) {
          const prevPrevRowNodes = nodes.filter(n => n.row === node.row - 2)
          if (prevPrevRowNodes.length > 0) {
            // Add post-stitch edge to row n-2 (every 3rd node)
            if (node.positionInRow % 3 === 0) {
              const targetNode = prevPrevRowNodes[
                Math.min(node.positionInRow - 1, prevPrevRowNodes.length - 1)
              ]
              edges.push({
                sourceId: node.nodeId,
                targetId: targetNode.nodeId,
                type: 'post_stitch',
                curvature,
                rowSpan: 2,
                tension: Math.abs(curvature) * 0.5 + 0.2 // Lower tension for post-stitches
              })
            }
          }
        }
        
        // Add increase/decrease edges based on stitch instruction
        if (node.stitchInstruction === '2 sc in next st') {
          edges.push({
            sourceId: node.nodeId,
            targetId: nearestPrevNode.node.nodeId,
            type: 'increase',
            curvature,
            rowSpan: 1,
            tension: Math.abs(curvature) * 0.8 + 0.4
          })
        } else if (node.stitchInstruction === 'sc2tog') {
          // For decreases, connect to two nodes in previous row
          const secondNearestPrevNode = prevRowNodes.find(
            n => n.nodeId !== nearestPrevNode.node.nodeId
          )
          if (secondNearestPrevNode) {
            edges.push({
              sourceId: node.nodeId,
              targetId: secondNearestPrevNode.nodeId,
              type: 'decrease',
              curvature,
              rowSpan: 1,
              tension: Math.abs(curvature) * 0.9 + 0.5 // High tension on decreases
            })
          }
        }
      }
    }
    
    node.edges = edges
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