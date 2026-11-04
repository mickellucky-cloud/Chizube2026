import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCountdownParts, buildIcsContent, buildWhatsAppRsvpUrl } from './wedding-utils.js';

test('calculateCountdownParts computes padded days, hours, minutes, seconds', () => {
  const target = new Date('2026-12-28T09:00:00+01:00').getTime();
  const now = target - ((10 * 86400 + 5 * 3600 + 7 * 60 + 9) * 1000);
  const parts = calculateCountdownParts(target, now);
  assert.deepEqual(parts, {
    days: '010',
    hours: '05',
    minutes: '07',
    seconds: '09',
  });
});

test('calculateCountdownParts clamps to zero when target date has passed', () => {
  const target = 1000;
  const now = 5000;
  assert.deepEqual(calculateCountdownParts(target, now), {
    days: '000',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
});

test('buildIcsContent returns valid VCALENDAR with ceremony details', () => {
  const ics = buildIcsContent({
    title: 'Chizube 2026: Chi Chi & Zubby Holy Matrimony',
    location: 'Sacred Heart Catholic Church, Lagos',
  });
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
  assert.ok(ics.includes('SUMMARY:Chizube 2026: Chi Chi & Zubby Holy Matrimony'));
  assert.ok(ics.includes('DTSTART:20261228T080000Z'));
  assert.ok(ics.endsWith('END:VCALENDAR'));
});

test('buildWhatsAppRsvpUrl formats guest RSVP details into encoded wa.me link', () => {
  const url = buildWhatsAppRsvpUrl(
    {
      name: 'Chief Emeka Okafor',
      attendance: 'Attending',
      guestCount: '2',
      phone: '08012345678',
      notes: 'God bless your home',
    },
    '2348130255015'
  );
  assert.ok(url.startsWith('https://wa.me/2348130255015?text='));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.ok(decoded.includes('Chief Emeka Okafor'));
  assert.ok(decoded.includes('Joyfully Attending'));
  assert.ok(decoded.includes('2 Person(s)'));
});
