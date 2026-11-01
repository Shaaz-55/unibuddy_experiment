import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Search, SlidersHorizontal, Sparkles, Users, X } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { MENTOR_CATEGORIES, filterMentors } from '../../lib/mentors';
import MentorCard from '../../components/MentorCard';
import MentorProfile from '../../components/MentorProfile';
import './Mentors.css';

export default function Mentors() {
  const { profiles } = useNetwork();
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState(null);
  const query = params.get('q') || '';
  const category = MENTOR_CATEGORIES.some(item => item.id === params.get('category')) ? params.get('category') : 'all';
  const college = params.get('college') || 'all';
  const skill = params.get('skill') || 'all';
  const year = params.get('year') || 'all';
  const sort = params.get('sort') || 'recommended';
  const available = params.get('available') === 'true';
  const mentors = useMemo(() => profiles.filter(profile => profile.role === 'senior'), [profiles]);
  const colleges = [...new Set(mentors.map(mentor => mentor.college))].sort();
  const skills = [...new Set(['Web Dev', 'Cloud & DevOps', ...mentors.flatMap(mentor => mentor.interests || mentor.skills || [])])].sort();
  const results = filterMentors(profiles, { query, category, college, skill, year, sort, available });
  const activeFilters = !!(query || category !== 'all' || college !== 'all' || skill !== 'all' || year !== 'all' || available);
  function update(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || value === 'recommended') next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  }
  return <div className="mentors-page wrap">
    <header className="directory-heading"><div><p className="eyebrow"><span>01</span> THE PEOPLE WHO GET IT</p><h1>A little ahead.<br /><span>A lot on your side.</span></h1><p>Find a senior who’s been where you are.<br />A new skill, a clearer plan, or just a place to start.</p></div><div className="directory-note"><span className="directory-note-mark"><Sparkles size={27} /></span><span>GOOD COMPANY.<br />GREAT POSSIBILITIES.</span><p>{mentors.length} different stories.<br />One shared starting point.</p><a href="#senior-directory" aria-label="Explore the senior directory"><ArrowDown size={19} /></a></div></header>
    <section className="directory-controls" id="senior-directory" aria-label="Find your senior">
      <div className="directory-search-row"><label className="directory-search"><Search size={20} /><input type="search" placeholder="A name, a skill, a college. Start anywhere." aria-label="Search seniors" value={query} onChange={event => update('q', event.target.value)} />{query && <button type="button" onClick={() => update('q', '')} aria-label="Clear search"><X size={17} /></button>}</label><span className="directory-free-note"><span className="status-dot" /> A hello is always free.</span></div>
      <div className="directory-category-list" aria-label="Areas of interest">{MENTOR_CATEGORIES.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} className={category === item.id ? 'active' : ''} onClick={() => update('category', item.id)}>{item.label}</button>)}</div>
      <div className="directory-filters"><span className="filter-label"><SlidersHorizontal size={14} /> A little more specific</span><select value={skill} onChange={event => update('skill', event.target.value)} aria-label="Filter by skill"><option value="all">Any skill</option>{skills.map(item => <option key={item}>{item}</option>)}</select><select value={college} onChange={event => update('college', event.target.value)} aria-label="Filter by college"><option value="all">Any college</option>{colleges.map(item => <option key={item}>{item}</option>)}</select><select value={year} onChange={event => update('year', event.target.value)} aria-label="Filter by year"><option value="all">Any year</option>{['1st yr', '2nd yr', '3rd yr', '4th yr'].map(item => <option key={item}>{item}</option>)}</select><label className="directory-available"><input type="checkbox" checked={available} onChange={event => update('available', event.target.checked ? 'true' : '')} />Open to connect</label>{activeFilters && <button className="directory-clear" type="button" onClick={() => setParams({})}>Clear filters <X size={12} /></button>}</div>
    </section>
    <div className="directory-results-heading"><p aria-live="polite"><strong>{results.length}</strong> {results.length === 1 ? 'senior' : 'seniors'} to meet <span>· Your next hello could be here.</span></p><label>Sort by<select value={sort} aria-label="Sort seniors" onChange={event => update('sort', event.target.value)}><option value="recommended">Top rated</option><option value="reviews">Most reviewed</option><option value="name">Name A–Z</option></select></label></div>
    {results.length ? <section className="directory-grid" aria-label="Senior profiles">{results.map(mentor => <MentorCard key={mentor.id} mentor={mentor} onView={setSelected} />)}</section> : <div className="network-panel network-empty"><Users size={30} /><h3>Your person is still out there.</h3><p>Try a different skill, a broader search, or a fresh start.</p><button type="button" className="btn-primary" onClick={() => setParams({})}>Meet all seniors <ArrowUpRight size={16} /></button></div>}
    <footer className="directory-footnote"><Sparkles size={15} /><span>Different campuses. Shared ambitions. <strong>Better together.</strong></span><small>Sample profiles, photos & reviews</small></footer>
    <MentorProfile mentor={selected ? profiles.find(profile => profile.id === selected.id) : null} onClose={() => setSelected(null)} />
  </div>;
}
