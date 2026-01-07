import React, { useRef, useEffect, useState, useCallback } from 'react'
import { generateHyperbolicNodes, generatePattern, verifyCurvatureLogic } from '../lib/geometry'
import { useTheme } from '../context/ThemeContext'
import CouncilSidebar from './CouncilSidebar'

const PatternViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [curvature, setCurvature] = useState<number>(-0.5)
  const [nodes, setNodes] = useState(generateHyperbolicNodes(-0.5, 24))
  const [verificationResults, setVerificationResults] = useState<{ [key: string]: boolean } | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null)
  const [isCouncilOpen, setIsCouncilOpen] = useState<boolean>(false)
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 })
  const [isMobileAccordionOpen, setIsMobileAccordionOpen] = useState<boolean>(false)
  
  const { theme, cycleEra } = useTheme()

  // Update canvas dimensions based on container size
  const updateCanvasDimensions = useCallback(() => {
    if (!containerRef.current) return
    
    const containerWidth = containerRef.current.clientWidth
    // Calculate responsive dimensions
    const width = Math.min(containerWidth - 32, 800) // Subtract padding
    const height = Math.min(width * 0.75, 600) // Maintain 4:3 aspect ratio
    
    setCanvasDimensions({ width, height })
  }, [])

  // Handle window resize
  useEffect(() => {
    updateCanvasDimensions()
    window.addEventListener('resize', updateCanvasDimensions)
    return () => window.removeEventListener('resize', updateCanvasDimensions)
  }, [updateCanvasDimensions])

  // Initial dimensions on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      updateCanvasDimensions()
    }, 100)
    return () => clearTimeout(timer)
  }, [updateCanvasDimensions])

  // Update canvas when sidebar opens/closes (container width changes)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateCanvasDimensions()
    }, 150) // Slight delay to allow DOM to update
    return () => clearTimeout(timer)
  }, [isCouncilOpen, updateCanvasDimensions])

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
    
    // Set canvas dimensions to match state
    canvas.width = canvasDimensions.width
    canvas.height = canvasDimensions.height
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw grid
    ctx.fillStyle = theme.colors.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.strokeStyle = theme.colors.border
    ctx.lineWidth = 1
    const gridSize = Math.max(20, Math.min(40, canvas.width / 20)) // Responsive grid spacing
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
    
    // Scale node positions to fit new canvas dimensions
    const scaleX = canvas.width / 800
    const scaleY = canvas.height / 600
    const scale = Math.min(scaleX, scaleY)
    
    // Draw connections
    ctx.strokeStyle = theme.colors.primary + '80'
    ctx.lineWidth = 1
    for (let i = 0; i < nodes.length; i++) {
      const node1 = nodes[i]
      const node2 = nodes[(i + 1) % nodes.length]
      ctx.beginPath()
      ctx.moveTo(node1.x * scaleX, node1.y * scaleY)
      ctx.lineTo(node2.x * scaleX, node2.y * scaleY)
      ctx.stroke()
    }
    
    // Draw nodes
    nodes.forEach((node, index) => {
      const scaledX = node.x * scaleX
      const scaledY = node.y * scaleY
      const scaledSize = node.size * scale
      
      ctx.beginPath()
      ctx.arc(scaledX, scaledY, scaledSize + 3, 0, Math.PI * 2)
      ctx.fillStyle = `${theme.colors.primary}40`
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
      ctx.fillStyle = curvature < 0 ? theme.colors.accent : theme.colors.primary
      ctx.fill()
      
      ctx.beginPath()
      ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
      ctx.strokeStyle = theme.colors.accent
      ctx.lineWidth = 1.5
      ctx.stroke()
      
      ctx.fillStyle = theme.colors.text
      ctx.font = `${Math.max(8, 10 * scale)}px ${theme.typography.monoFont}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(index.toString(), scaledX, scaledY)
    })
    
    // Draw selected node
    if (selectedNodeId !== null && nodes[selectedNodeId]) {
      const node = nodes[selectedNodeId]
      const scaledX = node.x * scaleX
      const scaledY = node.y * scaleY
      const scaledSize = node.size * scale
      
      ctx.beginPath()
      ctx.arc(scaledX, scaledY, scaledSize + 10, 0, Math.PI * 2)
      ctx.strokeStyle = theme.colors.accent
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
    }
    
    // Draw curvature indicator (responsive positioning)
    const centerX = canvas.width - 80 * scale
    const centerY = 80 * scale
    const radius = 30 * scale
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
    // Smaller font on mobile (canvas width < 640)
    const isMobileCanvas = canvas.width < 640
    const labelFontSize = isMobileCanvas ? Math.max(8, 10 * scale) : Math.max(10, 12 * scale)
    ctx.font = `${labelFontSize}px ${theme.typography.monoFont}`
    ctx.textAlign = 'center'
    // Adjust vertical spacing for mobile
    const verticalOffset = isMobileCanvas ? 35 * scale : 45 * scale
    const lineSpacing = isMobileCanvas ? 12 * scale : 15 * scale
    ctx.fillText('K < 0', centerX - 25 * scale, centerY + verticalOffset)
    ctx.fillText('Hyperbolic', centerX - 25 * scale, centerY + verticalOffset + lineSpacing)
    ctx.fillText('K > 0', centerX + 25 * scale, centerY + verticalOffset)
    ctx.fillText('Spherical', centerX + 25 * scale, centerY + verticalOffset + lineSpacing)
  }, [nodes, curvature, selectedNodeId, theme, canvasDimensions])

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

  const handleGeneratePattern = () => {
    // Generate new nodes with slight random variation
    const baseNodes = generateHyperbolicNodes(curvature, 24)
    const variedNodes = baseNodes.map(node => ({
      ...node,
      x: node.x + (Math.random() - 0.5) * 30,
      y: node.y + (Math.random() - 0.5) * 30,
    }))
    setNodes(variedNodes)
    // Optionally reset selected node
    setSelectedNodeId(null)
  }

  const handleExportVisualization = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Create a temporary link to download the canvas as PNG
    const link = document.createElement('a')
    link.download = `thalia-pattern-${curvature.toFixed(2)}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const pattern = generatePattern(curvature)

  return (
    <>
      <div className="min-h-screen px-4 py-6 md:px-8 md:py-12" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-glow" style={{ color: theme.colors.accent }}>
                THALIA
              </h1>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={cycleEra}
                  className="px-6 py-4 md:px-4 md:py-3 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 w-full md:w-auto min-h-[44px] flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
                >
                  {theme.name} Era
                </button>
                <button
                  onClick={() => setIsCouncilOpen(!isCouncilOpen)}
                  className="px-6 py-4 md:px-4 md:py-3 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 w-full md:w-auto min-h-[44px] flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.accent, color: theme.colors.background }}
                >
                  {isCouncilOpen ? 'Close Council' : 'Open Council'}
                </button>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-2" style={{ color: theme.colors.primary }}>
              Computational Crochet Engine
            </h2>
            <p className="max-w-2xl mx-auto text-sm md:text-base" style={{ color: theme.colors.textSecondary }}>
              Visualizing hyperbolic (K {'<'} 0) and spherical (K {'>'} 0) stitch patterns through geometric curvature mathematics
            </p>
            <div className="mt-4 text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: theme.colors.card }}>
                Era: {theme.name} • Click nodes for expert insights
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="hidden md:block md:col-span-2 lg:col-span-1 rounded-2xl p-4 md:p-6 border" style={{ backgroundColor: theme.colors.card + '80', borderColor: theme.colors.border }}>
              <div className="mb-8">
                <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: theme.colors.accent }}>Curvature Controls</h3>
                
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
                    <div className="relative py-2">
                      <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.01"
                        value={curvature}
                        onChange={(e) => handleCurvatureChange(parseFloat(e.target.value))}
                        className="w-full h-4 md:h-3 rounded-lg appearance-none cursor-pointer slider-thumb touch-manipulation"
                        style={{
                          backgroundColor: theme.colors.border,
                          accentColor: theme.colors.primary,
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          ...(theme.name === 'Future' && {
                            boxShadow: `0 0 15px ${theme.colors.accent}`,
                            border: `1px solid ${theme.colors.accent}`,
                          })
                        }}
                      />
                      <div className="absolute -top-1 left-0 right-0 h-8 md:h-6 pointer-events-none" /> {/* Touch target extension */}
                    </div>
                    <div className="flex justify-between text-xs md:text-sm mt-1 md:mt-2" style={{ color: theme.colors.textSecondary }}>
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
                      <h4 className="font-medium mb-3 text-base md:text-lg" style={{ color: theme.colors.text }}>Logic Verification</h4>
                      <div className="space-y-2">
                        {Object.entries(verificationResults).map(([test, passed]) => (
                          <div key={test} className="flex items-center justify-between">
                            <span className="text-xs md:text-sm capitalize" style={{ color: theme.colors.textSecondary }}>
                              {test.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-xs md:text-sm px-2 py-1 rounded" style={{
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
                <button
                  onClick={handleGeneratePattern}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
                  style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
                >
                  Generate Pattern
                </button>
                <button
                  onClick={handleExportVisualization}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
                  style={{ backgroundColor: theme.colors.accent, color: theme.colors.background }}
                >
                  Export Visualization
                </button>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-2">
              <div className="rounded-2xl p-4 md:p-6 border h-full" style={{ backgroundColor: theme.colors.card + '80', borderColor: theme.colors.border }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
                  <h3 className="text-base md:text-xl font-semibold" style={{ color: theme.colors.primary }}>Stitch Graph Visualization</h3>
                  <div className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>
                    {nodes.length} nodes • K = {curvature.toFixed(2)} • {selectedNodeId !== null ? `Node #${selectedNodeId} selected` : 'Click a node'}
                  </div>
                </div>

                {/* Mobile‑only slider and buttons */}
                <div className="block md:hidden mb-4">
                  <div className="rounded-lg p-3 border" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
                    <h4 className="font-medium mb-2" style={{ color: theme.colors.accent }}>Curvature Slider</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm" style={{ color: theme.colors.text }}>Curvature (K): {curvature.toFixed(2)}</label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{
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
                      <div className="relative py-1">
                        <input
                          type="range"
                          min="-1"
                          max="1"
                          step="0.01"
                          value={curvature}
                          onChange={(e) => handleCurvatureChange(parseFloat(e.target.value))}
                          className="w-full h-3 rounded-lg appearance-none cursor-pointer slider-thumb touch-manipulation"
                          style={{
                            backgroundColor: theme.colors.border,
                            accentColor: theme.colors.primary,
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            ...(theme.name === 'Future' && {
                              boxShadow: `0 0 15px ${theme.colors.accent}`,
                              border: `1px solid ${theme.colors.accent}`,
                            })
                          }}
                        />
                        <div className="absolute -top-1 left-0 right-0 h-6 pointer-events-none" />
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: theme.colors.textSecondary }}>
                        <span>-1.0</span>
                        <span>0.0</span>
                        <span>+1.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile accordion for Curvature Effects & Logic Verification */}
                <div className="block md:hidden mb-6">
                  <button
                    onClick={() => setIsMobileAccordionOpen(!isMobileAccordionOpen)}
                    className="w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-between"
                    style={{ backgroundColor: theme.colors.card, border: `1px solid ${theme.colors.border}`, color: theme.colors.text }}
                  >
                    <span>Curvature Effects & Logic Verification</span>
                    <span>{isMobileAccordionOpen ? '▲' : '▼'}</span>
                  </button>
                  {isMobileAccordionOpen && (
                    <div className="mt-3 space-y-3">
                      <div className="rounded-lg p-4 border" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}>
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
                          <h4 className="font-medium mb-3 text-base" style={{ color: theme.colors.text }}>Logic Verification</h4>
                          <div className="space-y-2">
                            {Object.entries(verificationResults).map(([test, passed]) => (
                              <div key={test} className="flex items-center justify-between">
                                <span className="text-xs capitalize" style={{ color: theme.colors.textSecondary }}>
                                  {test.replace(/_/g, ' ')}:
                                </span>
                                <span className="text-xs px-2 py-1 rounded" style={{
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
                  )}
                </div>

                <div className="relative min-h-[300px]" ref={containerRef}>
                  <canvas
                    ref={canvasRef}
                    width={canvasDimensions.width}
                    height={canvasDimensions.height}
                    onClick={handleCanvasClick}
                    className="w-full h-auto max-h-[500px] md:max-h-[600px] rounded-xl border-2 cursor-pointer transition-all hover:border-opacity-100"
                    style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}
                  />
                  
                  {/* Desktop‑only legend (absolute overlay) */}
                  <div className="hidden md:block absolute bottom-4 left-4 backdrop-blur-sm rounded-lg p-3 max-w-xs" style={{
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

                {/* Mobile‑only buttons row */}
                <div className="block md:hidden mt-6">
                  <div className="flex gap-3">
                    <button
                      onClick={handleGeneratePattern}
                      className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
                      style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
                    >
                      Generate Pattern
                    </button>
                    <button
                      onClick={handleExportVisualization}
                      className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
                      style={{ backgroundColor: theme.colors.accent, color: theme.colors.background }}
                    >
                      Export Visualization
                    </button>
                  </div>
                </div>

                {/* Mobile‑only legend (below canvas) */}
                <div className="block md:hidden mt-6">
                  <div className="rounded-lg p-4 border" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: theme.colors.accent }}></div>
                      <span className="text-sm" style={{ color: theme.colors.text }}>Hyperbolic Nodes (K {'<'} 0)</span>
                    </div>
                    <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                      Each node represents a stitch. Negative curvature creates expanding patterns suitable for ruffles and corals.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6">
                  <div className="rounded-lg p-3 md:p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>Total Stitches</div>
                    <div className="text-xl md:text-2xl font-semibold" style={{ color: theme.colors.primary }}>
                      {pattern.stitches.reduce((a, b) => a + b, 0)}
                    </div>
                  </div>
                  <div className="rounded-lg p-3 md:p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>Pattern Rows</div>
                    <div className="text-xl md:text-2xl font-semibold" style={{ color: theme.colors.accent }}>{pattern.rows}</div>
                  </div>
                  <div className="rounded-lg p-3 md:p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>Curvature Type</div>
                    <div className="text-xl md:text-2xl font-semibold capitalize text-sm md:text-base">{pattern.type}</div>
                  </div>
                  <div className="rounded-lg p-3 md:p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>Density</div>
                    <div className="text-xl md:text-2xl font-semibold">
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

          <div className="mt-6 md:mt-8 text-center text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>
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