import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { compilePattern, formatPatternAsText } from '../lib/compiler';

interface PatternScriptProps {
  curvature: number;
  stylePreset: 'default' | 'irish_famine_rose' | 'hyper_realistic_botanical' | 'amigurumi_core' | 'oya_lace';
  baseStitches?: number;
  rows?: number;
}

const PatternScript: React.FC<PatternScriptProps> = ({ 
  curvature, 
  stylePreset, 
  baseStitches = 12,
  rows = 5
}) => {
  const { theme } = useTheme();
  
  // Compile the pattern
  const pattern = compilePattern({
    curvature,
    baseStitches,
    rows,
    stylePreset
  });
  
  // Format instructions for display
  const formatInstructions = () => {
    return pattern.instructions.map((row) => {
      // Extract just the round number and instruction for blueprint style
      const match = row.instruction.match(/Rnd (\d+): (.+)/);
      if (match) {
        const [, round, instruction] = match;
        return { round: parseInt(round), instruction };
      }
      return { round: row.round, instruction: row.instruction };
    });
  };
  
  const instructions = formatInstructions();
  
  // Get abbreviation examples
  const commonAbbreviations = {
    'sc': 'single crochet',
    'dc': 'double crochet',
    'hdc': 'half double crochet',
    'ch': 'chain',
    'sl st': 'slip stitch',
    'inc': 'increase (2 stitches in same stitch)',
    'dec': 'decrease (2 stitches together)',
    'rep': 'repeat',
    'st(s)': 'stitch(es)'
  };

  return (
    <div className="rounded-xl border overflow-hidden" style={{ 
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border 
    }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ 
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border 
      }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold" style={{ color: theme.colors.accent }}>
              Pattern Blueprint
            </h3>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              K = {curvature.toFixed(2)} • {pattern.skillLevel} • {rows} rounds
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs px-3 py-1 rounded-full" style={{ 
              backgroundColor: curvature < 0 ? theme.colors.accent + '20' : theme.colors.primary + '20',
              color: curvature < 0 ? theme.colors.accent : theme.colors.primary
            }}>
              {curvature < 0 ? 'Hyperbolic' : curvature > 0 ? 'Spherical' : 'Euclidean'}
            </div>
            <div className="text-xs px-3 py-1 rounded-full" style={{ 
              backgroundColor: theme.colors.card,
              color: theme.colors.textSecondary,
              border: `1px solid ${theme.colors.border}`
            }}>
              {pattern.instructions.reduce((sum, row) => sum + row.stitchCount, 0)} total stitches
            </div>
          </div>
        </div>
      </div>
      
      {/* Abbreviations Key */}
      <div className="p-4 border-b" style={{ 
        backgroundColor: theme.colors.card + '80',
        borderColor: theme.colors.border 
      }}>
        <h4 className="text-sm font-semibold mb-2" style={{ color: theme.colors.text }}>
          Standard Abbreviations
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(commonAbbreviations).map(([abbr, meaning]) => (
            <div key={abbr} className="flex items-start">
              <code className="text-xs font-mono mr-2" style={{ color: theme.colors.accent }}>
                {abbr}
              </code>
              <span className="text-xs" style={{ color: theme.colors.textSecondary }}>
                {meaning}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pattern Instructions */}
      <div className="p-4">
        <h4 className="text-sm font-semibold mb-3" style={{ color: theme.colors.text }}>
          Round-by-Round Instructions
        </h4>
        <div className="space-y-3">
          {instructions.slice(0, 8).map((item) => (
            <div 
              key={item.round}
              className="p-3 rounded-lg border"
              style={{ 
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                borderLeft: `4px solid ${curvature < 0 ? theme.colors.accent : theme.colors.primary}`
              }}
            >
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold"
                  style={{ 
                    backgroundColor: curvature < 0 ? theme.colors.accent + '20' : theme.colors.primary + '20',
                    color: curvature < 0 ? theme.colors.accent : theme.colors.primary
                  }}
                >
                  {item.round}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-mono" style={{ color: theme.colors.text }}>
                    {item.instruction}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="text-xs px-2 py-1 rounded mr-2" style={{ 
                      backgroundColor: theme.colors.card,
                      color: theme.colors.textSecondary
                    }}>
                      {pattern.instructions[item.round - 1]?.stitchCount || '?'} sts
                    </div>
                    {pattern.instructions[item.round - 1]?.specialNotes && (
                      <div className="text-xs" style={{ color: theme.colors.accent }}>
                        ⓘ
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {instructions.length > 8 && (
            <div className="text-center pt-2">
              <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                ... plus {instructions.length - 8} more rounds
              </span>
            </div>
          )}
        </div>
        
        {/* Materials Preview */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.colors.border }}>
          <h4 className="text-sm font-semibold mb-2" style={{ color: theme.colors.text }}>
            Materials
          </h4>
          <div className="flex flex-wrap gap-2">
            {pattern.materials.slice(0, 4).map((material) => (
              <div
                key={material}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.textSecondary,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                {material}
              </div>
            ))}
            {pattern.materials.length > 4 && (
              <div className="text-xs px-3 py-1.5 rounded-full" style={{ 
                backgroundColor: theme.colors.card,
                color: theme.colors.textSecondary
              }}>
                +{pattern.materials.length - 4} more
              </div>
            )}
          </div>
        </div>
        
        {/* Notes Preview */}
        {pattern.notes.length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.colors.border }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: theme.colors.text }}>
              Key Notes
            </h4>
            <ul className="space-y-1">
              {pattern.notes.slice(0, 2).map((note, index) => (
                <li key={index} className="flex items-start text-sm">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 mr-2" style={{ 
                    backgroundColor: curvature < 0 ? theme.colors.accent : theme.colors.primary 
                  }} />
                  <span style={{ color: theme.colors.textSecondary }}>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Footer with action buttons */}
      <div className="p-4 border-t" style={{ 
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border 
      }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              const blob = new Blob([formatPatternAsText(pattern)], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `thalia-pattern-k${curvature.toFixed(2)}-r${rows}.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.text 
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Text
          </button>
          <button
            onClick={() => {
              // Create a printable version of the pattern
              const printWindow = window.open('', '_blank')
              if (!printWindow) {
                alert('Please allow pop-ups to print the pattern')
                return
              }
              
              const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                  <title>Thalia Pattern - K=${curvature.toFixed(2)}</title>
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
                    .title { font-size: 28px; color: #059669; font-weight: bold; margin-bottom: 5px; }
                    .subtitle { font-size: 16px; color: #666; margin-bottom: 20px; }
                    .section { margin-bottom: 25px; }
                    .section-title { font-size: 18px; color: #059669; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
                    .abbreviations { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
                    .abbr-item { display: flex; }
                    .abbr { font-family: monospace; font-weight: bold; color: #059669; min-width: 60px; }
                    .instructions { margin-left: 20px; }
                    .instruction-item { margin-bottom: 15px; }
                    .round-number { display: inline-block; width: 30px; height: 30px; background: #059669; color: white; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 10px; }
                    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888; text-align: center; }
                    @media print {
                      body { padding: 0; }
                      .no-print { display: none; }
                    }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <div class="title">Thalia Crochet Pattern</div>
                    <div class="subtitle">Computational Design • K = ${curvature.toFixed(2)} • ${pattern.skillLevel} • ${rows} rounds</div>
                    <div>Generated on ${new Date().toLocaleDateString()} • Style: ${stylePreset}</div>
                  </div>
                  
                  <div class="section">
                    <div class="section-title">Standard Abbreviations</div>
                    <div class="abbreviations">
                      ${Object.entries(commonAbbreviations).map(([abbr, meaning]) => `
                        <div class="abbr-item">
                          <div class="abbr">${abbr}</div>
                          <div class="meaning">${meaning}</div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  
                  <div class="section">
                    <div class="section-title">Round-by-Round Instructions</div>
                    <div class="instructions">
                      ${pattern.instructions.map((row) => `
                        <div class="instruction-item">
                          <span class="round-number">${row.round}</span>
                          <strong>${row.instruction}</strong>
                          <div style="margin-left: 40px; font-size: 14px; color: #666;">
                            ${row.stitchCount} stitches • ${row.specialNotes ? 'Note: ' + row.specialNotes : ''}
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                  
                  <div class="section">
                    <div class="section-title">Materials</div>
                    <ul>
                      ${pattern.materials.map(material => `<li>${material}</li>`).join('')}
                    </ul>
                  </div>
                  
                  ${pattern.notes.length > 0 ? `
                  <div class="section">
                    <div class="section-title">Notes</div>
                    <ul>
                      ${pattern.notes.map(note => `<li>${note}</li>`).join('')}
                    </ul>
                  </div>
                  ` : ''}
                  
                  <div class="footer">
                    <div>Generated by Thalia Computational Crochet Engine</div>
                    <div>thalia-crochet.vercel.app • For Master Artisans</div>
                    <div class="no-print">
                      <button onclick="window.print()" style="padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                        Print This Pattern
                      </button>
                    </div>
                  </div>
                  
                  <script>
                    // Auto-print after a short delay
                    setTimeout(() => {
                      window.print();
                    }, 500);
                  </script>
                </body>
                </html>
              `
              
              printWindow.document.write(printContent)
              printWindow.document.close()
            }}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
            style={{
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Pattern
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternScript;