import { Link } from 'react-router-dom';

export default function Logo({ to = '/', small = false }) {
  return <Link className={`campus-brand ${small ? 'is-small' : ''}`} to={to} aria-label="UniBuddy home"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 7v12a7 7 0 0 0 14 0V7M13 7v12a7 7 0 0 0 14 0V7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg><span>unibuddy<span className="brand-dot">.</span></span></Link>;
}
