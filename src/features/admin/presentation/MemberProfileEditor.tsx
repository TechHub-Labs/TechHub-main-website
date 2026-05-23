/**
 * MemberProfileEditor — Upsert own member profile
 * Handles first-time (INSERT) and returning (UPDATE) members via .upsert()
 */
import { useEffect, useState } from 'react';
import { supabase } from '../../../core/supabase/client';
import { useAuth } from '../../../shared/hooks/useAuth';
import {
  AdminInput, AdminTextarea, TagEditor,
  AvatarUploader, AdminToggle, SaveBar,
} from './AdminFormComponents';

const CATEGORY_OPTIONS = ['Undergrad', 'Alumni', "'25", "'26", "'27"];

export function MemberProfileEditor() {
  const { user } = useAuth();

  const [name,     setName]     = useState('');
  const [roleTitle,setRoleTitle]= useState('');
  const [year,     setYear]     = useState('');
  const [quote,    setQuote]    = useState('');
  const [avatarUrl,setAvatarUrl]= useState<string | null>(null);
  const [skills,   setSkills]   = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [github,   setGithub]   = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter,  setTwitter]  = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [visible,  setVisible]  = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');

  // Load existing profile on mount
  useEffect(() => {
    if (!user) return;
    supabase.from('members').select('*').eq('user_id', user.id).single().then(({ data: raw }) => {
      const data = raw as import('../../../core/supabase/types').Member | null;
      if (!data) return;
      setName(data.name ?? '');
      setRoleTitle(data.role_title ?? '');
      setYear(data.year ?? '');
      setQuote(data.quote ?? '');
      setAvatarUrl(data.avatar_url ?? null);
      setSkills(data.skills ?? []);
      setProjects(data.projects ?? []);
      setGithub(data.github ?? '');
      setLinkedin(data.linkedin ?? '');
      setTwitter(data.twitter ?? '');
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

    const { error } = await (supabase.from('members') as any).upsert({
      user_id: user.id, name, role_title: roleTitle, year, quote,
      avatar_url: avatarUrl, skills, projects, github, linkedin, twitter,
      category, visible,
    }, { onConflict: 'user_id' });

    setSaving(false);
    if (error) { setError(error.message); }
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '32px', maxWidth: '680px' }}>
      <h1 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>My Profile</h1>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '28px' }}>
        Your profile will appear on the Members page once an admin marks it visible.
      </p>

      <form onSubmit={handleSubmit}>
        {user && <AvatarUploader userId={user.id} currentUrl={avatarUrl} onUploaded={setAvatarUrl} />}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <AdminInput label="Full Name"  value={name}      onChange={setName}      required placeholder="Ada Lovelace" />
          <AdminInput label="Role/Title" value={roleTitle} onChange={setRoleTitle} placeholder="Frontend Developer" />
          <AdminInput label="Year"       value={year}      onChange={setYear}      placeholder="2025" />
          <AdminInput label="GitHub URL" value={github}    onChange={setGithub}    placeholder="https://github.com/..." />
          <AdminInput label="LinkedIn"   value={linkedin}  onChange={setLinkedin}  placeholder="https://linkedin.com/in/..." />
          <AdminInput label="Twitter/X"  value={twitter}   onChange={setTwitter}   placeholder="https://twitter.com/..." />
        </div>

        <AdminTextarea label="Quote" value={quote} onChange={setQuote} placeholder="A short quote about your journey…" rows={3} />

        <TagEditor label="Skills" tags={skills} onChange={setSkills} placeholder="e.g. React, Python…" />
        <TagEditor label="Projects" tags={projects} onChange={setProjects} placeholder="e.g. Project name" />

        {/* Category checkboxes */}
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
                  borderColor: category.includes(opt) ? '#A3D045' : 'rgba(255,255,255,0.1)',
                  background: category.includes(opt) ? 'rgba(163,208,69,0.12)' : 'transparent',
                  color: category.includes(opt) ? '#A3D045' : '#64748b',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <AdminToggle
          label="Visible on Members page"
          description="Toggle on when your profile is ready to publish"
          checked={visible}
          onChange={setVisible}
        />

        <SaveBar saving={saving} saved={saved} error={error} />
      </form>
    </div>
  );
}
