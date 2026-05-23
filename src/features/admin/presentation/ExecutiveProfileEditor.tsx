/**
 * ExecutiveProfileEditor — Upsert own executive profile
 */
import { useEffect, useState } from 'react';
import { supabase } from '../../../core/supabase/client';
import { useAuth } from '../../../shared/hooks/useAuth';
import { AdminInput, AdminTextarea, AvatarUploader, AdminToggle, SaveBar } from './AdminFormComponents';

const CATEGORY_OPTIONS = ["Founding Council", "'27", "'28"];

export function ExecutiveProfileEditor() {
  const { user } = useAuth();

  const [name,      setName]      = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [quote,     setQuote]     = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [category,  setCategory]  = useState<string[]>([]);
  const [visible,   setVisible]   = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');

  useEffect(() => {
    if (!user) return;
    supabase.from('executives').select('*').eq('user_id', user.id).single().then(({ data: raw }) => {
      const data = raw as import('../../../core/supabase/types').Executive | null;
      if (!data) return;
      setName(data.name ?? '');
      setRoleTitle(data.role_title ?? '');
      setQuote(data.quote ?? '');
      setAvatarUrl(data.avatar_url ?? null);
      setCategory(data.category ?? []);
      setVisible(data.visible ?? false);
    });
  }, [user]);

  const toggleCategory = (cat: string) =>
    setCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setSaved(false); setError('');

    const { error } = await (supabase.from('executives') as any).upsert({
      user_id: user.id, name, role_title: roleTitle, quote,
      avatar_url: avatarUrl, category, visible,
    }, { onConflict: 'user_id' });

    setSaving(false);
    if (error) { setError(error.message); }
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '32px', maxWidth: '560px' }}>
      <h1 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>My Executive Profile</h1>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '28px' }}>
        Your profile will appear on the Executive Council page once marked visible.
      </p>

      <form onSubmit={handleSubmit}>
        {user && <AvatarUploader userId={user.id} currentUrl={avatarUrl} onUploaded={setAvatarUrl} />}

        <AdminInput label="Full Name"  value={name}      onChange={setName}      required placeholder="Ada Lovelace" />
        <AdminInput label="Role/Title" value={roleTitle} onChange={setRoleTitle} required placeholder="President" />
        <AdminTextarea label="Quote" value={quote} onChange={setQuote} placeholder="Your vision in one sentence…" rows={3} />

        {/* Category */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Category
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CATEGORY_OPTIONS.map(opt => (
              <button
                key={opt} type="button" onClick={() => toggleCategory(opt)}
                style={{
                  padding: '5px 14px', borderRadius: '20px', fontSize: '13px',
                  border: '1px solid',
                  borderColor: category.includes(opt) ? '#a78bfa' : 'rgba(255,255,255,0.1)',
                  background: category.includes(opt) ? 'rgba(167,139,250,0.12)' : 'transparent',
                  color: category.includes(opt) ? '#a78bfa' : '#64748b',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <AdminToggle
          label="Visible on Executive Council page"
          description="Toggle on when your profile is ready to publish"
          checked={visible}
          onChange={setVisible}
        />

        <SaveBar saving={saving} saved={saved} error={error} />
      </form>
    </div>
  );
}
