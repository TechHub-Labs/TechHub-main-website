/**
 * SuperAdminExecutives — Full CRUD for executive council profiles
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../core/supabase/client';
import type { Executive } from '../../../core/supabase/types';
import { AdminInput, AdminTextarea, AvatarUploader, AdminToggle, SaveBar, AdminMessagesPanel } from './AdminFormComponents';

const CATEGORY_OPTIONS = ["Founding Council", "'27", "'28"];
const EMPTY: Partial<Executive> = {
  name: '', role_title: '', quote: '', avatar_url: null, category: [], visible: false,
};

export function SuperAdminExecutives() {
  const [execs,    setExecs]   = useState<Executive[]>([]);
  const [loading,  setLoading] = useState(true);
  const [editing,  setEditing] = useState<Partial<Executive> | null>(null);
  const [isNew,    setIsNew]   = useState(false);
  const [saving,   setSaving]  = useState(false);
  const [saved,    setSaved]   = useState(false);
  const [formErr,  setFormErr] = useState('');
  const [deleting, setDeleting]= useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('executives').select('*').order('name');
    setExecs((data ?? []) as Executive[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setEditing({ ...EMPTY }); setIsNew(true); setSaved(false); setFormErr(''); };
  const openEdit = (e: Executive) => { setEditing({ ...e }); setIsNew(false); setSaved(false); setFormErr(''); };
  const close    = () => { setEditing(null); setSaved(false); setFormErr(''); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setSaved(false); setFormErr('');

    const payload = {
      name: editing.name, role_title: editing.role_title, quote: editing.quote,
      avatar_url: editing.avatar_url, category: editing.category ?? [], visible: editing.visible ?? false,
    };

    const { error } = isNew
      ? await (supabase.from('executives') as any).insert(payload)
      : await (supabase.from('executives') as any).update(payload).eq('id', editing.id!);

    setSaving(false);
    if (error) { setFormErr(error.message); return; }
    setSaved(true); load(); setTimeout(close, 1000);
  };

  const confirmDelete = async (id: string) => {
    await (supabase.from('executives') as any).delete().eq('id', id);
    setDeleting(null); load();
  };

  const toggleVisible = async (ex: Executive) => {
    await (supabase.from('executives') as any).update({ visible: !ex.visible }).eq('id', ex.id);
    load();
  };

  const set = (key: keyof Executive) => (val: any) =>
    setEditing(prev => prev ? { ...prev, [key]: val } : prev);

  const toggleCategory = (cat: string) =>
    set('category')((editing?.category ?? []).includes(cat)
      ? (editing?.category ?? []).filter((c: string) => c !== cat)
      : [...(editing?.category ?? []), cat]);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>Executive Council</h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>{execs.length} total</p>
        </div>
        <button onClick={openNew} style={{
          padding: '8px 18px', borderRadius: '8px', background: '#a78bfa',
          color: '#0f172a', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer',
        }}>
          + Add Executive
        </button>
      </div>

      <AdminMessagesPanel role="executive" />

      {loading ? <p style={{ color: '#64748b' }}>Loading…</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Executive', 'Role', 'Category', 'Visible', 'Actions'].map(h => (
                  <th key={h} style={{ color: '#64748b', fontWeight: 600, textAlign: 'left', padding: '8px 12px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {execs.map(ex => (
                <tr key={ex.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', background: '#0f172a', flexShrink: 0 }}>
                        {ex.avatar_url
                          ? <img src={ex.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>👤</div>
                        }
                      </div>
                      <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{ex.name ?? '—'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{ex.role_title ?? '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{(ex.category ?? []).join(', ') || '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button onClick={() => toggleVisible(ex)} type="button" style={{
                      width: '36px', height: '20px', borderRadius: '10px', border: 'none',
                      background: ex.visible ? '#a78bfa' : '#334155', cursor: 'pointer',
                      position: 'relative', transition: 'background 0.2s',
                    }}>
                      <span style={{ position: 'absolute', top: '2px', left: ex.visible ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                    </button>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(ex)} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => setDeleting(ex.id)} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {execs.length === 0 && <p style={{ color: '#475569', textAlign: 'center', padding: '32px' }}>No executives yet.</p>}
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '28px', maxWidth: '360px', width: '90%', border: '1px solid rgba(239,68,68,0.3)' }}>
            <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Delete executive?</h3>
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
          <div style={{ background: '#1e293b', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '90vh', overflowY: 'auto', scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700 }}>{isNew ? 'Add Executive' : 'Edit Executive'}</h2>
              <button onClick={close} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              {editing.user_id && (
                <AvatarUploader userId={editing.user_id} currentUrl={editing.avatar_url ?? null}
                  onUploaded={url => setEditing(prev => prev ? { ...prev, avatar_url: url } : prev)} />
              )}
              <AdminInput label="Full Name"  value={editing.name ?? ''}      onChange={set('name')}      required />
              <AdminInput label="Role/Title" value={editing.role_title ?? ''} onChange={set('role_title')} required />
              <AdminTextarea label="Quote" value={editing.quote ?? ''} onChange={set('quote')} rows={2} />
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {CATEGORY_OPTIONS.map(opt => (
                    <button key={opt} type="button" onClick={() => toggleCategory(opt)} style={{
                      padding: '5px 14px', borderRadius: '20px', fontSize: '13px', border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
                      borderColor: (editing.category ?? []).includes(opt) ? '#a78bfa' : 'rgba(255,255,255,0.1)',
                      background: (editing.category ?? []).includes(opt) ? 'rgba(167,139,250,0.12)' : 'transparent',
                      color: (editing.category ?? []).includes(opt) ? '#a78bfa' : '#64748b',
                    }}>{opt}</button>
                  ))}
                </div>
              </div>
              <AdminToggle label="Visible" description="Show on Executive Council page" checked={editing.visible ?? false} onChange={set('visible')} />
              <SaveBar saving={saving} saved={saved} error={formErr} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
