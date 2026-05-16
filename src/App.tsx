import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './features/landing/presentation/LandingPage';
import { AboutPage } from './features/about/presentation/AboutPage';
import { MembersPage } from './features/members/presentation/MembersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/members" element={<MembersPage />} />
      </Routes>
    </Router>
  );
}

export default App;