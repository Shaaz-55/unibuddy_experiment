/* eslint-env node */
import test from 'node:test';
import assert from 'node:assert/strict';
import { destinationFor, normalizeProfile, validatePass } from '../src/lib/profiles.js';
import { DEMO_JUNIOR, DEMO_SENIOR } from '../src/data/network.js';

test('a campus pass requires a real introduction, email, college and an interest', () => {
  assert.deepEqual(validatePass(DEMO_JUNIOR), {});
  assert.deepEqual(Object.keys(validatePass({ name: ' ', email: 'not-an-email', college: '', interests: [] })), ['name', 'email', 'college', 'interests']);
  assert.equal(Object.keys(validatePass(null)).length, 4);
  assert.ok(validatePass({ ...DEMO_JUNIOR, interests: [null, ' '] }).interests);
});

test('normalizing a saved pass preserves demo identity and repairs malformed optional fields', () => {
  assert.equal(normalizeProfile(null), null);
  assert.equal(normalizeProfile({ name: '', email: 'a@b.com' }), null);
  const normalized = normalizeProfile({ ...DEMO_JUNIOR, id: undefined, email: ' RAHUL@IITB.AC.IN ', name: ' Rahul Verma ', interests: ['DSA', null, ' DSA ', 'React'], bio: null, year: 'nonsense' });
  assert.equal(normalized.id, DEMO_JUNIOR.id);
  assert.equal(normalized.name, 'Rahul Verma');
  assert.equal(normalized.email, DEMO_JUNIOR.email);
  assert.deepEqual(normalized.interests, ['DSA', 'React']);
  assert.equal(normalized.year, '1st yr');
  assert.equal(normalized.bio, '');
  assert.equal(normalizeProfile({ ...DEMO_SENIOR, year: null }).year, '3rd yr');
});

test('sign-in restores an allowed deep link, including conversation IDs and request tabs', () => {
  assert.equal(destinationFor('junior', '/messages/aarav-mehta'), '/messages/aarav-mehta');
  assert.equal(destinationFor('senior', '/connections?tab=requests'), '/connections?tab=requests');
  assert.equal(destinationFor('junior', '/stories'), '/stories');
  assert.equal(destinationFor('senior', '/senior/profile'), '/senior/profile');
});

test('sign-in cannot redirect outside the app or to the other role’s workspace', () => {
  for (const requested of ['https://example.com', '//example.com', '/missing', undefined, '/senior']) assert.equal(destinationFor('junior', requested), '/dashboard');
  assert.equal(destinationFor('senior', '/mentors'), '/senior');
  assert.equal(destinationFor('senior', '/dashboard'), '/senior');
});
