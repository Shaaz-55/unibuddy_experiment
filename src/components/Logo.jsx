import { Link } from 'react-router-dom';

export default function Logo({ to = '/', small = false }) {
  return <Link className={`campus-brand ${small ? 'is-small' : ''}`} to={to} aria-label="UniBuddy home"><img className="brand-mark" src="/brand/unibuddy-logo.png" alt="" width="30" height="30" decoding="async" /><span>unibuddy<span className="brand-dot">.</span></span></Link>;
}
