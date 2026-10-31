/**
 * CHIZUBE 2026 - Wedding Invitation Engine
 * Interactive Countdown, Seamless Audio Autoplay, Gallery Lightbox, RSVP
 */

document.addEventListener('DOMContentLoaded', () => {
  const cfg = window.WEDDING_CONFIG || {};

  // DOM Elements
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  const toast = document.querySelector('[data-toast]');
  const audioToggle = document.querySelector('[data-audio-toggle]');
  const audioElement = document.querySelector('#wedding-audio');

  // Helper Toast Notification
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // 1. Header Scroll Shadow & Sticky Styling
  const handleScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = siteNav.classList.contains('open');
      siteNav.classList.toggle('open', !isOpen);
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.classList.toggle('is-active', !isOpen);
      document.body.classList.toggle('menu-locked', !isOpen);
    });

    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-active');
        document.body.classList.remove('menu-locked');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (siteNav.classList.contains('open') && !siteNav.contains(e.target) && !menuToggle.contains(e.target)) {
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-active');
        document.body.classList.remove('menu-locked');
      }
    });
  }

  // 3. Audio Autoplay & Controller with Gesture Fallback
  if (audioElement) {
    audioElement.volume = 0.85;

    const updateAudioState = (playing) => {
      if (audioToggle) {
        audioToggle.classList.toggle('playing', playing);
        const textSpan = audioToggle.querySelector('.audio-text');
        if (textSpan) {
          textSpan.textContent = playing ? 'Pause Music' : 'Play Music';
        }
      }
    };

    const playAudio = () => {
      const promise = audioElement.play();
      if (promise !== undefined) {
        promise.then(() => {
          updateAudioState(true);
          cleanupGestureListeners();
        }).catch(err => {
          // Autoplay was prevented by browser policy
          updateAudioState(false);
        });
      }
    };

    // Attempt autoplay immediately
    playAudio();

    // Interaction fallback: first tap/click/scroll unlocks audio
    const gestureEvents = ['click', 'touchstart', 'pointerdown', 'scroll', 'keydown'];
    const onFirstUserGesture = () => {
      if (audioElement.paused) {
        playAudio();
      }
    };

    const attachGestureListeners = () => {
      gestureEvents.forEach(evt => {
        window.addEventListener(evt, onFirstUserGesture, { once: true, passive: true });
      });
    };

    const cleanupGestureListeners = () => {
      gestureEvents.forEach(evt => {
        window.removeEventListener(evt, onFirstUserGesture);
      });
    };

    attachGestureListeners();

    // Explicit user toggle button
    if (audioToggle) {
      audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audioElement.paused) {
          audioElement.play().then(() => {
            updateAudioState(true);
            showToast('🎵 Playing wedding soundtrack');
          }).catch(() => {
            showToast('Tap anywhere on the screen to enable sound');
          });
        } else {
          audioElement.pause();
          updateAudioState(false);
          showToast('Music paused');
        }
      });
    }

    audioElement.addEventListener('ended', () => {
      audioElement.currentTime = 0;
      audioElement.play().catch(() => updateAudioState(false));
    });
  }

  // 4. Precision Live Countdown (28 Dec 2026, 09:00:00 WAT)
  const targetDate = new Date(cfg.event?.targetIso || '2026-12-28T09:00:00+01:00').getTime();
  const elDays = document.querySelector('[data-days]');
  const elHours = document.querySelector('[data-hours]');
  const elMinutes = document.querySelector('[data-minutes]');
  const elSeconds = document.querySelector('[data-seconds]');

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = String(d).padStart(3, '0');
    if (elHours) elHours.textContent = String(h).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(m).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(s).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 5. Add to Calendar (.ics Generator)
  const calendarBtn = document.querySelector('[data-calendar-btn]');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      const title = cfg.event?.icsDetails?.title || 'Chizube 2026: Chi Chi & Zubby Wedding';
      const desc = cfg.event?.icsDetails?.description || 'Holy Matrimony of Chi Chi & Zubby';
      const loc = cfg.event?.icsDetails?.location || 'Sacred Heart Catholic Church, Ojo Military Cantonment, Lagos';
      const start = '20261228T080000Z'; // 9:00 AM WAT = 08:00 AM UTC
      const end = '20261228T180000Z';

      const icsData = [
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
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Chizube2026-Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Wedding added to calendar (.ics)');
    });
  }

  // 6. Interactive Photo Gallery & Lightbox
  const galleryWrap = document.querySelector('[data-gallery]');
  if (galleryWrap) {
    const slides = galleryWrap.querySelectorAll('.gallery-slide');
    const thumbs = document.querySelectorAll('.gallery-thumb-item');
    const prevBtn = galleryWrap.querySelector('[data-gallery-prev]');
    const nextBtn = galleryWrap.querySelector('[data-gallery-next]');
    const captionEl = galleryWrap.querySelector('.gallery-caption-text');
    const counterEl = galleryWrap.querySelector('.gallery-counter-badge');
    const lightbox = document.querySelector('[data-lightbox]');
    const lightboxImg = lightbox?.querySelector('img');
    const lightboxClose = lightbox?.querySelector('[data-lightbox-close]');

    let currentIndex = 0;
    const totalSlides = slides.length;

    function goToSlide(index, userInitiated = false) {
      if (totalSlides === 0) return;
      currentIndex = (index + totalSlides) % totalSlides;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });

      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentIndex);
      });

      const currentSlide = slides[currentIndex];
      if (currentSlide && captionEl) {
        captionEl.textContent = currentSlide.getAttribute('data-caption') || '';
      }
      if (counterEl) {
        counterEl.textContent = `${currentIndex + 1} / ${totalSlides}`;
      }

      // Scroll active thumbnail inside its rail without scrolling the window
      const thumbsRail = document.querySelector('.gallery-thumbs-rail');
      const activeThumb = thumbs[currentIndex];
      if (thumbsRail && activeThumb && userInitiated) {
        const offsetLeft = activeThumb.offsetLeft - (thumbsRail.clientWidth / 2) + (activeThumb.clientWidth / 2);
        thumbsRail.scrollTo({ left: offsetLeft, behavior: 'smooth' });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1, true));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1, true));

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => goToSlide(i, true));
    });

    // Touch Swipe Support
    let touchStartX = 0;
    galleryWrap.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    galleryWrap.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        goToSlide(currentIndex + 1); // swipe left
      } else if (touchEndX - touchStartX > 45) {
        goToSlide(currentIndex - 1); // swipe right
      }
    }, { passive: true });

    // Lightbox Open & Close
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img && lightbox && lightboxImg) {
        img.addEventListener('click', () => {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || 'Wedding Gallery Photo';
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
      }
    });

    const closeLightbox = () => {
      if (!lightbox) return;
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
        closeLightbox();
      }
    });

    // Initialize first slide
    goToSlide(0);
  }

  // 7. RSVP Engine (WhatsApp Direct & Form Feedback)
  const rsvpForm = document.querySelector('#rsvp-form');
  const whatsappSubmitBtn = document.querySelector('#btn-whatsapp-rsvp');

  function getRsvpData() {
    if (!rsvpForm) return null;
    const name = rsvpForm.querySelector('#guest-name')?.value.trim();
    const attendance = rsvpForm.querySelector('input[name="attendance"]:checked')?.value || 'Attending';
    const guestCount = rsvpForm.querySelector('#guest-count')?.value || '1';
    const notes = rsvpForm.querySelector('#guest-notes')?.value.trim();
    return { name, attendance, guestCount, notes };
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getRsvpData();
      if (!data.name) {
        showToast('Please enter your full name');
        return;
      }

      try {
        localStorage.setItem('chizube_rsvp', JSON.stringify({ ...data, date: new Date().toISOString() }));
      } catch (err) {}

      showToast(`Thank you, ${data.name}! Your RSVP has been noted.`);
      rsvpForm.reset();
    });
  }

  if (whatsappSubmitBtn) {
    whatsappSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = getRsvpData();
      const name = data?.name || 'A Guest';
      const status = data?.attendance === 'Declining' ? 'Regretfully Declining' : 'Joyfully Attending';
      const guests = data?.guestCount || '1';
      const notes = data?.notes ? ` Message: "${data.notes}"` : '';

      const phone = cfg.rsvp?.whatsappNumber || '2348130255015';
      const message = `Hello Chi Chi & Zubby! I am confirming my RSVP for Chizube 2026.\n\nName: ${name}\nStatus: ${status}\nParty Size: ${guests}${notes}\n\nCongratulations!`;

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      const link = document.createElement('a');
      link.href = whatsappUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Opening WhatsApp to send your RSVP...');
    });
  }

  // 8. Share Invitation Link
  const shareBtn = document.querySelector('[data-share-btn]');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Chizube 2026 | Chi Chi & Zubby Wedding',
        text: 'Together with their families, Chi Chi & Zubby cordially invite you to their Holy Matrimony on Monday, 28th December 2026 at Sacred Heart Catholic Church, Lagos.',
        url: window.location.href.split('#')[0]
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') showToast('Share cancelled');
        }
      } else {
        try {
          await navigator.clipboard.writeText(shareData.url);
          showToast('Invitation link copied to clipboard!');
        } catch (err) {
          showToast('Please copy: ' + shareData.url);
        }
      }
    });
  }

  // 9. Reveal on Scroll (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-up');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in-view'));
  }
});
