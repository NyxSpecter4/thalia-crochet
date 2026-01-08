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

/**
 * Calculate stitch progression for Enneper's minimal surface.
 * Uses trigonometric identities to approximate arc length growth.
 * Row n stitch count = baseStitches * (1 + sin(n/rows * π/2) * curvatureFactor)
 * where curvatureFactor is derived from the surface's Gaussian curvature.
 */
export function calculateEnneperStitchProgression(
  baseStitches: number,
  rows: number,
  curvatureFactor: number = 0.5
): number[] {
  const progression: number[] = [baseStitches]
  for (let i = 1; i < rows; i++) {
    // Enneper's surface arc length grows with sin(theta)
    const theta = (i / rows) * Math.PI / 2
    const growth = Math.sin(theta) * curvatureFactor
    const nextStitches = Math.max(1, Math.floor(baseStitches * (1 + growth)))
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

/**
 * Generate nodes for Enneper's minimal surface with self‑intersection visualization.
 * Uses Bour's Surface logic (Trig‑identities) to calculate stitch counts.
 * Nodes are placed in a radial layout with a twist that creates crossing points.
 */
export function generateEnneperNodes(
  curvatureFactor: number = 0.5,
  baseCount: number = 12,
  rows: number = 5
): StitchNode[] {
  const nodes: StitchNode[] = []
  const centerX = 400
  const centerY = 300
  const baseRadius = 60

  // Calculate stitch progression using Enneper's trigonometric growth
  const stitchProgression = calculateEnneperStitchProgression(baseCount, rows, curvatureFactor)

  // First pass: create all nodes
  for (let row = 0; row < rows; row++) {
    const rowRadius = baseRadius + (row * 45) // Increase radius for each row
    const stitchesInRow = stitchProgression[row]

    for (let i = 0; i < stitchesInRow; i++) {
      // Base angle
      const baseAngle = (i * 2 * Math.PI) / stitchesInRow
      // Add a twist that depends on row and curvature factor to create self‑intersection
      // Twist follows sin(row * curvatureFactor) to produce crossing patterns
      const twist = curvatureFactor * Math.sin(row * 1.2) * 0.8
      const angle = baseAngle + twist

      // Radius variation to make the surface look more organic
      const radiusVariation = 1 + (curvatureFactor * 0.25 * Math.sin(row * 1.5 + i * 0.4))
      const radius = rowRadius * radiusVariation

      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Size decreases slightly for outer rows
      const size = 9 - (row * 1.2) + curvatureFactor * 5

      // Determine if this node is near a self‑intersection point
      // Self‑intersection occurs when twist causes angles to overlap with previous row
      const isSelfIntersection = Math.abs(twist) > 0.5 && row > 0 && i % 3 === 0

      // Color: cyan for regular nodes, magenta for self‑intersection points
      let color = isSelfIntersection ? '#ec4899' : '#06b6d4'
      // If curvature factor high, add gold tint
      if (curvatureFactor > 0.7) {
        color = isSelfIntersection ? '#f59e0b' : '#10b981'
      }

      // Generate stitch instruction based on position
      let stitchInstruction = 'sc in next st'
      if (row > 0) {
        const prevRowStitches = stitchProgression[row - 1]
        if (stitchesInRow > prevRowStitches) {
          const increaseEvery = Math.floor(prevRowStitches / (stitchesInRow - prevRowStitches))
          if (i % increaseEvery === 0) {
            stitchInstruction = '2 sc in next st'
          }
        } else if (stitchesInRow < prevRowStitches) {
          const decreaseEvery = Math.floor(prevRowStitches / (prevRowStitches - stitchesInRow))
          if (i % decreaseEvery === 0) {
            stitchInstruction = 'sc2tog'
          }
        }
      }

      nodes.push({
        x,
        y,
        size: Math.max(4, size),
        color,
        curvature: curvatureFactor,
        row: row + 1, // 1‑indexed for display
        positionInRow: i + 1,
        totalInRow: stitchesInRow,
        stitchInstruction,
        nodeId: `enneper_r${row + 1}_p${i + 1}`,
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
          curvature: curvatureFactor,
          rowSpan: 1,
          tension: curvatureFactor * 0.7 + 0.3
        })

        // For self‑intersection points, add a special "crossing" edge to row n‑2
        const isSelfIntersection = Math.abs(node.curvature) > 0.5 && node.row > 2 && node.positionInRow % 3 === 0
        if (isSelfIntersection) {
          const prevPrevRowNodes = nodes.filter(n => n.row === node.row - 2)
          if (prevPrevRowNodes.length > 0) {
            const targetNode = prevPrevRowNodes[
              Math.min(node.positionInRow - 1, prevPrevRowNodes.length - 1)
            ]
            edges.push({
              sourceId: node.nodeId,
              targetId: targetNode.nodeId,
              type: 'post_stitch',
              curvature: curvatureFactor,
              rowSpan: 2,
              tension: curvatureFactor * 0.5 + 0.2
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

/**
 * Generate nodes for Roman Surface (Steiner's Roman Surface).
 * Uses Steiner parametric equations:
 *   x = sin(2u) * cos²(v)
 *   y = sin(u) * sin(2v)
 *   z = cos(u) * sin(2v)
 *
 * For 2D visualization, we project to (x, y) plane and scale appropriately.
 * The surface is a self-intersecting mapping of the real projective plane into 3D space.
 */
export function generateRomanSurfaceNodes(
  curvatureFactor: number = 0.5,
  baseCount: number = 12,
  rows: number = 5
): StitchNode[] {
  const nodes: StitchNode[] = []
  const centerX = 400
  const centerY = 300
  const baseRadius = 60

  // First pass: create all nodes using Steiner parametric equations
  for (let row = 0; row < rows; row++) {
    // Map row to parameter u (0 to π)
    const u = (row / (rows - 1)) * Math.PI
    
    // Determine number of stitches in this row based on curvature factor
    const stitchesInRow = Math.max(6, Math.floor(baseCount * (1 + curvatureFactor * Math.sin(u))))
    
    for (let i = 0; i < stitchesInRow; i++) {
      // Map position in row to parameter v (0 to π)
      const v = (i / stitchesInRow) * Math.PI
      
      // Steiner parametric equations for Roman Surface
      const xParam = Math.sin(2 * u) * Math.pow(Math.cos(v), 2)
      const yParam = Math.sin(u) * Math.sin(2 * v)
      const zParam = Math.cos(u) * Math.sin(2 * v)
      
      // Scale and position for 2D visualization
      // We'll use x and y parameters, ignoring z for 2D projection
      const scale = 80 + (row * 30) // Increase scale for outer rows
      const x = centerX + xParam * scale
      const y = centerY + yParam * scale
      
      // Size based on position and curvature
      const size = 8 - (row * 0.8) + curvatureFactor * 4
      
      // Determine if this node is near a triple point (self-intersection)
      // Triple points occur where x, y, z are all zero or near zero
      const isTriplePoint = Math.abs(xParam) < 0.2 && Math.abs(yParam) < 0.2 && Math.abs(zParam) < 0.2
      
      // Color: indigo for regular nodes, gold for triple points
      let color = isTriplePoint ? '#f59e0b' : '#8b5cf6' // Vibrant indigo
      
      // Add color variation based on curvature factor
      if (curvatureFactor > 0.7) {
        color = isTriplePoint ? '#fbbf24' : '#7c3aed' // Brighter gold and deeper indigo
      }
      
      // Generate stitch instruction based on position
      let stitchInstruction = 'sc in next st'
      if (row > 0) {
        // For Roman surface, stitches alternate between increases and decreases
        // to create the three intersecting discs
        if (i % 3 === 0) {
          stitchInstruction = '2 sc in next st' // Increase for disc edges
        } else if (i % 5 === 0) {
          stitchInstruction = 'sc2tog' // Decrease for intersections
        }
      }
      
      nodes.push({
        x,
        y,
        size: Math.max(4, size),
        color,
        curvature: curvatureFactor,
        row: row + 1, // 1‑indexed for display
        positionInRow: i + 1,
        totalInRow: stitchesInRow,
        stitchInstruction,
        nodeId: `roman_r${row + 1}_p${i + 1}`,
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
          curvature: curvatureFactor,
          rowSpan: 1,
          tension: curvatureFactor * 0.7 + 0.3
        })

        // For Roman surface, add special "disc intersection" edges
        // These connect nodes that belong to different intersecting discs
        const isOnDiscBoundary = node.positionInRow % 3 === 0 || node.positionInRow % 5 === 0
        if (isOnDiscBoundary && node.row > 2) {
          const prevPrevRowNodes = nodes.filter(n => n.row === node.row - 2)
          if (prevPrevRowNodes.length > 0) {
            // Find node in row n-2 that's on the same disc
            const targetNode = prevPrevRowNodes.find(
              n => n.positionInRow % 3 === node.positionInRow % 3
            ) || prevPrevRowNodes[Math.min(node.positionInRow - 1, prevPrevRowNodes.length - 1)]
            
            if (targetNode) {
              edges.push({
                sourceId: node.nodeId,
                targetId: targetNode.nodeId,
                type: 'post_stitch',
                curvature: curvatureFactor,
                rowSpan: 2,
                tension: curvatureFactor * 0.5 + 0.2
              })
            }
          }
        }
      }
    }

    node.edges = edges
  }

  return nodes
}

/**
 * Generate nodes for Trefoil Knot curve.
 * Uses parametric equations:
 *   x = sin(t) + 2*sin(2t)
 *   y = cos(t) - 2*cos(2t)
 *   z = -sin(3t)
 *
 * For 2D visualization, we project to (x, y) plane and scale appropriately.
 * The trefoil is a (2,3)-torus knot with three crossings.
 */
export function generateTrefoilKnotNodes(
  curvatureFactor: number = 0.5,
  baseCount: number = 36,
  rows: number = 1
): StitchNode[] {
  const nodes: StitchNode[] = []
  const centerX = 400
  const centerY = 300
  const scale = 80

  // Trefoil knot is a 1D curve, so we treat each point as a "row" with 1 stitch
  // We'll use baseCount as the number of sample points along the curve
  const samplePoints = baseCount

  for (let i = 0; i < samplePoints; i++) {
    // Parameter t goes from 0 to 2π
    const t = (i / samplePoints) * 2 * Math.PI
    
    // Trefoil knot parametric equations
    const xParam = Math.sin(t) + 2 * Math.sin(2 * t)
    const yParam = Math.cos(t) - 2 * Math.cos(2 * t)
    const zParam = -Math.sin(3 * t)
    
    // Scale and position for 2D visualization
    const x = centerX + xParam * scale
    const y = centerY + yParam * scale
    
    // Size based on curvature factor and position
    const size = 6 + curvatureFactor * 4
    
    // Determine if this point is near a crossing
    // Crossings occur where z parameter is near zero and x,y are at extremes
    const isCrossing = Math.abs(zParam) < 0.3 && Math.abs(xParam) > 1.5 && Math.abs(yParam) > 1.5
    
    // Color: deep indigo for regular points, gold for crossings
    let color = isCrossing ? '#f59e0b' : '#4f46e5' // Deep indigo
    
    // Add color variation based on curvature factor
    if (curvatureFactor > 0.7) {
      color = isCrossing ? '#fbbf24' : '#3730a3' // Brighter gold and deeper indigo
    }
    
    // Generate stitch instruction (for a knot, we use slip stitches and chains)
    let stitchInstruction = 'sl st'
    if (i % 3 === 0) {
      stitchInstruction = 'ch 3' // Chain stitches at regular intervals
    } else if (isCrossing) {
      stitchInstruction = 'sc3tog' // Triple decrease at crossings
    }
    
    nodes.push({
      x,
      y,
      size: Math.max(3, size),
      color,
      curvature: curvatureFactor,
      row: 1, // All points in same "row" for knot visualization
      positionInRow: i + 1,
      totalInRow: samplePoints,
      stitchInstruction,
      nodeId: `trefoil_p${i + 1}`,
      edges: [] // Will be populated to connect consecutive points
    })
  }

  // Second pass: create edges between consecutive nodes to form the knot
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const edges: StitchEdge[] = []

    // Connect to next node (wrapping around to form closed knot)
    const nextIndex = (i + 1) % nodes.length
    const nextNode = nodes[nextIndex]
    
    edges.push({
      sourceId: node.nodeId,
      targetId: nextNode.nodeId,
      type: 'standard',
      curvature: curvatureFactor,
      rowSpan: 0, // Same row
      tension: curvatureFactor * 0.8 + 0.4 // Higher tension for knots
    })

    // Add crossing edges for points near crossings
    const isCrossing = Math.abs(node.curvature) > 0.5 && i % 12 === 0
    if (isCrossing) {
      // Connect to node on opposite side of knot (simulating under/over crossing)
      const oppositeIndex = (i + Math.floor(nodes.length / 2)) % nodes.length
      const oppositeNode = nodes[oppositeIndex]
      
      edges.push({
        sourceId: node.nodeId,
        targetId: oppositeNode.nodeId,
        type: 'post_stitch',
        curvature: curvatureFactor,
        rowSpan: 0,
        tension: curvatureFactor * 0.6 + 0.3 // Lower tension for crossing connections
      })
    }

    node.edges = edges
  }

  return nodes
}

/**
 * Generate nodes for Boy's Surface (Exact Apéry parametrization with α parameter).
 * Uses the exact trigonometric parametrization from Apéry's research:
 *   x = (√2 cos²v cos(2u) + cosu sin(2v)) / (α - √2 sin(3u) sin(2v))
 *   y = (√2 cos²v sin(2u) - sinu sin(2v)) / (α - √2 sin(3u) sin(2v))
 *   z = (3 cos²v) / (α - √2 sin(3u) sin(2v))
 *
 * Where α is a parameter controlling the surface's scale and shape (typically α = 2).
 * For 2D visualization, we project to (x, y) plane and scale appropriately.
 * Boy's Surface is an immersion of the real projective plane with a 4-lobe structure.
 */
export function generateBoysSurfaceNodes(
  curvatureFactor: number = 0.5,
  baseCount: number = 24,
  rows: number = 6,
  alpha: number = 2.0 // α parameter from Apéry parametrization
): StitchNode[] {
  const nodes: StitchNode[] = []
  const centerX = 400
  const centerY = 300
  const scale = 100

  // First pass: create all nodes using Boy's Surface parametric equations
  for (let row = 0; row < rows; row++) {
    // Map row to parameter u (-π/2 to π/2)
    const u = (row / (rows - 1) - 0.5) * Math.PI
    
    // Determine number of stitches in this row based on curvature factor
    const stitchesInRow = Math.max(8, Math.floor(baseCount * (1 + curvatureFactor * Math.cos(u))))
    
    for (let i = 0; i < stitchesInRow; i++) {
      // Map position in row to parameter v (0 to π)
      const v = (i / stitchesInRow) * Math.PI
      
      // Boy's Surface parametric equations (Exact Apéry parametrization with α)
      const denominator = alpha - Math.sqrt(2) * Math.sin(3 * u) * Math.sin(2 * v)
      
      // Avoid division by zero
      if (Math.abs(denominator) < 0.001) {
        continue
      }
      
      const xParam = (Math.sqrt(2) * Math.pow(Math.cos(v), 2) * Math.cos(2 * u) + Math.cos(u) * Math.sin(2 * v)) / denominator
      const yParam = (Math.sqrt(2) * Math.pow(Math.cos(v), 2) * Math.sin(2 * u) - Math.sin(u) * Math.sin(2 * v)) / denominator
      const zParam = (3 * Math.pow(Math.cos(v), 2)) / denominator
      
      // Scale and position for 2D visualization
      const x = centerX + xParam * scale
      const y = centerY + yParam * scale
      
      // Size based on position and curvature
      const size = 7 - (row * 0.6) + curvatureFactor * 3
      
      // Determine if this node is near a triple point (central point where lobes meet)
      const isTriplePoint = Math.abs(xParam) < 0.3 && Math.abs(yParam) < 0.3 && Math.abs(zParam) < 2.0
      
      // Determine if this node is on a lobe (one of the 4 lobes)
      const isOnLobe = Math.abs(zParam) > 1.5 && Math.abs(xParam) < 1.0 && Math.abs(yParam) < 1.0
      
      // Color: cyan for regular nodes, magenta for triple points, gold for lobes
      let color = '#06b6d4' // Cyan default
      if (isTriplePoint) {
        color = '#ec4899' // Magenta
      } else if (isOnLobe) {
        color = '#f59e0b' // Gold
      }
      
      // Add color variation based on curvature factor and α parameter
      if (curvatureFactor > 0.7) {
        if (isTriplePoint) {
          color = '#f472b6' // Pink
        } else if (isOnLobe) {
          color = '#fbbf24' // Bright gold
        } else {
          color = '#0ea5e9' // Sky blue
        }
      }
      
      // Special coloring for different α values
      if (alpha > 2.5) {
        // Higher α produces more elongated surface
        if (isOnLobe) color = '#10b981' // Emerald green
      } else if (alpha < 1.5) {
        // Lower α produces more compact surface
        if (isOnLobe) color = '#8b5cf6' // Indigo
      }
      
      // Generate stitch instruction based on position
      let stitchInstruction = 'sc in next st'
      if (row > 0) {
        // For Boy's surface, stitches follow lobe patterns
        if (isOnLobe) {
          stitchInstruction = '2 sc in next st' // Increase on lobes
        } else if (isTriplePoint) {
          stitchInstruction = 'sc3tog' // Triple decrease at central point
        } else if (i % 4 === 0) {
          stitchInstruction = 'dc in next st' // Double crochet for structure
        }
      }
      
      nodes.push({
        x,
        y,
        size: Math.max(4, size),
        color,
        curvature: curvatureFactor,
        row: row + 1, // 1‑indexed for display
        positionInRow: i + 1,
        totalInRow: stitchesInRow,
        stitchInstruction,
        nodeId: `boys_α${alpha.toFixed(1)}_r${row + 1}_p${i + 1}`,
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
          curvature: curvatureFactor,
          rowSpan: 1,
          tension: curvatureFactor * 0.7 + 0.3
        })

        // For Boy's surface, add special "lobe connection" edges
        const isOnLobe = node.color === '#f59e0b' || node.color === '#fbbf24' ||
                         node.color === '#10b981' || node.color === '#8b5cf6'
        if (isOnLobe && node.row > 2) {
          const prevPrevRowNodes = nodes.filter(n => n.row === node.row - 2)
          if (prevPrevRowNodes.length > 0) {
            // Find node in row n-2 that's also on a lobe
            const targetNode = prevPrevRowNodes.find(
              n => n.color === node.color ||
                   n.color === '#f59e0b' || n.color === '#fbbf24' ||
                   n.color === '#10b981' || n.color === '#8b5cf6'
            ) || prevPrevRowNodes[Math.min(node.positionInRow - 1, prevPrevRowNodes.length - 1)]
            
            if (targetNode) {
              edges.push({
                sourceId: node.nodeId,
                targetId: targetNode.nodeId,
                type: 'post_stitch',
                curvature: curvatureFactor,
                rowSpan: 2,
                tension: curvatureFactor * 0.5 + 0.2
              })
            }
          }
        }
      }
    }

    node.edges = edges
  }

  return nodes
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

// Research-integrated functions

/**
 * Calculate Aari stitch density for Gulabi shading based on research data
 * Returns stitches per centimeter for given parameters
 */
export function calculateAariStitchDensity(
  shadingIntensity: number, // 0-1 scale
  threadThickness: number = 0.1, // mm
  historicalAccuracy: boolean = false
): { min: number; max: number; estimated: number; confidence: 'low' | 'medium' | 'high' } {
  // Based on research data: estimated 8-12 stitches/cm for Gulabi shading
  const baseMin = 8;
  const baseMax = 12;
  
  // Adjust based on parameters
  const densityFactor = 1 + (shadingIntensity * 0.5); // More intense shading = higher density
  const thicknessFactor = 1 / (threadThickness * 10); // Thinner thread = higher density
  
  const estimated = Math.round((baseMin + baseMax) / 2 * densityFactor * thicknessFactor);
  const min = Math.round(baseMin * densityFactor * thicknessFactor * 0.9);
  const max = Math.round(baseMax * densityFactor * thicknessFactor * 1.1);
  
  return {
    min,
    max,
    estimated,
    confidence: historicalAccuracy ? 'low' : 'medium' // Confidence is low for historical accuracy due to missing data
  };
}

/**
 * Calculate mechanical properties for silver-plated nylon thread
 * Based on research data about Young's modulus and fracture strain
 */
export function calculateSilverPlatedNylonProperties(
  coatingThickness: number = 100, // nm
  nylonCoreDiameter: number = 0.2 // mm
): {
  youngsModulus: { min: number; max: number; estimated: number; unit: string };
  fractureStrain: { coating: number; nylonCore: number; critical: number; unit: string };
  conductivity: { min: number; max: number; estimated: number; unit: string };
} {
  // Young's modulus based on research: 60-72 GPa for thin films
  const youngsModulusMin = 60; // GPa
  const youngsModulusMax = 72; // GPa
  const youngsModulusEstimated = coatingThickness > 50 ?
    70 + (coatingThickness - 50) / 150 * 2 : // Thicker coating approaches bulk value
    60 + coatingThickness / 50 * 10; // Thinner coating has lower modulus
  
  // Fracture strain based on research estimates
  const coatingFractureStrain = 0.02; // 2% for thin silver coating (conservative)
  const nylonFractureStrain = 0.15; // 15% for nylon core
  const criticalFractureStrain = Math.min(coatingFractureStrain, nylonFractureStrain * 0.3); // Coating fails first
  
  // Conductivity based on coating thickness
  const conductivityMin = 1e6; // S/m for thin coating
  const conductivityMax = 6.3e7; // S/m for bulk silver
  const conductivityEstimated = conductivityMin + (coatingThickness / 200) * (conductivityMax - conductivityMin);
  
  return {
    youngsModulus: {
      min: youngsModulusMin,
      max: youngsModulusMax,
      estimated: youngsModulusEstimated,
      unit: 'GPa'
    },
    fractureStrain: {
      coating: coatingFractureStrain,
      nylonCore: nylonFractureStrain,
      critical: criticalFractureStrain,
      unit: 'strain'
    },
    conductivity: {
      min: conductivityMin,
      max: conductivityMax,
      estimated: conductivityEstimated,
      unit: 'S/m'
    }
  };
}

/**
 * Enhanced Boy's Surface lofting algorithm with flat-foldable decomposition
 * Attempts to create a crochet-friendly pattern from the mathematical surface
 * Based on research gap: missing algorithm for decomposition into flat-foldable lobes
 */
export function generateBoysSurfaceLoftingPattern(
  alpha: number = 2.0,
  rows: number = 6,
  baseStitches: number = 24,
  flatFoldable: boolean = false
): {
  success: boolean;
  pattern: PatternData | null;
  lobes: Array<{
    id: number;
    stitchCount: number;
    startRow: number;
    endRow: number;
    flatFoldable: boolean;
  }>;
  algorithmNotes: string;
} {
  // This is a placeholder implementation for the missing lofting algorithm
  // Based on research, we know Boy's Surface has 4 lobes but lack the decomposition algorithm
  
  const lobes = [
    { id: 1, stitchCount: Math.floor(baseStitches * 0.3), startRow: 1, endRow: rows, flatFoldable: false },
    { id: 2, stitchCount: Math.floor(baseStitches * 0.3), startRow: 1, endRow: rows, flatFoldable: false },
    { id: 3, stitchCount: Math.floor(baseStitches * 0.2), startRow: 2, endRow: rows - 1, flatFoldable: false },
    { id: 4, stitchCount: Math.floor(baseStitches * 0.2), startRow: 2, endRow: rows - 1, flatFoldable: false }
  ];
  
  // Generate a simple pattern for demonstration
  const curvature = -0.5; // Using hyperbolic curvature for expansion
  const pattern = generatePattern(curvature, baseStitches, rows);
  
  return {
    success: false, // Algorithm not fully implemented (research gap)
    pattern: flatFoldable ? null : pattern, // Can't generate flat-foldable pattern yet
    lobes,
    algorithmNotes: 'Missing decomposition algorithm for flat-foldable crochet lobes. Research required: computational topology papers, math art communities. Estimated effort: 4-8 weeks.'
  };
}

/**
 * Calculate stitch tension based on material properties and curvature
 * Uses silver-plated nylon physics research
 */
export function calculateStitchTension(
  curvature: number,
  stitchLength: number = 5, // mm
  materialProperties?: ReturnType<typeof calculateSilverPlatedNylonProperties>
): {
  tension: number; // 0-1 scale
  stress: number; // MPa
  safeMargin: number; // Factor of safety
  warning?: string;
} {
  const props = materialProperties || calculateSilverPlatedNylonProperties();
  
  // Basic tension calculation based on curvature
  const baseTension = Math.abs(curvature) * 0.7 + 0.3;
  
  // Adjust based on material properties
  const youngsModulusFactor = props.youngsModulus.estimated / 70; // Normalize to 70 GPa
  const fractureStrainFactor = props.fractureStrain.critical / 0.02; // Normalize to 2%
  
  const tension = Math.min(0.95, baseTension * youngsModulusFactor);
  const stress = tension * props.youngsModulus.estimated * 1000; // Convert GPa to MPa
  
  // Safety margin based on fracture strain
  const safeMargin = props.fractureStrain.critical / (tension * 0.1); // Assuming 10% strain at max tension
  
  let warning: string | undefined;
  if (safeMargin < 2.0) {
    warning = 'Low safety margin: consider reducing curvature or using thicker thread';
  } else if (tension > 0.8) {
    warning = 'High tension: risk of permanent deformation';
  }
  
  return {
    tension,
    stress,
    safeMargin,
    warning
  };
}

/**
 * Generate research report summarizing integration of research data
 */
export function generateResearchIntegrationReport(): {
  aariStatus: string;
  silverPhysicsStatus: string;
  boysSurfaceStatus: string;
  overallProgress: number;
  recommendations: string[];
} {
  // Simulating research integration status
  const aariStatus = 'PARTIAL - Estimated densities available, museum-grade data missing';
  const silverPhysicsStatus = 'PARTIAL - Bulk properties known, thin-film fracture strain unknown';
  const boysSurfaceStatus = 'EXAMPLE_FOUND - Parametrization implemented, lofting algorithm missing';
  
  const recommendations = [
    'Conduct micro-scale analysis of historical Mughal pieces for Aari stitch density',
    'Perform materials testing on silver-plated nylon threads for fracture strain',
    'Research computational topology algorithms for Boy\'s Surface decomposition',
    'Collaborate with museums and materials science laboratories'
  ];
  
  return {
    aariStatus,
    silverPhysicsStatus,
    boysSurfaceStatus,
    overallProgress: 45, // Estimated percentage of research integrated
    recommendations
  };
}