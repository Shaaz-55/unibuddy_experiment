export const MENTOR_CATEGORIES = [
  { id: 'all', label: 'A little of everything' },
  { id: 'coding', label: 'Code & build' },
  { id: 'design', label: 'Design & create' },
  { id: 'careers', label: 'Internships & careers' },
  { id: 'data', label: 'Data & AI' },
];

export function skillsMatch(skills, filter) {
  if (!filter || filter === 'all') return true;
  const aliases = { 'Web Dev': /React|Full-Stack|Web Dev/i, 'Cloud & DevOps': /Cloud|AWS|DevOps/i };
  return aliases[filter] ? skills.some(skill => aliases[filter].test(skill)) : skills.some(skill => skill.toLowerCase() === filter.toLowerCase());
}

export function filterMentors(profiles, filters = {}) {
  const { query = '', category = 'all', skill = 'all', college = 'all', year = 'all', available = false, sort = 'recommended' } = filters;
  const categoryMatches = { coding: /DSA|Web Dev|React|Full-Stack|Java|Android|Cloud|Cybersecurity|Game Dev|Competitive Programming/i, design: /UI\/UX|Figma|Portfolio|Product Management|Game Dev/i, careers: /Interview|Resume|Placements|Aptitude|HR Rounds|Product Management/i, data: /Machine Learning|Python|Research|Data Analytics|SQL|Power BI/i };
  return profiles.filter(profile => {
    if (profile.role !== 'senior') return false;
    const skills = profile.interests || profile.skills || [];
    if (query.trim() && !`${profile.name} ${profile.college} ${skills.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    if (categoryMatches[category] && !skills.some(item => categoryMatches[category].test(item))) return false;
    if (!skillsMatch(skills, skill)) return false;
    if (college !== 'all' && college !== profile.college) return false;
    if (year !== 'all' && year !== profile.year) return false;
    return !available || profile.available !== false;
  }).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'reviews' ? (b.reviewCount || 0) - (a.reviewCount || 0) : (b.rating || 0) - (a.rating || 0));
}
