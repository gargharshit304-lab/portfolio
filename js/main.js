/**
 * Harshit Garg Portfolio — Main JS
 * Version 1.0
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initScrollReveals();
  initSmoothScroll();
  initFooterYear();
  initHeroParallax();
  initContactModal();
  initCertificateLightbox();
});

/**
 * Handles navbar border & backdrop intensity change on scroll
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer Toggle & Escape handler
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!toggleBtn || !mobileMenu) return;

  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
    if (shouldOpen) {
      mobileMenu.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Change icon to close (X)
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      mobileMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // Change icon back to hamburger
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    }
  };

  toggleBtn.addEventListener('click', () => toggleMenu());

  // Close when clicking links inside mobile drawer
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/**
 * Subtle Viewport Scroll Reveals using IntersectionObserver
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Smooth scrolling helper with offset correction
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL hash safely without jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });
}

/**
 * Sets current year in footer automatically
 */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Subtle parallax floating effect for profile image on desktop
 */
function initHeroParallax() {
  const profileFrame = document.querySelector('.profile-image-frame');
  const hero = document.getElementById('hero');
  if (!profileFrame || !hero) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        if (window.innerWidth > 768 && scrollY < window.innerHeight) {
          const translateY = scrollY * 0.08;
          profileFrame.style.transform = `translateY(${translateY}px)`;
        } else {
          profileFrame.style.transform = '';
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Direct Glassmorphism Email Contact Modal & Endpoint Integration
 */
const CONTACT_CONFIG = {
  // Free direct AJAX delivery endpoint to gargharshit304@gmail.com (FormSubmit)
  FORM_ENDPOINT: 'https://formsubmit.co/ajax/gargharshit304@gmail.com',
  RECIPIENT_EMAIL: 'gargharshit304@gmail.com'
};

function initContactModal() {
  const openBtn = document.getElementById('contact-email-btn');
  const overlay = document.getElementById('email-modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const successCloseBtn = document.getElementById('modal-success-close-btn');
  const form = document.getElementById('email-form');
  const nameInput = document.getElementById('email-name');
  const fromInput = document.getElementById('email-from');
  const subjectInput = document.getElementById('email-subject');
  const messageInput = document.getElementById('email-message');
  const submitBtn = document.getElementById('modal-submit-btn');
  const nameError = document.getElementById('name-error');
  const fromError = document.getElementById('from-error');
  const messageError = document.getElementById('message-error');
  const statusAlert = document.getElementById('form-status-alert');
  const successView = document.getElementById('modal-success-view');

  if (!overlay || !form) return;

  let previousActiveElement = null;

  const openModal = () => {
    previousActiveElement = document.activeElement;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Reset view
    form.style.display = 'flex';
    if (successView) successView.style.display = 'none';
    if (statusAlert) {
      statusAlert.style.display = 'none';
      statusAlert.className = 'form-status-alert';
    }
    clearErrors();

    // Focus first editable input (NAME field)
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 100);
  };

  const closeModal = () => {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };

  const clearErrors = () => {
    if (nameError) nameError.textContent = '';
    if (fromError) fromError.textContent = '';
    if (messageError) messageError.textContent = '';
    if (statusAlert) {
      statusAlert.textContent = '';
      statusAlert.className = 'form-status-alert';
      statusAlert.style.display = 'none';
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Event Listener on Send an Email button
  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  // Close on backdrop overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Form Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const nameVal = nameInput ? nameInput.value.trim() : '';
    const fromVal = fromInput.value.trim();
    const subjectVal = subjectInput ? subjectInput.value.trim() : '';
    const messageVal = messageInput.value.trim();

    let isValid = true;

    if (!nameVal) {
      if (nameError) nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    if (!fromVal) {
      if (fromError) fromError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!validateEmail(fromVal)) {
      if (fromError) fromError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!messageVal) {
      if (messageError) messageError.textContent = 'Please write a message.';
      isValid = false;
    }

    if (!isValid) return;

    // Set Submitting State
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';

    // Format Email Subject: "Portfolio Contact — {subject}"
    const formattedSubject = subjectVal 
      ? `Portfolio Contact — ${subjectVal}` 
      : 'Portfolio Contact — New Message';

    try {
      // Send form data asynchronously via fetch to FormSubmit
      const response = await fetch(CONTACT_CONFIG.FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: nameVal,
          email: fromVal,
          _replyto: fromVal,
          _subject: formattedSubject,
          subject: formattedSubject,
          message: messageVal,
          _template: 'table'
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok || data.success === 'true' || response.status === 200) {
        // Success
        form.reset();
        form.style.display = 'none';
        if (successView) successView.style.display = 'flex';
      } else {
        throw new Error(data.message || 'Submission error');
      }
    } catch (err) {
      console.warn('Form submission note:', err);
      if (statusAlert) {
        statusAlert.className = 'form-status-alert error';
        statusAlert.innerHTML = '<strong>Something went wrong.</strong><br>Please try again in a moment.';
        statusAlert.style.display = 'block';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/**
 * Modular Certificate Data Array
 * Easily update or add new hackathon certificates here!
 */
const CERTIFICATES_DATA = [
  {
    id: 'cert-1',
    title: 'HACK-ADHAAY (National Level Hackathon)',
    organization: 'Lovely Professional University (LPU)',
    year: '2026',
    image: 'assets/certificates/certificate-1.png',
    fileUrl: 'assets/certificates/certificate-1.pdf'
  },
  {
    id: 'cert-2',
    title: 'Code Carvan 3.0',
    organization: 'Coding Blocks & LPU',
    year: '2026',
    image: 'assets/certificates/certificate-2.png',
    fileUrl: 'assets/certificates/certificate-2.pdf'
  },
  {
    id: 'cert-3',
    title: 'Hackathon-101',
    organization: 'ARC (Automation & Robotics Club)',
    year: '2026',
    image: 'assets/certificates/certificate-3.png',
    fileUrl: 'assets/certificates/certificate-3.pdf'
  },
  {
    id: 'cert-4',
    title: 'CODECARVAN 3.0 Hackathon',
    organization: 'Coding Blocks & LPU',
    year: '2025',
    image: 'assets/certificates/certificate-4.png',
    fileUrl: 'assets/certificates/certificate-4.pdf'
  },
  {
    id: 'cert-5',
    title: 'Code Carvan 3.0 (Mentor Session)',
    organization: 'Coding Blocks & LPU',
    year: '2026',
    image: 'assets/certificates/certificate-5.png',
    fileUrl: 'assets/certificates/certificate-5.pdf'
  }
];

function initCertificateLightbox() {
  const lightbox = document.getElementById('certificate-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!lightbox || !lightboxImg) return;

  let previousActiveElement = null;

  const openLightbox = (src, title) => {
    previousActiveElement = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = title || 'Certificate Full View';
    if (lightboxCaption) lightboxCaption.textContent = title || '';

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (closeBtn) closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
    
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };

  // Event Listeners for certificate preview clicks
  document.querySelectorAll('.certificate-card, .view-cert-btn').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      // Find source from dataset or child element
      const card = trigger.closest('.certificate-card') || trigger;
      const img = card.querySelector('.certificate-img');
      const src = trigger.getAttribute('data-cert-src') || (img ? img.getAttribute('src') : '');
      const title = trigger.getAttribute('data-cert-title') || (card.querySelector('.certificate-title') ? card.querySelector('.certificate-title').textContent : '');

      if (src) {
        openLightbox(src, title);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // Close on backdrop overlay click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
