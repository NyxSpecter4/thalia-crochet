import React from 'react';
import { researchData, RESEARCH_GAPS, getResearchProgress, PHYSICS_CONSTANTS } from '../data/researchConstants';
import { generateResearchIntegrationReport } from '../lib/geometry';
import { useTheme } from '../context/ThemeContext';

interface ResearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  compact?: boolean;
}

const ResearchPanel: React.FC<ResearchPanelProps> = ({ isOpen, onClose, compact = false }) => {
  const { theme } = useTheme();
  const researchReport = generateResearchIntegrationReport();
  const progress = getResearchProgress();
  
  if (!isOpen) return null;
  
  if (compact) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div 
          className="rounded-xl border max-w-md w-full max-h-[80vh] overflow-y-auto"
          style={{
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            color: theme.colors.text
          }}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif" style={{ color: theme.colors.accent }}>Research Status</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm" style={{ color: theme.colors.textSecondary }}>Overall Progress</span>
                <span className="font-bold" style={{ color: theme.colors.accent }}>{progress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.border }}>
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    backgroundColor: theme.colors.accent,
                    width: `${progress}%`
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              {Object.entries(researchData).map(([key, research]) => (
                <div 
                  key={key}
                  className="p-3 rounded-lg border"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium capitalize" style={{ color: theme.colors.text }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h4>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 
                          research.status === 'FOUND' ? '#10B98120' :
                          research.status === 'PARTIAL' || research.status === 'EXAMPLE_FOUND' ? '#F59E0B20' :
                          '#EF444420',
                        color:
                          research.status === 'FOUND' ? '#10B981' :
                          research.status === 'PARTIAL' || research.status === 'EXAMPLE_FOUND' ? '#F59E0B' :
                          '#EF4444'
                      }}
                    >
                      {research.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    {research.description.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
            
            <button
              onClick={onClose}
              className="w-full mt-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.background
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="rounded-xl border max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          color: theme.colors.text
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-serif" style={{ color: theme.colors.accent }}>THALIA Research Integration</h2>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Physics model constants and research status
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              ×
            </button>
          </div>
          
          {/* Progress Overview */}
          <div className="mb-8 p-4 rounded-lg border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium" style={{ color: theme.colors.text }}>Research Integration Progress</h3>
              <div className="text-2xl font-bold" style={{ color: theme.colors.accent }}>{progress}%</div>
            </div>
            <div className="h-4 rounded-full overflow-hidden mb-3" style={{ backgroundColor: theme.colors.border }}>
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  backgroundColor: theme.colors.accent,
                  width: `${progress}%`
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Aari Stitch Density</div>
                <div style={{ color: theme.colors.text }}>{researchReport.aariStatus}</div>
              </div>
              <div>
                <div className="font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Silver Physics</div>
                <div style={{ color: theme.colors.text }}>{researchReport.silverPhysicsStatus}</div>
              </div>
              <div>
                <div className="font-medium mb-1" style={{ color: theme.colors.textSecondary }}>Boy's Surface</div>
                <div style={{ color: theme.colors.text }}>{researchReport.boysSurfaceStatus}</div>
              </div>
            </div>
          </div>
          
          {/* Research Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Aari Stitch Density */}
            <div className="p-4 rounded-lg border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
              <h3 className="text-lg font-medium mb-3 flex items-center" style={{ color: theme.colors.accent }}>
                <span className="mr-2">🌺</span>
                Aari Stitch Density
              </h3>
              <div className="mb-4">
                <div className="text-sm mb-2" style={{ color: theme.colors.textSecondary }}>Status: {researchData.aariPrecision.status}</div>
                <p className="text-sm mb-4" style={{ color: theme.colors.text }}>
                  {researchData.aariPrecision.description}
                </p>
                <div className="p-3 rounded border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
                  <div className="font-medium mb-2" style={{ color: theme.colors.text }}>Estimated Values</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div style={{ color: theme.colors.textSecondary }}>Gulabi Shading:</div>
                      <div style={{ color: theme.colors.text }}>{PHYSICS_CONSTANTS.AARI_STITCH_DENSITY.gulabiShading.min}-{PHYSICS_CONSTANTS.AARI_STITCH_DENSITY.gulabiShading.max} stitches/cm</div>
                    </div>
                    <div>
                      <div style={{ color: theme.colors.textSecondary }}>Confidence:</div>
                      <div style={{ color: theme.colors.text }}>{PHYSICS_CONSTANTS.AARI_STITCH_DENSITY.gulabiShading.confidence}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                <strong>Research Gap:</strong> {researchData.aariPrecision.data?.researchGap}
              </div>
            </div>
            
            {/* Silver Plating Physics */}
            <div className="p-4 rounded-lg border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
              <h3 className="text-lg font-medium mb-3 flex items-center" style={{ color: theme.colors.accent }}>
                <span className="mr-2">⚡</span>
                Silver-Plated Nylon Physics
              </h3>
              <div className="mb-4">
                <div className="text-sm mb-2" style={{ color: theme.colors.textSecondary }}>Status: {researchData.silverPlatingPhysics.status}</div>
                <p className="text-sm mb-4" style={{ color: theme.colors.text }}>
                  {researchData.silverPlatingPhysics.description}
                </p>
                <div className="p-3 rounded border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
                  <div className="font-medium mb-2" style={{ color: theme.colors.text }}>Material Properties</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div style={{ color: theme.colors.textSecondary }}>Young's Modulus:</div>
                      <div style={{ color: theme.colors.text }}>{PHYSICS_CONSTANTS.SILVER_PLATED_NYLON.youngsModulus.min}-{PHYSICS_CONSTANTS.SILVER_PLATED_NYLON.youngsModulus.max} {PHYSICS_CONSTANTS.SILVER_PLATED_NYLON.youngsModulus.unit}</div>
                    </div>
                    <div>
                      <div style={{ color: theme.colors.textSecondary }}>Fracture Strain:</div>
                      <div style={{ color: theme.colors.text }}>{PHYSICS_CONSTANTS.SILVER_PLATED_NYLON.fractureStrain.estimated} (coating)</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                <strong>Critical Missing Data:</strong> Fracture strain for thin silver coatings on nylon fibers
              </div>
            </div>
            
            {/* Boy's Surface */}
            <div className="p-4 rounded-lg border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
              <h3 className="text-lg font-medium mb-3 flex items-center" style={{ color: theme.colors.accent }}>
                <span className="mr-2">🌀</span>
                Boy's Surface Topology
              </h3>
              <div className="mb-4">
                <div className="text-sm mb-2" style={{ color: theme.colors.textSecondary }}>Status: {researchData.topology.status}</div>
                <p className="text-sm mb-4" style={{ color: theme.colors.text }}>
                  {researchData.topology.description}
                </p>
                <div className="p-3 rounded border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
                  <div className="font-medium mb-2" style={{ color: theme.colors.text }}>Surface Parameters</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div style={{ color: theme.colors.textSecondary }}>Lobe Count:</div>
                      <div style={{ color: theme.colors.text }}>{PHYSICS_CONSTANTS.BOYS_SURFACE.lobeCount}</div>
                    </div>
                    <div>
                      <div style={{ color: theme.colors.textSecondary }}>α Parameter Range:</div>
                      <div style={{ color: theme.colors.text }}>{PHYSICS_CONSTANTS.BOYS_SURFACE.alphaRange[0]} to {PHYSICS_CONSTANTS.BOYS_SURFACE.alphaRange[1]}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                <strong>Algorithm Gap:</strong> Lofting algorithm for flat-foldable crochet decomposition
              </div>
            </div>
            
            {/* Research Gaps */}
            <div className="p-4 rounded-lg border lg:col-span-2" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: theme.colors.accent }}>Research Gaps & Next Steps</h3>
              <div className="space-y-3">
                {RESEARCH_GAPS.map((gap) => (
                  <div 
                    key={gap.id}
                    className="p-3 rounded border"
                    style={{
                      borderColor: 
                        gap.priority === 'high' ? '#EF4444' :
                        gap.priority === 'medium' ? '#F59E0B' : '#10B981',
                      backgroundColor: theme.colors.card
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium" style={{ color: theme.colors.text }}>{gap.title}</h4>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: 
                            gap.priority === 'high' ? '#EF444420' :
                            gap.priority === 'medium' ? '#F59E0B20' : '#10B98120',
                          color:
                            gap.priority === 'high' ? '#EF4444' :
                            gap.priority === 'medium' ? '#F59E0B' : '#10B981'
                        }}
                      >
                        {gap.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: theme.colors.text }}>{gap.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: theme.colors.border, color: theme.colors.text }}>
                        📚 {gap.sources[0]}
                      </div>
                      <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: theme.colors.border, color: theme.colors.text }}>
                        ⏱️ {gap.estimatedEffort}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium border"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }}
            >
              Close
            </button>
            <button
              onClick={() => {
                // In a real implementation, this would trigger research actions
                console.log('Research actions triggered');
              }}
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.background
              }}
            >
              Export Research Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPanel;