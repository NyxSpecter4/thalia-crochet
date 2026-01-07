import React, { useState, useEffect } from 'react';
import { councilMembers, getInsightsForNode, type CouncilMember } from '../data/council';
import { useTheme } from '../context/ThemeContext';
import { fetchExpertQuotesForNode, extractMeaning, extractTechnicalRecipe } from '../services/researchService';

interface CouncilSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNodeId: number | null;
}

const CouncilSidebar: React.FC<CouncilSidebarProps> = ({ isOpen, onClose, selectedNodeId }) => {
  const { theme } = useTheme();
  const [selectedMember, setSelectedMember] = useState<CouncilMember | null>(null);
  const [expertQuotes, setExpertQuotes] = useState<any[]>([]);
  
  const insights = selectedNodeId ? getInsightsForNode(selectedNodeId) : [];
  
  useEffect(() => {
    if (selectedNodeId !== null) {
      fetchExpertQuotesForNode(selectedNodeId).then(quotes => {
        setExpertQuotes(quotes);
      });
    } else {
      setExpertQuotes([]);
    }
  }, [selectedNodeId]);
  
  const handleMemberClick = (member: CouncilMember) => {
    setSelectedMember(member);
  };
  
  const handleBackToCouncil = () => {
    setSelectedMember(null);
  };
  
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed md:right-0 md:top-0 md:h-full md:w-96 bottom-0 left-0 md:left-auto w-full md:max-h-full max-h-[85vh] bg-card border-t md:border-l border-border shadow-2xl z-50 overflow-y-auto transition-transform duration-300"
      style={{
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
        color: theme.colors.text
      }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: theme.colors.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: theme.colors.accent }}>
              {selectedMember ? selectedMember.title : 'Council of Thalia'}
            </h2>
            <p className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
              {selectedMember 
                ? selectedMember.description 
                : 'Expert insights on stitch patterns and cultural context'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:opacity-80 transition-opacity"
            style={{ backgroundColor: theme.colors.border }}
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {selectedNodeId && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: theme.colors.primary }} />
              <span className="font-medium">Selected Node: #{selectedNodeId}</span>
            </div>
            <p className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
              {insights.length} expert insight{insights.length !== 1 ? 's' : ''} available
            </p>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {selectedMember ? (
          // Member Detail View
          <div>
            <button
              onClick={handleBackToCouncil}
              className="flex items-center text-sm mb-6 hover:opacity-80 transition-opacity"
              style={{ color: theme.colors.primary }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Council
            </button>
            
            <div className="flex items-start mb-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mr-4"
                style={{ backgroundColor: selectedMember.color + '20', color: selectedMember.color }}
              >
                {selectedMember.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  {selectedMember.title}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-2" style={{ color: theme.colors.accent }}>Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMember.expertise.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ 
                      backgroundColor: selectedMember.color + '20',
                      color: selectedMember.color
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-2" style={{ color: theme.colors.accent }}>Cultural References</h4>
              <ul className="space-y-2">
                {selectedMember.culturalReferences.map((ref, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3" style={{ backgroundColor: selectedMember.color }} />
                    <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{ref}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {selectedNodeId && insights.filter(i => i.councilMemberId === selectedMember.id).length > 0 && (
              <div>
                <h4 className="font-semibold mb-3" style={{ color: theme.colors.accent }}>Insight for Node #{selectedNodeId}</h4>
                {insights
                  .filter(insight => insight.councilMemberId === selectedMember.id)
                  .map(insight => (
                    <div 
                      key={insight.id}
                      className="p-4 rounded-lg mb-3"
                      style={{ 
                        backgroundColor: selectedMember.color + '10',
                        borderLeft: `4px solid ${selectedMember.color}`
                      }}
                    >
                      <p className="italic mb-2">"{insight.insight}"</p>
                      <div className="flex justify-between items-center text-sm">
                        <span style={{ color: theme.colors.textSecondary }}>{insight.culturalReference}</span>
                        <span className="px-2 py-1 rounded" style={{ 
                          backgroundColor: selectedMember.color + '20',
                          color: selectedMember.color
                        }}>
                          {insight.era.charAt(0).toUpperCase() + insight.era.slice(1)} Era
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          // Council Overview
          <div>
            <p className="mb-6 text-sm" style={{ color: theme.colors.textSecondary }}>
              Click on an expert to explore their perspective. When a stitch node is selected, relevant insights will appear.
            </p>
            
            <div className="space-y-4">
              {councilMembers.map(member => (
                <div
                  key={member.id}
                  onClick={() => handleMemberClick(member)}
                  className="p-4 rounded-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    borderLeft: `4px solid ${member.color}`
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex items-center mb-3 md:mb-0 md:mr-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl mr-4"
                        style={{ backgroundColor: member.color + '20', color: member.color }}
                      >
                        {member.icon}
                      </div>
                      <div className="flex-1 md:hidden">
                        <h3 className="font-bold">{member.name}</h3>
                        <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                          {member.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 md:flex md:items-center md:justify-between">
                      <div className="hidden md:block">
                        <h3 className="font-bold">{member.name}</h3>
                        <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                          {member.title}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 md:mt-0">
                        <div className="text-xs px-2 py-1 rounded-full self-start md:self-auto" style={{
                          backgroundColor: member.color + '20',
                          color: member.color
                        }}>
                          {member.expertise.length} specialties
                        </div>
                        {selectedNodeId && insights.filter(i => i.councilMemberId === member.id).length > 0 && (
                          <div className="text-xs px-2 py-1 rounded-full self-start md:self-auto" style={{
                            backgroundColor: theme.colors.primary + '20',
                            color: theme.colors.primary
                          }}>
                            {insights.filter(i => i.councilMemberId === member.id).length} insight{insights.filter(i => i.councilMemberId === member.id).length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm mt-3" style={{ color: theme.colors.textSecondary }}>
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
            
            {selectedNodeId && insights.length > 0 && (
              <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.colors.border }}>
                <h4 className="font-semibold mb-3" style={{ color: theme.colors.accent }}>
                  Insights for Node #{selectedNodeId}
                </h4>
                <div className="space-y-3">
                  {insights.map(insight => {
                    const member = councilMembers.find(m => m.id === insight.councilMemberId);
                    return (
                      <div
                        key={insight.id}
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: theme.colors.background,
                          border: `1px solid ${theme.colors.border}`
                        }}
                      >
                        <div className="flex items-center mb-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3"
                            style={{ backgroundColor: member?.color + '20', color: member?.color }}
                          >
                            {member?.icon}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{member?.title}</div>
                            <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                              Relevance: {(insight.relevanceScore * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                        <p className="text-sm italic">"{insight.insight}"</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Expert Quotes from Database */}
            {selectedNodeId && expertQuotes.length > 0 && (
              <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.colors.border }}>
                <h4 className="font-semibold mb-3" style={{ color: theme.colors.accent }}>
                  Expert Quotes from Research
                </h4>
                <div className="space-y-3">
                  {expertQuotes.map((quote, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: theme.colors.background,
                        border: `1px solid ${theme.colors.border}`
                      }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3" style={{ backgroundColor: theme.colors.primary + '20', color: theme.colors.primary }}>
                          {quote.author?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{quote.title}</div>
                          <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                            {quote.category} • {quote.author || 'Unknown'}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm italic">"{extractMeaning(quote)}"</p>
                      {quote.content?.technical_recipe && (
                        <div className="mt-2 text-xs" style={{ color: theme.colors.textSecondary }}>
                          <strong>Technical Recipe:</strong> {extractTechnicalRecipe(quote)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-6 border-t" style={{ borderColor: theme.colors.border }}>
        <div className="text-center text-sm" style={{ color: theme.colors.textSecondary }}>
          <p>The Council of Thalia provides multidisciplinary insights blending traditional craft with computational design.</p>
          <p className="mt-2">Click on stitch nodes in the visualization to trigger era-specific expert analysis.</p>
        </div>
      </div>
    </div>
  );
};

export default CouncilSidebar;