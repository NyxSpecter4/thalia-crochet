import React, { useRef, useEffect, useState, useCallback } from 'react'
import { generateHyperbolicNodes, generatePattern } from '../lib/geometry'
import { useTheme, type ThemeConfig, type Era, themes } from '../context/ThemeContext'
import CouncilSidebar from './CouncilSidebar'
import PatternScript from './PatternScript'

interface PatternViewerProps {
  era?: Era
  themeOverride?: ThemeConfig
  compact?: boolean
}

const PatternViewer: React.FC<PatternViewerProps> = ({ era, themeOverride, compact = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [curvature, setCurvature] = useState<number>(-0.5)
  const [nodes, setNodes] = useState(generateHyperbolicNodes(-0.5, 12, 5))
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null)
  const [isCouncilOpen, setIsCouncilOpen] = useState<boolean>(false)
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 })
  const [showPatternScript, setShowPatternScript] = useState<boolean>(false)
  
  const contextTheme = useTheme()
  let theme: ThemeConfig
  if (themeOverride) {
    theme = themeOverride
  } else if (era) {
    theme = themes[era]
  } else {
    theme = contextTheme.theme
  }

  const updateCanvasDimensions = useCallback(() => {
    if (!containerRef.current) return
    const containerWidth = containerRef.current.clientWidth
    const width = Math.min(containerWidth - 32, 800)
    const height = Math.min(width * 0.75, 600)
    setCanvasDimensions({ width, height })
  }, [])

  useEffect(() => {
    updateCanvasDimensions()
    window.addEventListener('resize', updateCanvasDimensions)
    return () => window.removeEventListener('resize', updateCanvasDimensions)
  }, [updateCanvasDimensions])

  useEffect(() => {
    const newNodes = generateHyperbolicNodes(curvature, 12, 5)
    setNodes(newNodes)
  }, [curvature])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = canvasDimensions.width
    canvas.height = canvasDimensions.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw background
    ctx.fillStyle = theme.colors.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw nodes
    const scaleX = canvas.width / 800
    const scaleY = canvas.height / 600
    const scale = Math.min(scaleX, scaleY)
    
    nodes.forEach((node, index) => {
      const scaledX = node.x * scaleX
      const scaledY = node.y * scaleY
      const scaledSize = node.size * scale
      
      ctx.beginPath()
      ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
      ctx.fillStyle = curvature < 0 ? theme.colors.accent : theme.colors.primary
      ctx.fill()
      
      ctx.fillStyle = theme.colors.text
      ctx.font = `${Math.max(8, 10 * scale)}px ${theme.typography.monoFont}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(index.toString(), scaledX, scaledY)
    })
    
    // Draw curvature indicator
    const centerX = canvas.width - 80 * scale
    const centerY = 80 * scale
    ctx.fillStyle = theme.colors.textSecondary
    ctx.font = `${Math.max(10, 12 * scale)}px ${theme.typography.monoFont}`
    ctx.textAlign = 'center'
    ctx.fillText('K < 0', centerX - 25 * scale, centerY + 45 * scale)
    ctx.fillText('Hyperbolic', centerX - 25 * scale, centerY + 60 * scale)
    ctx.fillText('K > 0', centerX + 25 * scale, centerY + 45 * scale)
    ctx.fillText('Spherical', centerX + 25 * scale, centerY + 60 * scale)
  }, [nodes, curvature, theme, canvasDimensions])

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

  if (compact) {
    return (
      <div className="relative rounded-xl overflow-hidden border" style={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border
      }}>
        <div className="relative min-h-[200px]" ref={containerRef}>
          <canvas
            ref={canvasRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            onClick={handleCanvasClick}
            className="w-full h-auto rounded-xl"
            style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}
          />
        </div>
        <div className="p-3 border-t" style={{ borderColor: theme.colors.border }}>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs" style={{ color: theme.colors.text }}>Curvature (K): {curvature.toFixed(2)}</label>
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
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={curvature}
            onChange={(e) => handleCurvatureChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-thumb touch-manipulation"
            style={{
              backgroundColor: theme.colors.border,
              accentColor: theme.colors.primary,
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          />
        </div>
        <CouncilSidebar
          isOpen={isCouncilOpen}
          onClose={() => setIsCouncilOpen(false)}
          selectedNodeId={selectedNodeId}
          nodes={nodes}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-12" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-glow" style={{ color: theme.colors.accent }}>
            THALIA Pattern Viewer
          </h1>
          <p className="text-lg md:text-xl font-mono mt-4" style={{ color: theme.colors.textSecondary }}>
            Curvature: {curvature.toFixed(2)} | Nodes: {nodes.length} | Pattern Rows: {pattern.rows}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: theme.colors.border }}>
              <div className="relative min-h-[400px]" ref={containerRef}>
                <canvas
                  ref={canvasRef}
                  width={canvasDimensions.width}
                  height={canvasDimensions.height}
                  onClick={handleCanvasClick}
                  className="w-full h-auto"
                  style={{ backgroundColor: theme.colors.background }}
                />
              </div>
              <div className="p-4 border-t" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm mb-2" style={{ color: theme.colors.text }}>Curvature (K): {curvature.toFixed(2)}</label>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.01"
                      value={curvature}
                      onChange={(e) => handleCurvatureChange(parseFloat(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        backgroundColor: theme.colors.border,
                        accentColor: theme.colors.primary,
                      }}
                    />
                    <div className="flex justify-between text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                      <span>-1.0</span>
                      <span>0.0</span>
                      <span>+1.0</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCouncilOpen(true)}
                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.background,
                    }}
                  >
                    Consult Council
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-xl font-serif mb-4" style={{ color: theme.colors.accent }}>Pattern Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm" style={{ color: theme.colors.textSecondary }}>Curvature:</span>
                  <span className="ml-2 font-mono" style={{ color: theme.colors.text }}>{curvature.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-sm" style={{ color: theme.colors.textSecondary }}>Geometry:</span>
                  <span className="ml-2 font-mono" style={{ color: theme.colors.text }}>
                    {curvature < 0 ? 'Hyperbolic' : curvature > 0 ? 'Spherical' : 'Euclidean'}
                  </span>
                </div>
                <div>
                  <span className="text-sm" style={{ color: theme.colors.textSecondary }}>Total Stitches:</span>
                  <span className="ml-2 font-mono" style={{ color: theme.colors.text }}>
                    {pattern.stitches.reduce((a, b) => a + b, 0)}
                  </span>
                </div>
                <div>
                  <span className="text-sm" style={{ color: theme.colors.textSecondary }}>Rows:</span>
                  <span className="ml-2 font-mono" style={{ color: theme.colors.text }}>{pattern.rows}</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-xl font-serif mb-4" style={{ color: theme.colors.accent }}>Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const newNodes = generateHyperbolicNodes(curvature, 12, 5)
                    setNodes(newNodes)
                  }}
                  className="w-full px-4 py-2 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: theme.colors.primary + '20',
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  Regenerate Pattern
                </button>
                <button
                  onClick={() => {
                    const canvas = canvasRef.current
                    if (!canvas) return
                    const link = document.createElement('a')
                    link.download = `thalia-pattern-${curvature.toFixed(2)}.png`
                    link.href = canvas.toDataURL('image/png')
                    link.click()
                  }}
                  className="w-full px-4 py-2 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: theme.colors.primary + '20',
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  Export Visualization
                </button>
                <button
                  onClick={() => setShowPatternScript(true)}
                  className="w-full px-4 py-2 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: theme.colors.accent + '20',
                    color: theme.colors.accent,
                    border: `1px solid ${theme.colors.accent}`,
                  }}
                >
                  View Pattern Script
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CouncilSidebar
        isOpen={isCouncilOpen}
        onClose={() => setIsCouncilOpen(false)}
        selectedNodeId={selectedNodeId}
        nodes={nodes}
      />
      
      {showPatternScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PatternScript
              curvature={curvature}
              stylePreset="default"
            />
            <button
              onClick={() => setShowPatternScript(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatternViewer
