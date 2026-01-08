import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import PatternViewer from './components/PatternViewer';
import MasterGallery from './pages/MasterGallery';
import AuditDashboard from './pages/AuditDashboard';
import Dashboard from './pages/Dashboard';
import AtlasDemo from './components/atlas/AtlasDemo';
import AIPanel from './components/AIPanel';
import PracticeDojo from './components/PracticeDojo';
import { useTheme } from './context/ThemeContext';
import './App.css';

function Navigation() {
  const { theme, cycleEra } = useTheme();
  
  return (
    <nav className="sticky top-0 z-40 w-full border-b backdrop-blur-md" style={{ backgroundColor: theme.colors.card + 'CC', borderColor: theme.colors.border }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-serif font-bold" style={{ color: theme.colors.accent }}>
            THALIA
          </Link>
          <span className="hidden md:inline text-sm px-3 py-1 rounded-full" style={{ backgroundColor: theme.colors.background, color: theme.colors.textSecondary }}>
            Computational Crochet Engine
          </span>
        </div>
        
        {/* Center: MASTER GALLERY (Prominent) */}
        <div className="order-last md:order-none mt-3 md:mt-0">
          <Link
            to="/comparison"
            className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 relative overflow-hidden group animate-pulse-glow"
            style={{
              backgroundColor: '#D4AF37',
              color: '#1a1a1a',
              boxShadow: '0 0 40px rgba(212, 175, 55, 1), 0 0 70px rgba(255, 215, 0, 0.9), 0 0 120px rgba(255, 215, 0, 0.5)',
              border: '3px solid #FFD700',
              display: 'inline-block',
              minWidth: '220px',
              textAlign: 'center'
            }}
          >
            <span className="font-extrabold text-xl tracking-wider">MASTER GALLERY</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/70 to-transparent group-hover:animate-shimmer" />
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/40 to-amber-300/40 blur-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />
          </Link>
        </div>
        
        {/* Right: Other Navigation Links */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-3 py-2 rounded-lg font-medium transition-colors hover:opacity-90 text-sm"
            style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
          >
            Engine
          </Link>
          <Link
            to="/audit"
            className="px-3 py-2 rounded-lg font-medium transition-colors hover:opacity-90 relative overflow-hidden group text-sm"
            style={{
              backgroundColor: '#7C3AED',
              color: '#ffffff',
              boxShadow: '0 0 10px rgba(124, 58, 237, 0.5)'
            }}
          >
            <span className="font-bold">AUDIT</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent group-hover:animate-shimmer" />
          </Link>
          <Link
            to="/atlas"
            className="px-3 py-2 rounded-lg font-medium transition-colors hover:opacity-90 relative overflow-hidden group text-sm"
            style={{
              backgroundColor: '#10B981',
              color: '#ffffff',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
            }}
          >
            <span className="font-bold">ATLAS</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent group-hover:animate-shimmer" />
          </Link>
          <Link
            to="/ai-panel"
            className="px-3 py-2 rounded-lg font-medium transition-colors hover:opacity-90 relative overflow-hidden group text-sm"
            style={{
              backgroundColor: '#EF4444',
              color: '#ffffff',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
            }}
          >
            <span className="font-bold">AI</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/30 to-transparent group-hover:animate-shimmer" />
          </Link>
          <Link
            to="/dojo"
            className="px-3 py-2 rounded-lg font-medium transition-colors hover:opacity-90 relative overflow-hidden group text-sm"
            style={{
              backgroundColor: '#F59E0B',
              color: '#ffffff',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
            }}
          >
            <span className="font-bold">DOJO</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent group-hover:animate-shimmer" />
          </Link>
          <button
            onClick={cycleEra}
            className="px-3 py-2 rounded-lg font-medium transition-colors hover:opacity-90 text-sm"
            style={{ backgroundColor: theme.colors.accent, color: theme.colors.background }}
          >
            {theme.name}
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
          <Route path="/comparison" element={<MasterGallery />} />
          <Route path="/audit" element={<AuditDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/atlas" element={<AtlasDemo />} />
          <Route path="/ai-panel" element={<AIPanel />} />
          <Route path="/dojo" element={<PracticeDojo />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
