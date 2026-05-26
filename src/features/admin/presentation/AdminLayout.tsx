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
import { WebsiteBackground } from '../../../shared/components/WebsiteBackground';

const NAV_ITEMS = [
  { path: '/admin',             label: 'Dashboard',   icon: '▣',  roles: ['member', 'executive', 'super_admin'] },
  { path: '/admin/profile',     label: 'Create Profile', icon: '👤', roles: ['member'] },
  { path: '/admin/exec-profile',label: 'Create Profile', icon: '👤', roles: ['executive'] },
  { path: '/admin/request-edit',label: 'Request Edit',icon: '📝', roles: ['member', 'executive'] },
  { path: '/admin/messages',    label: 'Messages',    icon: '📬', roles: ['super_admin'] },
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
    role !== null && (item.roles as readonly string[]).includes(role)
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
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: dark ? 'var(--min-bg-dark)' : 'var(--min-bg-light)', 
          borderRadius: '8px', padding: '6px 14px',
          border: '1px solid var(--min-border)',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ROLE_COLORS[role ?? 'member'], boxShadow: `0 0 8px ${ROLE_COLORS[role ?? 'member']}` }} />
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
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 16px', borderRadius: '8px', marginBottom: '4px',
                color: isActive ? '#A3D045' : colors.textMuted,
                background: isActive ? (dark ? 'rgba(163,208,69,0.1)' : 'rgba(163,208,69,0.1)') : 'transparent',
                textDecoration: 'none', fontSize: '14px', fontWeight: isActive ? 600 : 500,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { 
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
                  (e.currentTarget as HTMLAnchorElement).style.color = dark ? '#f1f5f9' : '#111827';
                }
              }}
              onMouseLeave={e => { 
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; 
                  (e.currentTarget as HTMLAnchorElement).style.color = colors.textMuted;
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle & Logout */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '32px' }}>
        <button
          onClick={() => setDark(!dark)}
          className="min-button"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--min-border)', background: 'transparent',
            color: dark ? '#f1f5f9' : '#111827', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--min-hover)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
        >
          <span>{dark ? '☀️' : '🌙'}</span> {dark ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button
          onClick={handleLogout}
          className="min-button"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--min-border)', background: 'transparent',
            color: '#ef4444', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
        >
          <span>⎋</span> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ 
      height: '100vh', overflow: 'hidden', display: 'flex', fontFamily: "'Inter', 'Geist', sans-serif",
      background: 'transparent',
      transition: 'background 0.2s ease', position: 'relative'
    }} className="admin-layout-root">
      
      {/* Dynamic Animated Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
        <WebsiteBackground isDark={dark} bgColor={colors.bg} opacity={0.6} />
      </div>

      <aside style={{
        width: '260px', flexShrink: 0, 
        background: dark ? 'var(--min-surface-dark)' : 'var(--min-surface-light)',
        borderRight: '1px solid var(--min-border)',
        height: '100vh', display: 'none',
        zIndex: 10
      }}
        className="lg:!block"
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '64px', zIndex: 100,
        background: colors.bg,

        borderBottom: '1px solid var(--min-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
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
            position: 'fixed', top: 0, left: 0, width: '260px', height: '100vh',
            background: dark ? 'var(--min-surface-dark)' : 'var(--min-surface-light)',
            borderRight: '1px solid var(--min-border)',
            zIndex: 102, overflowY: 'auto',
          }}>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <main 
        style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', paddingTop: 0, paddingBottom: '40px' }} 
        className="lg:!pt-0 pt-24 admin-fade-in"
      >
        <Outlet />
      </main>

      {/* Global Admin Styles */}
      <style>{`
        :root {
          --min-bg-light: ${colors.bg};
          --min-surface-light: rgba(255, 255, 255, 0.7);
          
          --min-bg-dark: ${colors.bg};
          --min-surface-dark: ${colors.nav};
        }

        ${!dark ? `
          :root {
            --min-border: rgba(13,19,64,0.1);
            --min-hover: rgba(13,19,64,0.04);
          }
          .admin-layout-root { color: #0d1340 !important; }
          .admin-layout-root h1, .admin-layout-root h2 { color: #0d1340 !important; }
          .admin-layout-root p { color: #4a5180 !important; }
          .admin-layout-root label { color: #4a5180 !important; }
          .admin-layout-root img[src="/images/Logo.png"] { filter: invert(1) !important; }
          .min-card { background: var(--min-surface-light); backdrop-filter: blur(16px); border: 1px solid var(--min-border); border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.02); }
          .min-button { background: var(--min-surface-light); border: 1px solid var(--min-border); border-radius: 6px; box-shadow: none; transition: all 0.15s; }
          .min-button:active { background: var(--min-hover); transform: scale(0.98); }
          .min-button:hover { background: var(--min-hover); }
          .min-input { background: rgba(255,255,255,0.6); backdrop-filter: blur(16px); border: 1px solid var(--min-border); border-radius: 6px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); transition: all 0.2s; }
          .min-input:focus { border-color: #A3D045; outline: none; box-shadow: 0 0 0 2px rgba(163,208,69,0.3); }
        ` : `
          :root {
            --min-border: rgba(255,255,255,0.1);
            --min-hover: rgba(255,255,255,0.05);
          }
          .admin-layout-root { color: #ffffff !important; }
          .min-card { background: var(--min-surface-dark); backdrop-filter: blur(16px); border: 1px solid var(--min-border); border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.2); }
          .min-button { background: rgba(255,255,255,0.05); border: 1px solid var(--min-border); border-radius: 6px; box-shadow: none; transition: all 0.15s; }
          .min-button:active { background: var(--min-hover); transform: scale(0.98); }
          .min-button:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); box-shadow: 0 0 12px rgba(255,255,255,0.05); }
          .min-input { background: rgba(0,0,0,0.2); backdrop-filter: blur(16px); border: 1px solid var(--min-border); border-radius: 6px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s; }
          .min-input:focus { border-color: #A3D045; outline: none; box-shadow: 0 0 12px rgba(163,208,69,0.2), inset 0 0 4px rgba(163,208,69,0.1); }
        `}
        
        @keyframes adminFadeIn {
          from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .admin-fade-in {
          animation: adminFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Make scrollbars look nice in admin panel */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(163,208,69,0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(163,208,69,0.7); }
      `}</style>
    </div>
  );
}
