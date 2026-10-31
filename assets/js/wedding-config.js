/**
 * Chizube 2026 - Wedding Invitation Configuration
 * Single Source of Truth for Chi Chi & Zubby's Wedding Website
 */

window.WEDDING_CONFIG = {
  // Couple & Branding
  couple: {
    bride: "Chi Chi",
    groom: "Zubby",
    brandTitle: "Chizube 2026",
    monogram: "C & Z",
    monogramShort: "CZ",
    tagline: "Set me as a seal upon your heart",
    hashtag: "#Chizube2026"
  },

  // Event Date & Time (WAT, UTC+1)
  event: {
    dateDisplay: "Monday, 28th December 2026",
    shortDate: "28 · 12 · 2026",
    timeDisplay: "9:00 AM Prompt",
    targetIso: "2026-12-28T09:00:00+01:00",
    icsDetails: {
      title: "Chizube 2026: Chi Chi & Zubby Holy Matrimony",
      description: "Celebrating the Sacrament of Holy Matrimony between Chi Chi and Zubby at Sacred Heart Catholic Church, Ojo Military Cantonment, Lagos.",
      location: "Sacred Heart Catholic Church, Ojo Military Cantonment, Lagos, Nigeria"
    }
  },

  // Quotes & Scripture
  scripture: {
    verse: "Set me as a seal upon your heart, as a seal upon your arm; for love is as strong as death.",
    reference: "Song of Solomon 8:6",
    secondaryVerse: "What therefore God hath joined together, let not man put asunder.",
    secondaryReference: "Matthew 19:6"
  },

  // Formal Invitation Copy
  invitation: {
    preKicker: "Together with their families",
    headline: "We Cordially Invite You",
    subheadline: "To Share In Our Joy & Happiness",
    body: "As we exchange holy vows and unite our hearts before God in the Sacrament of Holy Matrimony.",
    closing: "Your presence will make our day more special."
  },

  // Venues & Itinerary
  venues: {
    ceremony: {
      title: "Sacred Heart Catholic Church",
      type: "Solemn Matrimony",
      time: "9:00 AM Prompt",
      address: "Ojo Military Cantonment, Lagos, Nigeria",
      image: "assets/images/church-outside.jpg",
      droneImage: "assets/images/church-drone.jpg",
      mapQuery: "Sacred+Heart+Catholic+Church+Ojo+Military+Cantonment+Lagos",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sacred+Heart+Catholic+Church+Ojo+Military+Cantonment+Lagos"
    },
    reception: {
      title: "Wedding Reception & Gala",
      type: "Dinner, Dancing & Celebration",
      time: "Following the Ceremony",
      address: "Ojo Military Cantonment Banquet Arena, Lagos, Nigeria",
      image: "assets/images/portrait.jpg",
      note: "Reception, dinner, dancing, and celebration to follow immediately after holy mass.",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ojo+Military+Cantonment+Lagos"
    }
  },

  // Schedule Timeline
  timeline: [
    {
      time: "9:00 AM",
      title: "Solemn Nuptial Mass",
      desc: "Sacred vows, blessing of rings, and Holy Eucharist at Sacred Heart Catholic Church."
    },
    {
      time: "11:30 AM",
      title: "Photographs & Blessings",
      desc: "Celebratory pictures with the couple, families, bridal party, and cherished guests."
    },
    {
      time: "1:00 PM",
      title: "Grand Reception & Banquet",
      desc: "Triumphant entrance, cutting of cake, toasts, exquisite feast, and dancing celebration."
    }
  ],

  // Color Palette Swatches
  palette: [
    { name: "Royal Navy", hex: "#0E1E38", desc: "Regal dignity and enduring depth" },
    { name: "Champagne Gold", hex: "#D4AF37", desc: "Radiance, grace, and royal majesty" },
    { name: "Ivory Cream", hex: "#FAF7F2", desc: "Purity, elegance, and warmth" },
    { name: "Rich Burgundy", hex: "#6B1731", desc: "Passionate devotion and celebration" }
  ],

  // Gallery Photos
  gallery: [
    { src: "assets/images/gallery/gallery-01.jpg", caption: "Chi Chi & Zubby — Forever in Love" },
    { src: "assets/images/gallery/gallery-02.jpg", caption: "Joyful Moments and Laughter" },
    { src: "assets/images/gallery/gallery-03.jpg", caption: "Hand in Hand — Two Hearts United" },
    { src: "assets/images/gallery/gallery-04.jpg", caption: "Aerial View of Sacred Heart Catholic Church" },
    { src: "assets/images/gallery/gallery-05.jpg", caption: "Sanctuary of Sacred Heart Catholic Church" },
    { src: "assets/images/gallery/gallery-06.jpg", caption: "The Cathedral Grounds at Ojo Cantonment" }
  ],

  // RSVP Configuration
  rsvp: {
    phoneNumber: "08130255015",
    internationalPhone: "+2348130255015",
    whatsappNumber: "2348130255015",
    printedCode: "RSVP: OIP: TW 0C - 08130255015",
    defaultMessage: "Hello Chi Chi & Zubby! I am confirming my RSVP for Chizube 2026."
  },

  // Ambient Audio
  audio: {
    src: "assets/audio/chizube-theme.mp3",
    title: "Chizube 2026 Wedding Theme"
  }
};
