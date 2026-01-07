import React, { useRef, useEffect, useState } from 'react'
import { generateHyperbolicNodes, generatePattern, verifyCurvatureLogic } from '../lib/geometry'
import { useTheme } from '../context/ThemeContext'
import CouncilSidebar from './CouncilSidebar'

const PatternViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [curvature, setCurvature] = useState<number>(-0.5)
  const [nodes, setNodes] = useState(generateHyperbolicNodes(-0.5, 24))
  const [verificationResults, setVerificationResults] = useState<{ [key: string]: boolean } | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null)
  const [isCouncilOpen, setIsCouncilOpen] = useState<boolean>(false)
  
  const { theme, cycleEra } = useTheme()

  useEffect(() => {
    const newNodes = generateHyperbolicNodes(curvature, 24)
    setNodes(newNodes)
    
    if (!verificationResults) {
      setVerificationResults(verifyCurvatureLogic())
    }
  }, [curvature])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw grid
    ctx.fillStyle = theme.colors.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.strokeStyle = theme.colors.border
    ctx.lineWidth = 1
    for (let x = 0; x <= canvas.width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    
    // Draw connections
    ctx.strokeStyle = theme.colors.primary + '80'
    ctx.lineWidth = 1
    for (let i = 0; i < nodes.length; i++) {
      const node1 = nodes[i]
      const node2 = nodes[(i + 1) % nodes.length]
      ctx.beginPath()
      ctx.moveTo(node1.x, node1.y)
      ctx.lineTo(node2.x, node2.y)
      ctx.stroke()
    }
    
    // Draw nodes
    nodes.forEach((node, index) => {
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size + 3, 0, Math.PI * 2)
      ctx.fillStyle = `${theme.colors.primary}40`
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
      ctx.fillStyle = curvature < 0 ? theme.colors.accent : theme.colors.primary
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
      ctx.strokeStyle = theme.colors.accent
      ctx.lineWidth = 1.5
      ctx.stroke()
      
      ctx.fillStyle = theme.colors.text
      ctx.font = '10px ' + theme.typography.monoFont
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(index.toString(), node.x, node.y)
    })
    
    // Draw selected node
    if (selectedNodeId !== null && nodes[selectedNodeId]) {
      const node = nodes[selectedNodeId]
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.size + 10, 0, Math.PI * 2)
      ctx.strokeStyle = theme.colors.accent
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
    }
    
    // Draw curvature indicator
    const centerX = canvas.width - 100
    const centerY = 100
    const radius = 40
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = theme.colors.card
    ctx.fill()
    
    const angle = Math.PI * 0.75 + (curvature * Math.PI * 0.5)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + Math.cos(angle) * radius * 0.8, centerY + Math.sin(angle) * radius * 0.8)
    ctx.strokeStyle = curvature < 0 ? theme.colors.accent : theme.colors.primary
    ctx.lineWidth = 3
    ctx.stroke()
    
    ctx.fillStyle = theme.colors.textSecondary
    ctx.font = '12px ' + theme.typography.monoFont
    ctx.textAlign = 'center'
    ctx.fillText('K < 0', centerX - 30, centerY + 60)
    ctx.fillText('Hyperbolic', centerX - 30, centerY + 75)
    ctx.fillText('K > 0', centerX + 30, centerY + 60)
    ctx.fillText('Spherical', centerX + 30, centerY + 75)
  }, [nodes, curvature, selectedNodeId, theme])

  const handleCurvatureChange = (value: number) => {
    setCurvature(value)
    setSelectedNodeId(null)
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      if (distance <= node.size + 5) {
        setSelectedNodeId(i)
        setIsCouncilOpen(true)
        return
      }
    }
    
    setSelectedNodeId(null)
  }

  const pattern = generatePattern(curvature)

  return (
    <>
      <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-6xl font-serif text-glow" style={{ color: theme.colors.accent }}>
                THALIA
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={cycleEra}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
                >
                  {theme.name} Era
                </button>
                <button
                  onClick={() => setIsCouncilOpen(!isCouncilOpen)}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: theme.colors.accent, color: theme.colors.background }}
                >
                  {isCouncilOpen ? 'Close Council' : 'Open Council'}
                </button>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif mb-2" style={{ color: theme.colors.primary }}>
              Computational Crochet Engine
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: theme.colors.textSecondary }}>
              Visualizing hyperbolic (K {'<'} 0) and spherical (K {'>'} 0) stitch patterns through geometric curvature mathematics
            </p>
            <div className="mt-4 text-sm" style={{ color: theme.colors.textSecondary }}>
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: theme.colors.card }}>
                Era: {theme.name} • Click nodes for expert insights
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 rounded-2xl p-6 border" style={{ backgroundColor: theme.colors.card + '80', borderColor: theme.colors.border }}>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors.accent }}>Curvature Controls</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label style={{ color: theme.colors.text }}>Curvature (K): {curvature.toFixed(2)}</label>
                      <span className="text-sm px-3 py-1 rounded-full" style={{ 
                        backgroundColor: curvature < 0 ? theme.colors.accent + '20' : 
                                      curvature > 0 ? theme.colors.primary + '20' : 
                                      theme.colors.border,
                        color: curvature < 0 ? theme.colors.accent : 
                              curvature > 0 ? theme.colors.primary : 
                              theme.colors.textSecondary
                      }}>
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
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-thumb"
                      style={{ backgroundColor: theme.colors.border, accentColor: theme.colors.primary }}
                    />
                    <div className="flex justify-between text-sm mt-2" style={{ color: theme.colors.textSecondary }}>
                      <span>-1.0</span>
                      <span>0.0</span>
                      <span>+1.0</span>
                    </div>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.background }}>
                    <h4 className="font-medium mb-2" style={{ color: theme.colors.text }}>Curvature Effects</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: theme.colors.accent }}></div>
                        <span style={{ color: theme.colors.textSecondary }}>K {'<'} 0: Increase stitches (n:n+1)</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: theme.colors.primary }}></div>
                        <span style={{ color: theme.colors.textSecondary }}>K {'>'} 0: Decrease stitches (n:n-1)</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: theme.colors.border }}></div>
                        <span style={{ color: theme.colors.textSecondary }}>K = 0: Maintain stitch count</span>
                      </li>
                    </ul>
                  </div>

                  {verificationResults && (
                    <div className="rounded-lg p-4 border" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}>
                      <h4 className="font-medium mb-3" style={{ color: theme.colors.text }}>Logic Verification</h4>
                      <div className="space-y-2">
                        {Object.entries(verificationResults).map(([test, passed]) => (
                          <div key={test} className="flex items-center justify-between">
                            <span className="text-sm capitalize" style={{ color: theme.colors.textSecondary }}>
                              {test.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-sm px-2 py-1 rounded" style={{ 
                              backgroundColor: passed ? theme.colors.primary + '20' : '#ef444420',
                              color: passed ? theme.colors.primary : '#ef4444'
                            }}>
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
                <button className="w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
                  style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}>
                  Generate Pattern
                </button>
                <button className="w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
                  style={{ backgroundColor: theme.colors.accent, color: theme.colors.background }}>
                  Export Visualization
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl p-6 border h-full" style={{ backgroundColor: theme.colors.card + '80', borderColor: theme.colors.border }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold" style={{ color: theme.colors.primary }}>Stitch Graph Visualization</h3>
                  <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    {nodes.length} nodes • K = {curvature.toFixed(2)} • {selectedNodeId !== null ? `Node #${selectedNodeId} selected` : 'Click a node'}
                  </div>
                </div>

                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onClick={handleCanvasClick}
                    className="w-full h-auto max-h-[600px] rounded-xl border-2 cursor-pointer transition-all hover:border-opacity-100"
                    style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}
                  />
                  
                  <div className="absolute bottom-4 left-4 backdrop-blur-sm rounded-lg p-3 max-w-xs" style={{ 
                    backgroundColor: theme.colors.card + 'CC',
                    border: `1px solid ${theme.colors.border}`,
                    color: theme.colors.text
                  }}>
                    <div className="text-sm">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: theme.colors.accent }}></div>
                        <span>Hyperbolic Nodes (K {'<'} 0)</span>
                      </div>
                      <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                        Each node represents a stitch. Negative curvature creates expanding patterns suitable for ruffles and corals.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Total Stitches</div>
                    <div className="text-2xl font-semibold" style={{ color: theme.colors.primary }}>
                      {pattern.stitches.reduce((a, b) => a + b, 0)}
                    </div>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Pattern Rows</div>
                    <div className="text-2xl font-semibold" style={{ color: theme.colors.accent }}>{pattern.rows}</div>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Curvature Type</div>
                    <div className="text-2xl font-semibold capitalize">{pattern.type}</div>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Density</div>
                    <div className="text-2xl font-semibold">
                      {(() => {
                        const totalStitches = pattern.stitches.reduce((sum: number, count: number) => sum + count, 0)
                        const maxPossible = pattern.rows * Math.max(...pattern.stitches)
                        return (totalStitches / maxPossible).toFixed(2)
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm" style={{ color: theme.colors.textSecondary }}>
            <p>Fully responsive design • Optimized for mobile viewing • Ready for Vercel deployment</p>
          </div>
        </div>
      </div>

      <CouncilSidebar
        isOpen={isCouncilOpen}
        onClose={() => setIsCouncilOpen(false)}
        selectedNodeId={selectedNodeId}
      />
    </>
  )
}

export default PatternViewer