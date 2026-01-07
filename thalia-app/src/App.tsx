import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import PatternViewer from './components/PatternViewer';
import ComparisonPage from './pages/ComparisonPage';
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
