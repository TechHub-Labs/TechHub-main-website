/**
 * AdminDashboard — Role-aware landing page
 * Shows quick stats and links based on the user's role.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../core/supabase/client';
import { useAuth } from '../../../shared/hooks/useAuth';

interface Stats { members: number; executives: number; projects: number; }

function StatBox({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{
      background: '#1e293b', borderRadius: '12px', padding: '24px',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontSize: '32px', fontWeight: 700, color, marginBottom: '4px' }}>{value}</div>
      <div style={{ color: '#64748b', fontSize: '13px' }}>{label}</div>
    </div>
  );
}

function QuickLink({ to, label, description, color }: { to: string; label: string; description: string; color: string }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#1e293b', borderRadius: '12px', padding: '20px',
        border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
      >
        <div style={{ color, fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{label} →</div>
        <div style={{ color: '#64748b', fontSize: '12px' }}>{description}</div>
      </div>
    </Link>
  );
}

export function AdminDashboard() {
  const { role, profile } = useAuth();
  const [stats, setStats]   = useState<Stats>({ members: 0, executives: 0, projects: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ count: m }, { count: e }, { count: p }] = await Promise.all([
        (supabase.from('members')    as any).select('*', { count: 'exact', head: true }),
        (supabase.from('executives') as any).select('*', { count: 'exact', head: true }),
        (supabase.from('projects')   as any).select('*', { count: 'exact', head: true }),
      ]);
      setStats({ members: m ?? 0, executives: e ?? 0, projects: p ?? 0 });
    };
    load();
  }, []);

  const roleGreeting: Record<string, string> = {
    member:      'Update your member profile below. Once your admin marks it visible, it\'ll appear on the Members page.',
    executive:   'Update your executive profile below. Once marked visible, it\'ll appear on the Executive Council page.',
    super_admin: 'Full control: manage members, executives, and projects from the sidebar.',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
          Welcome back 👋
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          {profile?.email} · {roleGreeting[role ?? 'member']}
        </p>
      </div>

      {/* Stats — super_admin only */}
      {role === 'super_admin' && (
        <>
          <h2 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Overview
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
            <StatBox label="Total Members"   value={stats.members}    color="#38bdf8" />
            <StatBox label="Executives"      value={stats.executives} color="#a78bfa" />
            <StatBox label="Projects"        value={stats.projects}   color="#A3D045" />
          </div>
        </>
      )}

      {/* Quick Actions */}
      <h2 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        Quick Actions
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {role === 'member' && (
          <QuickLink to="/admin/profile"      label="Edit My Profile"  description="Update your photo, bio, skills and socials" color="#38bdf8" />
        )}
        {role === 'executive' && (
          <QuickLink to="/admin/exec-profile" label="Edit My Profile"  description="Update your photo, role and quote" color="#a78bfa" />
        )}
        {role === 'super_admin' && (
          <>
            <QuickLink to="/admin/members"    label="Manage Members"   description="Add, edit or remove member profiles" color="#38bdf8" />
            <QuickLink to="/admin/executives" label="Manage Executives" description="Add, edit or remove executive profiles" color="#a78bfa" />
            <QuickLink to="/admin/projects"   label="Manage Projects"  description="Add, edit or remove projects" color="#A3D045" />
          </>
        )}
      </div>
    </div>
  );
}
