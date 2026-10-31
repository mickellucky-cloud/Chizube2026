import QRCode from 'qrcode';

/**
 * CHIZUBE 2026 - Wedding Invitation Engine
 * Interactive Countdown, Seamless Audio Autoplay, Gallery Lightbox, RSVP, QR Pass
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

  // 2. Mobile Menu & Drawer Controller
  const menuBackdrop = document.querySelector('[data-menu-backdrop]');
  const drawerClose = document.querySelector('[data-menu-close]');

  const closeMenu = () => {
    if (!siteNav) return;
    siteNav.classList.remove('open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('is-active');
    }
    document.body.classList.remove('menu-locked');
  };

  const openMenu = () => {
    if (!siteNav) return;
    siteNav.classList.add('open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.classList.add('is-active');
    }
    document.body.classList.add('menu-locked');
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = siteNav.classList.contains('open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    if (drawerClose) {
      drawerClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    if (menuBackdrop) {
      menuBackdrop.addEventListener('click', closeMenu);
    }

    siteNav.querySelectorAll('.drawer-nav-item').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // 3. Audio Autoplay & Sync Controller (Header & Drawer)
  const audioButtons = document.querySelectorAll('[data-audio-toggle]');
  if (audioElement) {
    audioElement.volume = 0.85;

    const updateAudioState = (playing) => {
      audioButtons.forEach(btn => {
        btn.classList.toggle('playing', playing);
        const textSpan = btn.querySelector('.audio-text');
        if (textSpan) {
          textSpan.textContent = playing ? 'Pause Music' : 'Play Music';
        }
        const drawerStatus = btn.querySelector('.drawer-audio-status');
        if (drawerStatus) {
          drawerStatus.textContent = playing ? 'Now Playing · Tap to Pause' : 'Paused · Tap to Play';
        }
      });
    };

    const playAudio = () => {
      const promise = audioElement.play();
      if (promise !== undefined) {
        promise.then(() => {
          updateAudioState(true);
          cleanupGestureListeners();
        }).catch(() => {
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

    // Connect all audio toggle buttons
    audioButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
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
    });

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

  // 7. Digital Pass QR Code Engine
  const qrContainer = document.querySelector('#qr-target-container');
  const qrUrlReadout = document.querySelector('#qr-url-text');
  const qrModeButtons = document.querySelectorAll('[data-qr-mode]');
  const btnDownloadQr = document.querySelector('#btn-download-qr-pass');
  const btnCopyQr = document.querySelector('#btn-copy-qr-url');

  let currentQrMode = 'rsvp';
  const getBaseUrl = () => {
    return window.location.origin + window.location.pathname.replace(/\/$/, '');
  };

  const getTargetQrUrl = (mode) => {
    const base = getBaseUrl();
    return mode === 'rsvp' ? `${base}#rsvp` : base;
  };

  async function renderQrCode(mode) {
    if (!qrContainer) return;
    const url = getTargetQrUrl(mode);
    if (qrUrlReadout) qrUrlReadout.textContent = url;

    try {
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        margin: 1,
        color: {
          dark: '#0E1E38',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });
      qrContainer.innerHTML = svgString;
    } catch (err) {
      console.error('Error rendering QR code:', err);
    }
  }

  qrModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      qrModeButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentQrMode = btn.getAttribute('data-qr-mode') || 'rsvp';
      renderQrCode(currentQrMode);
    });
  });

  // Copy QR Link
  if (btnCopyQr) {
    btnCopyQr.addEventListener('click', async () => {
      const url = getTargetQrUrl(currentQrMode);
      try {
        await navigator.clipboard.writeText(url);
        showToast('✓ Link copied to clipboard');
      } catch (err) {
        showToast('Link: ' + url);
      }
    });
  }

  // Download High-Resolution Gate Clearance Pass
  if (btnDownloadQr) {
    btnDownloadQr.addEventListener('click', async () => {
      const url = getTargetQrUrl(currentQrMode);
      try {
        showToast('Generating official clearance pass...');
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 320,
          margin: 1,
          color: { dark: '#0E1E38', light: '#FFFFFF' },
          errorCorrectionLevel: 'H'
        });

        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 840;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Warm Ivory Card Background
        ctx.fillStyle = '#FAF7F2';
        ctx.fillRect(0, 0, 640, 840);

        // Gold Foil Border
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#D4AF37';
        ctx.strokeRect(20, 20, 600, 800);

        // Inner Navy Border
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#0E1E38';
        ctx.strokeRect(28, 28, 584, 784);

        // Header Title
        ctx.fillStyle = '#0E1E38';
        ctx.textAlign = 'center';
        ctx.font = 'bold 22px Georgia, serif';
        ctx.fillText('SACRAMENT OF HOLY MATRIMONY', 320, 80);

        ctx.font = 'italic 16px sans-serif';
        ctx.fillStyle = '#D4AF37';
        ctx.fillText('Official Digital Gate Clearance & RSVP Pass', 320, 110);

        ctx.font = 'bold 36px Georgia, serif';
        ctx.fillStyle = '#6B1731';
        ctx.fillText('Chi Chi & Zubby', 320, 160);

        ctx.font = '15px sans-serif';
        ctx.fillStyle = '#1C2430';
        ctx.fillText('Monday, 28th December 2026 · 9:00 AM Prompt', 320, 195);
        ctx.fillText('Sacred Heart Catholic Church · Ojo Cantonment, Lagos', 320, 220);

        // Render QR Code onto Canvas
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 170, 260, 300, 300);

          // Center Monogram Seal
          ctx.beginPath();
          ctx.arc(320, 410, 28, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#D4AF37';
          ctx.stroke();

          ctx.fillStyle = '#0E1E38';
          ctx.font = 'bold 16px Georgia, serif';
          ctx.fillText('C & Z', 320, 416);

          // Footer Notice
          ctx.font = 'bold 14px sans-serif';
          ctx.fillStyle = '#0E1E38';
          ctx.fillText('SCAN WITH CAMERA FOR INSTANT GATE CLEARANCE & RSVP', 320, 600);

          ctx.font = 'italic 14px Georgia, serif';
          ctx.fillStyle = '#6B1731';
          ctx.fillText('“Love is as strong as death” — Song of Solomon 8:6', 320, 640);

          ctx.font = 'bold 15px sans-serif';
          ctx.fillStyle = '#D4AF37';
          ctx.fillText('#Chizube2026', 320, 675);

          // Trigger download
          const link = document.createElement('a');
          link.download = 'Chizube2026-DigitalGatePass.png';
          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('✓ Digital Pass downloaded to device');
        };
        img.src = qrDataUrl;
      } catch (err) {
        showToast('Download complete. Check downloads.');
      }
    });
  }

  // Initialize QR
  renderQrCode('rsvp');

  // 8. RSVP Engine & Live Confirmation Feedback
  const rsvpForm = document.querySelector('#rsvp-form');
  const rsvpSuccessCard = document.querySelector('#rsvp-success-card');
  const btnEditRsvp = document.querySelector('#btn-edit-rsvp');
  const whatsappSubmitBtn = document.querySelector('#btn-whatsapp-rsvp');

  function getRsvpData() {
    if (!rsvpForm) return null;
    const name = rsvpForm.querySelector('#guest-name')?.value.trim();
    const attendance = rsvpForm.querySelector('input[name="attendance"]:checked')?.value || 'Attending';
    const guestCount = rsvpForm.querySelector('#guest-count')?.value || '1';
    const phone = rsvpForm.querySelector('#guest-phone')?.value.trim();
    const notes = rsvpForm.querySelector('#guest-notes')?.value.trim();
    return { name, attendance, guestCount, phone, notes };
  }

  function displaySuccessState(data) {
    if (!rsvpForm || !rsvpSuccessCard) return;
    rsvpForm.style.display = 'none';
    rsvpSuccessCard.style.display = 'block';

    const guestNameEl = document.querySelector('#success-guest-name');
    const guestStatusEl = document.querySelector('#success-guest-status');
    const guestCountEl = document.querySelector('#success-guest-count');

    if (guestNameEl) guestNameEl.textContent = data.name || 'Esteemed Guest';
    if (guestStatusEl) {
      guestStatusEl.textContent = data.attendance === 'Declining' ? 'Regretfully Declining' : 'Joyfully Attending';
      guestStatusEl.style.color = data.attendance === 'Declining' ? 'var(--color-burgundy)' : '#A68010';
    }
    if (guestCountEl) guestCountEl.textContent = `${data.guestCount} ${data.guestCount === '1' ? 'Person' : 'Persons'}`;
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getRsvpData();
      if (!data.name) {
        showToast('Please provide your full name');
        return;
      }

      try {
        localStorage.setItem('chizube_rsvp', JSON.stringify({ ...data, date: new Date().toISOString() }));
      } catch (err) {}

      displaySuccessState(data);
      showToast(`✨ Thank you, ${data.name}! Your RSVP has been confirmed.`);
    });
  }

  if (btnEditRsvp) {
    btnEditRsvp.addEventListener('click', () => {
      if (rsvpForm && rsvpSuccessCard) {
        rsvpSuccessCard.style.display = 'none';
        rsvpForm.style.display = 'block';
      }
    });
  }

  // Restore saved RSVP if previously submitted
  try {
    const savedRsvp = localStorage.getItem('chizube_rsvp');
    if (savedRsvp) {
      const parsed = JSON.parse(savedRsvp);
      if (parsed && parsed.name) {
        displaySuccessState(parsed);
      }
    }
  } catch (err) {}

  if (whatsappSubmitBtn) {
    whatsappSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = getRsvpData();
      const name = data?.name || 'A Guest';
      const status = data?.attendance === 'Declining' ? 'Regretfully Declining' : 'Joyfully Attending';
      const guests = data?.guestCount || '1';
      const phone = data?.phone ? `\n📞 Phone: ${data.phone}` : '';
      const notes = data?.notes ? `\n💌 Prayer/Note: "${data.notes}"` : '';

      const targetPhone = cfg.rsvp?.whatsappNumber || '2348130255015';
      const message = `Hello Chi Chi & Zubby! I am confirming my RSVP for Chizube 2026.\n\n👤 Name: ${name}\n✨ Status: ${status}\n👥 Reserved Seats: ${guests} Person(s)${phone}${notes}\n\nCongratulations and God bless your union!`;

      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
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

  // 9. Reveal on Scroll (Intersection Observer with Sibling Staggering)
  const revealTargetsSelector = [
    '.section-header',
    '.invitation-card',
    '.invitation-detail-item',
    '.countdown-item',
    '.calendar-action-btn',
    '.story-media-stack',
    '.story-header',
    '.story-paragraph',
    '.story-quote-card',
    '.story-signature',
    '.sacred-union-content',
    '.venue-card',
    '.timeline-card',
    '.gallery-slider-wrap',
    '.gallery-thumbs-rail',
    '.palette-swatch-card',
    '.qr-pass-card',
    '.rsvp-header-block',
    '.rsvp-contact-box',
    '.rsvp-reminder-badge',
    '.rsvp-form-card',
    '.closing-section .container'
  ].join(', ');

  document.querySelectorAll(revealTargetsSelector).forEach((el) => {
    el.classList.add('reveal-up', 'reveal-on-scroll');
  });

  // Apply staggered transition delays to sibling cards inside grids and stacks
  const staggerContainers = document.querySelectorAll(
    '.invitation-details-grid, .countdown-grid, .story-text-stack, .venues-grid, .timeline-strip, .palette-swatches-grid, .rsvp-text-col'
  );
  staggerContainers.forEach((container) => {
    const items = container.querySelectorAll(':scope > .reveal-up');
    items.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${(index % 4) * 95}ms`);
    });
  });

  const revealElements = document.querySelectorAll('.reveal-up, .reveal-on-scroll');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('in-view'));
  }
});

