import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import PatternScript from './PatternScript';

interface DesignForgeProps {
  isOpen: boolean;
  onClose: () => void;
  era: string;
  motif: string;
  curvature: number;
  baseStitches?: number;
  rows?: number;
}

const DesignForge: React.FC<DesignForgeProps> = ({
  isOpen,
  onClose,
  era,
  motif,
  curvature,
  baseStitches = 12,
  rows = 8
}) => {
  const { theme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [expertCritiques, setExpertCritiques] = useState<any[]>([]);
  const [isLoadingCritiques, setIsLoadingCritiques] = useState(false);

  // Map era to style preset
  const getStylePreset = (era: string) => {
    switch (era.toLowerCase()) {
      case 'ancient': return 'irish_famine_rose';
      case 'modern': return 'hyper_realistic_botanical';
      case 'future': return 'amigurumi_core';
      default: return 'default';
    }
  };

  const stylePreset = getStylePreset(era);

  // Get material for the selected tradition
  const getMaterialForTradition = (traditionName: string) => {
    const traditionMaterials: Record<string, string> = {
      'Turkish Oya': 'fine silk thread',
      'Irish Rose': 'linen lace',
      'Andean Braid': 'alpaca wool',
      'Mughal Paisley': 'gold silk zari',
      'Roman Surface': 'marble thread',
      'Boy\'s Surface': 'quantum fiber',
      'Japanese Sashiko': 'indigo cotton',
      'Navajo Weaving': 'sheep wool',
    };
    return traditionMaterials[traditionName] || 'fine silk thread';
  };

  const material = getMaterialForTradition(motif);

  // Fetch both image and critiques when forge opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchForgeData = async () => {
      setIsGenerating(true);
      setGenerationProgress(0);
      setGenerationError(null);
      setIsLoadingCritiques(true);

      try {
        // 1. Generate image using the forge API (DALL-E 3)
        const imageResponse = await fetch('/api/forge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            era,
            motif,
            K: curvature,
            style: 'photorealistic_macro',
            resolution: '1024x1024',
            prompt: `Museum-quality macro photo of a hand-crocheted ${motif}, ${material} thread, 8k resolution, cinematic lighting.`
          }),
        });

        if (!imageResponse.ok) {
          throw new Error(`Image API error: ${imageResponse.status}`);
        }

        const imageData = await imageResponse.json();
        setGeneratedImage(imageData.imageUrl);
        setGenerationProgress(50);

        // 2. Fetch expert critiques using the critique API (DeepSeek)
        const critiqueResponse = await fetch('/api/critique', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            curvature,
            era,
            totalStitches: baseStitches * rows,
            rows,
            motifName: motif,
            stylePreset: stylePreset
          }),
        });

        if (!critiqueResponse.ok) {
          throw new Error(`Critique API error: ${critiqueResponse.status}`);
        }

        const critiqueData = await critiqueResponse.json();
        setExpertCritiques(critiqueData.critiques || []);
        setGenerationProgress(100);

      } catch (error) {
        console.error('Error in Design Forge:', error);
        setGenerationError(error instanceof Error ? error.message : 'Unknown error');
        
        // Fallback to placeholder image
        const fallbackUrl = `https://placehold.co/1024x1024/ef4444/ffffff?text=${encodeURIComponent(`Generation Failed\n${motif} (K=${curvature})`)}`;
        setGeneratedImage(fallbackUrl);
        
        // Fallback to mock critiques
        setExpertCritiques([
          {
            expertName: "Dr. Elara Vance",
            role: "Ethno-Mathematician",
            feedback: `Your curvature of K = ${curvature.toFixed(2)} creates a hyperbolic expansion reminiscent of Celtic knotwork. The ${baseStitches}:${rows} stitch ratio echoes mathematical patterns found in ${era} textile traditions.`
          },
          {
            expertName: "Professor Aris Thorne",
            role: "Material Architect",
            feedback: `The hoop stress calculation shows potential tension points. With ${baseStitches} base stitches, consider using appropriate thread weight to distribute mechanical load for this ${motif} pattern.`
          }
        ]);
      } finally {
        setIsGenerating(false);
        setIsLoadingCritiques(false);
        setGenerationProgress(100);
      }
    };

    fetchForgeData();
  }, [isOpen, era, motif, curvature, baseStitches, rows, stylePreset]);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setIsLoadingCritiques(true);
    setGenerationProgress(0);
    setGenerationError(null);

    try {
      // 1. Generate image using the forge API (DALL-E 3)
      const imageResponse = await fetch('/api/forge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          era,
          motif,
          K: curvature,
          style: 'photorealistic_macro',
          resolution: '1024x1024',
          prompt: `Museum-quality macro photo of a hand-crocheted ${motif}, ${material} thread, 8k resolution, cinematic lighting.`
        }),
      });

      if (!imageResponse.ok) {
        throw new Error(`Image API error: ${imageResponse.status}`);
      }

      const imageData = await imageResponse.json();
      setGeneratedImage(imageData.imageUrl);
      setGenerationProgress(50);

      // 2. Fetch expert critiques using the critique API (DeepSeek)
      const critiqueResponse = await fetch('/api/critique', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          curvature,
          era,
          totalStitches: baseStitches * rows,
          rows,
          motifName: motif,
          stylePreset: stylePreset
        }),
      });

      if (!critiqueResponse.ok) {
        throw new Error(`Critique API error: ${critiqueResponse.status}`);
      }

      const critiqueData = await critiqueResponse.json();
      setExpertCritiques(critiqueData.critiques || []);
      setGenerationProgress(100);

    } catch (error) {
      console.error('Error generating forge masterpiece:', error);
      setGenerationError(error instanceof Error ? error.message : 'Unknown error');
      
      // Fallback to placeholder
      const fallbackUrl = `https://placehold.co/1024x1024/ef4444/ffffff?text=${encodeURIComponent(`Generation Failed\n${motif} (K=${curvature})`)}`;
      setGeneratedImage(fallbackUrl);
      
      // Fallback to mock critiques
      setExpertCritiques([
        {
          expertName: "Dr. Elara Vance",
          role: "Ethno-Mathematician",
          feedback: `Your curvature of K = ${curvature.toFixed(2)} creates a hyperbolic expansion reminiscent of Celtic knotwork. The ${baseStitches}:${rows} stitch ratio echoes mathematical patterns found in ${era} textile traditions.`
        },
        {
          expertName: "Professor Aris Thorne",
          role: "Material Architect",
          feedback: `The hoop stress calculation shows potential tension points. With ${baseStitches} base stitches, consider using appropriate thread weight to distribute mechanical load for this ${motif} pattern.`
        }
      ]);
    } finally {
      setIsGenerating(false);
      setIsLoadingCritiques(false);
      setGenerationProgress(100);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `thalia-forge-${era}-${motif}-k${curvature.toFixed(2)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (!generatedImage) return;
    
    if (navigator.share) {
      navigator.share({
        title: `Thalia Design Forge: ${era} ${motif}`,
        text: `Check out this crochet pattern I generated with Thalia! K=${curvature.toFixed(2)} curvature.`,
        url: generatedImage,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Thalia Design Forge: ${era} ${motif} - K=${curvature.toFixed(2)}\n${generatedImage}`);
      alert('Link copied to clipboard!');
    }
  };

  // Calculate symbol score color
  const getSymbolScoreColor = (score: number) => {
    if (score > 0) return '#FBBF24'; // Gold for increase
    if (score < 0) return '#EF4444'; // Red for decrease
    return '#10B981'; // Emerald for standard
  };

  // Generate symbol scores based on curvature
  const symbolScores = [
    { symbol: '●', meaning: 'Stitch Density', score: curvature * 10 },
    { symbol: '▲', meaning: 'Curvature Intensity', score: Math.abs(curvature) * 15 },
    { symbol: '◎', meaning: 'Pattern Harmony', score: 5 - Math.abs(curvature) * 8 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Artisan Modal - Full screen vertical split */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 overflow-hidden"
            style={{
              backgroundColor: theme.colors.background,
            }}
          >
            {/* Minimal Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold" style={{ color: theme.colors.text }}>
                  🎨 Artisan Forge
                </h2>
                <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                  {era} • {motif} • K = {curvature.toFixed(2)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                style={{
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                ×
              </button>
            </div>

            {/* Top Half: DALL-E 3 Image */}
            <div className="absolute top-0 left-0 right-0 h-1/2">
              {isGenerating ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 rounded-full border-4" style={{
                      borderColor: theme.colors.border
                    }} />
                    <motion.div
                      className="absolute inset-0 rounded-full border-4"
                      style={{
                        borderColor: theme.colors.primary,
                        borderTopColor: 'transparent'
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                  <h4 className="text-lg font-medium mb-2 text-center" style={{ color: theme.colors.text }}>
                    Forging {motif} Masterpiece...
                  </h4>
                  <p className="text-sm text-center mb-4 px-4" style={{ color: theme.colors.textSecondary }}>
                    "Museum-quality macro photo of a hand-crocheted {motif}, {material} thread"
                  </p>
                  <div className="w-full max-w-xs">
                    <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: theme.colors.border }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${generationProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: theme.colors.textSecondary }}>
                      <span>DALL-E 3 Processing</span>
                      <span>{generationProgress}%</span>
                    </div>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="w-full h-full relative">
                  <img
                    src={generatedImage}
                    alt={`Generated ${era} ${motif}`}
                    className="w-full h-full object-cover"
                  />
                  {generationError && (
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg" style={{
                      backgroundColor: '#ef4444',
                      color: 'white'
                    }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">⚠️</span>
                        <span className="text-sm">Using placeholder: {generationError}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Bottom Half: Language Instructions & Expert Tips */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 border-t" style={{ borderColor: theme.colors.border }}>
              <div className="h-full overflow-y-auto p-6">
                {/* Symbol Score Row */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3" style={{ color: theme.colors.text }}>
                    Symbol Score Analysis
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {symbolScores.map((item, index) => (
                      <div key={index} className="p-4 rounded-xl text-center" style={{
                        backgroundColor: theme.colors.card,
                        border: `2px solid ${getSymbolScoreColor(item.score)}`
                      }}>
                        <div className="text-3xl mb-2">{item.symbol}</div>
                        <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
                          {item.meaning}
                        </div>
                        <div className="text-xl font-bold" style={{ color: getSymbolScoreColor(item.score) }}>
                          {item.score > 0 ? '+' : ''}{item.score.toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pattern Instructions */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3" style={{ color: theme.colors.text }}>
                    Master Pattern Instructions
                  </h3>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: theme.colors.card }}>
                    <PatternScript
                      curvature={curvature}
                      stylePreset={stylePreset}
                      baseStitches={baseStitches}
                      rows={rows}
                    />
                  </div>
                </div>

                {/* Expert Tip Box */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3" style={{ color: theme.colors.text }}>
                    Expert Tip from DeepSeek
                  </h3>
                  <div className="p-4 rounded-xl" style={{
                    backgroundColor: '#1E293B',
                    border: '2px solid #3B82F6'
                  }}>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{
                        backgroundColor: '#3B82F6',
                        color: 'white'
                      }}>
                        🤖
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">DeepSeek Technical Advice</h4>
                        <p className="text-sm text-gray-300">
                          {expertCritiques.length > 0 
                            ? expertCritiques[0].feedback
                            : `For curvature K = ${curvature.toFixed(2)}, consider using ${material} with stitch tension adjusted by ${Math.abs(curvature * 10).toFixed(1)}%. This creates ${curvature < 0 ? 'hyperbolic' : 'spherical'} geometry ideal for ${motif} tradition.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleGenerateImage}
                    disabled={isGenerating}
                    className="px-4 py-3 rounded-lg font-medium flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background
                    }}
                  >
                    <span>⚡</span>
                    <span>Regenerate</span>
                  </button>
                  <button
                    onClick={handleDownloadImage}
                    disabled={!generatedImage || isGenerating}
                    className="px-4 py-3 rounded-lg font-medium flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: theme.colors.card,
                      color: theme.colors.text,
                      border: `1px solid ${theme.colors.border}`
                    }}
                  >
                    <span>📥</span>
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleShare}
                    disabled={!generatedImage || isGenerating}
                    className="px-4 py-3 rounded-lg font-medium flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.background
                    }}
                  >
                    <span>↗️</span>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DesignForge;
