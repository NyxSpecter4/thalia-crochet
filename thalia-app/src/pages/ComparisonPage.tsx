import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import CouncilSidebar from '../components/CouncilSidebar';
import PatternViewer from '../components/PatternViewer';
import { useResearchData } from '../hooks/useResearchData';
import { extractMeaning, extractTechnicalRecipe, saveSelectedEra } from '../services/researchService';

const ComparisonPage: React.FC = () => {
  const { theme: currentTheme, setEra } = useTheme();
  const [selectedNodeId] = useState<number | null>(null);
  const [isCouncilOpen, setIsCouncilOpen] = useState<boolean>(false);
  const { ancient, modern, future } = useResearchData();
  const [votes, setVotes] = useState<{ [era: string]: number }>(() => {
    // Load votes from localStorage on initial render
    const saved = localStorage.getItem('thalia_era_votes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved votes', e);
      }
    }
    return {
      ancient: 0,
      modern: 0,
      future: 0,
    };
  });

  const handleVote = (era: 'ancient' | 'modern' | 'future') => {
    setVotes(prev => {
      const newVotes = {
        ...prev,
        [era]: prev[era] + 1,
      };
      // Save to localStorage
      localStorage.setItem('thalia_era_votes', JSON.stringify(newVotes));
      return newVotes;
    });
    // In a real app, you would send this to a backend
    alert(`Voted for ${era} era! Thank you for your feedback.`);
  };

  const handleMasteryChallenge = async (era: 'ancient' | 'modern' | 'future') => {
    try {
      const { success, error } = await saveSelectedEra(era);
      if (success) {
        alert(`Mastery Challenge accepted! You've selected the ${era} era as your focus. Saved to your profile.`);
      } else {
        // If user is not authenticated, we still show a success message but note it's local.
        if (error?.includes('not authenticated')) {
          alert(`Mastery Challenge accepted! You've selected the ${era} era as your focus. (Sign in to save to your profile.)`);
        } else {
          alert(`Mastery Challenge accepted! (Could not save to profile: ${error})`);
        }
      }
    } catch (error) {
      console.error('Failed to save mastery challenge:', error);
      alert('Could not save mastery challenge. Please try again.');
    }
  };

  interface CardData {
    title: string;
    description: string;
    symbolism: string;
    technicalRecipe: string;
    stitchCount: number;
  }

  const getDataForEra = (era: 'ancient' | 'modern' | 'future'): CardData => {
    let items: any[] = [];
    switch (era) {
      case 'ancient':
        items = ancient.items;
        break;
      case 'modern':
        items = modern.items;
        break;
      case 'future':
        items = future.items;
        break;
    }
    if (items.length > 0) {
      const item = items[0];
      return {
        title: item.title,
        description: item.description || '',
        symbolism: extractMeaning(item),
        technicalRecipe: extractTechnicalRecipe(item),
        stitchCount: item.content?.stitch_count || 42,
      };
    }
    // Fallback data matching the specific patterns
    const fallbacks: Record<'ancient' | 'modern' | 'future', CardData> = {
      ancient: {
        title: 'Pepper Spice Oya',
        description: 'Oya lace with pepper‑spice symbolism representing Discord.',
        symbolism: 'Pepper Spice Oya: Discord, protection, and cultural resistance.',
        technicalRecipe: 'Z‑twist, 2:1 increase ratio, 5‑row repeat.',
        stitchCount: 56,
      },
      modern: {
        title: 'Brain Coral',
        description: 'Hyperbolic growth pattern with 1:3 stitch ratio.',
        symbolism: 'Brain Coral: Computational geometry, fractal expansion.',
        technicalRecipe: '1:3 increase ratio, curvature K = -0.7, 8‑row repeat.',
        stitchCount: 42,
      },
      future: {
        title: 'Helix Trace',
        description: 'Bioluminescent smart‑fabric with biometric sensing.',
        symbolism: 'Helix Trace: Adaptive materials, robotic path‑lines.',
        technicalRecipe: 'Dynamic stitch adjustment, LED‑thread integration.',
        stitchCount: 64,
      },
    };
    return fallbacks[era];
  };

  const columns = [
    {
      era: 'ancient' as const,
      title: 'The Ancestor',
      subtitle: 'Sacred Artifact with Oya Symbolism',
      bgColor: '#d4a574',
      accentColor: '#c53030',
      description: 'Traditional Oya lace patterns represent protection and heritage. Each stitch is a prayer.',
    },
    {
      era: 'modern' as const,
      title: 'The Equation',
      subtitle: 'Technical Blueprint with Curvature Heatmaps',
      bgColor: '#0f172a',
      accentColor: '#059669',
      description: 'Precision geometry defines stitch expansion. Curvature K determines hyperbolic growth.',
    },
    {
      era: 'future' as const,
      title: 'The Progeny',
      subtitle: 'Bioluminescent Smart‑Fabric with Robotic Path‑lines',
      bgColor: '#0a0a0f',
      accentColor: '#00f5ff',
      description: 'Self‑illuminating threads adapt to environmental data. Robotic looms weave dynamic textures.',
    },
  ];

  return (
    <>
      <div className="min-h-screen px-4 py-6 md:px-8 md:py-12" style={{ backgroundColor: currentTheme.colors.background, color: currentTheme.colors.text }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-glow" style={{ color: currentTheme.colors.accent }}>
              Multi‑Era Comparison Engine
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-2" style={{ color: currentTheme.colors.primary }}>
              Visualizing the Same Geometric Pattern Across Three Eras
            </h2>
            <p className="max-w-3xl mx-auto text-sm md:text-base" style={{ color: currentTheme.colors.textSecondary }}>
              Cindy, explore how a single Shell Stitch transforms under Ancient, Modern, and Future design philosophies.
              Click the Council button for unified expert insights across all three.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsCouncilOpen(true)}
                className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: currentTheme.colors.accent, color: currentTheme.colors.background }}
              >
                Open Unified Council Insights
              </button>
            </div>
          </div>

          {/* 3‑Column Layout (horizontal scroll on mobile, grid on desktop) */}
          <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto pb-4 md:overflow-visible md:pb-0 snap-x snap-mandatory scrollbar-hide">
            {columns.map(col => {
              const data = getDataForEra(col.era);
              return (
                <div
                  key={col.era}
                  className="rounded-2xl p-6 border-2 shadow-xl transition-transform duration-300 hover:scale-[1.02] flex-shrink-0 w-[85vw] md:w-auto snap-center"
                  style={{
                    backgroundColor: col.bgColor,
                    borderColor: col.accentColor,
                    color: col.era === 'ancient' ? '#2d3748' : col.era === 'modern' ? '#f8fafc' : '#e0e0ff',
                  }}
                >
                  {/* Column Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{col.title}</h3>
                    <h4 className="text-lg md:text-xl font-semibold mb-3" style={{ color: col.accentColor }}>
                      {col.subtitle}
                    </h4>
                    <div className="inline-block px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: col.accentColor + '20', color: col.accentColor }}>
                      {col.era.toUpperCase()} ERA
                    </div>
                  </div>

                  {/* Pattern Visualization */}
                  <div className="relative h-48 md:h-64 rounded-xl mb-6 overflow-hidden border" style={{ borderColor: col.accentColor }}>
                    <PatternViewer era={col.era} compact />
                    <div className="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-sm" style={{ backgroundColor: col.bgColor + 'CC' }}>
                      <div className="text-sm md:text-base font-semibold">{data.title}</div>
                      <div className="text-xs md:text-sm" style={{ color: col.accentColor }}>
                        {data.stitchCount} stitches • Curvature K = {col.era === 'ancient' ? '-0.7' : col.era === 'modern' ? '0.0' : '+0.5'}
                      </div>
                    </div>
                  </div>

                  {/* Cultural & Mathematical Data */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h5 className="font-bold text-lg mb-2" style={{ color: col.accentColor }}>Symbolism</h5>
                      <p className="text-sm md:text-base">{data.symbolism}</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2" style={{ color: col.accentColor }}>Technical Recipe</h5>
                      <p className="text-sm md:text-base">{data.technicalRecipe}</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2" style={{ color: col.accentColor }}>Description</h5>
                      <p className="text-sm md:text-base">{data.description}</p>
                    </div>
                  </div>

                  {/* Vote & Mastery Challenge Section */}
                  <div className="border-t pt-4" style={{ borderColor: col.accentColor + '40' }}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm md:text-base font-medium">Which design speaks to you?</span>
                      <span className="text-lg font-bold" style={{ color: col.accentColor }}>{votes[col.era]} votes</span>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleVote(col.era)}
                        className="w-full py-3 px-4 rounded-lg font-bold transition-all hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: col.accentColor, color: col.era === 'future' ? '#0a0a0f' : '#ffffff' }}
                      >
                        Vote for {col.title}
                      </button>
                      <button
                        onClick={() => handleMasteryChallenge(col.era)}
                        className="w-full py-3 px-4 rounded-lg font-bold transition-all hover:opacity-90 active:scale-95 border-2"
                        style={{
                          borderColor: col.accentColor,
                          backgroundColor: 'transparent',
                          color: col.accentColor
                        }}
                      >
                        Mastery Challenge: Focus on {col.title}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary & Navigation */}
          <div className="mt-12 p-6 rounded-2xl border" style={{ backgroundColor: currentTheme.colors.card, borderColor: currentTheme.colors.border }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.accent }}>Comparison Insights</h3>
            <p className="mb-4" style={{ color: currentTheme.colors.textSecondary }}>
              This side‑by‑side view reveals how cultural context transforms identical geometry. The Ancient era embeds spiritual meaning,
              the Modern era quantifies curvature, and the Future era envisions adaptive materials.
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm md:text-base">
                <span className="font-semibold" style={{ color: currentTheme.colors.primary }}>Total Votes:</span>
                <span className="ml-2">{Object.values(votes).reduce((a, b) => a + b, 0)}</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setEra('ancient')}
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: currentTheme.colors.border, color: currentTheme.colors.text }}
                >
                  Switch to Ancient Era
                </button>
                <button
                  onClick={() => setEra('modern')}
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: currentTheme.colors.primary, color: currentTheme.colors.text }}
                >
                  Back to Modern
                </button>
                <button
                  onClick={() => setEra('future')}
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: currentTheme.colors.accent, color: currentTheme.colors.background }}
                >
                  Switch to Future
                </button>
              </div>
            </div>
          </div>

          {/* Mobile‑only swipe hint */}
          <div className="mt-8 md:hidden text-center text-sm" style={{ color: currentTheme.colors.textSecondary }}>
            <p>💡 <strong>Swipe horizontally</strong> to compare eras on mobile.</p>
          </div>
        </div>
      </div>

      {/* Council Sidebar for unified insights */}
      <CouncilSidebar
        isOpen={isCouncilOpen}
        onClose={() => setIsCouncilOpen(false)}
        selectedNodeId={selectedNodeId}
      />
    </>
  );
};

export default ComparisonPage;