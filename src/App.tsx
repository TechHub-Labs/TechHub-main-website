import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './core/auth/AuthContext';
// import { ProtectedRoute } from './shared/components/ProtectedRoute';

// Public Pages
import { LandingPage } from './features/landing/presentation/LandingPage';
import { AboutPage } from './features/about/presentation/AboutPage';
import { ProjectsPage } from './features/projects/presentation/ProjectsPage';
import { ProjectDetailsPage } from './features/projects/presentation/ProjectDetailsPage';
import { ExecutiveCouncilPage } from './features/executives/presentation/ExecutiveCouncilPage';
import { JoinUsPage } from './features/joinus/presentation/JoinUsPage';
import { MembersPage } from './features/members/presentation/MembersPage';
import { PlayPage } from './features/play/presentation/PlayPage';

// // Admin Features
// import { LoginPage } from './features/admin/presentation/LoginPage';
// import { AdminLayout } from './features/admin/presentation/AdminLayout';
// import { AdminDashboard } from './features/admin/presentation/AdminDashboard';
// import { MemberProfileForm } from './features/admin/presentation/MemberProfileForm';

function App() {
  return (
    // <AuthProvider>
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/executives" element={<ExecutiveCouncilPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/join" element={<JoinUsPage />} />
          {/* Note: Play page can be handled similarly if expanding TerminalSection */}

          {/* --- ADMIN ROUTES --- */}
          {/* <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route element={<ProtectedRoute allowedRoles={['MEMBER', 'ADMIN']} />}>
                <Route path="profile" element={<MemberProfileForm />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Route> */}
        </Routes>
      </Router>
    // </AuthProvider>
  );
}

export default App;