import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { compilePattern } from '../lib/compiler';

interface PatternScoreProps {
  curvature: number;
  stylePreset: 'default' | 'irish_famine_rose' | 'hyper_realistic_botanical' | 'amigurumi_core' | 'oya_lace';
  baseStitches?: number;
  rows?: number;
  onStepChange?: (stepIndex: number) => void;
}

// Japanese symbols (Amizu) for crochet stitches
const AMIZU_SYMBOLS: Record<string, string> = {
  'sc': '●',      // single crochet - solid circle
  'dc': '▲',      // double crochet - triangle
  'hdc': '◐',     // half double crochet - half circle
  'ch': '─',      // chain - dash
  'sl st': '○',   // slip stitch - open circle
  'inc': '⇈',     // increase - double up arrow
  'dec': '⇊',     // decrease - double down arrow
  'rep': '↻',     // repeat - clockwise arrow
  'st': '・',      // stitch - middle dot
  'sp': '␣',      // space - open box
  'tog': '⏚',     // together - join symbol
  'blo': '◑',     // back loop only - right half circle
  'flo': '◒',     // front loop only - left half circle
  'yo': '↯',      // yarn over - lightning
  'pm': '📍',     // place marker - pin
  'join': '⚬',    // join - small circle
};

const PatternScore: React.FC<PatternScoreProps> = ({ 
  curvature, 
  stylePreset, 
  baseStitches = 12,
  rows = 5,
  onStepChange
}) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Compile the pattern
  const pattern = compilePattern({
    curvature,
    baseStitches,
    rows,
    stylePreset
  });
  
  // Convert pattern instructions to Amizu symbols
  const amizuInstructions = pattern.instructions.map((row) => {
    let instruction = row.instruction;
    
    // Replace common crochet terms with Amizu symbols
    Object.entries(AMIZU_SYMBOLS).forEach(([term, symbol]) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      instruction = instruction.replace(regex, symbol);
    });
    
    // Replace numbers with Japanese-style counters
    instruction = instruction.replace(/\b(\d+)\b/g, (match) => {
      const num = parseInt(match);
      const japaneseNumbers = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
      if (num <= 10) return japaneseNumbers[num];
      if (num <= 99) {
        const tens = Math.floor(num / 10);
        const ones = num % 10;
        return (tens > 1 ? japaneseNumbers[tens] : '') + '十' + (ones > 0 ? japaneseNumbers[ones] : '');
      }
      return match;
    });
    
    return {
      round: row.round,
      instruction: instruction,
      stitchCount: row.stitchCount,
      original: row.instruction
    };
  });
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < amizuInstructions.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
      
      // Scroll to the active step
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const stepElement = container.children[newStep] as HTMLElement;
        if (stepElement) {
          const scrollLeft = stepElement.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (stepElement.clientWidth / 2);
          container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
      
      // Scroll to the active step
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const stepElement = container.children[newStep] as HTMLElement;
        if (stepElement) {
          const scrollLeft = stepElement.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (stepElement.clientWidth / 2);
          container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  };
  
  // Auto-scroll to current step on mount
  useEffect(() => {
    if (scrollContainerRef.current && amizuInstructions.length > 0) {
      const container = scrollContainerRef.current;
      const stepElement = container.children[currentStep] as HTMLElement;
      if (stepElement) {
        const scrollLeft = stepElement.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (stepElement.clientWidth / 2);
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentStep, amizuInstructions.length]);
  
  return (
    <div className="rounded-xl border overflow-hidden" style={{ 
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border 
    }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ 
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border 
      }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold" style={{ color: theme.colors.accent }}>
              Amizu Pattern Score
            </h3>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              Horizontal scrolling score • Japanese notation • Step {currentStep + 1} of {amizuInstructions.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs px-3 py-1 rounded-full" style={{ 
              backgroundColor: curvature < 0 ? theme.colors.accent + '20' : theme.colors.primary + '20',
              color: curvature < 0 ? theme.colors.accent : theme.colors.primary
            }}>
              {curvature < 0 ? 'Hyperbolic' : curvature > 0 ? 'Spherical' : 'Euclidean'}
            </div>
            <div className="text-xs px-3 py-1 rounded-full" style={{ 
              backgroundColor: theme.colors.card,
              color: theme.colors.textSecondary,
              border: `1px solid ${theme.colors.border}`
            }}>
              K = {curvature.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Horizontal Scrolling Score */}
      <div className="p-4">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 space-x-3 scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {amizuInstructions.map((step, index) => (
            <div
              key={step.round}
              onClick={() => {
                setCurrentStep(index);
                onStepChange?.(index);
              }}
              className={`flex-shrink-0 w-48 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                index === currentStep ? 'scale-105' : 'hover:scale-102'
              }`}
              style={{
                backgroundColor: index === currentStep ? 
                  (curvature < 0 ? theme.colors.accent + '10' : theme.colors.primary + '10') : 
                  theme.colors.background,
                borderColor: index === currentStep ? 
                  (curvature < 0 ? theme.colors.accent : theme.colors.primary) : 
                  theme.colors.border,
                borderWidth: index === currentStep ? '3px' : '1px',
                minWidth: '12rem'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ 
                    backgroundColor: index === currentStep ? 
                      (curvature < 0 ? theme.colors.accent : theme.colors.primary) : 
                      theme.colors.card,
                    color: index === currentStep ? theme.colors.background : theme.colors.text
                  }}
                >
                  {step.round}
                </div>
                <div className="text-xs px-2 py-1 rounded" style={{ 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.textSecondary
                }}>
                  {step.stitchCount} st
                </div>
              </div>
              
              <div className="font-mono text-2xl text-center mb-3 leading-relaxed" style={{ 
                color: index === currentStep ? 
                  (curvature < 0 ? theme.colors.accent : theme.colors.primary) : 
                  theme.colors.text
              }}>
                {step.instruction}
              </div>
              
              <div className="text-xs text-center" style={{ color: theme.colors.textSecondary }}>
                Round {step.round}
              </div>
              
              {index === currentStep && (
                <div className="mt-3 pt-2 border-t" style={{ borderColor: theme.colors.border }}>
                  <div className="text-xs text-center" style={{ color: theme.colors.textSecondary }}>
                    <span className="inline-block w-2 h-2 rounded-full mr-1 animate-pulse" 
                      style={{ backgroundColor: curvature < 0 ? theme.colors.accent : theme.colors.primary }}
                    ></span>
                    Active Step
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <span>←</span>
              <span>Prev Chord</span>
            </button>
            
            <button
              onClick={handleNextStep}
              disabled={currentStep === amizuInstructions.length - 1}
              className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              <span>Next Chord</span>
              <span>→</span>
            </button>
          </div>
          
          <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
            <span className="font-bold" style={{ color: theme.colors.text }}>Chord {currentStep + 1}</span> of {amizuInstructions.length}
          </div>
        </div>
        
        {/* Amizu Legend */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.colors.border }}>
          <h4 className="text-sm font-semibold mb-3" style={{ color: theme.colors.text }}>
            Amizu Symbol Legend
          </h4>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {Object.entries(AMIZU_SYMBOLS).slice(0, 10).map(([term, symbol]) => (
              <div key={term} className="flex items-center p-2 rounded" style={{ backgroundColor: theme.colors.background }}>
                <div className="w-8 h-8 rounded flex items-center justify-center mr-2" style={{ 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.accent
                }}>
                  <span className="text-lg">{symbol}</span>
                </div>
                <div>
                  <div className="text-xs font-mono" style={{ color: theme.colors.text }}>{term}</div>
                  <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    {term === 'sc' ? 'single crochet' : 
                     term === 'dc' ? 'double crochet' :
                     term === 'hdc' ? 'half double' :
                     term === 'ch' ? 'chain' : term}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <button
              onClick={() => {
                // Show all symbols in a modal
                const symbolsList = Object.entries(AMIZU_SYMBOLS).map(([term, symbol]) => `${symbol} = ${term}`).join('\n');
                alert(`Amizu Symbols:\n\n${symbolsList}`);
              }}
              className="text-xs px-3 py-1 rounded"
              style={{
                backgroundColor: theme.colors.card,
                color: theme.colors.textSecondary,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              View All Symbols
            </button>
          </div>
        </div>
        
        {/* Flow State Indicator */}
        <div className="mt-4 p-3 rounded-lg" style={{ 
          backgroundColor: curvature < 0 ? theme.colors.accent + '10' : theme.colors.primary + '10',
          border: `1px solid ${curvature < 0 ? theme.colors.accent + '30' : theme.colors.primary + '30'}`
        }}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 animate-pulse"
              style={{ 
                backgroundColor: curvature < 0 ? theme.colors.accent : theme.colors.primary,
                color: theme.colors.background
              }}
            >
              ⚡
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: theme.colors.text }}>
                Flow State: {currentStep === 0 ? 'Beginning' : currentStep === amizuInstructions.length - 1 ? 'Finale' : 'In Progress'}
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                {currentStep === 0 ? 'Start your crochet journey' : 
                 currentStep === amizuInstructions.length - 1 ? 'Masterpiece complete!' :
                 'Follow the Amizu score as it scrolls'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternScore;