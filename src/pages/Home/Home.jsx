import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check,
  Coffee, MapPin, Menu, MessageCircle, Star, Utensils, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import ThemeToggle from '../../components/ThemeToggle';
import { MENTORS } from '../../data/mentors';
import { COLLEGES } from '../../data/colleges';
import { PLACES } from '../../data/places';
import './Home.css';

const ASSETS = '/experiment/';
const PORTRAITS = {
  'aarav-mehta': 'aarav-portrait.jpg',
  'priya-sharma': 'priya-portrait.jpg',
  'rohan-kulkarni': 'rohan-portrait.jpg',
  'ananya-iyer': 'ananya-portrait.jpg',
};

const FILTERS = [
  { id: 'all', label: 'A little of everything', match: () => true },
  { id: 'coding', label: 'Code & build', match: (mentor) => mentor.skills.some((skill) => /DSA|Java|React|Full-Stack|Python|Android|Cloud|Cybersecurity|Game Dev|Competitive Programming/.test(skill)) },
  { id: 'design', label: 'Design & create', match: (mentor) => mentor.skills.some((skill) => /UI\/UX|Figma|Product Management|Game Dev/.test(skill)) },
  { id: 'careers', label: 'Internships & placements', match: (mentor) => mentor.skills.some((skill) => /Interview Prep|Resume Review|Placements|Product Management/.test(skill)) },
];

const SPOTS = [
  { ...PLACES.find((place) => place.id === 'blue-tokai-cafe'), x: 32, y: 38, icon: Coffee, note: 'Coffee, catch-ups, and a change of scene.' },
  { ...PLACES.find((place) => place.id === 'lakeview-study-library'), x: 73, y: 30, icon: BookOpen, note: 'A quiet corner for your next big idea.' },
  { ...PLACES.find((place) => place.id === 'midnight-maggi-point'), x: 60, y: 65, icon: Utensils, note: 'Because the best conversations run late.' },
];

const MOMENTS = [
  { image: 'campus-friends.jpg', caption: 'The best part wasn’t on the timetable.', label: 'Between classes', alt: 'Five friends laughing together outdoors' },
  { image: 'campus-evening.jpg', caption: 'One more event. A hundred new hellos.', label: 'After hours', alt: 'Students gathered for a campus event' },
  { image: 'study-together.jpg', caption: 'Deadlines are better with good company.', label: 'The study session', alt: 'A group of students working together in a library' },
];

function Brand({ compact = false }) {
  return (
    <a className={`ub-brand ${compact ? 'ub-brand-small' : ''}`} href="#ub-top" aria-label="UniBuddy, back to top">
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M5 7v12a7 7 0 0 0 14 0V7M13 7v12a7 7 0 0 0 14 0V7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span>unibuddy<span className="ub-brand-dot">.</span></span>
    </a>
  );
}

