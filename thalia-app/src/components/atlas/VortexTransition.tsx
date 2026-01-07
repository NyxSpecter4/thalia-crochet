import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

interface VortexTransitionProps {
  isActive: boolean
  fromEra: 'ancient' | 'modern' | 'future' | null
  toEra: 'ancient' | 'modern' | 'future'
  onComplete?: () => void
  duration?: number
  travelText?: string
}

const VortexTransition: React.FC<VortexTransitionProps> = ({
  isActive,
  fromEra,
  toEra,
  onComplete,
  duration = 1200,
  travelText
}) => {
  const { theme } = useTheme()
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>([])
  const [progress, setProgress] = useState(0)

  // Era color mapping
  const eraColors = {
    ancient: '#D97706',
    modern: '#059669',
    future: '#7C3AED'
  }

  // Era icons
  const eraIcons = {
    ancient: '🏺',
    modern: '⚙️',
    future: '🚀'
  }

  // Era descriptions
  const eraDescriptions = {
    ancient: 'Traditional Craft Wisdom',
    modern: 'Contemporary Techniques',
    future: 'Algorithmic Frontiers'
  }

  useEffect(() => {
    if (isActive) {
      // Generate particles for vortex effect
      const newParticles = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5
      }))
      setParticles(newParticles)

      // Animate progress
      const startTime = Date.now()
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const newProgress = Math.min(elapsed / duration, 1)
        setProgress(newProgress)

        if (newProgress >= 1) {
          clearInterval(interval)
          if (onComplete) {
            setTimeout(onComplete, 300)
          }
        }
      }, 16)

      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [isActive, duration, onComplete])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Vortex Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${eraColors[toEra]}20 0%, transparent 70%)`
        }}
      />

      {/* Vortex Core */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            scale: [0.8, 1.2, 0.9, 1.1],
            rotate: [0, 180, 360, 540]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Inner Vortex */}
          <div className="relative w-64 h-64">
            {/* Spinning Rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: `${eraColors[toEra]}${ring === 1 ? '80' : ring === 2 ? '40' : '20'}`,
                  borderWidth: `${ring * 2}px`
                }}
                animate={{
                  rotate: ring % 2 === 0 ? [0, 360] : [360, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3 + ring,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}

            {/* Central Portal */}
            <motion.div
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${eraColors[toEra]} 0%, ${eraColors[toEra]}80 30%, transparent 70%)`,
                boxShadow: `0 0 60px ${eraColors[toEra]}`
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.9, 1, 0.9]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-4xl">{eraIcons[toEra]}</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: eraColors[toEra]
            }}
            animate={{
              x: [0, Math.sin(particle.id) * 100],
              y: [0, Math.cos(particle.id) * 100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: particle.speed * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Era Transition Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence>
          {fromEra && progress < 0.5 && (
            <motion.div
              key="from-era"
              className="text-center mb-8"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-2xl font-bold mb-2" style={{ color: eraColors[fromEra] }}>
                {eraIcons[fromEra]} {eraDescriptions[fromEra]}
              </div>
              <div className="text-sm opacity-75" style={{ color: theme.colors.textSecondary }}>
                Leaving {fromEra} era...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-4xl font-bold mb-4" style={{ color: eraColors[toEra] }}>
            {eraIcons[toEra]} Entering {toEra.toUpperCase()} Era
          </div>
          <div className="text-lg mb-6" style={{ color: theme.colors.textSecondary }}>
            {eraDescriptions[toEra]}
          </div>
          
          {/* Travel Text Display */}
          {travelText && (
            <motion.div
              className="text-sm mb-4 px-4 py-2 rounded-lg max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                backgroundColor: `${eraColors[toEra]}20`,
                border: `1px solid ${eraColors[toEra]}40`,
                color: theme.colors.text
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs">🌀</span>
                <span>{travelText}</span>
              </div>
            </motion.div>
          )}
          
          {/* Progress Bar */}
          <div className="w-64 h-2 rounded-full overflow-hidden mx-auto mb-4" style={{ backgroundColor: theme.colors.border }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: eraColors[toEra] }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
            {Math.round(progress * 100)}% • Warping spacetime...
          </div>
        </motion.div>

        {/* Mathematical Equations Floating */}
        <div className="absolute bottom-8 left-8 opacity-30">
          <div className="text-sm font-mono" style={{ color: theme.colors.textSecondary }}>
            ∇·F = ρ/ε₀
          </div>
        </div>
        <div className="absolute bottom-8 right-8 opacity-30">
          <div className="text-sm font-mono" style={{ color: theme.colors.textSecondary }}>
            e^(iπ) + 1 = 0
          </div>
        </div>
        <div className="absolute top-8 left-8 opacity-30">
          <div className="text-sm font-mono" style={{ color: theme.colors.textSecondary }}>
            K = -∇²φ
          </div>
        </div>
        <div className="absolute top-8 right-8 opacity-30">
          <div className="text-sm font-mono" style={{ color: theme.colors.textSecondary }}>
            ψ = Σ a_n e^(inx)
          </div>
        </div>
      </div>

      {/* Audio Visualization (simulated) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center gap-1">
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full"
            style={{ backgroundColor: eraColors[toEra] }}
            animate={{
              height: [10, Math.random() * 40 + 10, 10]
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              delay: i * 0.05
            }}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs opacity-50" style={{ color: theme.colors.textSecondary }}>
          Portal stabilizes in {Math.max(0, (1 - progress) * (duration / 1000)).toFixed(1)}s
        </div>
      </div>
    </div>
  )
}

export default VortexTransition