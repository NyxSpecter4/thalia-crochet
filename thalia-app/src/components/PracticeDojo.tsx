import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface ChallengeLevel {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  theme: 'ancient' | 'modern' | 'topological';
  color: string;
  backgroundColor: string;
  curvature: number;
  boundaryRequired: boolean;
  icon: string;
  constraints?: {
    oneLiveStitch?: boolean;
    twistTension?: number;
    selfIntersection?: boolean;
  };
}

const PracticeDojo: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const levels: ChallengeLevel[] = [
    {
      id: 'oya-tension',
      title: 'LEVEL 1: The Oya Tension Test',
      subtitle: 'Ancient Theme • Silk Shader',
      description: 'Master the delicate tension of Ottoman Oya lace. Keep curvature near zero while maintaining perfect stitch uniformity.',
      theme: 'ancient',
      color: '#C53030',
      backgroundColor: '#FEF3C7',
      curvature: 0,
      boundaryRequired: false,
      icon: '🏺',
    },
    {
      id: 'hyperbolic-coral',
      title: 'LEVEL 2: The Hyperbolic Coral Bloom',
      subtitle: 'Modern Theme • Gold/Emerald',
      description: 'Create a hyperbolic coral structure with negative curvature. Expand stitches exponentially while preserving symmetry.',
      theme: 'modern',
      color: '#10B981',
      backgroundColor: '#FEF3C7',
      curvature: -0.5,
      boundaryRequired: false,
      icon: '🧵',
    },
    {
      id: 'seifert-trefoil',
      title: 'LEVEL 3: The Seifert Trefoil Boundary',
      subtitle: 'Topological Theme • Indigo/Silver',
      description: 'Navigate the topological complexity of a trefoil knot boundary. Visualize the Seifert surface while maintaining edge integrity. Constraint: One Live Stitch. Goal: Maintain 180‑degree twist tension.',
      theme: 'topological',
      color: '#4F46E5',
      backgroundColor: '#1E293B',
      curvature: 0.65,
      boundaryRequired: true,
      icon: '🔮',
      constraints: {
        oneLiveStitch: true,
        twistTension: 180,
      },
    },
    {
      id: 'enneper-minimal',
      title: 'LEVEL 4: The Enneper Minimal Challenge',
      subtitle: 'Minimalist Theme • Silver/Cyan',
      description: 'Explore the self‑intersecting geometry of Enneper’s minimal surface. Maintain zero mean curvature while navigating saddle points. Constraint: Show Self‑Intersection. Goal: Visualize where the fabric crosses its own plane. Mentor Quote (Lin): "This surface is a bridge between the Roman Surface and the Boy\'s Surface. Watch your tension at the saddle point."',
      theme: 'topological',
      color: '#94a3b8',
      backgroundColor: '#f8fafc',
      curvature: -0.3,
      boundaryRequired: false,
      icon: '🌀',
      constraints: {
        selfIntersection: true,
      },
    },
  ];

  const handleSelectLevel = (level: ChallengeLevel) => {
    navigate('/', {
      state: {
        challenge: level.id,
        curvature: level.curvature,
        boundaryRequired: level.boundaryRequired,
        theme: level.theme,
        color: level.color,
        locked: true,
        constraints: level.constraints,
      },
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4" style={{ color: theme.colors.accent }}>
            PRACTICE DOJO
          </h1>
          <p className="text-lg md:text-xl" style={{ color: theme.colors.textSecondary }}>
            Master the Three Great Challenges • Locked Slider • Boundary Visualization
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#C5303020', color: '#C53030' }}>Ancient: Silk Texture</span>
            <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#10B98120', color: '#10B981' }}>Modern: Gold/Emerald</span>
            <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#4F46E520', color: '#4F46E5' }}>Topological: Indigo/Silver</span>
            <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#94a3b820', color: '#94a3b8' }}>Minimalist: Silver/Cyan</span>
          </div>
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {levels.map((level) => (
            <div
              key={level.id}
              className="rounded-3xl border overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: level.backgroundColor,
                backgroundImage: level.theme === 'ancient' ? 'url(#parchmentTexture)' : level.theme === 'topological' ? 'linear-gradient(135deg, #1E293B 0%, #4F46E5 100%)' : 'none',
              }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-5xl">{level.icon}</div>
                  <div className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: level.color + '20', color: level.color }}>
                    {level.theme.toUpperCase()}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: level.color }}>{level.title}</h3>
                <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>{level.subtitle}</p>
                <p className="text-lg mb-6" style={{ color: theme.colors.text }}>{level.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Curvature (K)</div>
                    <div className="text-lg font-mono" style={{ color: level.color }}>{level.curvature.toFixed(2)}</div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Boundary</div>
                    <div className="text-lg font-mono" style={{ color: level.color }}>{level.boundaryRequired ? 'Required' : 'None'}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectLevel(level)}
                  className="w-full py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: level.color,
                    color: '#FFFFFF',
                  }}
                >
                  <span>Begin Challenge</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 p-8 rounded-3xl border text-center" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
          <h3 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>Dojo Rules</h3>
          <p className="text-lg mb-6" style={{ color: theme.colors.text }}>
            When you select a challenge, the Pattern Viewer will <strong>lock the curvature slider</strong> to the required K‑value and <strong>enable boundary visualization</strong> if needed.
            Complete the pattern within the constraints to earn mastery badges.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
              <div className="font-bold">Ancient Challenge</div>
              <div className="text-sm">Silk Shader, K ≈ 0, No Boundary</div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#1E293B', color: '#67E8F9' }}>
              <div className="font-bold">Topological Challenge</div>
              <div className="text-sm">Indigo/Silver, K = 0.65, Boundary Required</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeDojo;