/**
 * SuperAdminMembers — Full CRUD for all member profiles
 * Table view with add/edit modal + delete confirmation + visible toggle
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../core/supabase/client';
import type { Member } from '../../../core/supabase/types';
import {
  AdminInput, AdminTextarea, TagEditor,
  AvatarUploader, AdminToggle, SaveBar, AdminMessagesPanel
} from './AdminFormComponents';

const CATEGORY_OPTIONS = ['Undergrad', 'Alumni'];
const EMPTY: Partial<Member> = {
  name: '', role_title: '', year: '', quote: '', avatar_url: null,
  skills: [], projects: [], github: '', linkedin: '', twitter: '',
  category: [], visible: false,
};

export function SuperAdminMembers() {
  const [members,  setMembers]  = useState<Member[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState<Partial<Member> | null>(null);
  const [isNew,    setIsNew]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [formErr,  setFormErr]  = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search,   setSearch]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('members').select('*').order('name');
    setMembers((data ?? []) as Member[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setEditing({ ...EMPTY }); setIsNew(true); setSaved(false); setFormErr(''); };
  const openEdit = (m: Member) => { setEditing({ ...m }); setIsNew(false); setSaved(false); setFormErr(''); };
  const closeModal = () => { setEditing(null); setSaved(false); setFormErr(''); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setSaved(false); setFormErr('');

    if (!editing.avatar_url) { setSaving(false); return setFormErr('Please upload a profile picture.'); }
    if (!editing.category || editing.category.length === 0) { setSaving(false); return setFormErr('Please select a category.'); }
    if (!editing.quote?.trim()) { setSaving(false); return setFormErr('Please provide a quote.'); }
    if (!editing.skills || editing.skills.length === 0) { setSaving(false); return setFormErr('At least one skill is required.'); }
    if (!editing.github?.trim()) { setSaving(false); return setFormErr('Please provide a GitHub/Portfolio link.'); }

    const payload = {
      name: editing.name, role_title: editing.role_title, year: editing.year,
      quote: editing.quote, avatar_url: editing.avatar_url,
      skills: editing.skills ?? [], projects: editing.projects ?? [],
      github: editing.github, linkedin: editing.linkedin, twitter: editing.twitter,
      category: editing.category ?? [], visible: editing.visible ?? false,
    };

    const { error } = isNew
      ? await (supabase.from('members') as any).insert(payload)
      : await (supabase.from('members') as any).update(payload).eq('id', editing.id!);

    setSaving(false);
    if (error) { setFormErr(error.message); return; }
    setSaved(true);
    load();
    setTimeout(closeModal, 1000);
  };

  const confirmDelete = async (id: string) => {
    const { error } = await (supabase.from('members') as any).delete().eq('id', id);
    if (error) {
      setFormErr(`Delete failed: ${error.message}`);
      setDeleting(null);
      return;
    }
    setDeleting(null);
    load();
  };

  const toggleVisible = async (m: Member) => {
    await (supabase.from('members') as any).update({ visible: !m.visible }).eq('id', m.id);
    load();
  };

  const filtered = members.filter(m =>
    !search || (m.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const set = (key: keyof Member) => (val: any) =>
    setEditing(prev => prev ? { ...prev, [key]: val } : prev);

  const toggleCategory = (cat: string) =>
    set('category')((editing?.category ?? []).includes(cat)
      ? (editing?.category ?? []).filter((c: string) => c !== cat)
      : [...(editing?.category ?? []), cat]);

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>Members</h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>{members.length} total</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
            className="min-input"
            style={{
              padding: '10px 16px', borderRadius: '12px', color: 'inherit', fontSize: '13px',
              outline: 'none', width: '200px', transition: 'all 0.2s', border: 'none'
            }}
          />
          <button onClick={openNew} className="min-button" style={{
            padding: '10px 18px', borderRadius: '12px', border: 'none',
            color: '#A3D045', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
          }}>
            + Add Member
          </button>
        </div>
      </div>

      {/* Messages */}
      <AdminMessagesPanel role="member" />

      {/* Table */}
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading…</p>
      ) : (
        <div className="brutalist-card" style={{ overflowX: 'auto', padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Member', 'Role', 'Year', 'Category', 'Visible', 'Actions'].map(h => (
                  <th key={h} style={{ color: '#64748b', fontWeight: 600, textAlign: 'left', padding: '8px 12px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="min-input" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, padding: m.avatar_url ? '0' : '8px' }}>
                        {m.avatar_url
                          ? <img src={m.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>👤</div>
                        }
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{m.name ?? '—'}</span>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {m.github && <a href={m.github} target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontSize: '11px', textDecoration: 'none' }}>GH</a>}
                          {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontSize: '11px', textDecoration: 'none' }}>IN</a>}
                          {m.twitter && <a href={m.twitter} target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontSize: '11px', textDecoration: 'none' }}>X</a>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{m.role_title ?? '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{m.year ?? '—'}</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{(m.category ?? []).join(', ') || '—'}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => toggleVisible(m)} type="button" className="min-button" style={{
                      width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                      color: m.visible ? '#A3D045' : '#94a3b8', cursor: 'pointer',
                      position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute', top: '4px', left: m.visible ? '24px' : '4px',
                        width: '16px', height: '16px', borderRadius: '50%', background: m.visible ? '#A3D045' : '#94a3b8',
                        transition: 'left 0.2s',
                      }} />
                    </button>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(m)} className="min-button" style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', color: 'inherit', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                      <button onClick={() => setDeleting(m.id)} className="min-button" style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ color: '#475569', textAlign: 'center', padding: '32px' }}>No members found.</p>
          )}
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="min-card" style={{ padding: '32px', maxWidth: '360px', width: '90%', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Delete member?</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>This action <strong style={{ color: '#ef4444' }}>cannot be undone</strong>. The member will be permanently removed.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleting(null)} className="min-button" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => confirmDelete(deleting)} className="min-button" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add modal */}
      {editing && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 pt-[80px] lg:pt-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="min-card p-6 sm:p-8" style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{isNew ? 'Add Member' : 'Edit Member'}</h2>
              <button onClick={closeModal} className="min-button" style={{ border: 'none', color: '#64748b', fontSize: '16px', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8">
                
                <div className="md:w-1/3 flex flex-col gap-2">
                  <AvatarUploader currentUrl={editing.avatar_url ?? null} onUploaded={url => setEditing(prev => prev ? { ...prev, avatar_url: url } : prev)} bucketName="members" />
                  <div className="mt-2">
                    <label className="admin-label">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_OPTIONS.map(opt => (
                        <button key={opt} type="button" onClick={() => toggleCategory(opt)} className={(editing.category ?? []).includes(opt) ? 'min-input' : 'min-button'} style={{
                          padding: '6px 10px', borderRadius: '8px', fontSize: '12px', border: 'none', cursor: 'pointer',
                          color: (editing.category ?? []).includes(opt) ? '#A3D045' : '#64748b', fontWeight: 600
                        }}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <AdminToggle label="Visible" description="Show on members page" checked={editing.visible ?? false} onChange={set('visible')} />
                  </div>
                </div>

                <div className="md:w-2/3 flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="flex-1"><AdminInput label="Full Name"  value={editing.name ?? ''}      onChange={set('name')}      required /></div>
                    <div className="flex-1"><AdminInput label="Role/Title" value={editing.role_title ?? ''} onChange={set('role_title')} /></div>
                    <div className="sm:w-24"><AdminInput label="Year" value={editing.year ?? ''}       onChange={set('year')} /></div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="flex-1"><AdminInput label="GitHub"     value={editing.github ?? ''}     onChange={set('github')} /></div>
                    <div className="flex-1"><AdminInput label="LinkedIn"   value={editing.linkedin ?? ''}   onChange={set('linkedin')} /></div>
                    <div className="flex-1"><AdminInput label="Twitter/X"  value={editing.twitter ?? ''}    onChange={set('twitter')} /></div>
                  </div>

                  <AdminTextarea label="Quote" value={editing.quote ?? ''} onChange={set('quote')} rows={2} />
                  
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="flex-1"><TagEditor label="Skills"   tags={editing.skills   ?? []} onChange={set('skills')}   placeholder="e.g. React" /></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <SaveBar saving={saving} saved={saved} error={formErr} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