function Reveal({ children, className = '', delay = 0 }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CampusScene() {
  const stageRef = useRef(null);
  const reducedMotion = useReducedMotion();

  function moveScene(event) {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stageRef.current?.style.setProperty('--ub-tilt-x', `${-y * 7}deg`);
    stageRef.current?.style.setProperty('--ub-tilt-y', `${x * 7}deg`);
  }

  function resetScene() {
    stageRef.current?.style.setProperty('--ub-tilt-x', '0deg');
    stageRef.current?.style.setProperty('--ub-tilt-y', '0deg');
  }

  return (
    <div className="ub-scene" onPointerMove={moveScene} onPointerLeave={resetScene} aria-hidden="true">
      <span className="ub-scene-coordinate">THE CAMPUS EDITION / 001</span>
      <svg className="ub-scene-route" viewBox="0 0 560 570" fill="none">
        <path d="M-25 110C75 20 135 175 245 100S580 35 560 240S340 260 435 470S600 555 610 570" stroke="#BBC9B3" strokeWidth="1.5" strokeDasharray="5 7" />
        <circle cx="84" cy="111" r="5" fill="#688268" />
        <path d="m478 483 18 9-16 12" stroke="#688268" strokeWidth="2" />
      </svg>
      <div className="ub-scene-stage" ref={stageRef}>
        <div className="ub-photo-print">
          <div className="ub-photo-image">
            <img src={`${ASSETS}campus-friends.jpg`} alt="" width="1400" height="1500" fetchPriority="high" />
            <span className="ub-photo-corner">THE GOOD OLD DAYS.<br />HAPPENING RIGHT NOW.</span>
          </div>
          <div className="ub-photo-caption"><span>More than a degree.</span><span>↗</span></div>
        </div>
        <div className="ub-pocket-pass">
          <div className="ub-pass-top"><span>unibuddy.</span><span>YOUR CAMPUS PASS</span></div>
          <div className="ub-pass-heading">You belong<br />here.</div>
          <svg className="ub-pass-flower" viewBox="0 0 100 100" fill="none">
            <path d="M50 4v92M4 50h92M17.5 17.5l65 65M17.5 82.5l65-65M32.4 7.5l35.2 85M7.5 32.4l85 35.2M7.5 67.6l85-35.2M32.4 92.5l35.2-85" stroke="currentColor" strokeWidth="8" />
            <circle cx="50" cy="50" r="20" fill="#DFF58B" />
            <path d="m39 50 8 8 15-17" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="ub-pass-bottom"><span>ALL YEARS. ALL POSSIBILITIES.</span><span>IND / 26</span></div>
        </div>
        <div className="ub-good-company"><span>GOOD</span><span className="ub-sticker-smile">⌣</span><span>COMPANY</span></div>
      </div>
      <span className="ub-scene-footnote">A little guidance. A lot of possibility.</span>
    </div>
  );
}

function MentorPortrait({ mentor, className = '' }) {
  const portrait = PORTRAITS[mentor.id];
  return portrait ? (
    <img className={className} src={`${ASSETS}${portrait}`} alt="" loading="lazy" width="700" height="800" />
  ) : (
    <div className={`ub-monogram ${className}`} aria-hidden="true">
      <span>{mentor.initials}</span>
      <svg viewBox="0 0 240 240" fill="none"><circle cx="120" cy="120" r="82" stroke="currentColor" /><circle cx="120" cy="120" r="105" stroke="currentColor" /><path d="M0 120h240M120 0v240" stroke="currentColor" /></svg>
    </div>
  );
}

function CampusPreview({ onExplore }) {
  const [tab, setTab] = useState('map');
  const [spotIndex, setSpotIndex] = useState(0);
  const [momentIndex, setMomentIndex] = useState(0);
  const tabRefs = useRef([]);
  const selectedSpot = SPOTS[spotIndex];
  const moment = MOMENTS[momentIndex];

  function switchWithKeyboard(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'map' : event.key === 'End' ? 'stories' : tab === 'map' ? 'stories' : 'map';
    setTab(next);
    tabRefs.current[next === 'map' ? 0 : 1]?.focus();
  }

  return (
    <section id="ub-campus" className="ub-campus-section ub-container">
      <Reveal className="ub-campus-panel">
        <div className="ub-campus-copy">
          <p className="ub-eyebrow"><span>02</span> A LITTLE MORE CAMPUS</p>
          <h2>Life happens<br />between<br /><span>the lectures.</span></h2>
          <div className="ub-campus-tabs" role="tablist" aria-label="Explore campus features" onKeyDown={switchWithKeyboard}>
            {['map', 'stories'].map((value, index) => (
              <button
                key={value} type="button" role="tab" id={`ub-tab-${value}`}
                aria-selected={tab === value} aria-controls={`ub-panel-${value}`}
                tabIndex={tab === value ? 0 : -1} ref={(element) => { tabRefs.current[index] = element; }}
                className={tab === value ? 'is-active' : ''} onClick={() => setTab(value)}
              >
                {value === 'map' ? <MapPin size={15} /> : <MessageCircle size={15} />}
                {value === 'map' ? 'Your campus map' : 'Campus stories'}
              </button>
            ))}
          </div>
          <p className="ub-campus-description">
            {tab === 'map'
              ? 'A favourite chai spot. A quiet corner to study. Find the little places that make campus feel like yours.'
              : 'The fest-night chaos. That first hackathon. A sunset worth sharing. Stay close to your college’s everyday moments.'}
          </p>
          <button className="ub-text-link ub-light-link" type="button" onClick={() => onExplore(tab === 'map' ? '/map' : '/stories')}>
            {tab === 'map' ? 'Explore the campus map' : 'See campus stories'} <ArrowUpRight size={20} />
          </button>
        </div>

        {tab === 'map' ? (
          <div className="ub-map-preview" id="ub-panel-map" role="tabpanel" aria-labelledby="ub-tab-map" tabIndex={0}>
            <div className="ub-map-heading"><MapPin size={17} /><div><span>A LITTLE LOOK AROUND</span><strong>IIT Bombay</strong></div><span className="ub-preview-tag">Preview</span></div>
            <svg className="ub-map-art" viewBox="0 0 600 480" fill="none" aria-hidden="true">
              <rect width="600" height="480" fill="#ECEDDF" />
              <path d="M440-40c-30 75 36 86 23 155s-90 82-57 140 177 20 201 66V-40Z" fill="#CBDEDA" />
              <path d="m10 80 180-65 51 121-187 67Z" fill="#DAE3CB" /><path d="m328 229 92 23-31 102-99-35Z" fill="#DAE3CB" /><path d="m24 331 111-15 40 164H0Z" fill="#DAE3CB" />
              <path d="M-20 244c165-42 225-78 365-57s189 3 270-38M128-20c13 109 99 165 94 254s-32 186-10 274M340-20c-35 145-70 223-18 305s119 103 90 215" stroke="#FAFBF5" strokeWidth="23" />
              <path d="M-20 244c165-42 225-78 365-57s189 3 270-38M128-20c13 109 99 165 94 254s-32 186-10 274" stroke="#C7CEBA" strokeWidth="1.5" strokeDasharray="5 7" />
              <g fill="#D1D4BF" stroke="#C7CBB5" strokeWidth="1.5">
                <rect x="81" y="123" width="59" height="32" rx="4" transform="rotate(-18 81 123)" /><rect x="112" y="67" width="32" height="38" rx="4" transform="rotate(-18 112 67)" />
                <rect x="255" y="84" width="47" height="60" rx="4" transform="rotate(12 255 84)" /><rect x="374" y="80" width="57" height="37" rx="4" transform="rotate(12 374 80)" />
                <rect x="83" y="256" width="69" height="42" rx="4" transform="rotate(-12 83 256)" /><rect x="239" y="276" width="40" height="58" rx="4" transform="rotate(8 239 276)" />
                <rect x="456" y="314" width="61" height="38" rx="4" transform="rotate(-12 456 314)" /><rect x="473" y="233" width="46" height="37" rx="4" transform="rotate(-12 473 233)" />
              </g>
              <g fill="#769064"><circle cx="61" cy="59" r="7" /><circle cx="81" cy="47" r="9" /><circle cx="53" cy="88" r="10" /><circle cx="362" cy="267" r="9" /><circle cx="375" cy="292" r="7" /><circle cx="346" cy="292" r="8" /><circle cx="72" cy="383" r="9" /><circle cx="91" cy="368" r="7" /></g>
              <path d="M200 204c53-3 87 7 130 43s38 44 39 79" stroke="#527F57" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
              <circle cx="255" cy="209" r="19" fill="#DFF58B" /><circle cx="255" cy="209" r="7" fill="#234B36" />
              <g fontFamily="'UniBuddy Manrope', sans-serif" fontSize="10" fill="#778473"><text x="498" y="100" transform="rotate(24 498 100)">POWAI LAKE</text><text x="49" y="232" transform="rotate(-12 49 232)">CAMPUS ROAD</text><text x="228" y="248">YOU ARE HERE</text></g>
            </svg>
            {SPOTS.map((spot, index) => {
              const Icon = spot.icon;
              return <button key={spot.id} type="button" className={`ub-map-pin ${spotIndex === index ? 'is-selected' : ''}`} style={{ left: `${spot.x}%`, top: `${spot.y}%` }} onClick={() => setSpotIndex(index)} aria-label={`Preview ${spot.name}`} aria-pressed={spotIndex === index}><Icon size={19} /><span>{spot.name}</span></button>;
            })}
            <div className="ub-map-location" aria-live="polite" aria-atomic="true">
              <div className="ub-map-location-icon"><selectedSpot.icon size={22} /></div>
              <div><strong>{selectedSpot.name}</strong><p>{selectedSpot.note}</p><span>{selectedSpot.walkMinutes} min walk · Sample spot</span></div>
              <ArrowUpRight size={21} aria-hidden="true" />
            </div>
            <span className="ub-map-disclaimer">Illustrated map · Example places and walking times</span>
          </div>
        ) : (
          <div className="ub-story-preview" id="ub-panel-stories" role="tabpanel" aria-labelledby="ub-tab-stories" tabIndex={0}>
            <img key={moment.image} src={`${ASSETS}${moment.image}`} alt={moment.alt} width="800" height="1000" loading="lazy" />
            <div className="ub-story-progress" aria-hidden="true">{MOMENTS.map((item, index) => <span className={index === momentIndex ? 'is-active' : ''} key={item.image} />)}</div>
            <span className="ub-story-label">Campus moments <span>Preview</span></span>
            <div className="ub-story-bottom">
              <div aria-live="polite" aria-atomic="true"><span>{moment.label}</span><h3>{moment.caption}</h3></div>
              <div className="ub-story-controls"><button type="button" onClick={() => setMomentIndex((momentIndex + MOMENTS.length - 1) % MOMENTS.length)} aria-label="Previous campus moment"><ArrowLeft size={19} /></button><button type="button" onClick={() => setMomentIndex((momentIndex + 1) % MOMENTS.length)} aria-label="Next campus moment"><ArrowRight size={19} /></button></div>
            </div>
          </div>
        )}
      </Reveal>
    </section>
  );
}

export default function Home() {
  const { user, isAuthenticated, openLoginModal, openRegisterModal, openSeniorModal } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const headerRef = useRef(null);
  const activeFilter = FILTERS.find((item) => item.id === filter);
  const visibleMentors = MENTORS.filter(activeFilter.match).slice(0, 4);
  const homeRoute = user?.role === 'senior' ? '/senior' : '/dashboard';

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    const closeOutside = (event) => { if (!headerRef.current?.contains(event.target)) setMenuOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
    };
  }, [menuOpen]);

  function getStarted() {
    setMenuOpen(false);
    if (isAuthenticated) navigate(homeRoute);
    else openRegisterModal();
  }

  function exploreCampus(path) {
    if (isAuthenticated) navigate(path);
    else openRegisterModal();
  }

  function openDirectory() {
    if (isAuthenticated) navigate(user?.role === 'senior' ? '/senior' : '/mentors');
    else openRegisterModal();
  }

  return (
    <div className="ub-experiment" id="ub-top">
      <a className="ub-skip-link" href="#ub-main">Skip to content</a>
      <header className="ub-header" ref={headerRef}>
        <div className="ub-nav ub-container">
          <Brand />
          <nav className="ub-desktop-nav" aria-label="Homepage navigation"><a href="#ub-seniors">Meet your seniors</a><a href="#ub-campus">Campus life</a><a href="#ub-how">How it works</a></nav>
          <div className="ub-nav-actions">
            <ThemeToggle />
            {isAuthenticated ? <Link className="ub-login-link" to={homeRoute}>My campus</Link> : <button className="ub-login-link" type="button" onClick={openLoginModal}>Log in</button>}
            <button type="button" className="ub-btn ub-btn-dark ub-nav-join" onClick={getStarted}>{isAuthenticated ? 'My campus' : 'Get started'}<ArrowUpRight size={17} /></button>
            <button type="button" className="ub-menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="ub-mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
        {menuOpen && <nav id="ub-mobile-navigation" className="ub-mobile-nav" aria-label="Mobile homepage navigation"><a href="#ub-seniors" onClick={() => setMenuOpen(false)}>Meet your seniors<ArrowUpRight size={19} /></a><a href="#ub-campus" onClick={() => setMenuOpen(false)}>Campus life<ArrowUpRight size={19} /></a><a href="#ub-how" onClick={() => setMenuOpen(false)}>How it works<ArrowUpRight size={19} /></a>{!isAuthenticated && <button type="button" onClick={() => { setMenuOpen(false); openLoginModal(); }}>Log in<ArrowUpRight size={19} /></button>}<button type="button" onClick={() => { setMenuOpen(false); openSeniorModal(); }}>Become a mentor<ArrowUpRight size={19} /></button></nav>}
      </header>

      <main id="ub-main">
        <section className="ub-hero ub-container" aria-labelledby="ub-hero-title">
          <div className="ub-hero-copy">
            <p className="ub-eyebrow"><span className="ub-live-dot" /> YOUR PEOPLE. YOUR PLACE.</p>
            <h1 id="ub-hero-title">College is<br />better<br /><span className="ub-together">together.<svg viewBox="0 0 430 24" fill="none" aria-hidden="true"><path d="M5 15C124 2 279 3 421 11" stroke="currentColor" strokeWidth="12" strokeLinecap="round" /></svg></span></h1>
            <p className="ub-hero-description">Find a senior who gets it. Discover your campus.<br className="ub-desktop-break" /> Make more of the years that matter.</p>
            <div className="ub-hero-actions"><a className="ub-btn ub-btn-dark" href="#ub-seniors">Find my people<ArrowUpRight size={21} /></a><a className="ub-text-link" href="#ub-campus">Take a look around<ArrowDown size={17} /></a></div>
            <div className="ub-hero-note"><div className="ub-avatar-stack" aria-hidden="true"><img src={`${ASSETS}aarav-portrait.jpg`} alt="" width="40" height="40" /><img src={`${ASSETS}priya-portrait.jpg`} alt="" width="40" height="40" /><img src={`${ASSETS}rohan-portrait.jpg`} alt="" width="40" height="40" /></div><span>From first-day nerves<br /><strong>to your next big thing.</strong></span></div>
          </div>
          <CampusScene />
          <div className="ub-hero-bottom"><span>LESS “AB KYA?” · MORE “LET’S GO.”</span><a href="#ub-seniors" aria-label="Scroll to meet your seniors"><ArrowDown size={18} /></a><span>MADE FOR CAMPUS LIFE IN INDIA</span></div>
        </section>

        <section className="ub-campus-strip" aria-label="Colleges in the UniBuddy directory"><div className="ub-container ub-campus-strip-inner"><p>A bigger circle.<br /><strong>Across {COLLEGES.length} colleges.</strong></p><div className="ub-college-marquee"><div className="ub-college-track">{[0, 1].map((copy) => <div className="ub-college-names" key={copy} aria-hidden={copy === 1 ? true : undefined}><span className="ub-college-iit">IIT <small>Bombay</small></span><span className="ub-college-bits">BITS<small>PILANI</small></span><span className="ub-college-iiit">IIIT <small>Hyderabad</small></span><span className="ub-college-vit">VIT<small>VELLORE</small></span><span className="ub-college-newton">newton<small>SCHOOL OF TECHNOLOGY</small></span></div>)}</div></div></div></section>

        <section className="ub-seniors ub-container" id="ub-seniors" aria-labelledby="ub-seniors-title">
          <Reveal className="ub-section-heading"><div><p className="ub-eyebrow"><span>01</span> A LITTLE GUIDANCE</p><h2 id="ub-seniors-title">Someone’s been<br />where you’re going.</h2></div><div className="ub-section-intro"><p>The first project. The internship hunt. The “what next?”<br />Meet seniors who remember what it’s like.</p><button type="button" className="ub-text-link" onClick={openDirectory}>Explore all seniors<ArrowUpRight size={20} /></button></div></Reveal>
          <Reveal><div className="ub-filter-row"><div className="ub-mentor-filters" role="group" aria-label="Filter seniors by interest">{FILTERS.map((item) => <button key={item.id} type="button" className={filter === item.id ? 'is-active' : ''} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id}>{filter === item.id && <Check size={14} />}{item.label}</button>)}</div><span className="ub-demo-label">A few sample profiles</span></div></Reveal>
          <div className="ub-sr-only" role="status" aria-live="polite">Showing {visibleMentors.length} sample seniors for {activeFilter.label}.</div>
          <div className="ub-mentor-grid" key={filter}>
            {visibleMentors.map((mentor, index) => <button key={mentor.id} type="button" className={`ub-mentor-card ub-mentor-tone-${index}`} onClick={() => setSelectedMentor(mentor)} aria-label={`Meet ${mentor.name}, ${mentor.college}; sample mentor profile`}><div className="ub-mentor-photo"><MentorPortrait mentor={mentor} /><span className="ub-mentor-focus">{mentor.skills[0]}</span><span className="ub-mentor-arrow"><ArrowUpRight size={20} /></span></div><div className="ub-mentor-details"><div className="ub-mentor-name-row"><h3>{mentor.name}</h3><span><Star size={12} fill="currentColor" />{mentor.rating}</span></div><p>{mentor.college} · {mentor.year}</p><div className="ub-mentor-skills">{mentor.skills.slice(1, 3).map((skill) => <span key={skill}>{skill}</span>)}</div></div></button>)}
          </div>
          <div className="ub-mentor-footnote"><MessageCircle size={16} /><p>Big questions or small doubts. <strong>Start with a hello.</strong></p><span>Good advice travels beyond your campus.</span></div>
        </section>

        <CampusPreview onExplore={exploreCampus} />

        <section className="ub-how ub-container" id="ub-how" aria-labelledby="ub-how-title">
          <Reveal className="ub-how-heading"><p className="ub-eyebrow"><span>03</span> YOUR NEXT CHAPTER</p><h2 id="ub-how-title">A small hello.<br />A whole new world.</h2><p>No complicated first steps. Just you, your college,<br className="ub-desktop-break" /> and a little curiosity.</p></Reveal>
          <div className="ub-steps">
            {[
              { number: '01', title: 'Make it yours.', description: 'Pick your college, your year, and the things you’re curious about. Your campus pass starts with you.' },
              { number: '02', title: 'Find your people.', description: 'Explore seniors by skill or college. Find someone who’s taken the path you want to try.' },
              { number: '03', title: 'Take the first step.', description: 'Send a connection request. Once they accept, start a conversation. There’s a whole campus to explore, too.' },
            ].map((step, index) => <Reveal className="ub-step" key={step.number} delay={index * 0.08}><div className="ub-step-top"><span>{step.number}</span><ArrowUpRight size={23} /></div><h3>{step.title}</h3><p>{step.description}</p></Reveal>)}
          </div>
          <Reveal className="ub-faq"><div className="ub-faq-heading"><h2>FAQs</h2><p>Everything you need to know about finding your people, discovering your campus, and making the most of UniBuddy.</p></div><details><summary>Can I connect with seniors from other colleges?<span className="ub-faq-plus" aria-hidden="true" /></summary><p>Yes. Explore the full senior directory by skill or college, then send a connection request to someone with experience that matches your interests.</p></details><details><summary>I’m a senior. Can I be part of this?<span className="ub-faq-plus" aria-hidden="true" /></summary><p>Absolutely. Create a senior profile, add the skills you can help with, and choose your availability. Your experience could be someone else’s starting point. <button type="button" onClick={isAuthenticated ? () => navigate(homeRoute) : openSeniorModal}>{isAuthenticated ? 'Open your workspace' : 'Create a senior pass'}<ArrowUpRight size={15} /></button></p></details></Reveal>
        </section>

        <section className="ub-closing" aria-labelledby="ub-closing-title"><Reveal className="ub-container ub-closing-inner"><div><p className="ub-eyebrow">THESE ARE YOUR YEARS. MAKE THEM YOURS.</p><h2 id="ub-closing-title">Your next chapter<br />has good company.</h2></div><div className="ub-closing-actions"><button type="button" className="ub-btn ub-btn-dark" onClick={getStarted}>{isAuthenticated ? 'Back to my campus' : 'Get my campus pass'}<ArrowUpRight size={21} /></button>{!isAuthenticated && <button type="button" className="ub-text-link" onClick={openSeniorModal}>I’m a senior. Count me in.<ArrowUpRight size={17} /></button>}<span>A little guidance goes a long way.</span></div></Reveal></section>
      </main>

      <footer className="ub-footer"><div className="ub-container"><div className="ub-footer-top"><Brand compact /><p>Good people. Great college days.</p><a className="ub-text-link" href="#ub-top">Back to top<ArrowUpRight size={16} /></a></div><div className="ub-footer-bottom"><span>© 2026 UniBuddy · Made for campus life in India.</span><span className="ub-experiment-label"><span /> The campus edition / 001</span><button type="button" className="ub-footer-demo" onClick={isAuthenticated ? () => navigate(homeRoute) : openLoginModal}>{isAuthenticated ? 'Back to my campus' : 'Explore with a demo pass'}<ArrowUpRight size={15} /></button></div></div></footer>

      <Modal isOpen={!!selectedMentor} onClose={() => setSelectedMentor(null)} title={selectedMentor?.name} subtitle={selectedMentor ? `${selectedMentor.college} · ${selectedMentor.year} · ${selectedMentor.branch}` : ''} className="ub-mentor-modal">
        {selectedMentor && <div className="ub-profile-preview"><div className="ub-profile-top"><div className="ub-profile-portrait"><MentorPortrait mentor={selectedMentor} /></div><div><span className="ub-profile-sample">Sample senior profile</span><div className="ub-profile-tags">{selectedMentor.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></div><p className="ub-profile-description">{selectedMentor.description}</p><blockquote>“{selectedMentor.quote}”</blockquote><div className="ub-profile-rating"><Star size={16} fill="currentColor" /><strong>{selectedMentor.rating}</strong><span>· {selectedMentor.reviewCount} sample reviews</span></div><button type="button" className="ub-btn ub-btn-dark" onClick={() => { setSelectedMentor(null); openDirectory(); }}>{isAuthenticated ? 'Open your mentor directory' : 'Get started with a campus pass'}<ArrowUpRight size={19} /></button></div>}
      </Modal>
      
    </div>
  );
}
