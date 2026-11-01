import { DEMO_JUNIOR, DEMO_SENIOR } from '../data/network.js';

export function validatePass(profile) {
  const errors = {};
  if (typeof profile?.name !== 'string' || profile.name.trim().length < 2) errors.name = 'Add your full name (at least two characters).';
  if (typeof profile?.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) errors.email = 'Add a valid email address.';
  if (typeof profile?.college !== 'string' || !profile.college.trim()) errors.college = 'Add your college so we can find your campus.';
  if (!Array.isArray(profile?.interests) || !profile.interests.some(item => typeof item === 'string' && item.trim())) errors.interests = 'Choose at least one interest.';
  return errors;
}

export function normalizeProfile(profile) {
  if (!profile || typeof profile.email !== 'string' || typeof profile.name !== 'string' || !profile.email.trim() || !profile.name.trim()) return null;
  const email = profile.email.trim().toLowerCase();
  const demo = [DEMO_JUNIOR, DEMO_SENIOR].find(item => item.email === email);
  const role = profile.role === 'senior' ? 'senior' : 'junior';
  return {
    ...profile,
    id: profile.id || demo?.id || `student:${email}`,
    email,
    name: profile.name.trim(),
    college: typeof profile.college === 'string' && profile.college.trim() ? profile.college.trim() : 'IIT Bombay',
    year: ['1st yr', '2nd yr', '3rd yr', '4th yr'].includes(profile.year) ? profile.year : role === 'senior' ? '3rd yr' : '1st yr',
    interests: Array.isArray(profile.interests) ? [...new Set(profile.interests.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim()))] : [],
    bio: typeof profile.bio === 'string' ? profile.bio : '',
    role,
  };
}

export function destinationFor(role, requested) {
  const fallback = role === 'senior' ? '/senior' : '/dashboard';
  if (typeof requested !== 'string' || !requested.startsWith('/') || requested.startsWith('//')) return fallback;
  const path = requested.split('?')[0];
  if (['/connections', '/messages', '/map', '/stories', '/profile'].includes(path) || /^\/messages\/[^/]+$/.test(path)) return requested;
  if (role === 'senior' && ['/senior', '/senior/profile'].includes(path)) return requested;
  if (role === 'junior' && ['/dashboard', '/mentors'].includes(path)) return requested;
  return fallback;
}
