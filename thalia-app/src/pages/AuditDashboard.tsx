import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { generatePattern } from '../lib/geometry';

interface Expert {
  id: string;
  name: string;
  role: string;
  specialty: string;
  color: string;
  icon: string;
}

interface AuditResult {
  expertId: string;
  verdict: 'PASS' | 'WARNING' | 'FAIL';
  score: number; // 0-100
  feedback: string;
  recommendations: string[];
}

const AuditDashboard: React.FC = () => {
  const { theme, cycleEra } = useTheme();
  const [curvature, setCurvature] = useState<number>(-0.5);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);

  const pattern = generatePattern(curvature);

  const experts: Expert[] = [
    {
      id: 'textile-cad',
      name: 'Dr. Elara Vance',
      role: 'Textile CAD Specialist',
      specialty: 'Digital Fabrication & Material Simulation',
      color: '#3B82F6',
      icon: '🧵'
    },
    {
      id: 'physicist',
      name: 'Prof. Aris Thorne',
      role: 'Theoretical Physicist',
      specialty: 'Continuum Mechanics & Topology',
      color: '#EF4444',
      icon: '⚛️'
    },
    {
      id: 'hci',
      name: 'Dr. Maya Chen',
      role: 'HCI & Cognitive Scientist',
      specialty: 'Human‑Centered Design & Pattern Recognition',
      color: '#10B981',
      icon: '🧠'
    },
    {
      id: 'geometer',
      name: 'Dr. Silas Reed',
      role: 'Differential Geometer',
      specialty: 'Non‑Euclidean Geometry & Curvature Analysis',
      color: '#8B5CF6',
      icon: '📐'
    },
    {
      id: 'ethno-math',
      name: 'Dr. Amara Okoro',
      role: 'Ethno‑Mathematician',
      specialty: 'Cultural Pattern Systems & Symbolic Encoding',
      color: '#F59E0B',
      icon: '🌍'
    }
  ];

  const handleRunAudit = async () => {
    setIsAuditing(true);
    
    // Simulate API call to DeepSeek for strategic audit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock audit results based on curvature
    const mockResults: AuditResult[] = experts.map(expert => {
      let verdict: 'PASS' | 'WARNING' | 'FAIL' = 'PASS';
      let score = 85;
      let feedback = '';
      let recommendations: string[] = [];
      
      switch (expert.id) {
        case 'textile-cad':
          score = curvature < -0.3 ? 90 : curvature > 0.3 ? 70 : 85;
          verdict = score > 80 ? 'PASS' : score > 60 ? 'WARNING' : 'FAIL';
          feedback = `Material stress distribution ${curvature < 0 ? 'optimal for hyperbolic expansion' : 'requires reinforcement at decrease points'}.`;
          recommendations = curvature < 0 
            ? ['Increase stitch density by 15% at row transitions', 'Use medium-weight yarn for structural integrity']
            : ['Implement slip‑stitch joins at every 4th stitch', 'Consider double‑crochet reinforcement'];
          break;
          
        case 'physicist':
          score = Math.abs(curvature) > 0.7 ? 65 : Math.abs(curvature) < 0.2 ? 75 : 85;
          verdict = score > 80 ? 'PASS' : score > 60 ? 'WARNING' : 'FAIL';
          feedback = `Hoop stress (σ) = ${(Math.abs(curvature) * 12.5).toFixed(1)} MPa. ${curvature > 0.5 ? 'Risk of spherical collapse at K > 0.5' : 'Within safe parameters'}.`;
          recommendations = ['Monitor tension at row 4-5 transition', 'Validate against Euler‑Bernoulli beam theory'];
          break;
          
        case 'hci':
          score = 88;
          verdict = 'PASS';
          feedback = 'Pattern complexity aligns with expert‑artisan cognitive load. Visual hierarchy effectively communicates stitch progression.';
          recommendations = ['Add tactile markers for visually impaired crafters', 'Consider color‑coding for different curvature zones'];
          break;
          
        case 'geometer':
          score = Math.abs(curvature) > 0.1 ? 92 : 68;
          verdict = score > 80 ? 'PASS' : score > 60 ? 'WARNING' : 'FAIL';
          feedback = `Gaussian curvature K = ${curvature.toFixed(3)} creates ${curvature < 0 ? 'hyperbolic saddle' : 'spherical dome'} topology.`;
          recommendations = ['Verify Gauss‑Bonnet theorem compliance', 'Check for singularities at stitch junctions'];
          break;
          
        case 'ethno-math':
          score = 95;
          verdict = 'PASS';
          feedback = 'Pattern encodes cultural resonance through Fibonacci‑based stitch progression. Symbolic density appropriate for ceremonial use.';
          recommendations = ['Document symbolic mapping for cultural preservation', 'Consider adding "hidden message" stitches'];
          break;
      }
      
      return {
        expertId: expert.id,
        verdict,
        score,
        feedback,
        recommendations
      };
    });
    
    setAuditResults(mockResults);
    setIsAuditing(false);
    setSelectedExpert(experts[0].id);
  };

  const getSelectedExpert = () => {
    return experts.find(e => e.id === selectedExpert) || experts[0];
  };

  const getExpertResult = (expertId: string) => {
    return auditResults.find(r => r.expertId === expertId);
  };

  const getOverallVerdict = () => {
    if (auditResults.length === 0) return 'PENDING';
    const fails = auditResults.filter(r => r.verdict === 'FAIL').length;
    const warnings = auditResults.filter(r => r.verdict === 'WARNING').length;
    
    if (fails > 0) return 'FAIL';
    if (warnings > 0) return 'WARNING';
    return 'PASS';
  };

  const overallVerdict = getOverallVerdict();

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif mb-2" style={{ color: theme.colors.accent }}>
                STRATEGIC AUDIT DASHBOARD
              </h1>
              <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
                Jury of 5 Experts • Brutal Peer‑Review for Computational Crochet
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cycleEra}
                className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
              >
                {theme.name} Era
              </button>
              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 relative overflow-hidden"
                style={{ 
                  backgroundColor: isAuditing ? theme.colors.card : '#D4AF37',
                  color: isAuditing ? theme.colors.text : '#1a1a1a',
                  boxShadow: isAuditing ? `0 0 25px ${theme.colors.accent}` : '0 0 20px rgba(212, 175, 55, 0.8)'
                }}
              >
                {isAuditing ? (
                  <>
                    <span className="animate-pulse">AUDITING...</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </>
                ) : (
                  <>
                    <span className="font-bold">RUN STRATEGIC AUDIT</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent animate-shimmer" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="rounded-xl p-4 border" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Current Curvature</div>
              <div className="text-2xl font-bold" style={{ color: theme.colors.accent }}>K = {curvature.toFixed(2)}</div>
              <div className="text-sm">{curvature < 0 ? 'Hyperbolic' : curvature > 0 ? 'Spherical' : 'Euclidean'}</div>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Total Stitches</div>
              <div className="text-2xl font-bold" style={{ color: theme.colors.primary }}>{pattern.stitches.reduce((a, b) => a + b, 0)}</div>
              <div className="text-sm">Across {pattern.rows} rows</div>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Expert Jury</div>
              <div className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>5</div>
              <div className="text-sm">Specialized disciplines</div>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Audit Status</div>
              <div className="text-2xl font-bold" style={{ 
                color: overallVerdict === 'PASS' ? '#10B981' : 
                       overallVerdict === 'WARNING' ? '#F59E0B' : 
                       overallVerdict === 'FAIL' ? '#EF4444' : theme.colors.textSecondary
              }}>
                {overallVerdict}
              </div>
              <div className="text-sm">{auditResults.length > 0 ? `${auditResults.filter(r => r.verdict === 'PASS').length}/5 passed` : 'Not run'}</div>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>DeepSeek AI</div>
              <div className="text-2xl font-bold" style={{ color: '#06B6D4' }}>V3</div>
              <div className="text-sm">Strategic analysis engine</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Expert Jury */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.colors.card + '80', borderColor: theme.colors.border }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.primary }}>The Jury of 5 Experts</h2>
              <p className="text-sm mb-6" style={{ color: theme.colors.textSecondary }}>
                Each expert analyzes your pattern through their specialized lens. Click to see detailed verdict.
              </p>
              
              <div className="space-y-4">
                {experts.map(expert => {
                  const result = getExpertResult(expert.id);
                  return (
                    <button
                      key={expert.id}
                      onClick={() => setSelectedExpert(expert.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${selectedExpert === expert.id ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                      style={{
                        backgroundColor: selectedExpert === expert.id ? expert.color + '20' : theme.colors.background,
                        borderColor: selectedExpert === expert.id ? expert.color : theme.colors.border,
                        borderWidth: selectedExpert === expert.id ? '2px' : '1px'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{expert.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold" style={{ color: theme.colors.text }}>{expert.name}</h3>
                            {result && (
                              <span className="text-xs px-2 py-1 rounded-full" style={{
                                backgroundColor: result.verdict === 'PASS' ? '#10B98120' :
                                               result.verdict === 'WARNING' ? '#F59E0B20' : '#EF444420',
                                color: result.verdict === 'PASS' ? '#10B981' :
                                       result.verdict === 'WARNING' ? '#F59E0B' : '#EF4444'
                              }}>
                                {result.verdict}
                              </span>
                            )}
                          </div>
                          <div className="text-sm mb-1" style={{ color: expert.color }}>{expert.role}</div>
                          <p className="text-xs" style={{ color: theme.colors.textSecondary }}>{expert.specialty}</p>
                          
                          {result && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs" style={{ color: theme.colors.textSecondary }}>Score:</span>
                                <span className="text-sm font-medium" style={{ color: theme.colors.text }}>{result.score}/100</span>
                              </div>
                              <div className="w-full h-2 rounded-full" style={{ backgroundColor: theme.colors.border }}>
                                <div 
                                  className="h-full rounded-full"
                                  style={{ 
                                    width: `${result.score}%`,
                                    backgroundColor: result.score > 80 ? '#10B981' : result.score > 60 ? '#F59E0B' : '#EF4444'
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Curvature Control */}
            <div className="rounded-2xl border p-6 mt-8" style={{ backgroundColor: theme.colors.card + '80', borderColor: theme.colors.border }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.primary }}>Pattern Parameters</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm" style={{ color: theme.colors.text }}>Curvature (K): {curvature.toFixed(2)}</label>
                    <span className="text-xs px-2 py-1 rounded-full" style={{
                      backgroundColor: curvature < 0 ? theme.colors.accent + '20' :
                                    curvature > 0 ? theme.colors.primary + '20' :
                                    theme.colors.border,
                      color: curvature < 0 ? theme.colors.accent :
                            curvature > 0 ? theme.colors.primary :
                            theme.colors.textSecondary
                    }}>
                      {curvature < 0 ? 'Hyperbolic' : curvature > 0 ? 'Spherical' : 'Euclidean'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={curvature}
                    onChange={(e) => setCurvature(parseFloat(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      backgroundColor: theme.colors.border,
                      accentColor: theme.colors.primary
                    }}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                    <span>-1.0</span>
                    <span>0.0</span>
                    <span>+1.0</span>
                  </div>
                </div>
                
                <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.background }}>
                  <h3 className="font-medium mb-2" style={{ color: theme.colors.text }}>Pattern Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Rows</div>
                      <div className="text-lg font-semibold" style={{ color: theme.colors.primary }}>{pattern.rows}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Stitches</div>
                      <div className="text-lg font-semibold" style={{ color: theme.colors.accent }}>{pattern.stitches.reduce((a, b) => a + b, 0)}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Type</div>
                      <div className="text-lg font-semibold capitalize" style={{ color: theme.colors.text }}>{pattern.type}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Density</div>
                      <div className="text-lg font-semibold" style={{ color: theme.colors.text }}>
                        {(() => {
                          const totalStitches = pattern.stitches.reduce((sum: number, count: number) => sum + count, 0);
                          const maxPossible = pattern.rows * Math.max(...pattern.stitches);
                          return (totalStitches / maxPossible).toFixed(2);
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Expert Verdict Details */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.colors.card + '80', borderColor: theme.colors.border }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.primary }}>Expert Verdict</h2>
              
              {selectedExpert && auditResults.length > 0 ? (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{getSelectedExpert().icon}</div>
                      <div>
                        <h3 className="text-2xl font-semibold" style={{ color: theme.colors.text }}>{getSelectedExpert().name}</h3>
                        <div className="text-sm" style={{ color: getSelectedExpert().color }}>{getSelectedExpert().role}</div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-4xl font-bold" style={{
                          color: getExpertResult(selectedExpert)?.verdict === 'PASS' ? '#10B981' :
                                 getExpertResult(selectedExpert)?.verdict === 'WARNING' ? '#F59E0B' : '#EF4444'
                        }}>
                          {getExpertResult(selectedExpert)?.score}/100
                        </div>
                        <div className="text-center text-sm font-medium" style={{
                          color: getExpertResult(selectedExpert)?.verdict === 'PASS' ? '#10B981' :
                                 getExpertResult(selectedExpert)?.verdict === 'WARNING' ? '#F59E0B' : '#EF4444'
                        }}>
                          {getExpertResult(selectedExpert)?.verdict}
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg p-4 mb-4" style={{
                      backgroundColor: getExpertResult(selectedExpert)?.verdict === 'PASS' ? '#10B98110' :
                                      getExpertResult(selectedExpert)?.verdict === 'WARNING' ? '#F59E0B10' : '#EF444410',
                      borderLeft: `4px solid ${getExpertResult(selectedExpert)?.verdict === 'PASS' ? '#10B981' :
                                  getExpertResult(selectedExpert)?.verdict === 'WARNING' ? '#F59E0B' : '#EF4444'}`
                    }}>
                      <h4 className="font-medium mb-2" style={{ color: theme.colors.text }}>Expert Analysis</h4>
                      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        {getExpertResult(selectedExpert)?.feedback}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3" style={{ color: theme.colors.text }}>Recommendations</h4>
                      <ul className="space-y-2">
                        {getExpertResult(selectedExpert)?.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: getSelectedExpert().color }}></div>
                            <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.colors.border }}>
                    <h4 className="font-medium mb-3" style={{ color: theme.colors.text }}>Strategic Audit Questions</h4>
                    <div className="space-y-3">
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.colors.background }}>
                        <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
                          1. Does the current Graph Topology allow for 'Post-Stitches' to Row [n-2]?
                        </div>
                        <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                          {curvature < 0 ? '✅ Yes: Hyperbolic expansion permits retroactive stitches due to negative curvature.' : '⚠️ Limited: Spherical closure restricts post-stitch capacity.'}
                        </div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.colors.background }}>
                        <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
                          2. Based on the Curvature (K), where is the 'Material Collapse' point?
                        </div>
                        <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                          {curvature > 0.3 ? `⚠️ Estimated at K = 0.45 (current: ${curvature.toFixed(2)} - close to collapse)` : `✅ Safe: Material collapse point estimated at K = 0.65 (current: ${curvature.toFixed(2)})`}
                        </div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: theme.colors.background }}>
                        <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text }}>
                          3. Is the 'One Live Stitch' constraint maintained in the current compiler output?
                        </div>
                        <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                          {curvature < 0 ? '✅ Yes: Hyperbolic expansion maintains single live stitch per row.' : '⚠️ Requires slip-stitch joins at decreases to maintain constraint.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <div className="text-4xl mb-4" style={{ color: theme.colors.textSecondary }}>⚖️</div>
                  <h3 className="text-xl font-medium mb-2" style={{ color: theme.colors.primary }}>Awaiting Audit Results</h3>
                  <p className="text-sm mb-6" style={{ color: theme.colors.textSecondary }}>
                    Run the Strategic Audit to receive expert verdicts from the Jury of 5.
                  </p>
                  <button
                    onClick={handleRunAudit}
                    className="px-6 py-3 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.background
                    }}
                  >
                    Run Strategic Audit
                  </button>
                </div>
              )}
            </div>
            
            {/* Overall Summary */}
            {auditResults.length > 0 && (
              <div className="rounded-2xl border p-6 mt-8" style={{ backgroundColor: theme.colors.card + '80', borderColor: theme.colors.border }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.primary }}>Overall Audit Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Overall Verdict</div>
                    <div className="text-2xl font-bold mt-1" style={{
                      color: overallVerdict === 'PASS' ? '#10B981' :
                            overallVerdict === 'WARNING' ? '#F59E0B' : '#EF4444'
                    }}>
                      {overallVerdict}
                    </div>
                    <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                      Based on 5 expert analyses
                    </div>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Average Score</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: theme.colors.accent }}>
                      {Math.round(auditResults.reduce((sum, r) => sum + r.score, 0) / auditResults.length)}/100
                    </div>
                    <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                      Across all disciplines
                    </div>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Critical Issues</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: '#EF4444' }}>
                      {auditResults.filter(r => r.verdict === 'FAIL').length}
                    </div>
                    <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                      Requiring immediate attention
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3" style={{ color: theme.colors.text }}>Next Steps</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        {overallVerdict === 'PASS' ? 'Pattern is production-ready. Proceed with confidence.' :
                         overallVerdict === 'WARNING' ? 'Address warnings before production deployment.' :
                         'Critical issues detected. Major revisions required.'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        Consult the detailed expert recommendations for specific fixes.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        Re-run audit after implementing changes to verify improvements.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm" style={{ color: theme.colors.textSecondary }}>
          <p>STRATEGIC AUDIT DASHBOARD • Powered by DeepSeek AI • Jury of 5 Experts • Ready for professional peer‑review</p>
        </div>
      </div>
    </div>
  );
};

export default AuditDashboard;