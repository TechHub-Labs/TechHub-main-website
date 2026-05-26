/**
 * MemberProfileEditor — Upsert own member profile
 * Handles first-time (INSERT) and returning (UPDATE) members via .upsert()
 */
import { useState } from 'react';
import { supabase } from '../../../core/supabase/client';
import { useAuth } from '../../../shared/hooks/useAuth';
import {
  AdminInput, AdminTextarea, TagEditor,
  AvatarUploader, SaveBar,
} from './AdminFormComponents';

const CATEGORY_OPTIONS = ['Undergrad', 'Alumni'];

export function MemberProfileEditor() {
  const { user } = useAuth();

  const [name,     setName]     = useState('');
  const [roleTitle,setRoleTitle]= useState('');
  const [quote,    setQuote]    = useState('');
  const [avatarUrl,setAvatarUrl]= useState<string | null>(null);
  const [skills,   setSkills]   = useState<string[]>([]);
  const [portfolio,setPortfolio]= useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter,  setTwitter]  = useState('');
  const [category, setCategory] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');

  // No longer fetching existing data since this is a shared login for submissions.

  const toggleCategory = (cat: string) =>
    setCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setSaved(false); setError('');

    if (skills.length === 0) return setError('At least one skill is required.');
    if (category.length === 0) return setError('Please select a category.');

    const { error } = await supabase.from('members').insert({
      user_id: user.id, name, role_title: roleTitle, quote,
      avatar_url: avatarUrl, skills, projects: [], github: portfolio, linkedin, twitter,
      category, visible: false,
    });

    setSaving(false);
    if (error) { 
      setError(error.message); 
    } else { 
      setSaved(true);
      // Clear form
      setName(''); setRoleTitle(''); setQuote('');
      setAvatarUrl(null); setSkills([]);
      setPortfolio(''); setLinkedin(''); setTwitter(''); setCategory([]);
      setTimeout(() => setSaved(false), 3000); 
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '32px', maxWidth: '680px' }}>
      <h1 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Create Profile</h1>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '28px' }}>
        Your profile will appear on the Members page once an admin marks it visible.
      </p>

      <form onSubmit={handleSubmit}>
        <AvatarUploader currentUrl={avatarUrl} onUploaded={setAvatarUrl} bucketName="members" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <AdminInput label="Full Name"  value={name}      onChange={setName}      required placeholder="Ada Lovelace" />
          <AdminInput label="Role/Title" value={roleTitle} onChange={setRoleTitle} required placeholder="Frontend Developer" />
          <AdminInput label="Portfolio / Website" value={portfolio} onChange={setPortfolio} required placeholder="https://..." />
          <AdminInput label="LinkedIn"   value={linkedin}  onChange={setLinkedin}  required placeholder="https://linkedin.com/in/..." />
          <AdminInput label="Twitter/X"  value={twitter}   onChange={setTwitter}   required placeholder="https://twitter.com/..." />
        </div>

        <AdminTextarea label="Quote" value={quote} onChange={setQuote} required placeholder="A short quote about your journey…" rows={3} />

        <TagEditor label="Skills" tags={skills} onChange={setSkills} required placeholder="e.g. React, Python…" />

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

        {/* Approval status — super admin controls visibility */}
        <div style={{
          marginTop: '8px', padding: '12px 16px', borderRadius: '8px',
          background: 'rgba(251,191,36,0.1)',
          border: '1px solid rgba(251,191,36,0.3)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '16px' }}>⏳</span>
          <div>
            <div style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 600 }}>
              Pending admin approval
            </div>
            <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>
              Submit your profile to notify your admin to publish it.
            </div>
          </div>
        </div>

        <SaveBar saving={saving} saved={saved} error={error} />
      </form>
    </div>
  );
}
