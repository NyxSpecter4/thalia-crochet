import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { councilMembers, sampleInsights, type CulturalInsight } from '../../data/council'

interface CulturalMarker {
  id: string
  name: string
  lat: number
  lng: number
  era: 'ancient' | 'modern' | 'future'
  description: string
  stitchType: string
  curvature: number
  color: string
  size: number
}

interface CouncilTooltipProps {
  marker: CulturalMarker | null
  position: { x: number; y: number }
  onClose: () => void
}

const CouncilTooltip: React.FC<CouncilTooltipProps> = ({ marker, position, onClose }) => {
  const { theme } = useTheme()
  const [insights, setInsights] = useState<CulturalInsight[]>([])
  const [activeTab, setActiveTab] = useState<'council' | 'technical' | 'cultural'>('council')

  useEffect(() => {
    if (marker) {
      // Filter insights that might be relevant to this marker
      // For now, we'll use a simple filter based on era and some matching logic
      const markerInsights = sampleInsights.filter(insight => 
        insight.era === marker.era || 
        insight.culturalReference.toLowerCase().includes(marker.name.toLowerCase().split(' ')[0])
      )
      setInsights(markerInsights)
    }
  }, [marker])

  if (!marker) return null

  // Get relevant council members for this marker's era
  const relevantMembers = councilMembers.filter(member => {
    // Check if member has insights for this marker
    const memberInsights = insights.filter(insight => insight.councilMemberId === member.id)
    return memberInsights.length > 0
  })

  // Get era color
  const eraColors = {
    ancient: '#D97706',
    modern: '#059669',
    future: '#7C3AED'
  }

  // Get cultural references based on marker
  const getCulturalReferences = () => {
    switch (marker.id) {
      case 'irish_lace':
        return ['Irish Famine relief work', '19th century convent lace schools', 'Filet crochet technique']
      case 'oya_turkey':
        return ['Turkish headscarf traditions', 'Anatolian folk symbolism', 'Needle lace heritage']
      case 'japanese_amigurumi':
        return ['Kawaii culture', 'Japanese kumihimo influences', 'Miniature craft traditions']
      case 'cyber_crochet':
        return ['Algorithmic art', 'Digital fabrication', 'Computational craft']
      default:
        return ['Traditional craft', 'Cultural heritage', 'Textile history']
    }
  }

  return (
    <motion.div
      className="fixed z-50 max-w-md"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)'
      }}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Tooltip Arrow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
        <div 
          className="w-4 h-4 rotate-45"
          style={{ backgroundColor: theme.colors.card }}
        />
      </div>

      {/* Tooltip Content */}
      <div 
        className="rounded-xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          maxHeight: '70vh',
          width: '380px'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: theme.colors.border }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: marker.color }}
                />
                <h3 className="font-bold text-lg" style={{ color: theme.colors.text }}>
                  {marker.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: eraColors[marker.era] + '20',
                    color: eraColors[marker.era]
                  }}
                >
                  {marker.era.charAt(0).toUpperCase() + marker.era.slice(1)} Era
                </span>
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.textSecondary
                  }}
                >
                  K = {marker.curvature}
                </span>
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.textSecondary
                  }}
                >
                  {marker.stitchType}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
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

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: theme.colors.border }}>
          {[
            { id: 'council', label: 'Council Insights', icon: '👥' },
            { id: 'technical', label: 'Technical Blueprint', icon: '⚙️' },
            { id: 'cultural', label: 'Cultural Context', icon: '🏺' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id ? '' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                color: activeTab === tab.id ? theme.colors.primary : theme.colors.textSecondary,
                borderBottom: activeTab === tab.id ? `2px solid ${theme.colors.primary}` : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: '50vh' }}>
          {activeTab === 'council' && (
            <div className="p-4">
              <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                {marker.description}
              </p>

              {/* Relevant Council Members */}
              <div className="mb-4">
                <h4 className="font-semibold mb-3 text-sm" style={{ color: theme.colors.accent }}>
                  Expert Council ({relevantMembers.length})
                </h4>
                {relevantMembers.length > 0 ? (
                  <div className="space-y-3">
                    {relevantMembers.map(member => {
                      const memberInsights = insights.filter(i => i.councilMemberId === member.id)
                      return (
                        <div
                          key={member.id}
                          className="p-3 rounded-lg cursor-pointer hover:scale-[1.02] transition-transform"
                          style={{
                            backgroundColor: theme.colors.background,
                            border: `1px solid ${theme.colors.border}`,
                            borderLeft: `3px solid ${member.color}`
                          }}
                        >
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-lg mr-3"
                              style={{ backgroundColor: member.color + '20', color: member.color }}
                            >
                              {member.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{member.name}</div>
                              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                                {member.title}
                              </div>
                            </div>
                            {memberInsights.length > 0 && (
                              <div className="text-xs px-2 py-1 rounded-full" style={{
                                backgroundColor: member.color + '20',
                                color: member.color
                              }}>
                                {memberInsights.length} insight{memberInsights.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                          
                          {memberInsights.length > 0 && (
                            <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.colors.border }}>
                              <div className="text-xs italic" style={{ color: theme.colors.textSecondary }}>
                                "{memberInsights[0].insight}"
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      No council insights available for this marker yet.
                    </div>
                    <div className="text-xs mt-2" style={{ color: theme.colors.textSecondary }}>
                      Try selecting a different cultural marker or era.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm" style={{ color: theme.colors.accent }}>
                  Stitch Pattern Blueprint
                </h4>
                <div className="p-3 rounded-lg" style={{
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Curvature Type</div>
                      <div className="text-sm font-medium" style={{ color: theme.colors.text }}>
                        {marker.curvature > 0 ? 'Spherical (K > 0)' : 'Hyperbolic (K < 0)'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Complexity</div>
                      <div className="text-sm font-medium" style={{ color: theme.colors.text }}>
                        {Math.abs(marker.curvature) < 0.2 ? 'Beginner' : 
                         Math.abs(marker.curvature) < 0.4 ? 'Intermediate' : 'Advanced'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs font-mono p-2 rounded" style={{
                    backgroundColor: theme.colors.card,
                    color: theme.colors.textSecondary
                  }}>
                    <div>// Pattern formula for {marker.name}</div>
                    <div>K = {marker.curvature}</div>
                    <div>Base stitches: {marker.curvature > 0 ? '6' : '8'}</div>
                    <div>Increase rate: {Math.abs(marker.curvature * 100).toFixed(0)}% per round</div>
                    <div>Hook size: {marker.curvature > 0 ? '2.5mm' : '0.75mm'}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm" style={{ color: theme.colors.accent }}>
                  Recommended Materials
                </h4>
                <div className="space-y-2">
                  {[
                    { material: 'Yarn Type', value: marker.era === 'ancient' ? 'Silk thread' : marker.era === 'modern' ? 'Cotton blend' : 'Glow-in-dark acrylic' },
                    { material: 'Hook Size', value: marker.curvature > 0 ? '2.5-3.5mm' : '0.75-1.5mm' },
                    { material: 'Tension', value: marker.curvature > 0 ? 'Medium' : 'Very tight' },
                    { material: 'Special Tools', value: marker.era === 'ancient' ? 'Beading needle' : marker.era === 'modern' ? 'Stitch markers' : 'LED fiber optics' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b" style={{ borderColor: theme.colors.border }}>
                      <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{item.material}</span>
                      <span className="text-sm font-medium" style={{ color: theme.colors.text }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: theme.colors.accent }}>
                  Pattern Generation
                </h4>
                <button
                  className="w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: marker.color,
                    color: theme.colors.background
                  }}
                >
                  Generate {marker.name} Pattern
                </button>
              </div>
            </div>
          )}

          {activeTab === 'cultural' && (
            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm" style={{ color: theme.colors.accent }}>
                  Historical & Cultural Context
                </h4>
                <p className="text-sm mb-3" style={{ color: theme.colors.text }}>
                  {marker.description}
                </p>
                
                <div className="p-3 rounded-lg" style={{
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`
                }}>
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg mr-3" style={{
                      backgroundColor: eraColors[marker.era] + '20',
                      color: eraColors[marker.era]
                    }}>
                      {marker.era === 'ancient' ? '🏺' : marker.era === 'modern' ? '⚙️' : '🚀'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{marker.era.charAt(0).toUpperCase() + marker.era.slice(1)} Era Significance</div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                        {marker.era === 'ancient' ? 'Traditional craft wisdom' : 
                         marker.era === 'modern' ? 'Contemporary techniques' : 
                         'Algorithmic frontiers'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm" style={{ color: theme.colors.accent }}>
                  Symbolic Meaning
                </h4>
                <div className="text-sm space-y-2" style={{ color: theme.colors.text }}>
                  {marker.id === 'irish_lace' && (
                    <>
                      <p>Irish lace emerged during the Great Famine as an economic survival strategy for women.</p>
                      <p>The negative space in filet crochet represents both scarcity and resilience.</p>
                      <p>Floral motifs symbolize hope and regrowth after devastation.</p>
                    </>
                  )}
                  {marker.id === 'oya_turkey' && (
                    <>
                      <p>Oya lace is traditionally worn by Turkish women as edging on headscarves.</p>
                      <p>Each motif carries specific meanings: chili peppers for protection, flowers for joy.</p>
                      <p>The intricate needlework demonstrates skill and social status.</p>
                    </>
                  )}
                  {marker.id === 'japanese_amigurumi' && (
                    <>
                      <p>Amigurumi combines kawaii (cute) culture with mathematical precision.</p>
                      <p>The spherical forms represent wholeness and connection.</p>
                      <p>Small scale requires extreme tension control and attention to detail.</p>
                    </>
                  )}
                  {marker.id === 'cyber_crochet' && (
                    <>
                      <p>Algorithmic crochet explores the intersection of craft and computation.</p>
                      <p>Hyperbolic surfaces model coral reefs and other natural phenomena.</p>
                      <p>This represents a fusion of traditional technique with digital fabrication.</p>
                    </>
                  )}
                  {!['irish_lace', 'oya_turkey', 'japanese_amigurumi', 'cyber_crochet'].includes(marker.id) && (
                    <p>This cultural tradition represents a unique blend of mathematical precision and artistic expression, bridging generations of craft knowledge.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: theme.colors.accent }}>
                  Cultural References
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {getCulturalReferences().map((ref, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: eraColors[marker.era] + '20',
                        color: eraColors[marker.era]
                      }}
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CouncilTooltip
