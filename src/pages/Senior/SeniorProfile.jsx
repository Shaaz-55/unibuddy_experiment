import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Save, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { COLLEGES } from '../../data/colleges';
import { INTERESTS } from '../../data/visuals';
import StudentAvatar from '../../components/StudentAvatar';
import SkillTag from '../../components/SkillTag';
import './SeniorProfile.css';

const formFrom = user => ({ name: user.name, college: user.college, year: user.year, branch: user.branch || '', bio: user.bio || '', interests: user.interests || [], available: user.available !== false });

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const senior = user.role === 'senior';
  const [form, setForm] = useState(() => formFrom(user));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(formFrom(user));
  function setField(field, value) { setError(''); setSaved(false); setForm(current => ({ ...current, [field]: value })); }
  function toggleSkill(skill) { setField('interests', form.interests.includes(skill) ? form.interests.filter(item => item !== skill) : [...form.interests, skill]); }
  function handleSave(event) {
    event.preventDefault();
    if (form.name.trim().length < 2 || !form.college.trim() || !form.interests.length) { setError('Add your name, college and at least one interest.'); return; }
    const next = { ...form, name: form.name.trim(), college: form.college.trim(), bio: form.bio.trim(), branch: form.branch.trim() };
    updateProfile(next); setForm(next); setSaved(true);
    showToast(senior ? 'Your mentor profile is ready for its next hello.' : 'Your campus pass feels a little more like you.');
  }
  return <div className="network-page senior-profile-page wrap">
    <Link className="network-text-link profile-back-link" to={senior ? '/senior' : '/dashboard'}><ArrowLeft size={14} /> Back to your campus</Link>
    <header className="network-page-header"><div><span className="network-eyebrow"><Sparkles size={13} /> THE PERSON BEHIND THE PASS</span><h1>A little more you.</h1><p>{senior ? 'Your experience could be someone else’s starting point.' : 'Good connections start with a little introduction.'}</p></div></header>
    <div className="senior-profile-grid">
      <form className="network-panel mentor-profile-form" onSubmit={handleSave}>
        <div className="network-section-heading"><div><h2>Make yourself known.</h2><p>A few little things that make you, you.</p></div></div>
        {error && <p className="auth-error-banner" role="alert">{error}</p>}
        <div className="profile-form-row"><label>Full name<input className="auth-input" value={form.name} maxLength={80} minLength={2} autoComplete="name" onChange={event => setField('name', event.target.value)} required /></label><label>Your college<input className="auth-input" value={form.college} list="profile-colleges" maxLength={120} autoComplete="organization" onChange={event => setField('college', event.target.value)} required /><datalist id="profile-colleges">{COLLEGES.map(college => <option value={college.name} key={college.name} />)}</datalist></label></div>
        <div className="profile-form-row"><label>Year of study<select className="auth-input" value={form.year} onChange={event => setField('year', event.target.value)}>{['1st yr', '2nd yr', '3rd yr', '4th yr'].map(year => <option key={year}>{year}</option>)}</select></label><label>Branch <span className="muted">(optional)</span><input className="auth-input" value={form.branch} maxLength={80} onChange={event => setField('branch', event.target.value)} placeholder="e.g. Computer Science" /></label></div>
        <label className="profile-bio-label">Your little introduction<textarea className="auth-input" rows={4} value={form.bio} maxLength={400} onChange={event => setField('bio', event.target.value)} placeholder={senior ? 'What have you learned? What can you help someone with?' : 'What are you curious about? What would you love to learn?'} /><span>{form.bio.length}/400 · Keep it personal. Keep it you.</span></label>
        <fieldset className="profile-skills-fieldset"><legend>{senior ? 'Things you can help with' : 'Things you’re curious about'}</legend><p>{senior ? 'Choose the areas where you can give someone a little direction.' : 'A shared interest is a good place for a conversation to start.'}</p><div className="profile-skill-options">{[...new Set([...INTERESTS, ...form.interests])].map(skill => <button type="button" key={skill} aria-pressed={form.interests.includes(skill)} className={form.interests.includes(skill) ? 'selected' : ''} onClick={() => toggleSkill(skill)}>{form.interests.includes(skill) && <Check size={12} />}{skill}</button>)}</div></fieldset>
        {senior && <div className="profile-availability"><div><strong>Open to new connections</strong><p>Take a breather whenever you need. Your existing chats stay open.</p></div><button type="button" role="switch" aria-label="Open to new connections" aria-checked={form.available} className={`profile-switch ${form.available ? 'active' : ''}`} onClick={() => setField('available', !form.available)}><span /></button></div>}
        <div className="profile-form-footer"><span>{user.email}</span><button type="submit" className="btn-primary network-btn" disabled={!dirty}><Save size={15} /> Save changes</button></div>
        {saved && <p className="profile-save-status" role="status"><Check size={14} /> All changes saved to your campus pass.</p>}
      </form>
      <aside className="profile-preview-col"><span className="network-eyebrow">A LITTLE LOOK AT YOUR PASS</span><article className="network-panel profile-preview"><StudentAvatar profile={{ ...user, name: form.name }} size="large" /><span className={`student-role ${senior ? '' : 'role-junior'}`}>{senior ? 'Senior' : 'Junior'} pass</span><h2>{form.name || 'Your name'}</h2><p>{form.college || 'Your college'} · {form.year}{form.branch ? ` · ${form.branch}` : ''}</p><div className="network-skill-list">{form.interests.map((skill, index) => <SkillTag key={skill} name={skill} index={index} />)}</div><blockquote>{form.bio || 'Your story belongs here. Tell your campus a little about yourself.'}</blockquote><span className={`profile-preview-status ${!senior || form.available ? 'available' : ''}`}><span />{senior ? form.available ? 'Open to new connections' : 'Taking a break from new connections' : 'Your people. Your place. Your possibilities.'}</span></article><div className="profile-writing-tip"><Sparkles size={17} /><p>{senior ? 'A good introduction says what you’ve tried, what you’ve learned, and where you can help. You don’t need all the answers to make a difference.' : 'A first project, a favourite subject, a big question. Start with something you care about, and let the right people find you.'}</p></div></aside>
    </div>
  </div>;
}
