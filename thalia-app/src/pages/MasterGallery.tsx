import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { councilMembers, sampleInsights } from '../data/council';
import { fetchCulturalResearch } from '../lib/supabase';

interface MotifCard {
  id: string;
  name: string;
  era: 'ancient' | 'modern' | 'future';
  color: string;
  description: string;
  historicalBlurb: string;
  technicalRecipe: string;
  svgPath: string;
}

// Fallback hardcoded motifs in case Supabase fetch fails
const fallbackMotifs: MotifCard[] = [
  {
    id: 'oya',
    name: 'Ottoman Oya',
    era: 'ancient',
    color: '#C53030', // Madder Red
    description: 'Tiny crocheted motifs with bead embellishments, conveying messages through floral symbolism.',
    historicalBlurb: 'Originating in 17th century Anatolia, Oya lace edges headscarves with secret botanical language—each flower a coded sentiment between women.',
    technicalRecipe: 'Magic ring 6 sc, increase to 12, work 3 rounds even, add picot edge with seed beads. Use silk thread size 40, 0.75mm hook.',
    svgPath: 'M50,100 Q70,60 100,50 Q130,60 150,100 Q130,140 100,150 Q70,140 50,100 Z M100,70 L120,90 L110,120 L90,120 L80,90 Z',
  },
  {
    id: 'irish',
    name: 'Irish Famine Lace',
    era: 'modern',
    color: '#10B981', // Emerald
    description: 'Raised, padded motifs worked separately and joined with mesh, a resilience craft from the Great Famine.',
    historicalBlurb: 'During the potato famine (1845‑1852), Irish women created intricate lace roses as economic survival—each stitch a defiance of hunger.',
    technicalRecipe: 'Padding cord foundation, double crochet clusters, picot edges, starch aggressively. Use thread size 20, 1.25mm hook.',
    svgPath: 'M100,40 Q140,60 130,100 Q120,140 100,120 Q80,140 70,100 Q60,60 100,40 Z M100,60 Q140,80 120,110 Q100,150 80,110 Q60,80 100,60 Z',
  },
  {
    id: 'andean',
    name: 'Andean Quipu',
    era: 'ancient',
    color: '#D97706', // Amber
    description: 'Knot‑based textile computation, encoding data in cord color, length, and knot type.',
    historicalBlurb: 'Inca quipus were tactile databases—administrative records, narratives, and mathematical models woven into cotton cords.',
    technicalRecipe: 'Chain 100, slip stitch join, work rows of single crochet with strategic color changes. Emulate knot clusters with popcorn stitches.',
    svgPath: 'M60,50 L140,50 M60,70 L140,70 M60,90 L140,90 M60,110 L140,110 M60,130 L140,130 M100,50 L100,130',
  },
  {
    id: 'aari',
    name: 'Aari Embroidery',
    era: 'modern',
    color: '#7C3AED', // Violet
    description: 'Hook‑based embroidery from Kashmir, creating intricate floral patterns on fabric.',
    historicalBlurb: 'Aari work flourished under Mughal patronage, blending Persian floral aesthetics with Indian craftsmanship—each chain stitch a petal.',
    technicalRecipe: 'Use aari hook on stretched fabric, chain stitch along traced pattern, fill with satin stitch. Metallic thread for sheen.',
    svgPath: 'M80,80 Q100,60 120,80 Q140,100 120,120 Q100,140 80,120 Q60,100 80,80 Z M100,100 L130,70 M100,100 L70,130',
  },
  {
    id: 'bio-shell',
    name: 'Bio‑Shell',
    era: 'future',
    color: '#06B6D4', // Cyan
    description: 'Biomimetic crochet inspired by mollusk shells, grown algorithmically with responsive materials.',
    historicalBlurb: 'Future textiles will be grown, not made—this pattern simulates nacre deposition, layer by layer, using shape‑memory yarn.',
    technicalRecipe: 'Magic ring 6, increase by Fibonacci sequence each round, switch colors every 3 rows. Integrate thermochromic thread.',
    svgPath: 'M100,30 C120,20 180,40 180,80 C180,120 140,160 100,180 C60,160 20,120 20,80 C20,40 80,20 100,30 Z M100,50 L120,70 L110,100 L90,100 L80,70 Z',
  },
  {
    id: 'seifert',
    name: 'Trefoil Seifert Surface',
    era: 'future',
    color: '#4F46E5', // Deep Indigo
    description: 'A topological surface bounded by a trefoil knot, representing the mathematical beauty of textile structures.',
    historicalBlurb: 'Seifert surfaces connect knot theory to textile topology—each twist in the yarn corresponds to a crossing in the knot diagram, creating a continuous fabric without boundary.',
    technicalRecipe: 'Construct via Seifert algorithm: draw knot diagram, assign crossings, create oriented loops, fill with single crochet. Use indigo thread, silver metallic accent.',
    svgPath: 'M100,50 C120,30 180,40 180,80 C180,120 140,140 100,150 C60,140 20,120 20,80 C20,40 80,30 100,50 Z M100,70 C130,50 160,70 140,100 C120,130 80,130 60,100 C40,70 70,50 100,70 Z',
  },
  {
    id: 'roman',
    name: 'Roman Surface',
    era: 'future',
    color: '#8B5CF6', // Vibrant Indigo
    description: 'A self‑intersecting mapping of the real projective plane into three‑dimensional space, visualized as three orthogonal intersecting discs.',
    historicalBlurb: 'Discovered by Jakob Steiner in the 19th century, the Roman surface is a classic example of a non‑orientable surface with triple points—each disc intersecting the other two. Mark Shoulson physically realized it in crochet in 2024, demonstrating topological textile craft.',
    technicalRecipe: 'Crochet 3 separate K=0 discs. Join along calculated elliptical paths. Use silver metallic thread for disc surfaces, black yarn for intersection seams.',
    svgPath: 'M50,100 Q70,60 100,50 Q130,60 150,100 Q130,140 100,150 Q70,140 50,100 Z M100,50 L150,100 L100,150 L50,100 Z M100,50 L50,100 L100,150 L150,100 Z',
  },
  {
    id: 'boy',
    name: 'Boy\'s Surface',
    era: 'future',
    color: '#06B6D4', // Cyan
    description: 'An immersion of the real projective plane into 3‑space with a 4‑lobe structure, discovered by Werner Boy in 1901.',
    historicalBlurb: 'Boy’s surface is a minimal‑genus non‑orientable embedding—its four lobes twist around a central triple point, providing a visual metaphor for topological complexity.',
    technicalRecipe: 'Rnd 1: 8 sc in MR. Rnd 2: [sc, inc] repeat. Rnd 3‑7: sc even. Rnd 8: [sc, dec] repeat. Form lobes with post stitches and color shifts.',
    svgPath: 'M100,40 C140,20 180,60 160,100 C140,140 100,160 60,140 C20,120 20,80 60,60 C100,40 140,60 160,100 Z M100,80 C120,60 160,80 140,120 C120,160 80,160 60,120 C40,80 80,60 100,80 Z',
  },
  {
    id: 'universal',
    name: 'Universal Algorithm',
    era: 'future',
    color: '#10B981', // Emerald
    description: 'The universal formula N(R) = C(R)/W encoding the relationship between curvature, stitch count, and yarn weight.',
    historicalBlurb: 'Derived from the Gauss‑Bonnet theorem, this algorithm unifies all crochet geometries—every possible surface can be generated by varying its three parameters.',
    technicalRecipe: 'Compute N(R) = C(R)/W where C(R) is curvature‑dependent stitch count, W is yarn weight. Iterate over R from 0 to 2π, increasing by π/6 each round.',
    svgPath: 'M50,100 Q100,20 150,100 Q100,180 50,100 Z M100,50 L150,100 L100,150 L50,100 Z M100,50 L50,100 L100,150 L150,100 Z',
  },
];

