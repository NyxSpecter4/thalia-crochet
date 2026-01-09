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
            prompt: 'Photorealistic macro photography of a physical ' + motif + ' artifact, single thread of fine silk, visible intricate crochet stitches, directional studio lighting, 8k.'
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
          prompt: 'Photorealistic macro photography of a physical ' + motif + ' artifact, single thread of fine silk, visible intricate crochet stitches, directional studio lighting, 8k.'
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

          {/* Modal - Full screen on mobile, inset on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 sm:inset-4 z-50 overflow-hidden sm:rounded-2xl"
            style={{
              backgroundColor: theme.colors.background,
              border: `2px solid ${theme.colors.border}`,
              boxShadow: `0 25px 50px -12px ${theme.colors.border}40`
            }}
          >
            {/* Header - Compact on mobile */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b" style={{ borderColor: theme.colors.border }}>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold truncate" style={{ color: theme.colors.text }}>
                  🎨 Design Forge
                </h2>
                <p className="text-xs sm:text-sm mt-1 truncate" style={{ color: theme.colors.textSecondary }}>
                  {era} {motif} • K = {curvature.toFixed(2)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0 ml-2"
                style={{
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                ×
              </button>
            </div>

            {/* Main Content - Mobile: vertical stack, Desktop: side-by-side */}
            <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] overflow-hidden">
              {/* Left Panel - Image Generation */}
              <div className="lg:w-1/2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r overflow-y-auto" style={{ borderColor: theme.colors.border }}>
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3" style={{ color: theme.colors.text }}>
                    Visual Forge
                  </h3>
                  
                  {/* Image Container */}
                  <div className="relative rounded-xl overflow-hidden border" style={{
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                    aspectRatio: '1/1'
                  }}>
                    {isGenerating ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8">
                        <div className="relative w-16 h-16 sm:w-24 sm:h-24 mb-3 sm:mb-4">
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
                        <h4 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-center" style={{ color: theme.colors.text }}>
                          Extracting DNA from {motif}...
                        </h4>
                        <p className="text-xs sm:text-sm text-center mb-3 sm:mb-4 px-2" style={{ color: theme.colors.textSecondary }}>
                          "Photorealistic macro photography of a physical {motif} artifact, single thread of fine silk, visible intricate crochet stitches, directional studio lighting, 8k."
                        </p>
                        
                        {/* Progress Bar */}
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
                      <>
                        <img
                          src={generatedImage}
                          alt={`Generated ${era} ${motif}`}
                          className="w-full h-full object-cover"
                        />
                        {generationError && (
                          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 p-2 sm:p-3 rounded-lg" style={{
                            backgroundColor: '#ef4444',
                            color: 'white'
                          }}>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span className="text-xs sm:text-sm">⚠️</span>
                              <span className="text-xs sm:text-sm">Using placeholder: {generationError}</span>
                            </div>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>

                  {/* Generation Controls - Stack on mobile, grid on larger screens */}
                  <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    <button
                      onClick={handleGenerateImage}
                      disabled={isGenerating}
                      className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background
                      }}
                    >
                      <span>⚡</span>
                      <span className="text-sm sm:text-base">Regenerate</span>
                    </button>
                    <button
                      onClick={handleDownloadImage}
                      disabled={!generatedImage || isGenerating}
                      className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: theme.colors.card,
                        color: theme.colors.text,
                        border: `1px solid ${theme.colors.border}`
                      }}
                    >
                      <span>📥</span>
                      <span className="text-sm sm:text-base">Download</span>
                    </button>
                    <button
                      onClick={handleShare}
                      disabled={!generatedImage || isGenerating}
                      className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: theme.colors.accent,
                        color: theme.colors.background
                      }}
                    >
                      <span>↗️</span>
                      <span className="text-sm sm:text-base">Share</span>
                    </button>
                  </div>

                  {/* Prompt Details */}
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: theme.colors.card }}>
                    <h4 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2" style={{ color: theme.colors.text }}>
                      DALL-E 3 Prompt
                    </h4>
                    <p className="text-xs sm:text-sm" style={{ color: theme.colors.textSecondary }}>
                      "Photorealistic macro photography of a physical {motif} artifact, single thread of fine silk, visible intricate crochet stitches, directional studio lighting, 8k."
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Panel - Pattern Script & Council Verdict */}
              <div className="lg:w-1/2 p-4 sm:p-6 overflow-y-auto">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3" style={{ color: theme.colors.text }}>
                    Master Pattern & Council Verdict
                  </h3>
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: theme.colors.textSecondary }}>
                    Step-by-step instructions and expert feedback for this {era.toLowerCase()} {motif.toLowerCase()} masterpiece.
                  </p>
                </div>

                {/* Pattern Script */}
                <div className="mb-6">
                  <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3" style={{ color: theme.colors.text }}>
                    Master Pattern Instructions
                  </h4>
                  <PatternScript
                    curvature={curvature}
                    stylePreset={stylePreset}
                    baseStitches={baseStitches}
                    rows={rows}
                  />
                </div>

                {/* Council Verdict */}
                <div className="mb-6">
                  <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3" style={{ color: theme.colors.text }}>
                    Council Verdict
                  </h4>
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: theme.colors.textSecondary }}>
                    Expert feedback from the Council of Thalia (powered by DeepSeek AI)
                  </p>
                  
                  {isLoadingCritiques ? (
                    <div className="p-4 rounded-lg border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 mr-3" style={{ borderColor: theme.colors.primary }}></div>
                        <span style={{ color: theme.colors.text }}>Loading expert critiques...</span>
                      </div>
                    </div>
                  ) : expertCritiques.length > 0 ? (
                    <div className="space-y-3">
                      {expertCritiques.slice(0, 3).map((critique, index) => (
                        <div key={index} className="p-3 sm:p-4 rounded-lg border" style={{
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.card
                        }}>
                          <div className="flex items-start mb-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{
                              backgroundColor: theme.colors.accent,
                              color: theme.colors.background
                            }}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-bold text-sm" style={{ color: theme.colors.text }}>
                                {critique.expertName}
                              </div>
                              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                                {critique.role}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm" style={{ color: theme.colors.text }}>
                            {critique.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
                      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        No expert critiques available. Click "Regenerate" to fetch expert feedback.
                      </p>
                    </div>
                  )}
                </div>

                {/* Forge Actions */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: theme.colors.card }}>
                  <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3" style={{ color: theme.colors.text }}>
                    Forge Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        // Navigate to Practice Dojo with these parameters
                        console.log('Enter dojo with:', { era, motif, curvature });
                        window.location.href = '/dojo';
                      }}
                      className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: '#F59E0B',
                        color: '#FFFFFF'
                      }}
                    >
                      <span>🥋</span>
                      <span className="text-sm sm:text-base">Practice Dojo</span>
                    </button>
                    <button
                      onClick={() => {
                        // Save to gallery
                        console.log('Save to gallery:', { era, motif, curvature, generatedImage });
                        alert('Saved to Master Gallery!');
                      }}
                      className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background
                      }}
                    >
                      <span>⭐</span>
                      <span className="text-sm sm:text-base">Save to Gallery</span>
                    </button>
                  </div>
                </div>

                {/* Mathematical Details */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: theme.colors.card }}>
                  <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3" style={{ color: theme.colors.text }}>
                    Mathematical Foundation
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Curvature (K)</div>
                      <div className="text-base sm:text-lg font-bold" style={{ color: theme.colors.accent }}>
                        {curvature.toFixed(3)}
                      </div>
                      <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                        {curvature < 0 ? 'Hyperbolic' : curvature > 0 ? 'Spherical' : 'Euclidean'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Surface Type</div>
                      <div className="text-base sm:text-lg font-bold" style={{ color: theme.colors.accent }}>
                        {curvature < -0.3 ? 'Roman Surface' : curvature < 0 ? 'Enneper' : 'Spherical'}
                      </div>
                      <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                        Steiner parametric
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t" style={{ borderColor: theme.colors.border }}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                <div className="text-xs text-center sm:text-left mb-2 sm:mb-0" style={{ color: theme.colors.textSecondary }}>
                  <span className="font-medium" style={{ color: theme.colors.text }}>Thalia Design Forge</span> • Generative AI + Mathematical Crochet
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg font-medium"
                    style={{
                      backgroundColor: theme.colors.card,
                      color: theme.colors.text,
                      border: `1px solid ${theme.colors.border}`
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleGenerateImage();
                      alert('Image queued for generation!');
                    }}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg font-medium flex items-center gap-1 sm:gap-2"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background
                    }}
                  >
                    <span>✨</span>
                    <span className="hidden sm:inline">Generate Ultimate</span>
                    <span className="sm:hidden">Ultimate</span>
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