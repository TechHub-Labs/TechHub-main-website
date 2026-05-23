/**
 * AdminLayout — Sidebar shell for all admin pages
 * - Dark sidebar (240px) with role badge + nav links filtered by role
 * - Main content area on the right
 * - Mobile: sidebar collapses to top bar
 */
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

const NAV_ITEMS = [
  { path: '/admin',             label: 'Dashboard',   icon: '▣', roles: ['member', 'executive', 'super_admin'] },
  { path: '/admin/profile',     label: 'My Profile',  icon: '👤', roles: ['member'] },
  { path: '/admin/exec-profile',label: 'My Profile',  icon: '👤', roles: ['executive'] },
  { path: '/admin/members',     label: 'Members',     icon: '👥', roles: ['super_admin'] },
  { path: '/admin/executives',  label: 'Executives',  icon: '🏛', roles: ['super_admin'] },
  { path: '/admin/projects',    label: 'Projects',    icon: '🚀', roles: ['super_admin'] },
] as const;

const ROLE_LABELS: Record<string, string> = {
  member:      'Member',
  executive:   'Executive',
  super_admin: 'Super Admin',
};
const ROLE_COLORS: Record<string, string> = {
  member:      '#38bdf8',
  executive:   '#a78bfa',
  super_admin: '#A3D045',
};

export function AdminLayout() {
  const { role, logout, profile } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter(item =>
    role === 'super_admin' || (role !== null && (item.roles as readonly string[]).includes(role))
  );

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'block', marginBottom: '16px' }}>
          <img src="/images/Logo.png" alt="TechHub" style={{ height: '40px' }} />
        </Link>
        {/* Role badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.05)', borderRadius: '20px',
          padding: '4px 12px',
        }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: ROLE_COLORS[role ?? 'member'] }} />
          <span style={{ color: ROLE_COLORS[role ?? 'member'], fontSize: '12px', fontWeight: 600 }}>
            {ROLE_LABELS[role ?? 'member']}
          </span>
        </div>
        <p style={{ color: '#64748b', fontSize: '11px', marginTop: '6px', wordBreak: 'break-all' }}>
          {profile?.email}
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {visibleNav.map(item => {
          const isActive = item.path === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', marginBottom: '2px',
                color: isActive ? '#A3D045' : '#94a3b8',
                background: isActive ? 'rgba(163,208,69,0.08)' : 'transparent',
                textDecoration: 'none', fontSize: '14px', fontWeight: isActive ? 600 : 400,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px', border: 'none',
            background: 'transparent', color: '#64748b', fontSize: '14px',
            cursor: 'pointer', transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <span>⎋</span> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* Desktop sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0, background: '#1e293b',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, height: '100vh',
        display: 'none',
      }}
        className="lg:!block"
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '56px', zIndex: 100,
        background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
      }} className="lg:!hidden">
        <img src="/images/Logo.png" alt="TechHub" style={{ height: '32px' }} />
        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 101 }}
          />
          <aside style={{
            position: 'fixed', top: 0, left: 0, width: '240px', height: '100vh',
            background: '#1e293b', zIndex: 102, overflowY: 'auto',
          }}>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <main style={{ flex: 1, overflowX: 'hidden', paddingTop: 0 }} className="lg:!pt-0 pt-14">
        <Outlet />
      </main>
    </div>
  );
}
