/**
 * ProtectedRoute — wraps admin routes
 * - Unauthenticated → redirect to /admin/login
 * - Wrong role     → show Unauthorized screen (no crash, no blank page)
 * - Loading        → spinner
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../../core/supabase/types';

interface Props {
  children: React.ReactNode;
  /** If specified, only these roles may access. Super admin always passes. */
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div style={{ textAlign: 'center', color: '#A3D045' }}>
          <svg className="animate-spin mx-auto mb-3" width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#A3D04540" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#A3D045" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;

  // Role guard: super_admin always passes
  if (allowedRoles && role !== 'super_admin' && !allowedRoles.includes(role as Role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div style={{ textAlign: 'center', color: '#fff', padding: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Unauthorized</h2>
          <p style={{ color: '#94a3b8' }}>
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
