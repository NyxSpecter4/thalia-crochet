import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { generateHyperbolicNodes, generatePattern } from '../lib/geometry';

interface AuditFinding {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  stitchFix?: string;
}

const AuditPage: React.FC = () => {
  const { theme, cycleEra } = useTheme();
  const [curvature, setCurvature] = useState<number>(-0.5);
  const [nodes, setNodes] = useState(generateHyperbolicNodes(-0.5, 12, 5));
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditFindings, setAuditFindings] = useState<AuditFinding[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pattern = generatePattern(curvature);

  // Mock audit findings based on curvature
  useEffect(() => {
    const findings: AuditFinding[] = [];
    
    if (curvature < -0.7) {
      findings.push({
        id: 'hyperbolic-stress',
        title: 'Hyperbolic Stress Concentration',
        severity: 'high',
        description: 'Excessive negative curvature creates tension points at row transitions.',
        recommendation: 'Add reinforcement stitches at rows 3 and 5.',
        stitchFix: 'Row 3: (2 dc in next st) × 2'
      });
    }
    
    if (curvature > 0.3) {
      findings.push({
        id: 'spherical-collapse',
        title: 'Potential Spherical Collapse',
        severity: 'critical',
        description: 'Positive curvature may cause inward buckling at row 4.',
        recommendation: 'Introduce structural decreases gradually.',
        stitchFix: 'Row 4: (dc2tog) every 4th stitch'
      });
    }
    
    setAuditFindings(findings);
  }, [curvature]);

  // Draw heatmap on canvas
  useEffect(() => {
    if (!canvasRef.current || !showHeatmap) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 600;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    nodes.forEach((node, index) => {
      const tension = Math.abs(curvature) * (index % 3 === 0 ? 1.5 : 1);
      const heatColor = tension > 0.7 
        ? `rgba(255, 50, 50, ${0.3 + tension * 0.5})`
        : tension > 0.4 
        ? `rgba(255, 165, 0, ${0.3 + tension * 0.5})`
        : `rgba(50, 205, 50, ${0.3 + tension * 0.5})`;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size + 8, 0, Math.PI * 2);
      ctx.fillStyle = heatColor;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = curvature < 0 ? theme.colors.accent : theme.colors.primary;
      ctx.fill();
    });
  }, [nodes, curvature, showHeatmap, theme]);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Running strategic audit with curvature:', curvature);
    setIsAuditing(false);
  };

  const handleCurvatureChange = (value: number) => {
    setCurvature(value);
    setNodes(generateHyperbolicNodes(value, 12, 5));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif mb-2" style={{ color: theme.colors.accent }}>
                THALIA V3: STRATEGIC AUDIT
              </h1>
              <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
                Peer‑Review Dashboard for Computational Crochet
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Audit Findings</div>
              <div className="text-2xl font-bold" style={{ color: '#EF4444' }}>{auditFindings.length}</div>
              <div className="text-sm">Technical issues detected</div>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Pattern Integrity</div>
              <div className="text-2xl font-bold" style={{ 
                color: auditFindings.some(f => f.severity === 'critical') ? '#EF4444' : 
                       auditFindings.some(f => f.severity === 'high') ? '#F97316' : '#10B981'
              }}>
                {auditFindings.some(f => f.severity === 'critical') ? 'CRITICAL' : 
                 auditFindings.some(f => f.severity === 'high') ? 'NEEDS WORK' : 'STABLE'}
              </div>
              <div className="text-sm">Based on hoop stress analysis</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.colors.card + '80', borderColor: theme.colors.border }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold" style={{ color: theme.colors.primary }}>3D Graph with Physics Heatmap</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: theme.colors.textSecondary }}>Heatmap:</span>
                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${showHeatmap ? 'opacity-100' : 'opacity-60'}`}
                    style={{ 
                      backgroundColor: showHeatmap ? theme.colors.accent : theme.colors.card,
                      color: showHeatmap ? theme.colors.background : theme.colors.text
                    }}
                  >
                    {showHeatmap ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
              
              <div className="relative rounded-xl overflow-hidden border-2" style={{ borderColor: theme.colors.border }}>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
                
                {showHeatmap && (
                  <div className="absolute bottom-4 right-4 backdrop-blur-sm rounded-lg p-3" style={{ 
                    backgroundColor: theme.colors.card + 'CC',
                    border: `1px solid ${theme.colors.border}`
                  }}>
                    <div className="text-sm font-medium mb-2">Tension Heatmap</div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full bg-green-500/70"></div>
                      <span className="text-xs">Low ({'<'} 0.4)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full bg-orange-500/70"></div>
                      <span className="text-xs">Medium (0.4‑0.7)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500/70"></div>
                      <span className="text-xs">High ({'>'} 0.7)</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
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
                  onChange={(e) => handleCurvatureChange(parseFloat(e.target.value))}
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
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.primary }}>Audit Findings</h2>
              <div className="space-y-4">
                {auditFindings.map((finding) => (
                  <div key={finding.id} className="p-4 rounded-lg border" style={{ 
                    backgroundColor: theme.colors.card + '40',
                    borderColor: finding.severity === 'critical' ? '#EF4444' : 
                                finding.severity === 'high' ? '#F97316' : 
                                finding.severity === 'medium' ? '#F59E0B' : '#10B981'
                  }}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold" style={{ color: theme.colors.text }}>{finding.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full" style={{
                        backgroundColor: finding.severity === 'critical' ? '#EF4444' + '20' :
                                      finding.severity === 'high' ? '#F97316' + '20' :
                                      finding.severity === 'medium' ? '#F59E0B' + '20' : '#10B981' + '20',
                        color: finding.severity === 'critical' ? '#EF4444' :
                              finding.severity === 'high' ? '#F97316' :
                              finding.severity === 'medium' ? '#F59E0B' : '#10B981'
                      }}>
                        {finding.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: theme.colors.textSecondary }}>{finding.description}</p>
                    <div className="text-sm" style={{ color: theme.colors.accent }}>
                      <strong>Recommendation:</strong> {finding.recommendation}
                    </div>
                    {finding.stitchFix && (
                      <div className="text-sm mt-2 font-mono" style={{ color: theme.colors.primary }}>
                        <strong>Stitch Fix:</strong> {finding.stitchFix}
                      </div>
                    )}
                  </div>
                ))}
                {auditFindings.length === 0 && (
                  <div className="text-center py-8" style={{ color: theme.colors.textSecondary }}>
                    <div className="text-4xl mb-2">✓</div>
                    <p>No critical issues detected. Pattern integrity is stable.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditPage;
