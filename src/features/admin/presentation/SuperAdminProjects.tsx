/**
 * SuperAdminProjects — Full CRUD for public projects
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../core/supabase/client';
import type { Project } from '../../../core/supabase/types';
import { AdminInput, AdminTextarea, TagEditor, AdminToggle, SaveBar } from './AdminFormComponents';

const STATUS_OPTIONS = ['In Development', 'Completed', 'On Hold', 'Archived'];
const EMPTY: Partial<Project> = {
  title: '', description: '', tech: [], status: 'In Development',
  category: '', github_url: '', live_url: '', image_url: '', in_development: true,
};

export function SuperAdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState<Partial<Project> | null>(null);
  const [isNew,    setIsNew]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [formErr,  setFormErr]  = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search,   setSearch]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects((data ?? []) as Project[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setEditing({ ...EMPTY }); setIsNew(true); setSaved(false); setFormErr(''); };
  const openEdit = (p: Project) => { setEditing({ ...p }); setIsNew(false); setSaved(false); setFormErr(''); };
  const close    = () => { setEditing(null); setSaved(false); setFormErr(''); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setSaved(false); setFormErr('');

    const payload = {
      title: editing.title!, description: editing.description, tech: editing.tech ?? [],
      status: editing.status, category: editing.category, github_url: editing.github_url,
      live_url: editing.live_url, image_url: editing.image_url, in_development: editing.in_development ?? true,
    };

    const { error } = isNew
      ? await (supabase.from('projects') as any).insert(payload)
      : await (supabase.from('projects') as any).update(payload).eq('id', editing.id!);

    setSaving(false);
    if (error) { setFormErr(error.message); return; }
    setSaved(true); load(); setTimeout(close, 1000);
  };

  const confirmDelete = async (id: string) => {
    await (supabase.from('projects') as any).delete().eq('id', id);
    setDeleting(null); load();
  };

  const set = (key: keyof Project) => (val: any) =>
    setEditing(prev => prev ? { ...prev, [key]: val } : prev);

  const filtered = projects.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>Projects</h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>{projects.length} total</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '13px', outline: 'none', width: '180px' }}
          />
          <button onClick={openNew} style={{ padding: '8px 18px', borderRadius: '8px', background: '#A3D045', color: '#0f172a', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
            + Add Project
          </button>
        </div>
      </div>

      {loading ? <p style={{ color: '#64748b' }}>Loading…</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Title', 'Category', 'Status', 'Tech', 'Actions'].map(h => (
                  <th key={h} style={{ color: '#64748b', fontWeight: 600, textAlign: 'left', padding: '8px 12px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 12px', color: '#f1f5f9', fontWeight: 500 }}>{p.title}</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{p.category ?? '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: p.status === 'Completed' ? 'rgba(163,208,69,0.15)' : 'rgba(251,191,36,0.15)',
                      color: p.status === 'Completed' ? '#A3D045' : '#fbbf24',
                    }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#64748b' }}>{(p.tech ?? []).slice(0, 3).join(', ')}{(p.tech ?? []).length > 3 ? '…' : ''}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(p)} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => setDeleting(p.id)} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ color: '#475569', textAlign: 'center', padding: '32px' }}>No projects found.</p>}
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '28px', maxWidth: '360px', width: '90%', border: '1px solid rgba(239,68,68,0.3)' }}>
            <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Delete project?</h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleting(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              <button onClick={() => confirmDelete(deleting)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}>
          <div style={{ background: '#1e293b', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '560px', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '90vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700 }}>{isNew ? 'Add Project' : 'Edit Project'}</h2>
              <button onClick={close} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <AdminInput label="Title"     value={editing.title ?? ''}    onChange={set('title')}    required />
              <AdminInput label="Category"  value={editing.category ?? ''} onChange={set('category')} placeholder="e.g. Web, Mobile, AI" />
              <AdminInput label="GitHub URL" value={editing.github_url ?? ''} onChange={set('github_url')} />
              <AdminInput label="Live URL"   value={editing.live_url ?? ''}  onChange={set('live_url')} />
              <AdminInput label="Image URL"  value={editing.image_url ?? ''} onChange={set('image_url')} />
              <AdminTextarea label="Description" value={editing.description ?? ''} onChange={set('description')} rows={4} />
              <TagEditor label="Tech Stack" tags={editing.tech ?? []} onChange={set('tech')} placeholder="e.g. React, Node.js" />

              {/* Status */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} type="button" onClick={() => set('status')(s)} style={{
                      padding: '5px 14px', borderRadius: '20px', fontSize: '13px', border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
                      borderColor: editing.status === s ? '#A3D045' : 'rgba(255,255,255,0.1)',
                      background: editing.status === s ? 'rgba(163,208,69,0.12)' : 'transparent',
                      color: editing.status === s ? '#A3D045' : '#64748b',
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              <AdminToggle label="In Development" description="Shows 'In Development' badge on project card" checked={editing.in_development ?? true} onChange={set('in_development')} />
              <SaveBar saving={saving} saved={saved} error={formErr} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
