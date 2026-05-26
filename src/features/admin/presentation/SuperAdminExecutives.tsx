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
        <button onClick={openNew} className="min-button" style={{
          padding: '10px 18px', borderRadius: '12px', border: 'none',
          color: '#A3D045', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
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
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="min-input" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, padding: ex.avatar_url ? '0' : '8px' }}>
                        {ex.avatar_url
                          ? <img src={ex.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>👤</div>
                        }
                      </div>
                      <span style={{ fontWeight: 600 }}>{ex.name ?? '—'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{ex.role_title ?? '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{(ex.category ?? []).join(', ') || '—'}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => toggleVisible(ex)} type="button" className="min-button" style={{
                      width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                      color: ex.visible ? '#A3D045' : '#94a3b8', cursor: 'pointer',
                      position: 'relative',
                    }}>
                      <span style={{ position: 'absolute', top: '4px', left: ex.visible ? '24px' : '4px', width: '16px', height: '16px', borderRadius: '50%', background: ex.visible ? '#A3D045' : '#94a3b8', transition: 'left 0.2s' }} />
                    </button>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(ex)} className="min-button" style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', color: 'inherit', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                      <button onClick={() => setDeleting(ex.id)} className="min-button" style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
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
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 pt-[80px] lg:pt-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="min-card" style={{ padding: '32px', maxWidth: '360px', width: '90%' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Delete executive?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleting(null)} className="min-button" style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => confirmDelete(deleting)} className="min-button" style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add modal */}
      {editing && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 pt-[80px] lg:pt-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="min-card p-6 sm:p-8" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{isNew ? 'Add Executive' : 'Edit Executive'}</h2>
              <button onClick={close} className="min-button" style={{ border: 'none', color: '#64748b', fontSize: '16px', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col gap-4">
                  <AvatarUploader currentUrl={editing.avatar_url ?? null} onUploaded={url => setEditing(prev => prev ? { ...prev, avatar_url: url } : prev)} />
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_OPTIONS.map(opt => (
                        <button key={opt} type="button" onClick={() => toggleCategory(opt)} className={(editing.category ?? []).includes(opt) ? 'min-input' : 'min-button'} style={{
                          padding: '8px 12px', borderRadius: '8px', fontSize: '12px', border: 'none', cursor: 'pointer',
                          color: (editing.category ?? []).includes(opt) ? '#A3D045' : '#64748b', fontWeight: 600
                        }}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 flex flex-col">
                  <AdminInput label="Full Name"  value={editing.name ?? ''}      onChange={set('name')}      required />
                  <AdminInput label="Role/Title" value={editing.role_title ?? ''} onChange={set('role_title')} required />
                  <AdminTextarea label="Quote" value={editing.quote ?? ''} onChange={set('quote')} rows={3} />
                  <div className="mt-2">
                    <AdminToggle label="Visible" description="Show on Executive Council page" checked={editing.visible ?? false} onChange={set('visible')} />
                  </div>
                </div>
              </div>
              
              <div className="mt-2 border-t border-white/5 pt-4">
                <SaveBar saving={saving} saved={saved} error={formErr} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
