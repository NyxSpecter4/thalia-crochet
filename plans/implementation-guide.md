# Thalia Crochet - Implementation Guide

## Phase 1: Project Setup Commands

### 1. Create Vite React TypeScript Project
```bash
npm create vite@latest thalia-app -- --template react-ts
cd thalia-app
```

### 2. Install Core Dependencies
```bash
npm install @supabase/supabase-js lucide-react clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer @types/node
```

### 3. Initialize Tailwind CSS
```bash
npx tailwindcss init -p
```

### 4. Configure Tailwind (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          emerald: '#059669',
          DEFAULT: '#059669',
        },
        accent: {
          gold: '#fbbf24',
          DEFAULT: '#fbbf24',
        },
        background: {
          slate: '#0f172a',
          DEFAULT: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

### 5. Create Environment File (`.env`)
```env
VITE_SUPABASE_URL=https://thmtsyfkfjgwodrbjtmbt.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_qYeCHAUWecW-1O8YP3gSg_9IN3Q5Nr
```

## Phase 2: Core File Structure

### 1. Supabase Client (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 2. Geometry Utilities (`src/lib/geometry.ts`)
```typescript
export type CurvatureType = 'hyperbolic' | 'spherical' | 'euclidean'

export interface PatternData {
  stitches: number[]
  rows: number
  curvature: number
  type: CurvatureType
}

export function determineCurvatureType(curvature: number): CurvatureType {
  if (curvature < 0) return 'hyperbolic'
  if (curvature > 0) return 'spherical'
  return 'euclidean'
}

export function calculateStitchProgression(
  curvature: number,
  baseStitches: number,
  rows: number
): number[] {
  const progression: number[] = [baseStitches]
  const type = determineCurvatureType(curvature)
  
  for (let i = 1; i < rows; i++) {
    let nextStitches = baseStitches
    
    switch (type) {
      case 'hyperbolic':
        // K < 0: Increase stitches (n:n+1)
        nextStitches = baseStitches + Math.floor(Math.abs(curvature) * i)
        break
      case 'spherical':
        // K > 0: Decrease stitches (n:n-1)
        nextStitches = Math.max(1, baseStitches - Math.floor(curvature * i))
        break
      case 'euclidean':
        // K = 0: Maintain stitch count
        nextStitches = baseStitches
        break
    }
    
    progression.push(nextStitches)
  }
  
  return progression
}

export function generatePattern(
  curvature: number,
  baseStitches: number = 10,
  rows: number = 20
): PatternData {
  const stitches = calculateStitchProgression(curvature, baseStitches, rows)
  
  return {
    stitches,
    rows,
    curvature,
    type: determineCurvatureType(curvature)
  }
}
```

### 3. Theme Configuration (`src/lib/theme.ts`)
```typescript
export const theme = {
  colors: {
    primary: {
      emerald: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    accent: {
      gold: '#fbbf24',
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    background: {
      slate: '#0f172a',
      light: '#1e293b',
      dark: '#020617',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      muted: '#94a3b8',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  }
}
```

## Phase 3: Component Implementation

### 1. PatternViewer Component (`src/components/PatternViewer.tsx`)
```typescript
import React, { useRef, useEffect } from 'react'
import { PatternData } from '../lib/geometry'

interface PatternViewerProps {
  pattern: PatternData
  width?: number
  height?: number
}

export const PatternViewer: React.FC<PatternViewerProps> = ({
  pattern,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Draw pattern
    drawPattern(ctx, pattern, width, height)
  }, [pattern, width, height])
  
  const drawPattern = (
    ctx: CanvasRenderingContext2D,
    pattern: PatternData,
    width: number,
    height: number
  ) => {
    const { stitches, rows } = pattern
    const rowHeight = height / rows
    const maxStitches = Math.max(...stitches)
    
    // Draw grid background
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)
    
    // Draw stitches
    stitches.forEach((stitchCount, rowIndex) => {
      const y = rowIndex * rowHeight + rowHeight / 2
      const stitchWidth = width / maxStitches
      
      for (let i = 0; i < stitchCount; i++) {
        const x = i * stitchWidth + stitchWidth / 2
        
        // Color based on curvature
        let color = '#059669' // emerald default
        if (pattern.curvature < 0) color = '#fbbf24' // gold for hyperbolic
        if (pattern.curvature > 0) color = '#8b5cf6' // purple for spherical
        
        // Draw stitch point
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        
        // Draw connecting lines
        if (i > 0) {
          ctx.beginPath()
          ctx.moveTo(x - stitchWidth, y)
          ctx.lineTo(x, y)
          ctx.strokeStyle = color + '80' // 50% opacity
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    })
  }
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg border-2 border-slate-700"
    />
  )
}
```

### 2. Dashboard Component (`src/components/Dashboard.tsx`)
```typescript
import React, { useState } from 'react'
import { PatternViewer } from './PatternViewer'
import { generatePattern } from '../lib/geometry'
import { Sliders, Save, Download, Grid } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const [curvature, setCurvature] = useState<number>(0)
  const [baseStitches, setBaseStitches] = useState<number>(10)
  const [rows, setRows] = useState<number>(20)
  
  const pattern = generatePattern(curvature, baseStitches, rows)
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-400">Thalia Crochet Pattern Compiler</h1>
        <p className="text-slate-400">Visualize hyperbolic and spherical stitch patterns</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="w-5 h-5 text-gold-400" />
            <h2 className="text-xl font-semibold">Pattern Controls</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Curvature: {curvature.toFixed(2)}
                <span className="ml-2 text-xs text-slate-400">
                  {curvature < 0 ? 'Hyperbolic' : curvature > 0 ? 'Spherical' : 'Euclidean'}
                </span>
              </label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={curvature}
                onChange={(e) => setCurvature(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>-1 (Hyperbolic)</span>
                <span>0 (Euclidean)</span>
                <span>+1 (Spherical)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Base Stitches: {baseStitches}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={baseStitches}
                onChange={(e) => setBaseStitches(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rows: {rows}
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                Save Pattern
              </button>
              <button className="flex items-center justify-center gap-2 bg-gold-600 hover:bg-gold-700 text-white py-2 px-4 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Pattern Visualization */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Grid className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-semibold">Pattern Visualization</h2>
            </div>
            <div className="text-sm text-slate-400">
              {pattern.stitches.length} rows, {pattern.stitches[pattern.stitches.length - 1]} stitches
            </div>
          </div>
          
          <PatternViewer pattern={pattern} />
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="text-slate-400">Curvature Type</div>
              <div className="text-lg font-semibold capitalize">{pattern.type}</div>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="text-slate-400">Total Stitches</div>
              <div className="text-lg font-semibold">
                {pattern.stitches.reduce((a, b) => a + b, 0)}
              </div>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="text-slate-400">Pattern Density</div>
              <div className="text-lg font-semibold">
                {(pattern.stitches.reduce((a, b) => a + b, 0) / (pattern.rows * pattern.stitches[0])).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Phase 4: App Integration

### 1. Update `src/App.tsx`
```typescript
import React from 'react'
import { Dashboard } from './components/Dashboard'
import './App.css'

function App() {
  return <Dashboard />
}

export default App
```

### 2. Update `src/index.css` for Tailwind
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-900 text-slate-100;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## Testing Commands

### 1. Start Development Server
```bash
npm run dev
```

### 2. Build for Production
```bash
npm run build
```

### 3. Preview Production Build
```bash
npm run preview
```

## Verification Checklist

- [ ] Vite dev server starts successfully
- [ ] Tailwind CSS is properly configured and styles apply
- [ ] Canvas renders pattern visualization
- [ ] Curvature slider updates pattern in real-time
- [ ] Supabase client can connect (check browser console)
- [ ] Pattern data structure matches expected format
- [ ] Hyperbolic curvature increases stitches
- [ ] Spherical curvature decreases stitches
- [ ] Euclidean curvature maintains stitch count

## Next Steps After Implementation

1. **Add Supabase Integration**: Implement pattern saving/loading
2. **Add User Authentication**: Implement Supabase auth
3. **Enhance Canvas Features**: Add zoom, pan, and stitch details
4. **Add Pattern Library**: Grid view of saved patterns
5. **Implement Export**: PDF and image export functionality
6. **Add Collaboration**: Real-time pattern sharing
7. **Mobile Optimization**: Responsive design improvements
8. **Performance Testing**: Optimize canvas rendering for large patterns

---

*Implementation Guide v1.0 - Ready for Development*