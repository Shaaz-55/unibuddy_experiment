import { PORTRAITS } from '../data/visuals';

export default function StudentAvatar({ profile, size = 'medium' }) {
  const name = (profile?.name || 'UniBuddy').trim();
  const initials = name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
  return <span className={`student-avatar avatar-${size}`} style={{ background: profile?.gradient || 'var(--avatar-indigo)' }} aria-hidden="true">{PORTRAITS[profile?.id] ? <img src={PORTRAITS[profile.id]} alt="" loading="lazy" /> : initials}</span>;
}
