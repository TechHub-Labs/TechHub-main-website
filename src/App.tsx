/**
 * App.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import { LandingPage } from "./features/landing/presentation/LandingPage";
import { AboutPage } from "./features/about/presentation/AboutPage";
import { MembersPage } from "./features/members/presentation/MembersPage";
import { ProjectsPage } from "./features/projects/presentation/ProjectsPage";
import { ExecutiveCouncilPage } from "./features/executives/presentation/ExecutiveCouncilPage";
import { JoinUsPage } from "./features/joinus/presentation/JoinUsPage";
import { PlayPage } from "./features/play/presentation/PlayPage";
import { CustomCursor } from "./shared/components/CustomCursor";
import { ProjectDetailsPage } from "./features/projects/presentation/ProjectDetailsPage";

import { AdminLogin } from "./features/admin/presentation/AdminLogin";
import { AdminLayout } from "./features/admin/presentation/AdminLayout";
import { AdminDashboard } from "./features/admin/presentation/AdminDashboard";
import { MemberProfileEditor } from "./features/admin/presentation/MemberProfileEditor";
import { ExecutiveProfileEditor } from "./features/admin/presentation/ExecutiveProfileEditor";
import { SuperAdminMembers } from "./features/admin/presentation/SuperAdminMembers";
import { SuperAdminExecutives } from "./features/admin/presentation/SuperAdminExecutives";
import { SuperAdminProjects } from "./features/admin/presentation/SuperAdminProjects";
import { SuperAdminMessages } from "./features/admin/presentation/SuperAdminMessages";
import { RequestEditPage } from "./features/admin/presentation/RequestEditPage";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { NotFoundPage } from "./features/notfound/presentation/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="w-full max-w-[100vw] overflow-x-hidden min-h-screen bg-transparent">
        <CustomCursor />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/executives" element={<ExecutiveCouncilPage />} />
          <Route path="/join" element={<JoinUsPage />} />
          <Route path="/play" element={<PlayPage />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={["member"]}>
                  <MemberProfileEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="exec-profile"
              element={
                <ProtectedRoute allowedRoles={["executive"]}>
                  <ExecutiveProfileEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="members"
              element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <SuperAdminMembers />
                </ProtectedRoute>
              }
            />
            <Route
              path="executives"
              element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <SuperAdminExecutives />
                </ProtectedRoute>
              }
            />
            <Route
              path="projects"
              element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <SuperAdminProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="messages"
              element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <SuperAdminMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="request-edit"
              element={
                <ProtectedRoute allowedRoles={["member", "executive"]}>
                  <RequestEditPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
