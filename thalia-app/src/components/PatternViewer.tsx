import React, { useRef, useEffect, useState } from 'react'
import { generateHyperbolicNodes, generatePattern, verifyCurvatureLogic } from '../lib/geometry'

const PatternViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [curvature, setCurvature] = useState<number>(-0.5)
  const [nodes, setNodes] = useState(generateHyperbolicNodes(-0.5, 24))
  const [verificationResults, setVerificationResults] = useState<{ [key: string]: boolean } | null>(null)

  useEffect(() => {
    const newNodes = generateHyperbolicNodes(curvature, 24)
    setNodes(newNodes)
    
    // Run verification on component mount
    if (!verificationResults) {
      setVerificationResults(verifyCurvatureLogic())
    }
  }, [curvature])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw pattern grid background
    drawGrid(ctx, canvas.width, canvas.height)
    
    // Draw hyperbolic nodes
    drawNodes(ctx, nodes)
    
    // Draw connecting lines between nodes
    drawConnections(ctx, nodes)
    
    // Draw curvature indicator
    drawCurvatureIndicator(ctx, curvature, canvas.width, canvas.height)
  }, [nodes, curvature])

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Dark slate background
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, width, height)
    
    // Grid lines
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1
    
    // Vertical lines
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  const drawNodes = (ctx: CanvasRenderingContext2D, nodes: any[]) => {
    nodes.forEach(node => {
      // Draw glow effect
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size + 3, 0, Math.PI * 2)
      ctx.fillStyle = `${node.color}40`
      ctx.fill()
      
      // Draw main node
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
      ctx.fillStyle = node.color
      ctx.fill()
      
      // Draw border
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 1.5
      ctx.stroke()
      
      // Draw inner highlight
      ctx.beginPath()
      ctx.arc(node.x - node.size * 0.3, node.y - node.size * 0.3, node.size * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff40'
      ctx.fill()
    })
  }

  const drawConnections = (ctx: CanvasRenderingContext2D, nodes: any[]) => {
    ctx.strokeStyle = '#05966980'
    ctx.lineWidth = 1
    
    // Connect each node to its neighbors
    for (let i = 0; i < nodes.length; i++) {
      const node1 = nodes[i]
      const node2 = nodes[(i + 1) % nodes.length]
      
      ctx.beginPath()
      ctx.moveTo(node1.x, node1.y)
      ctx.lineTo(node2.x, node2.y)
      ctx.stroke()
      
      // Draw additional hyperbolic connections for negative curvature
      if (curvature < 0) {
        const node3 = nodes[(i + Math.floor(nodes.length / 3)) % nodes.length]
        ctx.beginPath()
        ctx.moveTo(node1.x, node1.y)
        ctx.lineTo(node3.x, node3.y)
        ctx.strokeStyle = '#fbbf2460'
        ctx.stroke()
        ctx.strokeStyle = '#05966980'
      }
    }
  }

  const drawCurvatureIndicator = (
    ctx: CanvasRenderingContext2D,
    curvature: number,
    width: number,
    _height: number
  ) => {
    const centerX = width - 100
    const centerY = 100
    const radius = 40
    
    // Draw curvature gauge background
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = '#1e293b'
    ctx.fill()
    
    // Draw gauge
    const angle = Math.PI * 0.75 + (curvature * Math.PI * 0.5)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + Math.cos(angle) * radius * 0.8,
      centerY + Math.sin(angle) * radius * 0.8
    )
    ctx.strokeStyle = curvature < 0 ? '#fbbf24' : '#059669'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Draw labels
    ctx.fillStyle = '#cbd5e1'
    ctx.font = '12px JetBrains Mono'
    ctx.textAlign = 'center'
    ctx.fillText('K < 0', centerX - 30, centerY + 60)
    ctx.fillText('Hyperbolic', centerX - 30, centerY + 75)
    ctx.fillText('K > 0', centerX + 30, centerY + 60)
    ctx.fillText('Spherical', centerX + 30, centerY + 75)
  }

  const handleCurvatureChange = (value: number) => {
    setCurvature(value)
  }

  const pattern = generatePattern(curvature)

  return (
    <div className="min-h-screen bg-background-slate text-slate-100 p-4 md:p-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-serif text-accent-gold mb-4 text-glow">
            THALIA
          </h1>
          <h2 className="text-2xl md:text-3xl font-serif text-primary-emerald mb-2">
            Computational Crochet Engine
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Visualizing hyperbolic (K {'<'} 0) and spherical (K {'>'} 0) stitch patterns through geometric curvature mathematics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-accent-gold mb-4">Curvature Controls</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-slate-300">Curvature (K): {curvature.toFixed(2)}</label>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      curvature < 0 ? 'bg-yellow-900/30 text-accent-gold' :
                      curvature > 0 ? 'bg-emerald-900/30 text-primary-emerald' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {curvature < 0 ? 'Hyperbolic' : curvature > 0 ? 'Spherical' : 'Euclidean'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={curvature}
                    onChange={(e) => handleCurvatureChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>-1.0</span>
                    <span>0.0</span>
                    <span>+1.0</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-300 mb-2">Curvature Effects</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-accent-gold mr-2"></div>
                      <span>K {'<'} 0: Increase stitches (n:n+1)</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-emerald mr-2"></div>
                      <span>K {'>'} 0: Decrease stitches (n:n-1)</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-slate-500 mr-2"></div>
                      <span>K = 0: Maintain stitch count</span>
                    </li>
                  </ul>
                </div>

                {verificationResults && (
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <h4 className="font-medium text-slate-300 mb-3">Logic Verification</h4>
                    <div className="space-y-2">
                      {Object.entries(verificationResults).map(([test, passed]) => (
                        <div key={test} className="flex items-center justify-between">
                          <span className="text-sm text-slate-400 capitalize">
                            {test.replace(/_/g, ' ')}:
                          </span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            passed ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'
                          }`}>
                            {passed ? '✓ Passed' : '✗ Failed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-primary-emerald hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200">
                Generate Pattern
              </button>
              <button className="w-full bg-accent-gold hover:bg-yellow-700 text-slate-900 py-3 px-4 rounded-lg font-medium transition-colors duration-200">
                Export Visualization
              </button>
            </div>
          </div>

          {/* Main Canvas Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-primary-emerald">Stitch Graph Visualization</h3>
                <div className="text-sm text-slate-400">
                  {nodes.length} nodes • K = {curvature.toFixed(2)}
                </div>
              </div>

              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-[600px] rounded-xl border-2 border-slate-700"
                />
                
                {/* Canvas overlay info */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 max-w-xs">
                  <div className="text-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-accent-gold mr-2"></div>
                      <span className="text-slate-300">Hyperbolic Nodes (K {'<'} 0)</span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Each node represents a stitch. Negative curvature creates expanding patterns suitable for ruffles and corals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pattern Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm">Total Stitches</div>
                  <div className="text-2xl font-semibold text-primary-emerald">
                    {pattern.stitches.reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm">Pattern Rows</div>
                  <div className="text-2xl font-semibold text-accent-gold">{pattern.rows}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm">Curvature Type</div>
                  <div className="text-2xl font-semibold capitalize">{pattern.type}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm">Density</div>
                  <div className="text-2xl font-semibold">
                    {calculatePatternDensity(pattern).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Responsive Note */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Fully responsive design • Optimized for mobile viewing • Ready for Vercel deployment</p>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate pattern density
function calculatePatternDensity(pattern: any): number {
  const totalStitches = pattern.stitches.reduce((sum: number, count: number) => sum + count, 0)
  const maxPossible = pattern.rows * Math.max(...pattern.stitches)
  return totalStitches / maxPossible
}

export default PatternViewer