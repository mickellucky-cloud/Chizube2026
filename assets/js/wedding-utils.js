/**
 * Pure utility functions for Chizube 2026 countdown, calendar (.ics), and RSVP formatting
 */

export function calculateCountdownParts(targetTimeMs, nowMs) {
  const diff = Math.max(0, targetTimeMs - nowMs);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: String(d).padStart(3, '0'),
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  };
}

export function buildIcsContent(icsDetails = {}) {
  const title = icsDetails.title || 'Chizube 2026: Chi Chi & Zubby Wedding';
  const desc = icsDetails.description || 'Holy Matrimony of Chi Chi & Zubby';
  const loc = icsDetails.location || 'Sacred Heart Catholic Church, Ojo Military Cantonment, Lagos';
  const start = '20261228T080000Z'; // 9:00 AM WAT = 08:00 AM UTC
  const end = '20261228T180000Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Chizube 2026//Wedding Invitation//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function buildWhatsAppRsvpUrl(data = {}, whatsappNumber = '2348130255015') {
  const name = data.name || 'A Guest';
  const status = data.attendance === 'Declining' ? 'Regretfully Declining' : 'Joyfully Attending';
  const guests = data.guestCount || '1';
  const phone = data.phone ? `\n📞 Phone: ${data.phone}` : '';
  const notes = data.notes ? `\n💌 Prayer/Note: "${data.notes}"` : '';

  const message = `Hello Chi Chi & Zubby! I am confirming my RSVP for Chizube 2026.\n\n👤 Name: ${name}\n✨ Status: ${status}\n👥 Reserved Seats: ${guests} Person(s)${phone}${notes}\n\nCongratulations and God bless your union!`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
