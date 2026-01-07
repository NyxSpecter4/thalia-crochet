import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { councilMembers, type CouncilMember } from '../../data/council'

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

interface MuseumModeProps {
  marker: CulturalMarker | null
  isActive: boolean
  onClose: () => void
}

const MuseumMode: React.FC<MuseumModeProps> = ({ marker, isActive, onClose }) => {
  const { theme } = useTheme()
  const [selectedMember, setSelectedMember] = useState<CouncilMember | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)

  // Get GPS-specific insights based on marker location
  const getGPSInsights = () => {
    if (!marker) return []
    
    const insights: Array<{member: CouncilMember, insight: string, culturalContext: string}> = []
    
    // Turkey (Oya Lace) - Ethno-Mathematician insight
    if (marker.id === 'oya_turkey') {
      const ethno = councilMembers.find(m => m.id === 'ethno-mathematician')
      if (ethno) {
        insights.push({
          member: ethno,
          insight: 'The Oya chili pepper motif you see here is not just decoration—it\'s a protective talisman. In Turkish folk symbology, the sharp points ward off the "evil eye," while the red color represents life force. Mathematically, the negative curvature (K = -0.4) creates exactly 7 points—the sacred number in Anatolian mysticism.',
          culturalContext: 'Anatolian Oya lace traditions, 18th-20th century'
        })
      }
    }
    
    // Irish Lace - Material Architect insight
    if (marker.id === 'irish_lace') {
      const material = councilMembers.find(m => m.id === 'material-architect')
      if (material) {
        insights.push({
          member: material,
          insight: 'During the Great Famine, Irish lacemakers used linen thread spun from flax grown in bog soil. The unique mineral content gave the thread a stiffness that holds hyperbolic form better than any modern cotton. At K = -0.3, this curvature would have maximized thread usage while creating maximum visual complexity—a survival strategy disguised as art.',
          culturalContext: '19th century Irish convent lace schools'
        })
      }
    }
    
    // Japanese Amigurumi - HX Strategist insight
    if (marker.id === 'japanese_amigurumi') {
      const hx = councilMembers.find(m => m.id === 'hx-strategist')
      if (hx) {
        insights.push({
          member: hx,
          insight: 'The spherical curvature (K = +0.5) of amigurumi triggers a specific neurochemical response: the "kawaii" (cute) effect. Research shows that perfect spheres with small stitch intervals increase oxytocin production by 28%. The 6-stitch increase pattern you see here is mathematically optimized for maximum dopamine release during creation.',
          culturalContext: 'Japanese kawaii culture and neuroaesthetics'
        })
      }
    }
    
    // Cyber Crochet - Heritage Futurist insight
    if (marker.id === 'cyber_crochet') {
      const futurist = councilMembers.find(m => m.id === 'heritage-futurist')
      if (futurist) {
        insights.push({
          member: futurist,
          insight: 'This algorithmic pattern represents the next evolution of craft: each node is a data point from the maker\'s biometrics. The hyperbolic surface (K = -0.8) could be rendered in conductive yarn to create a tactile interface for quantum computing. Imagine each stitch as a qubit in a textile-based quantum processor.',
          culturalContext: 'MIT Media Lab, Computational Craft Research Group 2030'
        })
      }
    }
    
    // Andean Textiles - Spatial Interactionist insight
    if (marker.id === 'andean_textiles') {
      const spatial = councilMembers.find(m => m.id === 'spatial-interactionist')
      if (spatial) {
        insights.push({
          member: spatial,
          insight: 'The diagonal stitch progression mirrors the Andean "ceque" system—lines radiating from Cusco that mapped both sacred geography and astronomical events. At this latitude (-13.5°), the curvature aligns with the December solstice sunrise. Each node represents a mountain shrine in the Inca cosmological textile.',
          culturalContext: 'Inca quipu and ceque system, 15th century'
        })
      }
    }
    
    // Add default insight if none found
    if (insights.length === 0) {
      const defaultMember = councilMembers[0]
      insights.push({
        member: defaultMember,
        insight: `Welcome to the ${marker.name} workbench. This cultural tradition represents a unique fusion of mathematical precision and artistic expression. The curvature K = ${marker.curvature} creates a ${marker.curvature > 0 ? 'spherical' : 'hyperbolic'} surface that has been used for generations to encode cultural knowledge.`,
        culturalContext: 'Global textile heritage'
      })
    }
    
    return insights
  }

  const insights = getGPSInsights()
  const eraColors = {
    ancient: '#D97706',
    modern: '#059669',
    future: '#7C3AED'
  }

  // Auto-close welcome message after 5 seconds
  useEffect(() => {
    if (showWelcome && isActive) {
      const timer = setTimeout(() => {
        setShowWelcome(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showWelcome, isActive])

  if (!isActive || !marker) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: theme.colors.background + 'CC' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="px-6 py-4 rounded-2xl shadow-2xl text-center max-w-2xl" style={{
              backgroundColor: theme.colors.card,
              border: `2px solid ${eraColors[marker.era]}`,
              backdropFilter: 'blur(12px)'
            }}>
              <div className="text-2xl mb-2" style={{ color: eraColors[marker.era] }}>
                🏛️ Museum Mode Activated
              </div>
              <div className="text-lg font-bold mb-2" style={{ color: theme.colors.text }}>
                Welcome to the {marker.name} Workbench
              </div>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                The Council of THALIA has prepared cultural insights for your exploration.
                Click on council members to hear their expert perspectives.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.border}`
        }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Header */}
        <div className="p-8 border-b" style={{ borderColor: theme.colors.border }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: marker.color + '20', color: marker.color }}
                >
                  {marker.era === 'ancient' ? '🏺' : marker.era === 'modern' ? '⚙️' : '🚀'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>
                    {marker.name} Cultural Workbench
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span 
                      className="text-sm px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: eraColors[marker.era] + '20',
                        color: eraColors[marker.era]
                      }}
                    >
                      {marker.era.charAt(0).toUpperCase() + marker.era.slice(1)} Era
                    </span>
                    <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      GPS: {marker.lat.toFixed(2)}°, {marker.lng.toFixed(2)}°
                    </span>
                    <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      Curvature: K = {marker.curvature}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-lg" style={{ color: theme.colors.text }}>
                {marker.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity text-2xl"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                border: `2px solid ${theme.colors.border}`
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.text }}>
              Council Insights for {marker.name}
            </h2>
            <p className="text-lg mb-6" style={{ color: theme.colors.textSecondary }}>
              The Council of THALIA provides expert analysis connecting mathematical patterns to cultural heritage.
              Select a council member to hear their specific insight about this location.
            </p>
          </div>

          {/* Council Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {insights.map((item, index) => (
              <motion.div
                key={item.member.id}
                className={`rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedMember?.id === item.member.id ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderLeft: `4px solid ${item.member.color}`,
                  boxShadow: selectedMember?.id === item.member.id ? `0 0 0 3px ${item.member.color}20` : 'none'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedMember(item.member)}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mr-4"
                    style={{ backgroundColor: item.member.color + '20', color: item.member.color }}
                  >
                    {item.member.icon}
                  </div>
                  <div>
                    <div className="font-bold text-lg" style={{ color: theme.colors.text }}>
                      {item.member.name}
                    </div>
                    <div className="text-sm" style={{ color: item.member.color }}>
                      {item.member.title}
                    </div>
                  </div>
                </div>
                <div className="text-sm mb-3" style={{ color: theme.colors.textSecondary }}>
                  {item.member.description}
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.member.expertise.slice(0, 3).map((exp, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: item.member.color + '15',
                        color: item.member.color
                      }}
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected Insight */}
          {selectedMember && (
            <motion.div
              className="rounded-2xl p-8 mb-8"
              style={{
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                borderTop: `4px solid ${selectedMember.color}`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-6"
                  style={{ backgroundColor: selectedMember.color + '20', color: selectedMember.color }}
                >
                  {selectedMember.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
                    {selectedMember.name}'s Insight
                  </h3>
                  <div className="text-lg" style={{ color: selectedMember.color }}>
                    {selectedMember.title}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-lg italic mb-4 p-4 rounded-xl" style={{
                  backgroundColor: selectedMember.color + '10',
                  color: theme.colors.text,
                  borderLeft: `4px solid ${selectedMember.color}`
                }}>
                  "{insights.find(i => i.member.id === selectedMember.id)?.insight}"
                </div>
                <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  <span className="font-medium">Cultural Context:</span>{' '}
                  {insights.find(i => i.member.id === selectedMember.id)?.culturalContext}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-lg mb-3" style={{ color: theme.colors.text }}>
                  Expert Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.card }}>
                    <div className="text-sm mb-2" style={{ color: theme.colors.textSecondary }}>Mathematical Significance</div>
                    <div className="text-lg font-medium" style={{ color: theme.colors.text }}>
                      Curvature K = {marker.curvature}
                    </div>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      {marker.curvature > 0 ? 'Spherical geometry' : 'Hyperbolic geometry'}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.card }}>
                    <div className="text-sm mb-2" style={{ color: theme.colors.textSecondary }}>Cultural Era</div>
                    <div className="text-lg font-medium" style={{ color: theme.colors.text }}>
                      {marker.era.charAt(0).toUpperCase() + marker.era.slice(1)} Period
                    </div>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      {marker.era === 'ancient' ? 'Traditional craft wisdom' : 
                       marker.era === 'modern' ? 'Contemporary techniques' : 
                       'Algorithmic frontiers'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    // Navigate to pattern generation
                    console.log(`Generate pattern for ${marker.name}`)
                  }}
                  className="px-6 py-3 rounded-lg font-medium"
                  style={{
                    backgroundColor: selectedMember.color,
                    color: theme.colors.background
                  }}
                >
                  Generate {marker.name} Pattern
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-6 py-3 rounded-lg font-medium"
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  View Other Insights
                </button>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t" style={{ borderColor: theme.colors.border }}>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
              Click on council members to explore their insights
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg font-medium"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                Return to Atlas
              </button>
              <button
                onClick={() => {
                  // Navigate to pattern workbench
                  console.log(`Enter ${marker.name} workbench`)
                }}
                className="px-6 py-3 rounded-lg font-medium"
                style={{
                  backgroundColor: eraColors[marker.era],
                  color: theme.colors.background
                }}
              >
                Enter Workbench
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MuseumMode