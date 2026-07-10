document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initStatsCounter();
  initSlideshow();
  initBioModals();
  initForms();
});

/**
 * Header Scroll Effect
 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check
}

/**
 * Mobile Navigation Menu & Focus Management
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!toggleBtn || !mobileMenu) return;

  const toggleMenu = () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    toggleBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    if (!isExpanded) {
      // Focus first link in mobile menu when opened
      const firstLink = mobileMenu.querySelector('a');
      if (firstLink) setTimeout(() => firstLink.focus(), 100);
    } else {
      toggleBtn.focus();
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking outer area
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && 
        !toggleBtn.contains(e.target)) {
      toggleMenu();
    }
  });

  // Handle ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      toggleMenu();
    }
  });
}

/**
 * IntersectionObserver for Scroll Reveal Effects
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => observer.observe(reveal));
}

/**
 * Stats Counter Animation
 */
function initStatsCounter() {
  const statsSection = document.querySelector('.stats-bar');
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statsSection || statNumbers.length === 0) return;

  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const prefix = stat.getAttribute('data-prefix') || '';
      let current = parseInt(stat.getAttribute('data-start') || '0', 10);
      const duration = 2000; // 2 seconds
      const steps = 50;
      const stepValue = Math.ceil(target / steps);
      const intervalTime = duration / steps;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          stat.textContent = prefix + target + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = prefix + current + suffix;
        }
      }, intervalTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animateCounters();
        animated = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

/**
 * Slideshow Fade Transition
 */
function initSlideshow() {
  const slideshow = document.querySelector('.media-slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.slide');
  if (slides.length <= 1) return;

  let currentIndex = 0;
  const intervalTime = 5000; // 5 seconds

  const nextSlide = () => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  };

  setInterval(nextSlide, intervalTime);
}

/**
 * Leadership Bios Modal Handler
 */
function initBioModals() {
  const bioButtons = document.querySelectorAll('.btn-bio');
  const modal = document.getElementById('bioModal');
  
  if (!modal) return;
  
  const modalContent = modal.querySelector('.bio-modal-content');
  const modalClose = modal.querySelector('.bio-modal-close');
  const modalImg = modal.querySelector('#modalImg');
  const modalName = modal.querySelector('#modalName');
  const modalRole = modal.querySelector('#modalRole');
  const modalText = modal.querySelector('#modalText');
  
  let lastActiveElement = null;

  const openModal = (btn) => {
    lastActiveElement = btn;
    const name = btn.getAttribute('data-name');
    const role = btn.getAttribute('data-role');
    const image = btn.getAttribute('data-img');
    const bioId = btn.getAttribute('data-bio-id');
    
    // Retrieve bio text content
    const bioTemplate = document.getElementById(bioId);
    if (!bioTemplate) return;

    // Populate modal
    modalImg.src = image;
    modalImg.alt = name;
    modalName.textContent = name;
    modalRole.textContent = role;
    modalText.innerHTML = bioTemplate.innerHTML;

    // Open Modal
    modal.classList.add('active');
    setTimeout(() => modalContent.classList.add('active'), 50);
    document.body.style.overflow = 'hidden'; // Lock scroll
    
    // Set focus to close button
    setTimeout(() => modalClose.focus(), 100);
  };

  const closeModal = () => {
    modalContent.classList.remove('active');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
    
    // Return focus
    if (lastActiveElement) {
      setTimeout(() => lastActiveElement.focus(), 50);
    }
  };

  bioButtons.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn));
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * Interactive Forms Handler
 */
function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('.form-control[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          highlightInput(input, true);
        } else {
          highlightInput(input, false);
        }
      });
      
      // Email validation helper
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          isValid = false;
          highlightInput(emailInput, true);
        }
      }

      if (isValid) {
        showFormSuccess(form);
      }
    });
    
    // Reset invalid indicators on input
    form.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        highlightInput(input, false);
      });
    });
  });
  
  function highlightInput(input, isError) {
    if (isError) {
      input.style.borderColor = 'var(--color-error)';
      input.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    } else {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }
  }

  function showFormSuccess(form) {
    const parentContainer = form.parentElement;
    const successMsg = document.createElement('div');
    successMsg.className = 'card text-center reveal';
    successMsg.style.padding = '3rem';
    successMsg.style.borderColor = 'var(--color-success)';
    
    successMsg.innerHTML = `
      <div class="card-icon" style="color: var(--color-success)">✓</div>
      <h3 class="mb-2">Thank you!</h3>
      <p class="mb-4">Your message has been successfully received. We will get back to you shortly.</p>
      <button class="btn btn-secondary btn-reset-form">Send Another Message</button>
    `;
    
    // Fade out form and fade in success message
    form.style.display = 'none';
    parentContainer.appendChild(successMsg);
    setTimeout(() => successMsg.classList.add('active'), 50);

    successMsg.querySelector('.btn-reset-form').addEventListener('click', () => {
      successMsg.remove();
      form.reset();
      form.style.display = '';
    });
  }
}
