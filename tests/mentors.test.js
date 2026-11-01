/* eslint-env node */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoNetwork } from '../src/data/network.js';
import { filterMentors, skillsMatch } from '../src/lib/mentors.js';

const profiles = createDemoNetwork().profiles;

test('Web Dev and Cloud interests find the relevant catalog skills', () => {
  assert.equal(skillsMatch(['React', 'Full-Stack'], 'Web Dev'), true);
  assert.equal(skillsMatch(['Cloud', 'AWS', 'DevOps'], 'Cloud & DevOps'), true);
  assert.equal(skillsMatch(['UI/UX', 'Figma'], 'Web Dev'), false);
  assert.ok(filterMentors(profiles, { skill: 'Web Dev' }).some(profile => profile.id === 'rohan-kulkarni'));
});

test('directory filters combine name, college, year and topic without changing the catalog', () => {
  const snapshot = JSON.stringify(profiles);
  const matches = filterMentors(profiles, { query: '  AARAV  ', category: 'coding', college: 'IIT Bombay', year: '3rd yr' });
  assert.deepEqual(matches.map(profile => profile.id), ['aarav-mehta']);
  assert.equal(filterMentors(profiles, { query: 'Aarav', category: 'design' }).length, 0);
  assert.equal(filterMentors(profiles, { query: 'no matching person' }).length, 0);
  assert.equal(JSON.stringify(profiles), snapshot);
});

test('directory keeps juniors out and respects paused seniors', () => {
  const paused = profiles.map(profile => profile.id === 'aarav-mehta' ? { ...profile, available: false } : profile);
  assert.ok(filterMentors(paused).every(profile => profile.role === 'senior'));
  assert.ok(filterMentors(paused).some(profile => profile.id === 'aarav-mehta'));
  assert.ok(!filterMentors(paused, { available: true }).some(profile => profile.id === 'aarav-mehta'));
});

test('new seniors with no sample ratings remain discoverable and sort by name', () => {
  const newSenior = { id: 'new-senior', name: 'A New Senior', role: 'senior', college: 'New College', year: '2nd yr', interests: ['Web Dev'] };
  const matches = filterMentors([...profiles, newSenior], { sort: 'name' });
  assert.equal(matches[0].id, 'new-senior');
  assert.equal(filterMentors([newSenior], { category: 'coding', available: true }).length, 1);
});
