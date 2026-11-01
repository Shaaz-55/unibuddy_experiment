import { ArrowUpRight, Star } from 'lucide-react';
import { PORTRAITS } from '../data/visuals';
import ConnectionAction from './ConnectionAction';
import './MentorCard.css';

export function MentorPortrait({ mentor }) {
  const initials = mentor.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('');
  return PORTRAITS[mentor.id] ? <img src={PORTRAITS[mentor.id]} alt="" loading="lazy" /> : <span className="mentor-monogram" style={{ background: mentor.gradient || 'var(--primary-soft)' }} aria-hidden="true"><span>{initials}</span><svg viewBox="0 0 250 220" fill="none"><circle cx="125" cy="110" r="76" /><circle cx="125" cy="110" r="99" /><path d="M0 110h250M125 0v220" /></svg></span>;
}

export default function MentorCard({ mentor, onView }) {
  const skills = mentor.interests || mentor.skills || [];
  return <article className="senior-card">
    <button type="button" className="senior-card-photo" aria-label={`View ${mentor.name}'s profile`} onClick={() => onView(mentor)}><MentorPortrait mentor={mentor} /><span className="senior-card-year">{mentor.year} / SENIOR PASS</span><span className="senior-card-arrow"><ArrowUpRight size={20} /></span><span className={`senior-card-availability ${mentor.available === false ? 'is-away' : ''}`}><span />{mentor.available === false ? 'Taking a break' : 'Open to connect'}</span></button>
    <div className="senior-card-body"><div className="senior-card-name"><button type="button" onClick={() => onView(mentor)}>{mentor.name}</button>{mentor.rating > 0 && <span><Star size={12} fill="currentColor" />{mentor.rating.toFixed(1)}</span>}</div><p className="senior-card-college">{mentor.college} <span>· {mentor.year}</span></p><div className="senior-card-skills">{skills.slice(0, 3).map(skill => <span key={skill}>{skill}</span>)}</div><p className="senior-card-bio">{mentor.bio || mentor.description || 'Here to help you find your next step.'}</p><div className="senior-card-footer"><ConnectionAction profile={mentor} /><button type="button" className="text-link" onClick={() => onView(mentor)} aria-label={`More about ${mentor.name}`}>Meet {mentor.name.split(' ')[0]}<ArrowUpRight size={14} /></button></div></div>
  </article>;
}
