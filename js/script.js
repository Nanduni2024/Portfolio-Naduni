// JavaScript Interactivity & Particle Network Engine - Nanduni Sanjana SaaS Redesign

document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================
     1. Preloader Handler
     ========================================== */
  const preloader = document.getElementById('preloader');
  
  window.addEventListener('load', () => {
    if (preloader) {
      preloader.classList.add('is-hidden');
    }
  });
  
  // Safety timeout in case window load event is delayed
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('is-hidden')) {
      preloader.classList.add('is-hidden');
    }
  }, 2000);


  /* ==========================================
     2. Interactive Particle Canvas Network
     ========================================== */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 130 };

    // Set canvas dimensions
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }
    
    // Listen for mouse inputs
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Class representing individual nodes
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }
        
        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        
        // Draw particle
        this.draw();
      }
    }

    // Initialize particle array
    function initParticles() {
      particlesArray = [];
      
      // Scale particle density based on screen width to prevent CPU throttle
      const numberOfParticles = Math.min(60, Math.floor((canvas.width * canvas.height) / 22000));
      
      const colors = ['rgba(139, 92, 246, 0.45)', 'rgba(6, 182, 212, 0.45)', 'rgba(255, 255, 255, 0.25)'];
      
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 1.5 + 1; // very small dots
        const x = Math.random() * (canvas.width - size * 2) + size * 2;
        const y = Math.random() * (canvas.height - size * 2) + size * 2;
        const directionX = (Math.random() - 0.5) * 0.4;
        const directionY = (Math.random() - 0.5) * 0.4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // Connect close particles with neural constellation lines
    function connectParticles() {
      let opacityValue = 1;
      const maxDistance = 110;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            opacityValue = 1 - (distance / maxDistance);
            
            // Generate glowing violet-cyan line gradients
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.14})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
        
        // Draw lines from mouse cursor to nearby particles
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particlesArray[a].x - mouse.x;
          const dy = particlesArray[a].y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            opacityValue = 1 - (distance / mouse.radius);
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacityValue * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation frame loop
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
  }


  /* ==========================================
     3. Navigation Scroll Spy & Mobile Navbar
     ========================================== */
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelectorAll('.site-nav a');
  const sections = document.querySelectorAll('main section[id], main div[id]');

  window.addEventListener('scroll', () => {
    // Scroll header scroll-tint state
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // Active navigation link tracking
    let currentId = 'home';
    const triggerHeight = window.innerHeight * 0.35;
    
    sections.forEach(sec => {
      const top = sec.offsetTop;
      if (window.scrollY >= (top - triggerHeight)) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('is-active');
      }
    });
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      const icon = menuToggle.querySelector('i');
      if (isOpen) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Close nav when links are clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  });


  /* ==========================================
     4. Project Cards Category Filter
     ========================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filterValue = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 30);
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });


  /* ==========================================
     5. Scroll Reveal Effect (IntersectionObserver)
     ========================================== */
  const revealItems = document.querySelectorAll(
    '.bento-panel, .project-card, .timeline-item, .journey-node, .achievement-tile, .cert-card'
  );
  
  if ('IntersectionObserver' in window) {
    revealItems.forEach(item => {
      item.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  } else {
    // Fallback for older browsers
    revealItems.forEach(item => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    });
  }


  /* ==========================================
     6. Contact Form Submission
     ========================================== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();

      const mailtoSubject = encodeURIComponent(`Portfolio inquiry: ${subject} from ${name}`);
      const mailtoBody = encodeURIComponent(`Hi Nanduni,\n\n${message}\n\nRegards,\n${name}\nEmail: ${email}`);
      
      window.location.href = `mailto:naduniwanniarachchi919@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    });
  }

});
