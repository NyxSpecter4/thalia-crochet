import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { generateHyperbolicNodes, generatePattern } from '../lib/geometry'
import { useTheme, type ThemeConfig, type Era, themes } from '../context/ThemeContext'
import CouncilSidebar from './CouncilSidebar'
import DesignForge from './DesignForge'
import ResearchPanel from './ResearchPanel'
import SilkFilter from './effects/SilkFilter'
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
  const [showPatternDetails, setShowPatternDetails] = useState<boolean>(false)
  const [showBoundary, setShowBoundary] = useState<boolean>(lockedBoundary)
  const [showDesignForge, setShowDesignForge] = useState<boolean>(false)
  const [showResearchPanel, setShowResearchPanel] = useState<boolean>(false)
  const [selectedTradition, setSelectedTradition] = useState<string>('Turkish Oya')
  const [activeExpertLens, setActiveExpertLens] = useState<string | null>(null)
  const [rotationAngle, setRotationAngle] = useState<number>(0)
  const [isTouching, setIsTouching] = useState<boolean>(false)
  const [touchStartX, setTouchStartX] = useState<number>(0)
  const [touchStartY, setTouchStartY] = useState<number>(0)
  
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
    const containerHeight = containerRef.current.clientHeight
    const width = Math.min(containerWidth, 800)
    const height = Math.min(containerHeight, 600)
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
    
    // Apply rotation transformation for touch rotation
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    ctx.translate(centerX, centerY)
    ctx.rotate(rotationAngle)
    ctx.translate(-centerX, -centerY)
    
    // Draw nodes with Fresnel effect (brighter at edges)
    const scaleX = canvas.width / 800
    const scaleY = canvas.height / 600
    
    // Apply expert lens shader overlays
    const applyExpertLens = (ctx: CanvasRenderingContext2D, node: any, scaledX: number, scaledY: number, scaledSize: number) => {
      const member = councilMembers.find(m => m.id === activeExpertLens)
      if (!member) return
      
      switch (member.id) {
        case 'ethno-mathematician':
          // Ethno-Mathematician: Red/Blue curvature heatmap
          const heatValue = Math.abs(curvature) * 255
          ctx.fillStyle = curvature < 0
            ? `rgba(255, ${255 - heatValue}, ${255 - heatValue}, 0.8)`
            : `rgba(${255 - heatValue}, ${255 - heatValue}, 255, 0.8)`
          break
          
        case 'material-architect':
          // Material Architect: Stress visualization with concentric rings
          const stress = Math.abs(curvature) * (1 + Math.abs(node.x - 400) / 400)
          ctx.fillStyle = `rgba(100, ${255 - stress * 100}, 100, 0.8)`
          
          // Draw stress rings
          ctx.beginPath()
          ctx.arc(scaledX, scaledY, scaledSize * 1.5, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(100, ${255 - stress * 100}, 100, 0.3)`
          ctx.lineWidth = 2
          ctx.stroke()
          break
          
        case 'heritage-futurist':
          // Heritage Futurist: Neon glow with trail effect
          ctx.fillStyle = `rgba(0, 245, 255, 0.9)`
          ctx.shadowBlur = 15
          ctx.shadowColor = '#00F5FF'
          break
          
        case 'hx-strategist':
          // HX Strategist: Flow state visualization with pulsing effect
          const pulse = (Date.now() / 1000) % 1
          const pulseSize = scaledSize * (0.8 + 0.4 * Math.sin(pulse * Math.PI * 2))
          ctx.fillStyle = `rgba(251, 191, 36, 0.9)`
          ctx.beginPath()
          ctx.arc(scaledX, scaledY, pulseSize, 0, Math.PI * 2)
          ctx.fill()
          return true // Skip default drawing
          
        default:
          // Default: Use theme-based colors
          const baseColor = curvature < 0 ? theme.colors.accent : theme.colors.primary
          ctx.fillStyle = baseColor + 'CC'
      }
      return false
    }
    
    nodes.forEach((node) => {
      const scaledX = node.x * scaleX
      const scaledY = node.y * scaleY
      const scaledSize = node.size * Math.min(scaleX, scaleY)
      
      // Calculate distance from center for Fresnel effect
      const dx = scaledX - centerX
      const dy = scaledY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = Math.min(canvas.width, canvas.height) / 2
      const edgeFactor = Math.max(0, 1 - distance / maxDistance)
      
      // Apply expert lens if active
      const skipDefault = activeExpertLens ? applyExpertLens(ctx, node, scaledX, scaledY, scaledSize) : false
      
      if (!skipDefault) {
        // Default Fresnel effect drawing
        const brightness = 0.7 + 0.3 * edgeFactor
        ctx.beginPath()
        ctx.arc(scaledX, scaledY, scaledSize, 0, Math.PI * 2)
        
        // Create gradient for silk-like appearance
        const gradient = ctx.createRadialGradient(
          scaledX, scaledY, 0,
          scaledX, scaledY, scaledSize * 2
        )
        
        if (currentEra === 'ancient') {
          gradient.addColorStop(0, `rgba(212, 175, 55, ${brightness})`)
          gradient.addColorStop(1, `rgba(166, 123, 91, ${brightness * 0.7})`)
        } else if (currentEra === 'modern') {
          gradient.addColorStop(0, `rgba(59, 130, 246, ${brightness})`)
          gradient.addColorStop(1, `rgba(30, 64, 175, ${brightness * 0.7})`)
        } else {
          gradient.addColorStop(0, `rgba(139, 92, 246, ${brightness})`)
          gradient.addColorStop(1, `rgba(109, 40, 217, ${brightness * 0.7})`)
        }
        
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Add subtle glow
        ctx.beginPath()
        ctx.arc(scaledX, scaledY, scaledSize * 1.2, 0, Math.PI * 2)
        ctx.strokeStyle = `${curvature < 0 ? theme.colors.accent : theme.colors.primary}40`
        ctx.lineWidth = 1
        ctx.stroke()
      }
      
      // Reset shadow if Heritage Futurist was active
      if (activeExpertLens === 'heritage-futurist') {
        ctx.shadowBlur = 0
        ctx.shadowColor = 'transparent'
      }
    })
    
    // Draw boundary if enabled
    if (showBoundary) {
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
  }, [nodes, curvature, theme, canvasDimensions, showBoundary, currentEra, activeExpertLens])

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
      const scaledX = node.x * (canvasDimensions.width / 800)
      const scaledY = node.y * (canvasDimensions.height / 600)
      const scaledSize = node.size * Math.min(canvasDimensions.width / 800, canvasDimensions.height / 600)
      const distance = Math.sqrt((x - scaledX) ** 2 + (y - scaledY) ** 2)
      if (distance <= scaledSize + 5) {
        setSelectedNodeId(i)
        setIsCouncilOpen(true)
        return
      }
    }
    setSelectedNodeId(null)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    if (event.touches.length === 1) {
      setIsTouching(true)
      setTouchStartX(event.touches[0].clientX)
      setTouchStartY(event.touches[0].clientY)
    }
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    if (!isTouching || event.touches.length !== 1) return
    
    const touchX = event.touches[0].clientX
    const touchY = event.touches[0].clientY
    
    // Calculate rotation based on horizontal movement
    const deltaX = touchX - touchStartX
    const deltaY = touchY - touchStartY
    
    // Use horizontal movement for rotation, vertical movement for slight zoom
    const newRotation = rotationAngle + deltaX * 0.01
    setRotationAngle(newRotation)
    
    // Update touch start for next movement
    setTouchStartX(touchX)
    setTouchStartY(touchY)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    setIsTouching(false)
  }

  const handleTouchCancel = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    setIsTouching(false)
  }

  const handleExpertSelect = (expertId: string) => {
    setActiveExpertLens(expertId)
  }

  const traditionOptions = [
    { id: 'turkish-oya', name: 'Turkish Oya', k: -0.2, alpha: 0.8, theme: 'ancient' as const, icon: '🌶️', material: 'Fine silk thread' },
    { id: 'irish-rose', name: 'Irish Rose', k: 0.2, alpha: 0.4, theme: 'modern' as const, icon: '🌹', material: 'Linen lace' },
    { id: 'andean-braid', name: 'Andean Braid', k: -0.5, alpha: 0.6, theme: 'ancient' as const, icon: '🧶', material: 'Alpaca wool' },
    { id: 'mughal-paisley', name: 'Mughal Paisley', k: 0.3, alpha: 0.8, theme: 'ancient' as const, icon: '🔥', material: 'Gold silk zari' },
    { id: 'roman-surface', name: 'Roman Surface', k: -0.7, alpha: 0.9, theme: 'ancient' as const, icon: '🏛️', material: 'Marble thread' },
    { id: 'boys-surface', name: 'Boy\'s Surface', k: -0.9, alpha: 1.0, theme: 'future' as const, icon: '🌀', material: 'Quantum fiber' },
    { id: 'japanese-sashiko', name: 'Japanese Sashiko', k: 0.1, alpha: 0.5, theme: 'modern' as const, icon: '🎌', material: 'Indigo cotton' },
    { id: 'navajo-weaving', name: 'Navajo Weaving', k: -0.3, alpha: 0.7, theme: 'ancient' as const, icon: '🪶', material: 'Sheep wool' },
  ]

  const handleTraditionSelect = (tradition: {
    id: string;
    name: string;
    k: number;
    alpha: number;
    theme: 'ancient' | 'modern' | 'future';
    icon: string;
    beakHeight?: number;
    meaning?: string;
  }) => {
    setCurvature(tradition.k)
    contextTheme.setEra(tradition.theme)
    setSelectedTradition(tradition.name)
    
    // Special handling for specific traditions
    if (tradition.id === 'turkish-oya') {
      setCurvature(-0.2) // Ensure exact value
    }
    if (tradition.id === 'seifert-surface') {
      setShowBoundary(true)
    } else {
      setShowBoundary(false)
    }
    
    console.log(`Selected tradition: ${tradition.name}, K=${tradition.k}, theme=${tradition.theme}`)
  }

  const pattern = generatePattern(curvature)
  const patternComplexity = pattern.stitches.reduce((sum, count) => sum + count, 0)

  if (compact) {
    return (
      <div className="relative rounded-xl overflow-hidden border" style={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border
      }}>
        <div
          className="relative min-h-[200px]"
          ref={containerRef}
          style={{ overscrollBehavior: 'contain' }}
        >
          <canvas
            ref={canvasRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            onClick={handleCanvasClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            className="w-full h-auto rounded-xl touch-manipulation"
            style={{
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background,
              cursor: isTouching ? 'grabbing' : 'grab'
            }}
          />
        </div>
        <div className="p-3 border-t" style={{ borderColor: theme.colors.border }}>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: theme.colors.text }}>Curvature (K): {curvature.toFixed(2)}</label>
              <span className="text-xs opacity-70" style={{ color: theme.colors.textSecondary }}>
                Touch & drag to rotate
              </span>
            </div>
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
              touchAction: 'pan-y' // Prevent interference with touch rotation
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

  // Main mobile-first layout - Master Studio Design
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <SilkFilter />
      
      {/* Top 60%: Pure Art Zone - Stitch Graph Visualization */}
      <div
        className="relative"
        style={{
          height: '60vh',
          overscrollBehavior: 'contain', // Prevent page bouncing
          touchAction: 'pan-y pinch-zoom' // Allow vertical scrolling but not horizontal
        }}
        ref={containerRef}
      >
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          onClick={handleCanvasClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          className="w-full h-full touch-manipulation"
          style={{
            backgroundColor: theme.colors.background,
            cursor: isTouching ? 'grabbing' : 'grab'
          }}
        />
        {/* Rotation hint for mobile */}
        <div className="absolute bottom-4 left-4 text-xs opacity-70" style={{ color: theme.colors.textSecondary }}>
          Touch & drag to rotate
        </div>
      </div>

      {/* Bottom 40%: Thumb-Zone Controls */}
      <div className="fixed bottom-0 left-0 right-0" style={{
        height: '40vh',
        backgroundColor: theme.colors.card,
        borderTop: `1px solid ${theme.colors.border}`,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* "Select Tradition" - Circular Icons Horizontal Scroll */}
        <div className="mb-6">
          <div className="text-xs font-medium mb-3 px-1" style={{ color: theme.colors.textSecondary }}>
            SELECT TRADITION
          </div>
          <div className="relative">
            {/* Tradition Picker - Circular Icons */}
            <div className="flex overflow-x-auto pb-2 pt-2 px-2 space-x-4 scrollbar-hide z-10" style={{ minHeight: '80px' }}>
              {traditionOptions.map((tradition) => (
                <button
                  key={tradition.id}
                  onClick={() => handleTraditionSelect(tradition)}
                  className="flex-shrink-0 flex flex-col items-center transition-all active:scale-95 hover:scale-110"
                  style={{
                    width: '70px',
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all mb-2"
                    style={{
                      backgroundColor: selectedTradition === tradition.name
                        ? `${theme.colors.primary}20`
                        : `${theme.colors.background}CC`,
                      borderColor: selectedTradition === tradition.name
                        ? theme.colors.primary
                        : `${theme.colors.border}80`,
                      backdropFilter: 'blur(10px)',
                      fontSize: '24px',
                    }}
                  >
                    {tradition.icon}
                  </div>
                  <span className="text-xs font-medium truncate w-full text-center" style={{ color: theme.colors.text }}>{tradition.name}</span>
                  <span className="text-xs mt-0.5" style={{ color: theme.colors.textSecondary }}>
                    K: {tradition.k.toFixed(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Slider - Wide and Easy to Touch */}
        <div className="mt-4 mb-6 px-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium" style={{ color: theme.colors.text }}>
              Curvature
            </label>
            <span className="text-sm font-mono" style={{ color: theme.colors.primary }}>
              {curvature.toFixed(2)}
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
            className="w-full h-3 appearance-none rounded-full slider-horizontal touch-manipulation"
            style={{
              backgroundColor: theme.colors.border,
              accentColor: theme.colors.primary,
              touchAction: 'none',
            }}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
            <span>Hyperbolic (-1)</span>
            <span>Flat (0)</span>
            <span>Spherical (+1)</span>
          </div>
        </div>

        {/* Professional FORGE FAB - Bottom Right */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={() => setShowDesignForge(true)}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
              color: '#FFFFFF',
              border: 'none'
            }}
          >
            <span className="text-sm font-semibold tracking-wide">FORGE</span>
          </button>
        </div>
      </div>


      {/* Design Forge Modal */}
      <DesignForge
        isOpen={showDesignForge}
        onClose={() => setShowDesignForge(false)}
        era={currentEra}
        motif={selectedTradition}
        curvature={curvature}
      />

      {/* Council Sidebar */}
      <CouncilSidebar
        isOpen={isCouncilOpen}
        onClose={() => setIsCouncilOpen(false)}
        selectedNodeId={selectedNodeId}
        nodes={nodes}
        onExpertSelect={handleExpertSelect}
      />

      {/* Research Panel */}
      <ResearchPanel
        isOpen={showResearchPanel}
        onClose={() => setShowResearchPanel(false)}
      />
    </div>
  );
}

export default PatternViewer;
