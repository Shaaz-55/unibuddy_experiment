import { Component, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ArrowUpRight, Sprout } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NetworkProvider } from './context/NetworkContext';
import { ThemeProvider } from './context/ThemeContext';
import AppShell from './components/AppShell';
import AuthModals from './components/AuthModals';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Mentors = lazy(() => import('./pages/Mentors/Mentors'));
const Connections = lazy(() => import('./pages/Connections/Connections'));
const Messages = lazy(() => import('./pages/Messages/Messages'));
const CampusMap = lazy(() => import('./pages/CampusMap/CampusMap'));
const Stories = lazy(() => import('./pages/Stories/Stories'));
const SeniorDashboard = lazy(() => import('./pages/Senior/SeniorDashboard'));
const Profile = lazy(() => import('./pages/Senior/SeniorProfile'));

class AppErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="route-message"><Sprout size={44} /><h1>Let’s try that again.</h1><p>This page couldn’t open. Your saved pass and connections are still in this browser.</p><button className="btn-primary" onClick={() => window.location.reload()}>Reload UniBuddy <ArrowUpRight size={18} /></button></div>;
    return this.props.children;
  }
}

function RouteDetails() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titles = { '/': 'College is better together', '/dashboard': 'Your campus', '/mentors': 'Find your senior', '/connections': 'Your circle', '/map': 'Campus map', '/stories': 'Campus stories', '/senior': 'Your mentor workspace', '/senior/profile': 'Your profile', '/profile': 'Your profile' };
    document.title = `UniBuddy — ${pathname.startsWith('/messages') ? 'Messages' : titles[pathname] || 'A new direction'}`;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function NotFound() {
  return <div className="route-message"><span className="eyebrow">A SMALL DETOUR / 404</span><Sprout size={44} /><h1>A different way<br />back to campus.</h1><p>We couldn’t find that page. Let’s get you somewhere familiar.</p><Link className="btn-primary" to="/">Back to UniBuddy <ArrowUpRight size={18} /></Link></div>;
}

export default function App() {
  return <AppErrorBoundary><ThemeProvider><MotionConfig reducedMotion="user"><BrowserRouter><ToastProvider><AuthProvider><NetworkProvider>
    <RouteDetails />
    <Suspense fallback={<div className="route-loading" role="status"><Sprout size={30} /><span>Opening your next chapter…</span></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experiment" element={<Navigate to="/" replace />} />
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<ProtectedRoute role="junior"><Dashboard /></ProtectedRoute>} />
          <Route path="/mentors" element={<ProtectedRoute role="junior"><Mentors /></ProtectedRoute>} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:peerId" element={<Messages />} />
          <Route path="/map" element={<CampusMap />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/senior" element={<ProtectedRoute role="senior"><SeniorDashboard /></ProtectedRoute>} />
          <Route path="/senior/profile" element={<ProtectedRoute role="senior"><Profile /></ProtectedRoute>} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    <AuthModals />
  </NetworkProvider></AuthProvider></ToastProvider></BrowserRouter></MotionConfig></ThemeProvider></AppErrorBoundary>;
}
