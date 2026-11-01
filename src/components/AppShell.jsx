import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, HeartHandshake, Home, LogOut, MapPin, Menu, MessageCircle, Sparkles, Sprout, UserRound, Users, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNetwork } from '../context/NetworkContext';
import { useToast } from '../context/ToastContext';
import Logo from './Logo';
import StudentAvatar from './StudentAvatar';
import ThemeToggle from './ThemeToggle';

export default function AppShell() {
  const { user, logout } = useAuth();
  const { unreadCount, incomingRequests } = useNetwork();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const accountButtonRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const senior = user.role === 'senior';
  const home = senior ? '/senior' : '/dashboard';
  const tabs = [
    { to: home, label: senior ? 'Workspace' : 'Your campus', short: 'Home', icon: Home },
    ...(!senior ? [{ to: '/mentors', label: 'Find a senior', short: 'Seniors', icon: Users }] : []),
    { to: '/connections', label: 'Your circle', short: 'Circle', icon: HeartHandshake, count: incomingRequests.length },
    { to: '/map', label: 'Campus map', short: 'Map', icon: MapPin },
    { to: '/stories', label: 'Stories', short: 'Stories', icon: Sparkles },
  ];
  const mobileTabs = [tabs[0], tabs[1], { to: '/messages', label: 'Messages', short: 'Inbox', icon: MessageCircle, count: unreadCount }, ...tabs.filter(tab => ['/map', '/stories'].includes(tab.to))];
  useEffect(() => { setMenuOpen(false); setAccountOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen && !accountOpen) return;
    const close = event => {
      if (event.key === 'Escape') {
        if (menuOpen) menuButtonRef.current?.focus();
        else accountButtonRef.current?.focus();
        setMenuOpen(false); setAccountOpen(false);
      } else if (event.type === 'pointerdown' && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false); setAccountOpen(false);
      }
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [menuOpen, accountOpen]);
  function signOut() {
    logout(); navigate('/'); showToast('See you around campus.');
  }
  return <div className={`campus-app ${pathname.startsWith('/messages') ? 'is-messages' : ''} ${pathname === '/stories' ? 'is-stories' : ''}`}>
    <a className="skip-link" href="#campus-main">Skip to content</a>
    <header className="campus-header" ref={headerRef}>
      <div className="campus-navigation wrap">
        <Logo to={home} />
        <nav className="desktop-tabs" aria-label="Main navigation">{tabs.map(({ to, label, count }) => <NavLink key={to} to={to} end className={({ isActive }) => isActive ? 'active' : ''}>{label}{count > 0 && <span className="nav-dot" aria-label={`${count} requests`} />}</NavLink>)}</nav>
        <div className="campus-nav-actions">
          <ThemeToggle />
          <NavLink to="/messages" className={({ isActive }) => `header-inbox ${isActive ? 'active' : ''}`} aria-label={`Messages${unreadCount ? `, ${unreadCount} unread` : ''}`}><MessageCircle size={20} />{unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}</NavLink>
          <div className="account-menu-wrap">
            <button ref={accountButtonRef} type="button" className="account-trigger" aria-label={`Account for ${user.name}`} aria-expanded={accountOpen} aria-controls="campus-account" onClick={() => { setAccountOpen(!accountOpen); setMenuOpen(false); }}><StudentAvatar profile={user} size="small" /><span>{user.name.split(' ')[0]}<small>{senior ? 'Senior pass' : 'Junior pass'}</small></span><ChevronDown size={14} /></button>
            {accountOpen && <div className="account-menu" id="campus-account"><div className="account-summary"><strong>{user.name}</strong><span>{user.college}</span><small>{user.year} · {senior ? 'Senior' : 'Junior'} pass</small></div><Link to="/profile"><UserRound size={16} /> My profile</Link><Link to="/connections"><HeartHandshake size={16} /> My connections</Link><Link to="/"><Sprout size={16} /> The campus edition</Link><button type="button" onClick={signOut}><LogOut size={16} /> Log out</button></div>}
          </div>
          <button ref={menuButtonRef} className="mobile-menu-trigger" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="campus-mobile-menu" onClick={() => { setMenuOpen(!menuOpen); setAccountOpen(false); }}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
      {menuOpen && <nav className="campus-mobile-menu" id="campus-mobile-menu" aria-label="All campus pages">{[...tabs, { to: '/messages', label: 'Messages', icon: MessageCircle, count: unreadCount }, { to: '/profile', label: 'My profile', icon: UserRound }].map(({ to, label, icon: Icon, count }) => <NavLink key={to} to={to} end><Icon size={18} />{label}{count > 0 ? <span className="network-count">{count}</span> : <ArrowUpRight size={15} />}</NavLink>)}</nav>}
    </header>
    <div className="campus-context wrap"><span><span className="status-dot" /> THE CAMPUS EDITION</span><Link to="/map"><MapPin size={12} /> {user.college}<ArrowUpRight size={12} /></Link></div>
    <main id="campus-main" className="campus-main" tabIndex={-1}><Outlet /></main>
    <footer className="campus-footer wrap"><Logo small /><span>A little guidance. A lot of possibility.</span><span className="edition-note">Local demo · Made for your next chapter</span></footer>
    <nav className="campus-bottom-nav" aria-label="Mobile navigation">{mobileTabs.map(({ to, short, icon: Icon, count }) => <NavLink key={to} to={to} end={to !== '/messages'} className={({ isActive }) => isActive ? 'active' : ''}><span><Icon size={20} />{count > 0 && <b>{count}</b>}</span>{short}</NavLink>)}</nav>
  </div>;
}
