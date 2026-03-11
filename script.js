/* ═══════════════════════════════════════════════
   CGONESTEPAHEADTECH — Main JavaScript
   Handles: Navbar, Scroll Reveal, FAQ,
   Testimonials, Counters, Mobile Menu
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky Navbar ── */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Mobile Menu Toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Smooth Scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Scroll Reveal ── */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-item__question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const answer = item.querySelector('.faq-item__answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-item__answer').style.maxHeight = null;
      });

      // Open clicked (if it wasn't already open)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── Testimonial Slider ── */
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('testimonialDots');
  const slides = track.querySelectorAll('.testimonial-card');
  let currentSlide = 0;
  const totalSlides = slides.length;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot');

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
  });

  // Auto-play every 6 seconds
  let autoPlay = setInterval(() => {
    goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
  }, 6000);

  // Pause on hover
  const slider = document.getElementById('testimonialSlider');
  slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
  slider.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
    }, 6000);
  });

  /* ── Animated Counters ── */
  const counters = document.querySelectorAll('.stat-card__value[data-target]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (counters.length > 0) {
    counterObserver.observe(counters[0].closest('.stats__grid'));
  }

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out quad
        const ease = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(ease * target);
        counter.textContent = current.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(update);
    });
  }

  /* ── Contact Form UI Feedback ── */
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!name || !email) {
        submitBtn.textContent = 'Please fill required fields';
        submitBtn.style.background = 'rgba(239, 68, 68, 0.2)';
        setTimeout(() => {
          submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Request a Demo
          `;
          submitBtn.style.background = '';
        }, 2500);
        return;
      }

      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        Demo Request Sent!
      `;
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';

      // Reset form
      setTimeout(() => {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('company').value = '';
        document.getElementById('message').value = '';
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          Request a Demo
        `;
        submitBtn.style.background = '';
      }, 3000);
    });
  }

});
