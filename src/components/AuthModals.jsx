import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { COLLEGES } from '../data/colleges';
import { DEMO_JUNIOR, DEMO_SENIOR } from '../data/network';
import { INTERESTS } from '../data/visuals';
import { destinationFor, validatePass } from '../lib/profiles';
import Modal from './Modal';
import StudentAvatar from './StudentAvatar';

export default function AuthModals() {
  const { authModal, closeAuthModal, openLoginModal, openRegisterModal, openSeniorModal, login, register, loginAsDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', college: '', year: '1st yr', interests: ['DSA', 'Web Dev'] });
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const senior = authModal.mode === 'senior';
  const loggingIn = authModal.mode === 'login';
  useEffect(() => {
    setErrors({}); setMessage('');
    setForm(previous => ({ ...previous, year: senior ? '3rd yr' : '1st yr' }));
  }, [authModal.mode, authModal.isOpen, senior]);
  function setField(field, value) { setForm(previous => ({ ...previous, [field]: value })); setErrors(previous => ({ ...previous, [field]: '' })); setMessage(''); }
  function finish(user) {
    showToast(`Your next chapter starts here, ${user.name.split(' ')[0]}.`);
    navigate(destinationFor(user.role, location.state?.from), { replace: true, state: null });
  }
  function submit(event) {
    event.preventDefault();
    if (loggingIn) {
      if (!email.trim()) { setMessage('Enter the email you used for your campus pass.'); return; }
      const result = login(email);
      if (result.success) finish(result.user); else setMessage(result.error);
      return;
    }
    const nextErrors = validatePass(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setMessage(Object.values(nextErrors)[0]);
      document.getElementById(`pass-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    const result = register({ ...form, role: senior ? 'senior' : 'junior' });
    if (result.success) finish(result.user); else setMessage(result.error);
  }
  return <Modal isOpen={authModal.isOpen} onClose={closeAuthModal} title={loggingIn ? 'Good to see you again.' : senior ? 'A little wisdom goes a long way.' : 'You belong here.'} subtitle={loggingIn ? 'Pick up where your last hello left off.' : senior ? 'Get your senior pass. Be someone’s head start.' : 'Your people, your campus, your next chapter.'} maxWidth={loggingIn ? '460px' : '520px'}>
    <form className="auth-form" onSubmit={submit} noValidate>
      {!loggingIn && <div className="auth-role-choice" aria-label="Choose your campus pass"><button type="button" className={!senior ? 'active' : ''} aria-pressed={!senior} onClick={openRegisterModal}>I’m finding my way</button><button type="button" className={senior ? 'active' : ''} aria-pressed={senior} onClick={openSeniorModal}>I’m here to guide</button></div>}
      {message && <div className="auth-error-banner" role="alert"><AlertCircle size={16} /><span>{message}</span></div>}
      {loggingIn ? <div className="form-field"><label htmlFor="login-email">Your email</label><input id="login-email" className="auth-input" type="email" value={email} onChange={event => { setEmail(event.target.value); setMessage(''); }} autoComplete="email" placeholder="you@college.edu" required maxLength={160} /></div> : <>
        <div className="form-field"><label htmlFor="pass-name">Full name</label><input id="pass-name" className="auth-input" value={form.name} onChange={event => setField('name', event.target.value)} autoComplete="name" placeholder="What should we call you?" maxLength={80} required aria-invalid={!!errors.name} /></div>
        <div className="form-field"><label htmlFor="pass-email">Email</label><input id="pass-email" className="auth-input" type="email" value={form.email} onChange={event => setField('email', event.target.value)} autoComplete="email" placeholder="you@college.edu" maxLength={160} required aria-invalid={!!errors.email} /></div>
        <div className="auth-form-row"><div className="form-field"><label htmlFor="pass-college">Your college</label><input id="pass-college" list="pass-colleges" className="auth-input" value={form.college} onChange={event => setField('college', event.target.value)} placeholder="Find or type your college" autoComplete="organization" maxLength={120} required aria-invalid={!!errors.college} /><datalist id="pass-colleges">{COLLEGES.map(college => <option value={college.name} key={college.name} />)}</datalist></div><div className="form-field"><label htmlFor="pass-year">Year</label><select id="pass-year" className="auth-input" value={form.year} onChange={event => setField('year', event.target.value)}>{['1st yr', '2nd yr', '3rd yr', '4th yr'].map(year => <option key={year}>{year}</option>)}</select></div></div>
        <fieldset className="auth-interest-field" id="pass-interests" tabIndex={-1}><legend>{senior ? 'I can help with' : 'I’m curious about'} <span className="muted">· Pick at least one</span></legend><div className="interests-chip-grid">{INTERESTS.slice(0, 12).map(interest => <button type="button" key={interest} aria-pressed={form.interests.includes(interest)} className={`interest-chip ${form.interests.includes(interest) ? 'selected' : ''}`} onClick={() => setField('interests', form.interests.includes(interest) ? form.interests.filter(item => item !== interest) : [...form.interests, interest])}>{form.interests.includes(interest) && <Check size={12} />}{interest}</button>)}</div></fieldset>
      </>}
      <button type="submit" className="btn-primary auth-submit-btn">{loggingIn ? 'Open my campus pass' : `Get my ${senior ? 'senior' : 'junior'} pass`}<ArrowUpRight size={18} /></button>
      <p className="auth-switch-text">{loggingIn ? 'New around here? ' : 'Already part of the campus? '}<button type="button" className="auth-switch-btn" onClick={loggingIn ? openRegisterModal : openLoginModal}>{loggingIn ? 'Make yourself at home' : 'Log in'}</button></p>
      <div className="auth-demo-section"><p><Sparkles size={13} /> Take a look around with a demo pass</p><div className="demo-choices">{[DEMO_JUNIOR, DEMO_SENIOR].map(profile => <button key={profile.id} type="button" onClick={() => finish(loginAsDemo(profile.role))} aria-label={`Explore as a ${profile.role}`}><StudentAvatar profile={profile} size="small" /><span>{profile.role === 'senior' ? 'Senior' : 'Junior'} pass<small>{profile.name.split(' ')[0]} · IIT Bombay</small></span><ArrowUpRight size={15} /></button>)}</div><p className="auth-local-note">This demo saves your pass on this browser. No password needed.</p></div>
    </form>
  </Modal>;
}
