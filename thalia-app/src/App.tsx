import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import PatternViewer from './components/PatternViewer';
import ComparisonPage from './pages/ComparisonPage';
import AuditDashboard from './pages/AuditDashboard';
import AtlasDemo from './components/atlas/AtlasDemo';
import AIPanel from './components/AIPanel';
import { useTheme } from './context/ThemeContext';
import './App.css';

function Navigation() {
  const { theme, cycleEra } = useTheme();
  
  return (
    <nav className="sticky top-0 z-40 w-full border-b backdrop-blur-md" style={{ backgroundColor: theme.colors.card + 'CC', borderColor: theme.colors.border }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-serif font-bold" style={{ color: theme.colors.accent }}>
            THALIA
          </Link>
          <span className="hidden md:inline text-sm px-3 py-1 rounded-full" style={{ backgroundColor: theme.colors.background, color: theme.colors.textSecondary }}>
            Computational Crochet Engine
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
          >
            Hyperbolic Engine
          </Link>
          <Link
            to="/comparison"
            className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
          >
            Multi‑Era Comparison
          </Link>
          <Link
            to="/audit"
            className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90 relative overflow-hidden group"
            style={{
              backgroundColor: '#D4AF37',
              color: '#1a1a1a',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)'
            }}
          >
            <span className="font-bold">STRATEGIC AUDIT</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent group-hover:animate-shimmer" />
          </Link>
          <Link
            to="/atlas"
            className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90 relative overflow-hidden group"
            style={{
              backgroundColor: '#7C3AED',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)'
            }}
          >
            <span className="font-bold">3D WORLD ATLAS</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/40 to-transparent group-hover:animate-shimmer" />
          </Link>
          <Link
            to="/ai-panel"
            className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90 relative overflow-hidden group"
            style={{
              backgroundColor: '#10B981',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)'
            }}
          >
            <span className="font-bold">AI PANEL</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent group-hover:animate-shimmer" />
          </Link>
          <button
            onClick={cycleEra}
            className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: theme.colors.accent, color: theme.colors.background }}
          >
            {theme.name} Era
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<PatternViewer />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/audit" element={<AuditDashboard />} />
          <Route path="/atlas" element={<AtlasDemo />} />
          <Route path="/ai-panel" element={<AIPanel />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
