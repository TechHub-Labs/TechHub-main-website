import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './features/landing/presentation/LandingPage';
import { AboutPage } from './features/about/presentation/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;