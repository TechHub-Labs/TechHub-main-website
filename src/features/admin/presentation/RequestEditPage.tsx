import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from '../../../core/supabase/client';
import { useAuth } from '../../../shared/hooks/useAuth';
import { AdminTextarea } from './AdminFormComponents';

// Custom Select Component for fully styled options
function CustomSelect({ value, options, onChange, placeholder }: { value: string; options: string[]; onChange: (val: string) => void; placeholder: string; required?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: '0px', boxSizing: 'border-box',
          background: 'transparent', border: '2px solid rgba(255,255,255,0.2)',
          color: value ? '#f1f5f9' : '#94a3b8', fontSize: '14px', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          transition: 'all 0.1s',
          borderColor: open ? '#A3D045' : 'rgba(255,255,255,0.2)',
          boxShadow: open ? '4px 4px 0px #A3D045' : 'none',
          transform: open ? 'translate(-2px, -2px)' : 'none',
        }}
      >
        {value || placeholder}
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </div>
      
      {open && (
        <div className="brutalist-card" style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
          maxHeight: '240px', overflowY: 'auto', zIndex: 50,
          background: '#0f172a', borderColor: '#A3D045', boxShadow: '4px 4px 0px #A3D045',
          padding: '8px 0', display: 'flex', flexDirection: 'column'
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: '10px 16px', cursor: 'pointer', color: '#f1f5f9', fontSize: '14px',
                background: value === opt ? 'rgba(163,208,69,0.1)' : 'transparent',
                borderLeft: value === opt ? '4px solid #A3D045' : '4px solid transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = value === opt ? 'rgba(163,208,69,0.1)' : 'transparent'}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RequestEditPage() {
  const { user, role } = useAuth();
  const [names, setNames] = useState<string[]>([]);
  const [loadingNames, setLoadingNames] = useState(true);

  const [senderName, setSenderName] = useState('');
  const [requestType, setRequestType] = useState('Profile Update');
  const [message, setMessage] = useState('');
  
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    const fetchNames = async () => {
      setLoadingNames(true);
      if (role === 'member') {
        const { data } = await supabase.from('members').select('name').order('name');
        setNames(data?.map(d => d.name).filter(Boolean) || []);
      } else if (role === 'executive') {
        const { data } = await supabase.from('executives').select('name').order('name');
        setNames(data?.map(d => d.name).filter(Boolean) || []);
      }
      setLoadingNames(false);
    };
    if (role) fetchNames();
  }, [role]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!senderName) {
      setMessageError('Please select your name.');
      return;
    }
    
    setSendingMessage(true); setMessageSent(false); setMessageError('');

    const { error } = await supabase.from('admin_messages').insert({
      user_id: user.id,
      sender_name: senderName,
      role: role ?? 'unknown',
      request_type: requestType,
      message
    });

    if (!error) {
      // Send email notification to super admin via EmailJS
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
          {
            to_name:      'Super Admin',
            from_name:    senderName,
            name:         senderName, // matches {{name}} in user's From Name and body
            from_role:    role ?? 'unknown',
            request_type: requestType,
            title:        requestType, // matches {{title}} in user's Subject
            message:      message,
            reply_to:     user.email ?? '',
            email:        user.email ?? '', // matches {{email}} in user's Reply To
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string,
        );
      } catch (emailErr) {
        // Email failure should not block the message submit
        console.warn('Email notification failed:', emailErr);
      }
    }

    setSendingMessage(false);
    if (error) {
      setMessageError(error.message);
    } else {
      setMessageSent(true);
      setSenderName('');
      setMessage('');
      setTimeout(() => setMessageSent(false), 8000);
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '32px', maxWidth: '680px' }} className="admin-fade-in">
      <div className="brutalist-card" style={{
        padding: '32px', animation: 'adminFadeIn 0.8s'
      }}>
        <h1 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Request an Edit</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
          Select your name and the type of request. The Super Admin will review your message and make the changes.
        </p>
        
        <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Your Name<span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>
            </label>
            <CustomSelect 
              value={senderName} 
              options={names} 
              onChange={setSenderName} 
              placeholder={loadingNames ? 'Loading names...' : 'Select your name'} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Request Type<span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>
            </label>
            <CustomSelect 
              value={requestType} 
              options={['Profile Update', 'Project Link Update', 'General Question']} 
              onChange={setRequestType} 
              placeholder="Select Request Type" 
              required 
            />
          </div>

          <AdminTextarea label="Message" value={message} onChange={setMessage} required placeholder="e.g. Please update my quote..." rows={4} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
            <button
              type="submit" disabled={sendingMessage || messageSent}
              className={sendingMessage || messageSent ? '' : 'brutalist-button'}
              style={{
                padding: '14px 32px', borderRadius: '0px',
                background: sendingMessage || messageSent ? '#334155' : '#A3D045',
                color: sendingMessage || messageSent ? '#94a3b8' : '#0f172a', fontWeight: 800, fontSize: '15px', letterSpacing: '0.5px', textTransform: 'uppercase',
                border: sendingMessage || messageSent ? '2px solid transparent' : undefined, cursor: (sendingMessage || messageSent) ? 'not-allowed' : 'pointer',
              }}
            >
              {sendingMessage ? 'Sending…' : messageSent ? 'Sent' : 'Send Request'}
            </button>
            {messageSent && <span style={{ color: '#A3D045', fontSize: '14px', fontWeight: 600, animation: 'adminFadeIn 0.3s' }}>✓ Message delivered! We will process it shortly.</span>}
            {messageError && <span style={{ color: '#f87171', fontSize: '14px' }}>{messageError}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
