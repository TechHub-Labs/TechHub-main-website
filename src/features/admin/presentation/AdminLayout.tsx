/**
 * AdminLayout — Sidebar shell for all admin pages
 * - Dark sidebar (240px) with role badge + nav links filtered by role
 * - Main content area on the right
 * - Mobile: sidebar collapses to top bar
 */
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useTheme } from '../../landing/domain/useTheme';

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
  const { role, logout, user } = useAuth();
  const { dark, setDark, colors } = useTheme();
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
        <p style={{ color: '#64748b', fontSize: '11px', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {user?.email}
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflow: 'hidden' }}>
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

      {/* Theme toggle & Logout */}
      <div style={{ padding: '16px 12px', borderTop: `1px solid ${colors.divider}`, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          onClick={() => setDark(!dark)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px', border: 'none',
            background: 'transparent', color: colors.textSubtle, fontSize: '14px',
            cursor: 'pointer', transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.text; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(163,208,69,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.textSubtle; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <span>{dark ? '☀️' : '🌙'}</span> {dark ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px', border: 'none',
            background: 'transparent', color: colors.textSubtle, fontSize: '14px',
            cursor: 'pointer', transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = colors.textSubtle; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <span>⎋</span> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: colors.bg, color: colors.text, display: 'flex', fontFamily: "'Inter', sans-serif" }} className="admin-layout-root">

      <aside style={{
        width: '240px', flexShrink: 0, background: colors.bgCard,
        borderRight: `1px solid ${colors.divider}`,
        height: '100vh', display: 'none',
      }}
        className="lg:!block"
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '56px', zIndex: 100,
        background: colors.bgCard, borderBottom: `1px solid ${colors.divider}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
      }} className="lg:!hidden">
        <img src="/images/Logo.png" alt="TechHub" style={{ height: '32px', filter: !dark ? 'invert(1)' : 'none' }} />
        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{ background: 'none', border: 'none', color: colors.text, fontSize: '20px', cursor: 'pointer' }}
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
            background: colors.bgCard, zIndex: 102, overflowY: 'auto',
          }}>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <main 
        style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', paddingTop: 0, paddingBottom: '40px' }} 
        className="lg:!pt-0 pt-14 admin-fade-in"
      >
        <Outlet />
      </main>

      {/* Global Admin Styles */}
      <style>{`
        ${!dark ? `
          /* Light Mode Overrides for Admin Portal */
          .admin-layout-root h1, .admin-layout-root h2 { color: #0f172a !important; }
          .admin-layout-root p { color: #475569 !important; }
          .admin-layout-root input, .admin-layout-root textarea { background: #ffffff !important; border-color: #cbd5e1 !important; color: #0f172a !important; }
          .admin-layout-root label { color: #64748b !important; }
          .admin-layout-root .card { background: #ffffff !important; border-color: #e2e8f0 !important; }
          .admin-layout-root img[src="/images/Logo.png"] { filter: invert(1) !important; }
        ` : ''}
        @keyframes adminFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .admin-fade-in {
          animation: adminFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Make scrollbars look nice in admin panel */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(163,208,69,0.5); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(163,208,69,0.8); }
      `}</style>
    </div>
  );
}