const MotifSVG: React.FC<{ motif: MotifCard; isHovered: boolean }> = ({ motif, isHovered }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    // Apply filter based on era
    if (motif.era === 'ancient') {
      svg.style.filter = 'url(#silkTexture)';
    } else if (motif.era === 'future') {
      svg.style.filter = 'url(#neonGlow)';
    } else {
      svg.style.filter = 'none';
    }
  }, [motif.era, isHovered]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="w-full h-auto transition-all duration-500"
        style={{
          filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
        }}
      >
        <defs>
          {/* Neon glow filter for future */}
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feFlood floodColor={motif.color} floodOpacity="0.8" result="glowColor" />
            <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* High‑fidelity SVG for topological surfaces */}
        {motif.id === 'roman' ? (
          <>
            {/* Three orthogonal intersecting discs */}
            <circle cx="100" cy="100" r="60" fill="none" stroke={motif.color} strokeWidth="3" strokeDasharray="5,5" />
            <circle cx="70" cy="70" r="40" fill={motif.color} fillOpacity="0.2" stroke={motif.color} strokeWidth="2" />
            <circle cx="130" cy="70" r="40" fill={motif.color} fillOpacity="0.2" stroke={motif.color} strokeWidth="2" />
            <circle cx="100" cy="130" r="40" fill={motif.color} fillOpacity="0.2" stroke={motif.color} strokeWidth="2" />
            <line x1="70" y1="70" x2="130" y2="130" stroke={motif.color} strokeWidth="2" strokeDasharray="3,3" />
            <line x1="130" y1="70" x2="70" y2="130" stroke={motif.color} strokeWidth="2" strokeDasharray="3,3" />
          </>
        ) : motif.id === 'boy' ? (
          <>
            {/* Four‑lobe immersion */}
            <path d="M100,40 C140,20 180,60 160,100 C140,140 100,160 60,140 C20,120 20,80 60,60 C100,40 140,60 160,100 Z" fill={motif.color} fillOpacity="0.2" stroke={motif.color} strokeWidth="3" />
            <path d="M100,80 C120,60 160,80 140,120 C120,160 80,160 60,120 C40,80 80,60 100,80 Z" fill={motif.color} fillOpacity="0.3" stroke={motif.color} strokeWidth="2" />
            <circle cx="100" cy="100" r="10" fill={motif.color} opacity="0.8">
              <animate attributeName="r" values="10;15;10" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </>
        ) : motif.id === 'universal' ? (
          <>
            {/* Universal Algorithm symbol */}
            <path d="M50,100 Q100,20 150,100 Q100,180 50,100 Z" fill={motif.color} fillOpacity="0.15" stroke={motif.color} strokeWidth="3" />
            <path d="M100,50 L150,100 L100,150 L50,100 Z" fill="none" stroke={motif.color} strokeWidth="2" strokeDasharray="4,4" />
            <text x="100" y="100" textAnchor="middle" fill={motif.color} fontSize="14" fontFamily="monospace">N(R)=C(R)/W</text>
          </>
        ) : (
          <>
            <path
              d={motif.svgPath}
              fill={motif.color}
              fillOpacity={motif.era === 'future' ? 0.3 : 0.15}
              stroke={motif.color}
              strokeWidth={motif.era === 'ancient' ? 2 : 3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {motif.era === 'future' && (
              <circle cx="100" cy="100" r="15" fill={motif.color}>
                <animate attributeName="r" values="15;20;15" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            {motif.era === 'ancient' && (
              <circle cx="100" cy="100" r="8" fill={motif.color} opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
          </>
        )}
      </svg>
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl" style={{ color: motif.color }}>
            {motif.era === 'ancient' && '🏺'}
            {motif.era === 'modern' && '🧵'}
            {motif.era === 'future' && '🔮'}
          </div>
        </div>
      )}
    </div>
  );
};

const MasterGallery: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setEra } = useTheme();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showCouncilOverlay, setShowCouncilOverlay] = useState(false);
  const [selectedMotif, setSelectedMotif] = useState<MotifCard | null>(null);
  const [motifs, setMotifs] = useState<MotifCard[]>(fallbackMotifs);
  const [_loading, setLoading] = useState(true);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function loadMotifs() {
      try {
        const data = await fetchCulturalResearch();
        if (data && data.length > 0) {
          // Transform Supabase cultural_research records to MotifCard format
          const mapped = data.map((item: any) => ({
            id: item.id,
            name: item.title || 'Untitled Motif',
            era: (item.category?.toLowerCase() as 'ancient' | 'modern' | 'future') || 'modern',
            color: item.color || '#C53030',
            description: item.description || 'No description available.',
            historicalBlurb: item.cultural_context || 'Historical context not provided.',
            technicalRecipe: item.stitch_patterns ? JSON.stringify(item.stitch_patterns) : 'No technical recipe available.',
            svgPath: item.geometry_data?.svgPath || 'M50,100 Q70,60 100,50 Q130,60 150,100 Q130,140 100,150 Q70,140 50,100 Z',
          }));
          setMotifs(mapped);
        } else {
          setMotifs(fallbackMotifs);
        }
      } catch (error) {
        console.error('Failed to fetch cultural research:', error);
        setMotifs(fallbackMotifs);
      } finally {
        setLoading(false);
      }
    }
    loadMotifs();
  }, []);

  const handleMasteryChallenge = (motif: MotifCard) => {
    // Determine curvature based on era
    let curvature = 0;
    if (motif.era === 'ancient') curvature = 0; // -0.3 to 0.3 range, pick middle
    else if (motif.era === 'modern') curvature = 0;
    else curvature = 0.65; // future

    // Determine style preset
    const stylePreset = motif.era === 'ancient' ? 'silk' : motif.era === 'future' ? 'neon' : 'geometric';

    // Special constraints for Seifert Trefoil
    const constraints = motif.id === 'seifert' ? {
      oneLiveStitch: true,
      twistTension: 180,
    } : undefined;

    navigate('/', {
      state: {
        motifId: motif.id,
        curvature,
        stylePreset,
        motifName: motif.name,
        color: motif.color,
        locked: motif.id === 'seifert', // lock for Seifert challenge
        boundaryRequired: motif.id === 'seifert', // boundary required for Seifert
        constraints,
      },
    });
  };

  const openCouncilOverlay = (motif: MotifCard) => {
    setSelectedMotif(motif);
    setShowCouncilOverlay(true);
  };

  const closeCouncilOverlay = () => {
    setShowCouncilOverlay(false);
    setSelectedMotif(null);
  };

  // Get Ethno-Mathematician member
  const ethnoMathematician = councilMembers.find(m => m.id === 'ethno-mathematician');
  // Get a relevant insight for the selected motif (filter by era)
  const getRelevantInsight = () => {
    if (!selectedMotif) return '';
    const eraInsights = sampleInsights.filter(insight => insight.era === selectedMotif.era);
    if (eraInsights.length === 0) return 'No specific insight available for this era.';
    // Pick first insight from Ethno-Mathematician if exists
    const ethnoInsight = eraInsights.find(insight => insight.councilMemberId === 'ethno-mathematician');
    if (ethnoInsight) return ethnoInsight.insight;
    return eraInsights[0].insight;
  };

  // IntersectionObserver for theme sync
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleEra: 'ancient' | 'modern' | 'future' | null = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = cardRefs.current.findIndex(ref => ref === entry.target);
            if (cardIndex >= 0 && cardIndex < motifs.length) {
              const motif = motifs[cardIndex];
              const ratio = entry.intersectionRatio;
              if (ratio > maxRatio) {
                maxRatio = ratio;
                mostVisibleEra = motif.era;
              }
            }
          }
        });

        if (mostVisibleEra) {
          setEra(mostVisibleEra);
        }
      },
      {
        threshold: [0.1, 0.5, 1.0],
        rootMargin: '-20% 0px -20% 0px', // reduce trigger zone to central 60%
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [setEra]);

  return (
    <div className="min-h-screen px-4 py-8 md:px-8" style={{ backgroundColor: '#1a1f2e', color: '#f8fafc' }}>
      {/* No filters - Clean design */}

      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px #06B6D480, 0 0 40px #06B6D440, 0 0 80px #00f5ff40;
            border-color: #06B6D4;
          }
          50% {
            box-shadow: 0 0 30px #06B6D4FF, 0 0 60px #06B6D480, 0 0 120px #00f5ff80;
            border-color: #00f5ff;
          }
        }
        @keyframes color-shift {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(30deg); }
          100% { filter: hue-rotate(0deg); }
        }
        .future-card {
          animation: pulse-glow 3s infinite ease-in-out;
          position: relative;
          border-width: 2px;
        }
        .future-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), #06B6D420 0%, transparent 50%);
          opacity: 0.5;
          pointer-events: none;
          z-index: 0;
          animation: color-shift 5s infinite linear;
        }
        .future-card:hover::before {
          opacity: 0.8;
          background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), #00f5ff40 0%, transparent 70%);
        }
        /* Gold border glow for triptych panels */
        .triptych-panel {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .triptych-panel:hover {
          border-color: #D4AF37 !important;
          box-shadow: 0 0 20px #D4AF37, 0 0 40px #FFD70080;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4" style={{ color: '#D4AF37' }}>
            THE MASTER GALLERY
          </h1>
          <p className="text-lg md:text-xl" style={{ color: '#cbd5e1' }}>
            A Professional Cultural Archive • Clear Visual Cards • High‑Contrast Content
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#374151', color: '#D4AF37' }}>Ancient</span>
            <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#374151', color: '#D4AF37' }}>Modern</span>
            <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#374151', color: '#D4AF37' }}>Future</span>
          </div>
        </div>

        {/* Motif Cards */}
        <div className="space-y-12">
          {motifs.map((motif, index) => (
            <div
              key={motif.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`rounded-3xl border overflow-hidden transition-all duration-500 ${hoveredId === motif.id ? 'scale-[1.02] shadow-2xl' : ''}`}
              style={{
                borderColor: '#2d3748',
                backgroundColor: '#2d3748',
                filter: 'none',
                backdropFilter: 'none',
              }}
              onMouseEnter={() => setHoveredId(motif.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Panel A: The Visual */}
                <div className="lg:w-1/3 p-8 flex flex-col items-center justify-center triptych-panel" style={{ backgroundColor: '#374151' }}>
                  <div className="w-64 h-64">
                    <MotifSVG motif={motif} isHovered={hoveredId === motif.id} />
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{motif.name}</h3>
                    <p className="text-sm mt-2" style={{ color: '#cbd5e1' }}>{motif.description}</p>
                    <div className="mt-4 inline-block px-4 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#4b5563', color: '#D4AF37' }}>
                      {motif.era.toUpperCase()} ERA
                    </div>
                  </div>
                </div>

                {/* Panel B: The Blueprint */}
                <div className="lg:w-1/3 p-8 border-l triptych-panel" style={{ borderColor: '#4b5563' }}>
                  <h4 className="text-xl font-serif mb-4" style={{ color: '#D4AF37' }}>Round‑by‑Round Blueprint</h4>
                  <div className="font-mono text-sm bg-gray-800 p-4 rounded-xl space-y-2" style={{ color: '#f8fafc' }}>
                    {motif.technicalRecipe.split('. ').map((step, idx) => (
                      step.trim() && (
                        <div key={idx} className="flex items-start">
                          <span className="text-xs mr-2 mt-1" style={{ color: '#D4AF37' }}>{idx + 1}.</span>
                          <span>{step.trim()}{step.trim().endsWith('.') ? '' : '.'}</span>
                        </div>
                      )
                    ))}
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#374151' }}>
                      <div className="text-sm" style={{ color: '#cbd5e1' }}>Curvature Range</div>
                      <div className="text-lg font-mono" style={{ color: '#D4AF37' }}>
                        {motif.era === 'ancient' ? 'K = -0.3 → 0.3' : motif.era === 'modern' ? 'K ≈ 0' : 'K = 0.5 → 0.8'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#374151' }}>
                      <div className="text-sm" style={{ color: '#cbd5e1' }}>Primary Stitch</div>
                      <div className="text-lg font-mono" style={{ color: '#D4AF37' }}>
                        {motif.id === 'oya' ? 'Single Crochet' : motif.id === 'irish' ? 'Double Crochet' : motif.id === 'andean' ? 'Slip Stitch' : motif.id === 'aari' ? 'Chain' : 'Magic Ring'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel C: The Legacy */}
                <div className="lg:w-1/3 p-8 border-l triptych-panel" style={{ borderColor: '#4b5563' }}>
                  <h4 className="text-xl font-serif mb-4" style={{ color: '#D4AF37' }}>Historical Legacy</h4>
                  <p className="text-lg leading-relaxed mb-6" style={{ color: '#f8fafc' }}>{motif.historicalBlurb}</p>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#374151' }}>
                    <h5 className="font-bold mb-2" style={{ color: '#D4AF37' }}>Cultural Significance</h5>
                    <p className="text-sm" style={{ color: '#cbd5e1' }}>
                      {motif.id === 'oya' ? 'Secret botanical language between women.' :
                       motif.id === 'irish' ? 'Resilience craft from the Great Famine.' :
                       motif.id === 'andean' ? 'Tactile database of the Inca Empire.' :
                       motif.id === 'aari' ? 'Mughal‑era floral aesthetics.' :
                       motif.id === 'bio-shell' ? 'Biomimetic future textiles.' :
                       'Topological beauty of knot theory.'}
                    </p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      className="px-6 py-3 rounded-lg font-bold transition-colors"
                      style={{ backgroundColor: '#D4AF37', color: '#1a1f2e' }}
                      onClick={() => alert(`Exploring ${motif.name} in depth`)}
                    >
                      Explore This Motif
                    </button>
                    <button
                      className="px-6 py-3 rounded-lg font-bold transition-colors border-2"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: '#D4AF37',
                        color: '#D4AF37'
                      }}
                      onClick={() => handleMasteryChallenge(motif)}
                    >
                      Begin Mastery Challenge
                    </button>
                    <button
                      className="px-6 py-3 rounded-lg font-bold transition-colors border-2 border-dashed"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: '#D4AF37',
                        color: '#D4AF37',
                        borderWidth: '2px',
                      }}
                      onClick={() => openCouncilOverlay(motif)}
                    >
                      Consult the Council
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Theme Sync Note */}
        <div className="mt-16 p-8 rounded-3xl border text-center" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
          <h3 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>Theme Sync Active</h3>
          <p className="text-lg mb-6" style={{ color: theme.colors.text }}>
            When Cindy scrolls to an <strong>Ancient</strong> card, the UI background shifts to Sandstone/Parchment.
            When she scrolls to a <strong>Future</strong> card, it shifts to Obsidian/Cyan.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
              <div className="font-bold">Ancient Palette</div>
              <div className="text-sm">Sandstone, Madder Red, Amber</div>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#1E293B', color: '#67E8F9' }}>
              <div className="font-bold">Future Palette</div>
              <div className="text-sm">Obsidian, Cyan, Neon Purple</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm" style={{ color: theme.colors.textSecondary }}>
          <p>THE VISUAL REVOLUTION • Procedural Icons Generated from Cultural Research • Immersive Digital Textile Museum</p>
        </div>
      </div>

      {/* Council Overlay Modal */}
      {showCouncilOverlay && selectedMotif && ethnoMathematician && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            className="relative rounded-3xl border overflow-hidden max-w-2xl w-full"
            style={{
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            }}
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{ethnoMathematician.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: ethnoMathematician.color }}>{ethnoMathematician.title}</h3>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>{ethnoMathematician.name}</p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-xl font-serif mb-2" style={{ color: selectedMotif.color }}>Visual Description for {selectedMotif.name}</h4>
                <p className="text-lg leading-relaxed" style={{ color: theme.colors.text }}>
                  {getRelevantInsight()}
                </p>
              </div>
              <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: ethnoMathematician.color + '10' }}>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  <strong>Cultural Reference:</strong> {ethnoMathematician.culturalReferences[0]}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  className="px-6 py-3 rounded-lg font-bold transition-colors"
                  style={{ backgroundColor: ethnoMathematician.color, color: '#FFFFFF' }}
                  onClick={closeCouncilOverlay}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterGallery;