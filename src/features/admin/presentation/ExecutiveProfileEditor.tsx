/**
 * ExecutiveProfileEditor — Upsert own executive profile
 */
import { useState } from 'react';
import { supabase } from '../../../core/supabase/client';
import { useAuth } from '../../../shared/hooks/useAuth';
import { AdminInput, AdminTextarea, AvatarUploader, SaveBar, TagEditor } from './AdminFormComponents';

const CATEGORY_OPTIONS = ["Founding Council", "'27", "'28"];

export function ExecutiveProfileEditor() {
  const { user } = useAuth();

  const [name,      setName]      = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [quote,     setQuote]     = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [skills,    setSkills]    = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState('');
  const [linkedin,  setLinkedin]  = useState('');
  const [twitter,   setTwitter]   = useState('');
  const [category,  setCategory]  = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');

  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [messageError, setMessageError] = useState('');

  // No longer fetching existing data since this is a shared login for submissions.

  const toggleCategory = (cat: string) => setCategory([cat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setSaved(false); setError('');

    if (skills.length === 0) return setError('At least one skill is required.');
    if (category.length === 0) return setError('Please select a category.');

    const { error } = await supabase.from('executives').insert({
      user_id: user.id, name, role_title: roleTitle, quote,
      avatar_url: avatarUrl, skills, portfolio, linkedin, twitter,
      category, visible: false,
    });

    setSaving(false);
    if (error) { 
      setError(error.message); 
    } else { 
      setSaved(true);
      // Clear form
      setName(''); setRoleTitle(''); setQuote('');
      setAvatarUrl(null); setSkills([]); setPortfolio('');
      setLinkedin(''); setTwitter(''); setCategory([]);
      setTimeout(() => setSaved(false), 3000); 
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSendingMessage(true); setMessageSent(false); setMessageError('');

    const { error } = await supabase.from('admin_messages').insert({
      user_id: user.id,
      sender_name: senderName,
      role: 'executive',
      message
    });

    setSendingMessage(false);
    if (error) {
      setMessageError(error.message);
    } else {
      setMessageSent(true);
      setSenderName('');
      setMessage('');
      setTimeout(() => setMessageSent(false), 3000);
    }
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <AdminInput label="Full Name"  value={name}      onChange={setName}      required placeholder="Ada Lovelace" />
          <AdminInput label="Role/Title" value={roleTitle} onChange={setRoleTitle} required placeholder="President" />
          <AdminInput label="Portfolio / Website" value={portfolio} onChange={setPortfolio} required placeholder="https://..." />
          <AdminInput label="LinkedIn"   value={linkedin}  onChange={setLinkedin}  required placeholder="https://linkedin.com/in/..." />
          <AdminInput label="Twitter/X"  value={twitter}   onChange={setTwitter}   required placeholder="https://twitter.com/..." />
        </div>

        <AdminTextarea label="Quote" value={quote} onChange={setQuote} required placeholder="Your vision in one sentence…" rows={3} />
        
        <TagEditor label="Skills" tags={skills} onChange={setSkills} required placeholder="e.g. Node.js, PostgreSQL…" />

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

        {/* Approval status */}
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
              Submit your profile and notify your admin to publish it.
            </div>
          </div>
        </div>

        <SaveBar saving={saving} saved={saved} error={error} />
      </form>

      {/* Contact Admin Section */}
      <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Need an edit?</h2>
        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
          Send a quick message to the Super Admin to request changes to an existing profile.
        </p>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
            <AdminInput label="Your Name" value={senderName} onChange={setSenderName} required placeholder="Who is requesting?" />
          </div>
          <AdminTextarea label="Message" value={message} onChange={setMessage} required placeholder="e.g. Please update my quote" rows={3} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit" disabled={sendingMessage}
              style={{
                padding: '10px 24px', borderRadius: '10px',
                background: sendingMessage ? '#334155' : 'rgba(255,255,255,0.05)',
                color: '#f1f5f9', fontWeight: 600, fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)',
                cursor: sendingMessage ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => !sendingMessage && (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => !sendingMessage && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            >
              {sendingMessage ? 'Sending…' : 'Send Message'}
            </button>
            {messageSent && <span style={{ color: '#A3D045', fontSize: '13px' }}>✓ Sent!</span>}
            {messageError && <span style={{ color: '#f87171', fontSize: '13px' }}>{messageError}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
