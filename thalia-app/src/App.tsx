import { ThemeProvider } from './context/ThemeContext'
import PatternViewer from './components/PatternViewer'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <PatternViewer />
    </ThemeProvider>
  )
}

export default App
