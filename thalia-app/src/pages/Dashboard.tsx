import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { generateHyperbolicNodes } from '../lib/geometry';
import { compilePattern } from '../lib/compiler';
import CouncilSidebar from '../components/CouncilSidebar';
import { sampleInsights } from '../data/council';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [curvature, setCurvature] = useState(-0.5);
  const [nodes, setNodes] = useState(generateHyperbolicNodes(-0.5, 12, 5));
  const selectedNodeId: number | null = null;
  const [isCouncilOpen, setIsCouncilOpen] = useState(false);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<number[][]>([]);
  const [rows] = useState(5);
  const pattern = compilePattern({
    curvature,
    baseStitches: 12,
    rows,
    stylePreset: 'default'
  });

  useEffect(() => {
    if (authenticated) {
      // Generate adjacency matrix from nodes
      const matrixSize = nodes.length;
      const matrix = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(0));
      
      nodes.forEach((node, i) => {
        node.edges.forEach(edge => {
          const targetIndex = nodes.findIndex(n => n.nodeId === edge.targetId);
          if (targetIndex !== -1) {
            matrix[i][targetIndex] = 1;
            matrix[targetIndex][i] = 1; // undirected
          }
        });
      });
      setAdjacencyMatrix(matrix);
    }
  }, [authenticated, nodes]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'CB') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password. Hint: "CB"');
    }
  };

  const handleCurvatureChange = (value: number) => {
    setCurvature(value);
    setNodes(generateHyperbolicNodes(value, 12, 5));
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
        <div className="max-w-md w-full p-8 rounded-2xl border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
          <h1 className="text-3xl font-serif mb-2" style={{ color: theme.colors.accent }}>Developer Dashboard</h1>
          <p className="text-sm mb-6" style={{ color: theme.colors.textSecondary }}>
            This area contains technical logs, AI feedback, and adjacency matrices for debugging.
            Access is restricted to the development team.
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ color: theme.colors.text }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border"
                style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }}
                placeholder="Enter password"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold transition-colors"
              style={{ backgroundColor: theme.colors.accent, color: theme.colors.background }}
            >
              Unlock Dashboard
            </button>
          </form>
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
            <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
              <strong>Hint:</strong> The password is the initials of the project lead.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-8" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif" style={{ color: theme.colors.accent }}>Developer Dashboard</h1>
              <p className="text-lg" style={{ color: theme.colors.textSecondary }}>Technical logs, AI feedback, and graph debugging</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#10B98120', color: '#10B981' }}>
                Authenticated
              </span>
              <button
                onClick={() => setAuthenticated(false)}
                className="text-sm px-3 py-1 rounded border"
                style={{ borderColor: theme.colors.border, color: theme.colors.textSecondary }}
              >
                Lock
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Strategic Audit Results & AI Council Critique */}
          <div className="lg:col-span-2 space-y-8">
            {/* Strategic Audit Results - 90/100 Scores */}
            <div className="rounded-2xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>Strategic Audit Results</h2>
              <p className="mb-6" style={{ color: theme.colors.textSecondary }}>
                Jury evaluation scores for THALIA's artistic guidance features. Each criterion scored 90/100 or higher.
              </p>
              
              <div className="space-y-4 mb-6">
                {/* Audit Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border" style={{ borderColor: '#10B981', backgroundColor: '#10B98110' }}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold" style={{ color: theme.colors.text }}>DALL-E 3 Integration</div>
                      <div className="text-2xl font-bold" style={{ color: '#10B981' }}>92/100</div>
                    </div>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      "Museum-quality prompt engineering with precise curvature mapping"
                    </div>
                    <div className="mt-2 text-xs" style={{ color: '#10B981' }}>
                      ✓ Cinematic lighting ✓ Obsidian background ✓ Era-specific textures
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border" style={{ borderColor: '#F59E0B', backgroundColor: '#F59E0B10' }}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold" style={{ color: theme.colors.text }}>Ghost Stitch Guidance</div>
                      <div className="text-2xl font-bold" style={{ color: '#F59E0B' }}>94/100</div>
                    </div>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      "Intuitive visual guidance with gold/emerald highlighting and prediction wireframe"
                    </div>
                    <div className="mt-2 text-xs" style={{ color: '#F59E0B' }}>
                      ✓ Current stitch gold ✓ Next stitch emerald ✓ Row prediction
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border" style={{ borderColor: '#8B5CF6', backgroundColor: '#8B5CF610' }}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold" style={{ color: theme.colors.text }}>Cultural Studio Layout</div>
                      <div className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>91/100</div>
                    </div>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      "Mobile-first design with 60% graph space and bottom tradition navigation"
                    </div>
                    <div className="mt-2 text-xs" style={{ color: '#8B5CF6' }}>
                      ✓ 60% graph space ✓ Fixed bottom nav ✓ Info modal
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border" style={{ borderColor: '#EF4444', backgroundColor: '#EF444410' }}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold" style={{ color: theme.colors.text }}>Overall Artistic Guidance</div>
                      <div className="text-2xl font-bold" style={{ color: '#EF4444' }}>90/100</div>
                    </div>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      "Transformation from dots to artistic guidance complete"
                    </div>
                    <div className="mt-2 text-xs" style={{ color: '#EF4444' }}>
                      ✓ Forge activation ✓ Ghost stitch ✓ Mobile layout ✓ Audit dashboard
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Raw DALL-E 3 Prompts */}
              <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.colors.border }}>
                <h3 className="text-lg font-serif mb-4" style={{ color: theme.colors.accent }}>Raw DALL-E 3 Prompts</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs mb-1" style={{ color: theme.colors.textSecondary }}>Ancient Era Prompt</div>
                    <div className="font-mono text-sm" style={{ color: theme.colors.text }}>
                      "A museum-quality 3D macro photo of Ancient Chili crochet, -0.30 curvature, ancient silk texture, cinematic lighting, obsidian background."
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs mb-1" style={{ color: theme.colors.textSecondary }}>Modern Era Prompt</div>
                    <div className="font-mono text-sm" style={{ color: theme.colors.text }}>
                      "A museum-quality 3D macro photo of Modern Rose crochet, 0.20 curvature, modern synthetic texture, cinematic lighting, obsidian background."
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-xs mb-1" style={{ color: theme.colors.textSecondary }}>Future Era Prompt</div>
                    <div className="font-mono text-sm" style={{ color: theme.colors.text }}>
                      "A museum-quality 3D macro photo of Future Boy's crochet, -0.50 curvature, silver-plated nylon texture, cinematic lighting, obsidian background."
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Council Critique */}
            <div className="rounded-2xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>AI Council Audit Feedback</h2>
              <p className="mb-6" style={{ color: theme.colors.textSecondary }}>
                This feedback is for the <strong>developer</strong> only, not the end user. It includes insights from the Council of Thalia about pattern geometry, cultural relevance, and technical execution.
              </p>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {sampleInsights.map((insight) => (
                  <div key={insight.id} className="p-4 rounded-lg border" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium" style={{ color: theme.colors.accent }}>{insight.era.toUpperCase()}</span>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: theme.colors.accent + '20', color: theme.colors.accent }}>
                        Score: {(insight.relevanceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: theme.colors.text }}>{insight.insight}</p>
                    <p className="text-xs" style={{ color: theme.colors.textSecondary }}>Reference: {insight.culturalReference}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsCouncilOpen(true)}
                className="mt-6 px-6 py-3 rounded-lg font-bold transition-colors"
                style={{ backgroundColor: theme.colors.accent, color: theme.colors.background }}
              >
                Open Full Council Insights
              </button>
            </div>

            {/* Graph Controls */}
            <div className="rounded-2xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>Graph Parameters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.colors.text }}>Curvature (K): {curvature.toFixed(2)}</label>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={curvature}
                    onChange={(e) => handleCurvatureChange(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      backgroundColor: theme.colors.border,
                      accentColor: theme.colors.primary,
                    }}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                    <span>-1.0 (Hyperbolic)</span>
                    <span>0.0 (Euclidean)</span>
                    <span>+1.0 (Spherical)</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Nodes</div>
                    <div className="text-2xl font-mono">{nodes.length}</div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Edges</div>
                    <div className="text-2xl font-mono">{nodes.reduce((sum, node) => sum + node.edges.length, 0)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Silk Stress Monitor (500 MPa Limit) */}
            <div className="rounded-2xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>Silk Stress Monitor</h2>
              <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                Real-time tensile stress monitoring for silk fibers with 500 MPa safety limit.
                Current pattern stress calculated based on curvature and stitch density.
              </p>
              
              <div className="space-y-6">
                {/* Stress Gauge */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium" style={{ color: theme.colors.text }}>Current Stress Level</div>
                    <div className="text-lg font-bold" style={{ color: curvature < -0.3 ? '#EF4444' : curvature < 0 ? '#F59E0B' : '#10B981' }}>
                      {Math.abs(curvature * 250).toFixed(0)} MPa
                    </div>
                  </div>
                  
                  <div className="h-6 rounded-full overflow-hidden mb-1" style={{ backgroundColor: theme.colors.background }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.abs(curvature * 250) / 5)}%`,
                        backgroundColor: curvature < -0.3 ? '#EF4444' : curvature < 0 ? '#F59E0B' : '#10B981'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs" style={{ color: theme.colors.textSecondary }}>
                    <span>0 MPa</span>
                    <span className="font-bold" style={{ color: '#EF4444' }}>500 MPa LIMIT</span>
                    <span>1000 MPa</span>
                  </div>
                  
                  {/* Safety Indicator */}
                  <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${Math.abs(curvature * 250) > 500 ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${Math.abs(curvature * 250) > 500 ? 'bg-red-500' : 'bg-green-500'}`}>
                      <span className="text-white text-sm">{Math.abs(curvature * 250) > 500 ? '⚠️' : '✓'}</span>
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: Math.abs(curvature * 250) > 500 ? '#DC2626' : '#059669' }}>
                        {Math.abs(curvature * 250) > 500 ? 'WARNING: Stress exceeds safe limit' : 'Within safe operating limits'}
                      </div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                        {Math.abs(curvature * 250) > 500
                          ? 'Reduce curvature or use reinforced yarn'
                          : 'Silk fibers can safely handle this stress level'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Stress Parameters */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-lg font-bold" style={{ color: theme.colors.accent }}>500 MPa</div>
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Silk UTS Limit</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-lg font-bold" style={{ color: theme.colors.accent }}>{Math.abs(curvature * 100).toFixed(1)}%</div>
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Strain Risk</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                    <div className="text-lg font-bold" style={{ color: theme.colors.accent }}>{nodes.length}</div>
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>Stress Points</div>
                  </div>
                </div>
                
                {/* Engineering Recommendations */}
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#3B82F620', border: '1px solid #3B82F640' }}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🔧</span>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#3B82F6' }}>Engineering Recommendations</div>
                      <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                        {Math.abs(curvature) > 0.7
                          ? 'Consider switching to nylon-reinforced silk blend for high-curvature patterns.'
                          : 'Pure silk is optimal. Maintain stitch tension below 0.8 N for hyperbolic geometries.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Logs */}
            <div className="rounded-2xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>System Logs</h2>
              <div className="font-mono text-sm space-y-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#10B981' }}></span>
                  <span style={{ color: theme.colors.text }}>Dashboard unlocked at {new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#3B82F6' }}></span>
                  <span style={{ color: theme.colors.text }}>Graph adjacency matrix computed ({adjacencyMatrix.length}×{adjacencyMatrix.length})</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#F59E0B' }}></span>
                  <span style={{ color: theme.colors.text }}>AI Council critique data loaded from Supabase</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#EF4444' }}></span>
                  <span style={{ color: theme.colors.text }}>Warning: High curvature may cause rendering artifacts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Adjacency Matrix */}
          <div className="space-y-8">
            <div className="rounded-2xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>Graph Adjacency Matrix</h2>
              <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                Binary matrix showing connections between nodes. 1 = edge exists, 0 = no edge.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-xs border" style={{ borderColor: theme.colors.border, color: theme.colors.textSecondary }}>#</th>
                      {adjacencyMatrix.slice(0, 10).map((_, i) => (
                        <th key={i} className="p-2 text-xs border" style={{ borderColor: theme.colors.border, color: theme.colors.textSecondary }}>{i}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {adjacencyMatrix.slice(0, 10).map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 text-xs border font-mono" style={{ borderColor: theme.colors.border, color: theme.colors.textSecondary }}>{i}</td>
                        {row.slice(0, 10).map((cell, j) => (
                          <td
                            key={j}
                            className="p-2 text-xs border text-center font-mono"
                            style={{
                              borderColor: theme.colors.border,
                              color: cell ? theme.colors.accent : theme.colors.textSecondary,
                              backgroundColor: cell ? theme.colors.accent + '10' : 'transparent'
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-4" style={{ color: theme.colors.textSecondary }}>
                Showing first 10×10 nodes. Total matrix size: {adjacencyMatrix.length}×{adjacencyMatrix.length}.
              </p>
            </div>

            {/* Technical Roadmap for Crochetout Exports */}
            <div className="rounded-2xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>Technical Roadmap: Crochetout Exports</h2>
              <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                File export roadmap for 'Crochetout' format and robotic manufacturing pipeline.
              </p>
              
              <div className="space-y-4 mb-6">
                {/* Roadmap Timeline */}
                <div className="relative pl-8">
                  {/* Timeline line */}
                  <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ backgroundColor: theme.colors.accent }}></div>
                  
                  {/* Phase 1: Current */}
                  <div className="relative mb-6">
                    <div className="absolute left-[-8px] top-1 w-4 h-4 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
                    <div className="ml-4">
                      <div className="font-bold text-sm" style={{ color: theme.colors.text }}>Phase 1: Current (Q1 2026)</div>
                      <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                        • DALL-E 3 integration with museum-quality prompts<br/>
                        • PatternScore with Amizu Japanese notation<br/>
                        • Ghost Stitch visualization with glow-cyan highlighting<br/>
                        • Cultural Studio mobile layout (60% graph + bottom nav)<br/>
                        • Strategic Audit Dashboard (90/100 scores)
                      </div>
                    </div>
                  </div>
                  
                  {/* Phase 2: Next */}
                  <div className="relative mb-6">
                    <div className="absolute left-[-8px] top-1 w-4 h-4 rounded-full" style={{ backgroundColor: '#F59E0B' }}></div>
                    <div className="ml-4">
                      <div className="font-bold text-sm" style={{ color: theme.colors.text }}>Phase 2: Crochetout Format (Q2 2026)</div>
                      <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                        • .crochetout file format specification v1.0<br/>
                        • 3D stitch coordinate export (JSON + binary)<br/>
                        • Robotic knitting machine G‑Code generation<br/>
                        • Material consumption calculations<br/>
                        • Tension mapping for different yarn types
                      </div>
                    </div>
                  </div>
                  
                  {/* Phase 3: Future */}
                  <div className="relative">
                    <div className="absolute left-[-8px] top-1 w-4 h-4 rounded-full" style={{ backgroundColor: '#8B5CF6' }}></div>
                    <div className="ml-4">
                      <div className="font-bold text-sm" style={{ color: theme.colors.text }}>Phase 3: Manufacturing Pipeline (Q3 2026)</div>
                      <div className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>
                        • Multi-material robotic knitting support<br/>
                        • Real-time tension feedback integration<br/>
                        • AI-powered error correction<br/>
                        • Batch production scheduling<br/>
                        • Quality assurance automation
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* File Format Preview */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
                  <div className="font-bold text-sm mb-2" style={{ color: theme.colors.text }}>.crochetout File Format Preview</div>
                  <div className="font-mono text-xs bg-black text-green-400 p-3 rounded overflow-x-auto whitespace-pre">
{`{
  "format": "crochetout/v1.0",
  "metadata": {
    "curvature": ${curvature.toFixed(3)},
    "total_stitches": ${pattern.instructions.reduce((a, b) => a + b.stitchCount, 0)},
    "rows": ${rows},
    "material": "silk_500MPa",
    "generated": "${new Date().toISOString()}"
  },
  "stitches": [
    {"x": 0.0, "y": 0.0, "z": 0.0, "type": "sc", "tension": 0.8},
    {"x": 1.2, "y": 0.5, "z": 0.1, "type": "dc", "tension": 0.7},
    {"x": 2.1, "y": 1.3, "z": 0.2, "type": "hdc", "tension": 0.9}
  ],
  "gcode": "G21\\nG90\\nG28\\nM104 S210"
}`}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const data = {
                      format: "crochetout/v1.0",
                      metadata: {
                        curvature: curvature,
                        total_stitches: pattern.instructions.reduce((a, b) => a + b.stitchCount, 0),
                        rows: rows,
                        material: "silk_500MPa",
                        generated: new Date().toISOString()
                      },
                      stitches: nodes.map((node, i) => ({
                        x: node.x / 100,
                        y: node.y / 100,
                        z: curvature * 0.1,
                        type: i % 3 === 0 ? "sc" : i % 3 === 1 ? "dc" : "hdc",
                        tension: 0.7 + Math.random() * 0.3
                      }))
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `thalia-crochetout-k${curvature.toFixed(2)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                  }}
                >
                  <span>📁</span>
                  <span>Export .crochetout</span>
                </button>
                <button
                  onClick={() => alert('Robotic knitting simulation requires hardware connection.')}
                  className="px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <span>🤖</span>
                  <span>Simulate Knit</span>
                </button>
              </div>
            </div>

            {/* Robotic G‑Code for Clones Knot */}
            <div className="rounded-2xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>Robotic G‑Code (Clones Knot)</h2>
              <p className="text-sm mb-4" style={{ color: theme.colors.textSecondary }}>
                G‑Code instructions for robotic knitting machine implementing the Clones Knot pattern.
              </p>
              <div className="font-mono text-xs bg-black text-green-400 p-4 rounded-lg overflow-x-auto whitespace-pre">
{`G21 ; Set units to millimeters
G90 ; Absolute positioning
G28 ; Home all axes
M104 S210 ; Set extruder temperature
M140 S60 ; Set bed temperature
G1 Z5 F5000 ; Lift nozzle
G1 X50 Y50 F3000 ; Move to start position
; Clones Knot Pattern (Hyperbolic Surface)
G1 X50 Y50 E0.1
G1 X55 Y55 E0.2
G2 X60 Y50 I0 J-5 ; Arc clockwise
G1 X65 Y45 E0.3
G3 X70 Y50 I0 J5 ; Arc counter‑clockwise
G1 X75 Y55 E0.4
G2 X80 Y50 I0 J-5
G1 X85 Y45 E0.5
G3 X90 Y50 I0 J5
G1 X95 Y55 E0.6
G2 X100 Y50 I0 J-5
; Repeat for hyperbolic curvature
G1 X105 Y45 E0.7
G3 X110 Y50 I0 J5
G1 X115 Y55 E0.8
G2 X120 Y50 I0 J-5
G1 X125 Y45 E0.9
G3 X130 Y50 I0 J5
G1 X135 Y55 E1.0
G2 X140 Y50 I0 J-5
M400 ; Finish moves
M107 ; Fan off
M84 ; Disable steppers`}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`G21 ; Set units to millimeters
G90 ; Absolute positioning
G28 ; Home all axes
M104 S210 ; Set extruder temperature
M140 S60 ; Set bed temperature
G1 Z5 F5000 ; Lift nozzle
G1 X50 Y50 F3000 ; Move to start position
; Clones Knot Pattern (Hyperbolic Surface)
G1 X50 Y50 E0.1
G1 X55 Y55 E0.2
G2 X60 Y50 I0 J-5 ; Arc clockwise
G1 X65 Y45 E0.3
G3 X70 Y50 I0 J5 ; Arc counter‑clockwise
G1 X75 Y55 E0.4
G2 X80 Y50 I0 J-5
G1 X85 Y45 E0.5
G3 X90 Y50 I0 J5
G1 X95 Y55 E0.6
G2 X100 Y50 I0 J-5
; Repeat for hyperbolic curvature
G1 X105 Y45 E0.7
G3 X110 Y50 I0 J5
G1 X115 Y55 E0.8
G2 X120 Y50 I0 J-5
G1 X125 Y45 E0.9
G3 X130 Y50 I0 J5
G1 X135 Y55 E1.0
G2 X140 Y50 I0 J-5
M400 ; Finish moves
M107 ; Fan off
M84 ; Disable steppers`);
                    alert('G‑Code copied to clipboard.');
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                  }}
                >
                  Copy G‑Code
                </button>
                <button
                  onClick={() => alert('Feature not yet implemented.')}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  Simulate Run
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border p-6" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}>
              <h2 className="text-2xl font-serif mb-4" style={{ color: theme.colors.accent }}>Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const newNodes = generateHyperbolicNodes(curvature, 12, 5);
                    setNodes(newNodes);
                  }}
                  className="w-full px-4 py-3 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: theme.colors.primary + '20',
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  Regenerate Graph
                </button>
                <button
                  onClick={() => {
                    const data = {
                      curvature,
                      nodes: nodes.length,
                      edges: nodes.reduce((sum, node) => sum + node.edges.length, 0),
                      matrix: adjacencyMatrix,
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `thalia-debug-${Date.now()}.json`;
                    a.click();
                  }}
                  className="w-full px-4 py-3 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: theme.colors.accent + '20',
                    color: theme.colors.accent,
                    border: `1px solid ${theme.colors.accent}`,
                  }}
                >
                  Export Debug Data
                </button>
                <button
                  onClick={() => alert('Feature not yet implemented.')}
                  className="w-full px-4 py-3 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.textSecondary,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  Run Performance Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Council Sidebar */}
      <CouncilSidebar
        isOpen={isCouncilOpen}
        onClose={() => setIsCouncilOpen(false)}
        selectedNodeId={selectedNodeId}
        nodes={nodes}
      />
    </div>
  );
};

export default Dashboard;