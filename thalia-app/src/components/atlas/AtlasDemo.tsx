import React, { useState } from 'react'
import ThaliaGlobe from './ThaliaGlobe'
import VortexTransition from './VortexTransition'
import CouncilTooltip from './CouncilTooltip'
import MuseumMode from './MuseumMode'
import { useTheme } from '../../context/ThemeContext'

const AtlasDemo: React.FC = () => {
  const { theme, setEra } = useTheme()
  const [selectedMarker, setSelectedMarker] = useState<any>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showVortex, setShowVortex] = useState(false)
  const [vortexToEra, setVortexToEra] = useState<'ancient' | 'modern' | 'future'>('ancient')
  const [currentEra, setCurrentEra] = useState<'ancient' | 'modern' | 'future' | 'all'>('all')
  const [_isTraveling, setIsTraveling] = useState(false)
  const [travelText, setTravelText] = useState('')
  const [showMuseumMode, setShowMuseumMode] = useState(false)

  const handleMarkerClick = (marker: any) => {
    // Calculate position for tooltip (center of screen for demo)
    const x = window.innerWidth / 2
    const y = window.innerHeight / 3
    setTooltipPosition({ x, y })
    setSelectedMarker(marker)
    
    // Trigger cinematic vortex transition
    setVortexToEra(marker.era)
    setShowVortex(true)
    setIsTraveling(true)
    
    // Generate era-appropriate travel text
    const eraTexts: Record<string, string> = {
      ancient: `Traveling to ${getHistoricalPeriod(marker)} ${marker.name}...`,
      modern: `Connecting to contemporary ${marker.name} techniques...`,
      future: `Accessing algorithmic ${marker.name} protocols...`
    }
    
    const markerEra = marker.era as string
    setTravelText(eraTexts[markerEra] || `Exploring ${marker.name}...`)
    
    // After vortex animation completes, show museum mode
    setTimeout(() => {
      setShowVortex(false)
      setIsTraveling(false)
      setShowMuseumMode(true)
      console.log(`Entered ${marker.name} workbench at era: ${marker.era}`)
    }, 1800)
  }
  
  const getHistoricalPeriod = (marker: any) => {
    const periods: Record<string, string> = {
      'Irish Lace': '19th century',
      'Oya Lace': 'Ottoman Empire',
      'Amigurumi Core': '20th century',
      'Andean Textiles': 'Pre-Columbian',
      'African Basketry': 'Ancient',
      'Nordic Fair Isle': '19th century',
      'Cyber Crochet': '22nd century',
      'Biomimetic Structures': '23rd century'
    }
    return periods[marker.name] || 'historical'
  }

  const handleEraChange = (era: 'ancient' | 'modern' | 'future') => {
    setVortexToEra(era)
    setShowVortex(true)
    setIsTraveling(true)
    
    // Set era-appropriate travel text
    const eraTravelTexts = {
      ancient: 'Traveling to Ancient Era: Silk Road textures loading...',
      modern: 'Transitioning to Modern Era: Industrial patterns syncing...',
      future: 'Warping to Future Era: Holographic interfaces initializing...'
    }
    setTravelText(eraTravelTexts[era])
    
    // After vortex animation completes, change the era
    setTimeout(() => {
      setEra(era)
      setCurrentEra(era)
      setShowVortex(false)
      setIsTraveling(false)
    }, 1800)
  }

  const handleCloseTooltip = () => {
    setSelectedMarker(null)
  }

  const handleCloseMuseumMode = () => {
    setShowMuseumMode(false)
    setSelectedMarker(null)
  }

  return (
    <div className="relative w-full h-screen" style={{ backgroundColor: theme.colors.background }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>
                Thalia 3D World Atlas
              </h1>
              <p className="text-sm mt-2" style={{ color: theme.colors.textSecondary }}>
                Explore cultural crochet traditions across eras and geographies
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleEraChange('ancient')}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: currentEra === 'ancient' ? '#D97706' : theme.colors.card,
                  color: currentEra === 'ancient' ? theme.colors.background : theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <span>🏺</span>
                <span>Ancient Era</span>
              </button>
              
              <button
                onClick={() => handleEraChange('modern')}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: currentEra === 'modern' ? '#059669' : theme.colors.card,
                  color: currentEra === 'modern' ? theme.colors.background : theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <span>⚙️</span>
                <span>Modern Era</span>
              </button>
              
              <button
                onClick={() => handleEraChange('future')}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: currentEra === 'future' ? '#7C3AED' : theme.colors.card,
                  color: currentEra === 'future' ? theme.colors.background : theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <span>🚀</span>
                <span>Future Era</span>
              </button>
              
              <button
                onClick={() => setCurrentEra('all')}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: currentEra === 'all' ? theme.colors.primary : theme.colors.card,
                  color: currentEra === 'all' ? theme.colors.background : theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <span>🌍</span>
                <span>All Eras</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 h-full">
        <div className="h-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            {/* Globe Container */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border" style={{
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card
            }}>
              <ThaliaGlobe
                era={currentEra}
                onMarkerClick={handleMarkerClick}
                activeMarkerId={selectedMarker?.id}
                showTradeRoutes={true}
              />
            </div>

            {/* Side Panel */}
            <div className="rounded-2xl border p-6 overflow-y-auto" style={{
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card
            }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text }}>
                Cultural Atlas Guide
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                  <h3 className="font-semibold mb-2" style={{ color: theme.colors.accent }}>How to Navigate</h3>
                  <ul className="text-sm space-y-2" style={{ color: theme.colors.textSecondary }}>
                    <li className="flex items-start">
                      <div className="w-2 h-2 rounded-full mt-1.5 mr-3" style={{ backgroundColor: theme.colors.primary }} />
                      <span>Click on cultural markers to see expert insights</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 rounded-full mt-1.5 mr-3" style={{ backgroundColor: theme.colors.primary }} />
                      <span>Use era buttons to filter by historical period</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 rounded-full mt-1.5 mr-3" style={{ backgroundColor: theme.colors.primary }} />
                      <span>Hover over markers for quick previews</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 rounded-full mt-1.5 mr-3" style={{ backgroundColor: theme.colors.primary }} />
                      <span>Click "Generate Pattern" to create crochet instructions</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                  <h3 className="font-semibold mb-2" style={{ color: theme.colors.accent }}>Era Overview</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: '#D97706' }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: theme.colors.text }}>Ancient</div>
                        <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Traditional craft wisdom</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: '#059669' }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: theme.colors.text }}>Modern</div>
                        <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Contemporary techniques</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: '#7C3AED' }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: theme.colors.text }}>Future</div>
                        <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Algorithmic frontiers</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                  <h3 className="font-semibold mb-2" style={{ color: theme.colors.accent }}>Selected Marker</h3>
                  {selectedMarker ? (
                    <div>
                      <div className="flex items-center mb-3">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: selectedMarker.color }}
                        />
                        <div>
                          <div className="font-medium" style={{ color: theme.colors.text }}>{selectedMarker.name}</div>
                          <div className="text-xs" style={{ color: theme.colors.textSecondary }}>{selectedMarker.stitchType}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const x = window.innerWidth / 2
                          const y = window.innerHeight / 3
                          setTooltipPosition({ x, y })
                        }}
                        className="w-full py-2 text-sm rounded-lg font-medium"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.background
                        }}
                      >
                        Show Council Tooltip
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        Click on a marker to select it
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                  <h3 className="font-semibold mb-2" style={{ color: theme.colors.accent }}>Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowVortex(true)}
                      className="w-full py-2.5 text-sm rounded-lg font-medium flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: theme.colors.card,
                        color: theme.colors.text,
                        border: `1px solid ${theme.colors.border}`
                      }}
                    >
                      <span>🌀</span>
                      <span>Test Vortex Transition</span>
                    </button>
                    <button
                      onClick={() => {
                        // Reset view
                        setCurrentEra('all')
                        setSelectedMarker(null)
                      }}
                      className="w-full py-2.5 text-sm rounded-lg font-medium"
                      style={{
                        backgroundColor: theme.colors.card,
                        color: theme.colors.text,
                        border: `1px solid ${theme.colors.border}`
                      }}
                    >
                      Reset View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vortex Transition */}
      <VortexTransition
        isActive={showVortex}
        fromEra={currentEra === 'all' ? null : currentEra as any}
        toEra={vortexToEra}
        onComplete={() => setShowVortex(false)}
        travelText={travelText}
      />

      {/* Council Tooltip */}
      <CouncilTooltip
        marker={selectedMarker}
        position={tooltipPosition}
        onClose={handleCloseTooltip}
      />

      {/* Museum Mode */}
      <MuseumMode
        marker={selectedMarker}
        isActive={showMuseumMode}
        onClose={handleCloseMuseumMode}
      />

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs px-4 py-2 rounded-full" style={{
          backgroundColor: theme.colors.card + 'CC',
          backdropFilter: 'blur(8px)',
          color: theme.colors.textSecondary,
          border: `1px solid ${theme.colors.border}`
        }}>
          <span className="font-medium" style={{ color: theme.colors.text }}>Tip:</span> Click markers for Council insights • Use era buttons for time travel
        </div>
      </div>
    </div>
  )
}

export default AtlasDemo