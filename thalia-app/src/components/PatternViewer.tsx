import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { generateHyperbolicNodes, generatePattern, generateEnneperNodes, generateRomanSurfaceNodes } from '../lib/geometry'
import { useTheme, type ThemeConfig, type Era, themes } from '../context/ThemeContext'
import CouncilSidebar from './CouncilSidebar'
import PatternScript from './PatternScript'
import DesignForge from './DesignForge'
import ResearchPanel from './ResearchPanel'
import { councilMembers } from '../data/council'

interface PatternViewerProps {
  era?: Era
  themeOverride?: ThemeConfig
  compact?: boolean
}

const PatternViewer: React.FC<PatternViewerProps> = ({ era, themeOverride, compact = false }) => {
  const location = useLocation()
  const challengeState = location.state as {
    challenge?: string
    curvature?: number
    boundaryRequired?: boolean
    locked?: boolean
    constraints?: {
      oneLiveStitch?: boolean
      twistTension?: number
    }
  } | undefined

  const lockedCurvature = challengeState?.curvature
  const lockedBoundary = challengeState?.boundaryRequired ?? false
  const isLocked = challengeState?.locked ?? false

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [curvature, setCurvature] = useState<number>(lockedCurvature ?? -0.5)
  const [nodes, setNodes] = useState(generateHyperbolicNodes(lockedCurvature ?? -0.5, 12, 5))
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null)
  const [isCouncilOpen, setIsCouncilOpen] = useState<boolean>(false)
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 })
  const [showPatternScript, setShowPatternScript] = useState<boolean>(false)
  const [showPatternDetails, setShowPatternDetails] = useState<boolean>(false)
  const [showBoundary, setShowBoundary] = useState<boolean>(lockedBoundary)
  const [showSelfIntersection, setShowSelfIntersection] = useState<boolean>(false)
  const [showRomanSurface, setShowRomanSurface] = useState<boolean>(false)
  const [showDesignForge, setShowDesignForge] = useState<boolean>(false)
  const [showResearchPanel, setShowResearchPanel] = useState<boolean>(false)
  const [selectedTradition, setSelectedTradition] = useState<string>('Chili')
  const [activeExpertLens, setActiveExpertLens] = useState<string | null>(null)
  const [regenerationSeed, setRegenerationSeed] = useState<number>(Date.now())
  const [guidedView, setGuidedView] = useState<boolean>(false)
  const [currentStitchIndex, setCurrentStitchIndex] = useState<number>(0)
  
  const contextTheme = useTheme()
  let theme: ThemeConfig
  if (themeOverride) {
    theme = themeOverride
  } else if (era) {
    theme = themes[era]
  } else {
    theme = contextTheme.theme
  }
  const currentEra = era || contextTheme.era

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
    let newNodes
    if (showRomanSurface) {
      newNodes = generateRomanSurfaceNodes(Math.abs(curvature), 12, 5)
    } else if (showSelfIntersection) {
      newNodes = generateEnneperNodes(Math.abs(curvature), 12, 5)
    } else {
      newNodes = generateHyperbolicNodes(curvature, 12, 5)
    }
    setNodes(newNodes)
  }, [curvature, showSelfIntersection, showRomanSurface, regenerationSeed])

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
    
    // Draw nodes - CLEAN VISUALIZATION WITHOUT NUMBERS
    const scaleX = canvas.width / 800
    const scaleY = canvas.height / 600
    const scale = Math.min(scaleX, scaleY)
    
    // Apply expert lens visual effects
    switch (activeExpertLens) {
      case 'material-architect':
        // Material Architect: Color based on stress (curvature)
        nodes.forEach((node) => {
          const scaledX = node.x * scaleX
          const scaledY = node.y * scaleY
          const scaledSize = node.size * scale
          
          // Calculate stress based on curvature and node position
          const stress = Math.abs(curvature) * (1 + Math.abs(node.x - 400) / 400)
          const red = Math.min(255, 100 + stress * 155)
          const green = Math.max(0, 255 - stress * 155)
          const blue = 100
          
          ctx.beginPath()
          ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
          ctx.fill()
        })
        break
        
      case 'differential-geometer':
        // Differential Geometer: Draw normal vectors
        nodes.forEach((node) => {
          const scaledX = node.x * scaleX
          const scaledY = node.y * scaleY
          const scaledSize = node.size * scale
          
          // Draw node
          ctx.beginPath()
          ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
          ctx.fillStyle = curvature < 0 ? theme.colors.accent : theme.colors.primary
          ctx.fill()
          
          // Draw normal vector (small line)
          const normalLength = 15
          const angle = Math.atan2(node.y - 300, node.x - 400) // Angle from center
          const endX = scaledX + Math.cos(angle) * normalLength
          const endY = scaledY + Math.sin(angle) * normalLength
          
          ctx.beginPath()
          ctx.moveTo(scaledX, scaledY)
          ctx.lineTo(endX, endY)
          ctx.strokeStyle = '#FF6B6B'
          ctx.lineWidth = 2
          ctx.stroke()
          
          // Draw arrowhead
          ctx.beginPath()
          ctx.arc(endX, endY, 3, 0, Math.PI * 2)
          ctx.fillStyle = '#FF6B6B'
          ctx.fill()
        })
        break
        
      case 'heritage-futurist':
        // Heritage Futurist: Neon trail connecting nodes
        // First draw nodes
        nodes.forEach((node) => {
          const scaledX = node.x * scaleX
          const scaledY = node.y * scaleY
          const scaledSize = node.size * scale
          
          ctx.beginPath()
          ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
          ctx.fillStyle = curvature < 0 ? theme.colors.accent : theme.colors.primary
          ctx.fill()
        })
        
        // Draw neon trail connecting nodes in sequence
        ctx.beginPath()
        nodes.forEach((node, index) => {
          const scaledX = node.x * scaleX
          const scaledY = node.y * scaleY
          
          if (index === 0) {
            ctx.moveTo(scaledX, scaledY)
          } else {
            ctx.lineTo(scaledX, scaledY)
          }
        })
        ctx.strokeStyle = '#00F5FF'
        ctx.lineWidth = 3
        ctx.shadowBlur = 15
        ctx.shadowColor = '#00F5FF'
        ctx.stroke()
        ctx.shadowBlur = 0 // Reset shadow
        break
        
      case 'ethno-mathematician':
        // Ethno-Mathematician: Motif glyphs instead of dots
        nodes.forEach((node) => {
          const scaledX = node.x * scaleX
          const scaledY = node.y * scaleY
          const scaledSize = node.size * scale
          
          // Draw chili shape for Ancient era, rose for Modern
          if (currentEra === 'ancient' || currentEra === 'modern') {
            // Draw chili pepper shape
            ctx.save()
            ctx.translate(scaledX, scaledY)
            ctx.rotate(Math.PI / 4)
            
            // Chili body
            ctx.beginPath()
            ctx.ellipse(0, 0, scaledSize, scaledSize * 1.5, 0, 0, Math.PI * 2)
            ctx.fillStyle = '#c53030'
            ctx.fill()
            
            // Chili stem
            ctx.beginPath()
            ctx.moveTo(0, -scaledSize * 1.5)
            ctx.lineTo(-scaledSize * 0.5, -scaledSize * 2)
            ctx.lineTo(scaledSize * 0.5, -scaledSize * 2)
            ctx.closePath()
            ctx.fillStyle = '#2d3748'
            ctx.fill()
            
            ctx.restore()
          } else {
            // Draw rose shape
            ctx.save()
            ctx.translate(scaledX, scaledY)
            
            // Rose petals
            for (let i = 0; i < 5; i++) {
              const angle = (i * Math.PI * 2) / 5
              ctx.beginPath()
              ctx.ellipse(
                Math.cos(angle) * scaledSize * 0.5,
                Math.sin(angle) * scaledSize * 0.5,
                scaledSize * 0.8,
                scaledSize * 0.6,
                angle,
                0,
                Math.PI * 2
              )
              ctx.fillStyle = '#e53e3e'
              ctx.fill()
            }
            
            // Rose center
            ctx.beginPath()
            ctx.arc(0, 0, scaledSize * 0.4, 0, Math.PI * 2)
            ctx.fillStyle = '#fbbf24'
            ctx.fill()
            
            ctx.restore()
          }
        })
        break
        
      default:
        // Default visualization with optional guided view
        if (guidedView && nodes.length > 0) {
          // Draw all nodes as semi-transparent background
          nodes.forEach((node, index) => {
            const scaledX = node.x * scaleX
            const scaledY = node.y * scaleY
            const scaledSize = node.size * scale
            
            ctx.beginPath()
            ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
            ctx.fillStyle = curvature < 0 ?
              `${theme.colors.accent}40` :
              `${theme.colors.primary}40`
            ctx.fill()
          })

          // Highlight current stitch in GLOW-CYAN
          if (currentStitchIndex < nodes.length) {
            const currentStitch = nodes[currentStitchIndex]
            const scaledX = currentStitch.x * scaleX
            const scaledY = currentStitch.y * scaleY
            const scaledSize = currentStitch.size * scale * 1.8
            
            // Create cyan glow effect with multiple layers
            for (let i = 3; i > 0; i--) {
              ctx.beginPath()
              ctx.arc(scaledX, scaledY, scaledSize + i * 2, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(0, 245, 255, ${0.1 * i})` // Cyan with decreasing opacity
              ctx.fill()
            }
            
            // Main cyan circle
            ctx.beginPath()
            ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
            ctx.fillStyle = '#00F5FF' // Bright cyan
            ctx.fill()
            
            // Inner white core for extra glow
            ctx.beginPath()
            ctx.arc(scaledX, scaledY, scaledSize * 0.6, 0, Math.PI * 2)
            ctx.fillStyle = '#FFFFFF'
            ctx.fill()
            
            // Pulsing animation effect
            const pulseSize = scaledSize * (1 + 0.1 * Math.sin(Date.now() / 500))
            ctx.beginPath()
            ctx.arc(scaledX, scaledY, pulseSize, 0, Math.PI * 2)
            ctx.strokeStyle = '#00F5FF'
            ctx.lineWidth = 2
            ctx.stroke()
          }

          // Highlight next stitch in CYAN-GHOST (semi-transparent)
          const nextStitchIndex = (currentStitchIndex + 1) % nodes.length
          if (nextStitchIndex < nodes.length) {
            const nextStitch = nodes[nextStitchIndex]
            const scaledX = nextStitch.x * scaleX
            const scaledY = nextStitch.y * scaleY
            const scaledSize = nextStitch.size * scale * 1.5
            
            // Ghost effect with transparency
            ctx.beginPath()
            ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(0, 245, 255, 0.3)' // Semi-transparent cyan
            ctx.fill()
            
            // Dashed outline for ghost effect
            ctx.beginPath()
            ctx.arc(scaledX, scaledY, scaledSize + 2, 0, Math.PI * 2)
            ctx.setLineDash([3, 3])
            ctx.strokeStyle = '#00F5FF'
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.setLineDash([])
          }

          // Draw prediction wireframe for next row
          ctx.beginPath()
          ctx.setLineDash([5, 5])
          ctx.strokeStyle = '#8B5CF660' // Semi-transparent purple
          ctx.lineWidth = 2
          
          // Connect nodes in a pattern to show next row
          const startIdx = Math.max(0, currentStitchIndex - 3)
          const endIdx = Math.min(nodes.length, currentStitchIndex + 4)
          
          for (let i = startIdx; i < endIdx; i++) {
            const node = nodes[i % nodes.length]
            const scaledX = node.x * scaleX
            const scaledY = node.y * scaleY
            
            if (i === startIdx) {
              ctx.moveTo(scaledX, scaledY)
            } else {
              ctx.lineTo(scaledX, scaledY)
            }
          }
          
          ctx.stroke()
          ctx.setLineDash([]) // Reset line dash
        } else {
          // Regular default visualization
          nodes.forEach((node) => {
            const scaledX = node.x * scaleX
            const scaledY = node.y * scaleY
            const scaledSize = node.size * scale
            
            ctx.beginPath()
            ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
            ctx.fillStyle = curvature < 0 ? theme.colors.accent : theme.colors.primary
            ctx.fill()
          })
        }
        break
    }
    
    // Draw trefoil knot boundary if toggled
    if (showBoundary) {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.3
      
      ctx.beginPath()
      const numPoints = 200
      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2
        const x = centerX + radius * (Math.sin(t) + 2 * Math.sin(2 * t))
        const y = centerY + radius * (Math.cos(t) - 2 * Math.cos(2 * t))
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.strokeStyle = '#4F46E5'
      ctx.lineWidth = 3
      ctx.stroke()
    }
  }, [nodes, curvature, theme, canvasDimensions, showBoundary, activeExpertLens, currentEra, guidedView, currentStitchIndex])

  const handleCurvatureChange = (value: number) => {
    if (isLocked) return
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

  const handleExpertSelect = (expertId: string) => {
    setActiveExpertLens(expertId)
  }

  const handleTraditionSelect = (tradition: {
    id: string;
    name: string;
    k: number;
    alpha: number;
    theme: 'ancient' | 'modern' | 'future';
  }) => {
    setCurvature(tradition.k)
    // Note: We would need to update alpha if we had that state
    // For now, we'll just update curvature and potentially theme
    console.log(`Selected tradition: ${tradition.name}, K=${tradition.k}, theme=${tradition.theme}`)
  }

  const handleRegenerate = () => {
    // Update the regeneration seed to trigger a new node generation
    setRegenerationSeed(Date.now())
    console.log('Regenerating pattern with new seed:', Date.now())
  }

  const handleNextStitch = () => {
    if (nodes.length === 0) return
    setCurrentStitchIndex((prev) => (prev + 1) % nodes.length)
  }

  const handlePrevStitch = () => {
    if (nodes.length === 0) return
    setCurrentStitchIndex((prev) => (prev - 1 + nodes.length) % nodes.length)
  }

  const handleToggleGuidedView = () => {
    setGuidedView(!guidedView)
    if (!guidedView) {
      setCurrentStitchIndex(0)
    }
  }

  const traditionOptions = [
    { id: 'turkish-oya', name: 'Turkish Oya', k: -0.3, alpha: 0.8, theme: 'ancient' as const, icon: '🌶️' },
    { id: 'andean-qurpus', name: 'Andean Q\'urpus', k: -0.5, alpha: 0.6, theme: 'ancient' as const, icon: '🧶' },
    { id: 'irish-lace', name: 'Irish Lace', k: 0.2, alpha: 0.4, theme: 'modern' as const, icon: '🍀' },
    { id: 'mughal-aari', name: 'Mughal Aari', k: 0.1, alpha: 0.7, theme: 'ancient' as const, icon: '🕌' },
    { id: 'sassanid', name: 'Sassanid', k: -0.7, alpha: 0.9, theme: 'ancient' as const, icon: '👑' },
    { id: 'seifert-surface', name: 'Seifert Surface', k: -0.9, alpha: 1.0, theme: 'future' as const, icon: '🌀' },
  ]

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
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: theme.colors.text }}>Curvature (K): {curvature.toFixed(2)}</label>
              {isLocked && (
                <span className="text-xs px-1 py-0.5 rounded-full flex items-center gap-0.5" style={{ backgroundColor: '#F59E0B20', color: '#F59E0B' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Locked
                </span>
              )}
            </div>
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
            disabled={isLocked}
            className={`w-full h-2 rounded-lg appearance-none slider-thumb touch-manipulation ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
          onExpertSelect={handleExpertSelect}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-4 md:px-8 md:py-12" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <div className="max-w-7xl mx-auto">
        {/* Mobile: Minimal header */}
        <div className="text-center mb-4 md:mb-12">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-serif text-glow" style={{ color: theme.colors.accent }}>
            THALIA Creative Studio
          </h1>
          <p className="text-xs md:text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
            Workspace‑First Design Environment
          </p>
        </div>
        
        {/* Grid‑Pulse effect for Future UI */}
        <style>{`
          @keyframes grid-pulse {
            0%, 100% {
              background-position: 0 0, 0 0;
              opacity: 0.05;
            }
            50% {
              background-position: 0 0, 20px 20px;
              opacity: 0.15;
            }
          }
          .grid-pulse-bg {
            background-image:
              radial-gradient(circle at 10px 10px, ${theme.colors.accent}20 1px, transparent 2px),
              radial-gradient(circle at 30px 30px, ${theme.colors.primary}20 1px, transparent 2px);
            background-size: 40px 40px, 40px 40px;
            animation: grid-pulse 4s ease-in-out infinite;
          }
        `}</style>

        {/* Cultural Tradition Picker - Highly Visible Horizontal Scroll Bar */}
        <div className="max-w-4xl mx-auto mb-4 md:mb-6">
          <div className="p-3 md:p-4 rounded-xl border" style={{
            borderColor: theme.colors.accent,
            backgroundColor: theme.colors.card,
            borderWidth: '2px'
          }}>
            <div className="mb-2 md:mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base md:text-lg font-serif" style={{ color: theme.colors.accent }}>Cultural Tradition Selection</h3>
                <span className="text-xs px-2 py-1 rounded-full" style={{
                  backgroundColor: theme.colors.accent + '20',
                  color: theme.colors.accent
                }}>
                  Tap to Select
                </span>
              </div>
              <p className="text-xs md:text-sm mb-3 md:mb-4" style={{ color: theme.colors.textSecondary }}>
                Each tradition sets specific curvature (K), alpha values, and visual theme
              </p>
              
              <div className="flex overflow-x-auto pb-3 space-x-2 md:space-x-3 scrollbar-hide">
                {traditionOptions.map((tradition) => (
                  <button
                    key={tradition.id}
                    onClick={() => handleTraditionSelect(tradition)}
                    className="flex-shrink-0 w-32 md:w-48 p-2 md:p-4 rounded-lg border-2 transition-all hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.accent,
                      minWidth: '8rem'
                    }}
                  >
                    <div className="flex items-center mb-1 md:mb-2">
                      <span className="text-xl md:text-2xl mr-2">{tradition.icon}</span>
                      <div className="text-left">
                        <div className="font-bold text-xs md:text-sm truncate" style={{ color: theme.colors.text }}>
                          {tradition.name}
                        </div>
                        <div className="text-xs truncate" style={{ color: theme.colors.textSecondary }}>
                          {tradition.theme.charAt(0).toUpperCase() + tradition.theme.slice(1)} Era
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs mt-1">
                      <div>
                        <span style={{ color: theme.colors.textSecondary }}>K:</span>
                        <div className="font-mono text-xs md:text-sm" style={{ color: theme.colors.text }}>
                          {tradition.k.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: theme.colors.textSecondary }}>Alpha:</span>
                        <div className="font-mono text-xs md:text-sm" style={{ color: theme.colors.text }}>
                          {tradition.alpha.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Active Expert Lens Indicator */}
              {activeExpertLens && (
                <div className="mt-3 p-2 md:p-3 rounded-lg border flex items-center justify-between" style={{
                  borderColor: theme.colors.accent,
                  backgroundColor: theme.colors.accent + '10'
                }}>
                  <div className="flex items-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3" style={{
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.background
                    }}>
                      👁️
                    </div>
                    <div>
                      <div className="font-bold text-xs md:text-sm" style={{ color: theme.colors.text }}>
                        Active Expert Lens: {councilMembers.find(m => m.id === activeExpertLens)?.title || 'Unknown'}
                      </div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                        Tap "Clear Lens" to return to default view
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveExpertLens(null)}
                    className="px-2 py-1 text-xs md:text-sm rounded-lg border"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }}
                  >
                    Clear Lens
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top 60%: 3D Stitch Graph - CLEAN VISUALIZATION (Mobile: 60%, Desktop: 50%) */}
        <div className="max-w-4xl mx-auto mb-4">
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: theme.colors.border }}>
            <div className={`relative min-h-[60vh] md:min-h-[400px] ${currentEra === 'future' ? 'grid-pulse-bg' : ''}`} ref={containerRef}>
              <canvas
                ref={canvasRef}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
                onClick={handleCanvasClick}
                className="w-full h-auto"
                style={{ backgroundColor: theme.colors.background }}
              />
            </div>
          </div>
        </div>

        {/* Middle 10%: Curvature Slider - Emerald track, Gold thumb */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="p-4 rounded-xl border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium" style={{ color: theme.colors.text }}>Curvature (K): {curvature.toFixed(2)}</label>
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
                disabled={isLocked}
                className={`w-full h-3 rounded-lg appearance-none touch-manipulation ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{
                  backgroundColor: '#10B981',
                  accentColor: '#F59E0B',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                <span>-1.0</span>
                <span>0.0</span>
                <span>+1.0</span>
              </div>
            </div>

            {/* Tradition Picker - Icon Row */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>Tradition</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'Chili', icon: '🌶️', label: 'Chili', curvature: -0.3 },
                  { id: 'Rose', icon: '🌹', label: 'Rose', curvature: 0.2 },
                  { id: 'Braid', icon: '🧶', label: 'Braid', curvature: 0.1 },
                  { id: 'Roman', icon: '🏛️', label: 'Roman', curvature: -0.7 },
                  { id: 'Boy', icon: '🌀', label: 'Boy\'s', curvature: -0.5 }
                ].map((tradition) => (
                  <button
                    key={tradition.id}
                    onClick={() => {
                      setSelectedTradition(tradition.id)
                      handleCurvatureChange(tradition.curvature)
                    }}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors border flex items-center gap-2 ${selectedTradition === tradition.id ? 'border-2' : ''}`}
                    style={{
                      backgroundColor: selectedTradition === tradition.id ? theme.colors.primary + '20' : theme.colors.background,
                      borderColor: selectedTradition === tradition.id ? theme.colors.primary : theme.colors.border,
                      color: theme.colors.text,
                    }}
                  >
                    <span className="text-lg">{tradition.icon}</span>
                    <span className="text-xs">{tradition.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
              <button
                onClick={() => setShowBoundary(!showBoundary)}
                className="px-3 py-2 text-sm rounded-lg font-medium transition-colors border"
                style={{
                  backgroundColor: showBoundary ? '#4F46E5' : 'transparent',
                  borderColor: '#4F46E5',
                  color: showBoundary ? '#FFFFFF' : '#4F46E5',
                }}
              >
                {showBoundary ? 'Hide Boundary' : 'Boundary'}
              </button>
              <button
                onClick={() => setShowSelfIntersection(!showSelfIntersection)}
                className="px-3 py-2 text-sm rounded-lg font-medium transition-colors border"
                style={{
                  backgroundColor: showSelfIntersection ? '#06B6D4' : 'transparent',
                  borderColor: '#06B6D4',
                  color: showSelfIntersection ? '#FFFFFF' : '#06B6D4',
                }}
              >
                {showSelfIntersection ? 'Hide Enneper' : 'Enneper'}
              </button>
              <button
                onClick={() => setShowRomanSurface(!showRomanSurface)}
                className="px-3 py-2 text-sm rounded-lg font-medium transition-colors border"
                style={{
                  backgroundColor: showRomanSurface ? '#8B5CF6' : 'transparent',
                  borderColor: '#8B5CF6',
                  color: showRomanSurface ? '#FFFFFF' : '#8B5CF6',
                }}
              >
                {showRomanSurface ? 'Hide Roman' : 'Roman'}
              </button>
              <button
                onClick={handleToggleGuidedView}
                className="px-3 py-2 text-sm rounded-lg font-medium transition-colors border flex items-center justify-center gap-1"
                style={{
                  backgroundColor: guidedView ? '#F59E0B' : 'transparent',
                  borderColor: '#F59E0B',
                  color: guidedView ? '#FFFFFF' : '#F59E0B',
                }}
              >
                <span>👻</span>
                <span className="hidden md:inline">{guidedView ? 'Hide Guide' : 'Guide'}</span>
              </button>
              <button
                onClick={() => setShowResearchPanel(true)}
                className="px-3 py-2 text-sm rounded-lg font-medium transition-colors border flex items-center justify-center gap-1"
                style={{
                  backgroundColor: '#8B5CF6',
                  borderColor: '#8B5CF6',
                  color: '#FFFFFF',
                }}
              >
                <span>🔬</span>
                <span className="hidden md:inline">Research</span>
              </button>
              <button
                onClick={handleRegenerate}
                className="px-3 py-2 text-sm rounded-lg font-medium transition-colors border-2 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#10B981',
                  borderColor: '#10B981',
                  color: '#FFFFFF',
                }}
              >
                <span>🔄</span>
                <span className="hidden md:inline">Regenerate</span>
                <span className="md:hidden">New</span>
              </button>
              <button
                onClick={() => setShowDesignForge(true)}
                className="px-3 py-3 md:px-3 md:py-2 text-sm rounded-lg font-medium transition-colors border-2 flex items-center justify-center gap-2 col-span-2 md:col-span-1"
                style={{
                  backgroundColor: '#F59E0B',
                  borderColor: '#F59E0B',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
                }}
              >
                <span className="text-lg md:text-base">✨</span>
                <span className="font-bold">Forge Masterpiece</span>
              </button>
            </div>

            {/* Guided View Controls */}
            {guidedView && (
              <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: '#F59E0B', backgroundColor: '#F59E0B10' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full mr-2 flex items-center justify-center" style={{ backgroundColor: '#F59E0B', color: 'white' }}>
                      👻
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#F59E0B' }}>Ghost Stitch Guide</div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                        Current: <span style={{ color: '#F59E0B' }}>Gold</span> • Next: <span style={{ color: '#10B981' }}>Emerald</span> • Wireframe: Next row prediction
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevStitch}
                      className="px-3 py-1 text-xs rounded-lg border flex items-center gap-1"
                      style={{
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      }}
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={handleNextStitch}
                      className="px-3 py-1 text-xs rounded-lg border flex items-center gap-1"
                      style={{
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
                <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                  Stitch {currentStitchIndex + 1} of {nodes.length} • Tap nodes to consult Council
                </div>
              </div>
            )}
            
            {/* Mobile-Only Prominent Forge Button */}
            <div className="mt-4 md:hidden">
              <button
                onClick={() => setShowDesignForge(true)}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-3"
                style={{
                  backgroundColor: '#F59E0B',
                  color: '#FFFFFF',
                  boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
                }}
              >
                <span className="text-2xl">✨</span>
                <div className="text-left">
                  <div className="text-lg font-bold">FORGE MASTERPIECE</div>
                  <div className="text-xs opacity-90">Tap to create with AI + Council</div>
                </div>
                <span className="text-2xl">🎨</span>
              </button>
              <p className="text-xs text-center mt-2" style={{ color: theme.colors.textSecondary }}>
                Generate museum-quality art with DALL-E 3 + DeepSeek Council
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-Only Fixed Bottom Nav with Cultural Traditions */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/90 to-transparent pt-8 pb-4 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
              {traditionOptions.slice(0, 4).map((tradition) => (
                <button
                  key={tradition.id}
                  onClick={() => handleTraditionSelect(tradition)}
                  className="flex-shrink-0 w-24 p-3 rounded-xl border-2 transition-all active:scale-95"
                  style={{
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.accent,
                    minWidth: '6rem'
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-2xl mb-1">{tradition.icon}</span>
                    <div className="text-center">
                      <div className="font-bold text-xs truncate" style={{ color: theme.colors.text }}>
                        {tradition.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: theme.colors.textSecondary }}>
                        K: {tradition.k.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setShowPatternDetails(true)}
                className="px-4 py-2 rounded-full flex items-center gap-2"
                style={{
                  backgroundColor: theme.colors.accent,
                  color: theme.colors.background,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium">Pattern Info</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pattern Info Modal */}
        {showPatternDetails && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50">
            <div className="relative w-full max-w-md md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden"
                 style={{
                   backgroundColor: theme.colors.card,
                   border: `1px solid ${theme.colors.border}`,
                   maxHeight: '80vh'
                 }}>
              <div className="p-4 border-b" style={{ borderColor: theme.colors.border }}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-serif" style={{ color: theme.colors.accent }}>Pattern Details</h3>
                  <button
                    onClick={() => setShowPatternDetails(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      border: `1px solid ${theme.colors.border}`
                    }}
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
                  Mathematical foundation and stitch details
                </p>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Curvature (K)</div>
                    <div className="font-mono text-xl font-bold mt-1" style={{ color: theme.colors.text }}>
                      {curvature.toFixed(3)}
                    </div>
                    <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                      {curvature < 0 ? 'Hyperbolic' : curvature > 0 ? 'Spherical' : 'Euclidean'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Surface Type</div>
                    <div className="font-mono text-lg font-bold mt-1" style={{ color: theme.colors.text }}>
                      {curvature < -0.3 ? 'Roman Surface' : curvature < 0 ? 'Enneper' : 'Spherical'}
                    </div>
                    <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                      Steiner parametric
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Total Stitches</div>
                    <div className="font-mono text-lg" style={{ color: theme.colors.text }}>
                      {pattern.stitches.reduce((a, b) => a + b, 0)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Rows</div>
                    <div className="font-mono text-lg" style={{ color: theme.colors.text }}>{pattern.rows}</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Active Tradition</div>
                    <div className="font-mono text-lg" style={{ color: theme.colors.text }}>{selectedTradition}</div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.colors.border }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: theme.colors.text }}>Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setShowPatternDetails(false)
                        setShowDesignForge(true)
                      }}
                      className="px-3 py-2 text-sm rounded-lg font-medium flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: '#F59E0B',
                        color: '#FFFFFF',
                      }}
                    >
                      <span>✨</span>
                      <span>Forge</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowPatternDetails(false)
                        setShowResearchPanel(true)
                      }}
                      className="px-3 py-2 text-sm rounded-lg font-medium flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: '#8B5CF6',
                        color: '#FFFFFF',
                      }}
                    >
                      <span>🔬</span>
                      <span>Research</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <CouncilSidebar
        isOpen={isCouncilOpen}
        onClose={() => setIsCouncilOpen(false)}
        selectedNodeId={selectedNodeId}
        nodes={nodes}
        onExpertSelect={handleExpertSelect}
      />
      
      {showDesignForge && (
        <DesignForge
          isOpen={showDesignForge}
          onClose={() => setShowDesignForge(false)}
          curvature={curvature}
          era={currentEra}
          motif={selectedTradition}
        />
      )}
      
      {showResearchPanel && (
        <ResearchPanel
          isOpen={showResearchPanel}
          onClose={() => setShowResearchPanel(false)}
        />
      )}
      
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
