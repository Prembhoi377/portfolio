document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Sticky Navigation & Scroll Progress Bar
  // ==========================================
  const mainNav = document.getElementById('main-nav');
  const scrollBar = document.getElementById('scroll-indicator-bar');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Sticky header class toggle
    if (scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    // Scroll progress bar width update
    if (scrollHeight > 0) {
      const scrollPercent = (scrollY / scrollHeight) * 100;
      scrollBar.style.width = `${scrollPercent}%`;
    }

    // Back to top button visibility toggle
    if (scrollY > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
      backToTopBtn.style.transform = 'translateY(0)';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
      backToTopBtn.style.transform = 'translateY(10px)';
    }
  });

  // Smooth scroll back to top
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  // ==========================================
  // 2. Mobile Burger Menu Toggle
  // ==========================================
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const navMenuList = document.getElementById('nav-menu-list');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggleBtn.addEventListener('click', () => {
    menuToggleBtn.classList.toggle('active');
    navMenuList.classList.toggle('active');
  });

  // Close menu when a navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggleBtn.classList.remove('active');
      navMenuList.classList.remove('active');
    });
  });


  // ==========================================
  // 3. Typewriter Effect
  // ==========================================
  const typewriterText = document.getElementById('typewriter-text');
  const words = [
    "Computer Science Engineering Student",
    "Python Developer",
    "AI Enthusiast",
    "Problem Solver"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Erasing characters
      typewriterText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 40;
    } else {
      // Typing characters
      typewriterText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100;
    }

    // Checking word completion states
    if (!isDeleting && charIndex === currentWord.length) {
      // Word completely typed -> Wait, then delete
      typingDelay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Word completely erased -> Move to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingDelay = 500;
    }

    setTimeout(type, typingDelay);
  }

  // Initial typewriter trigger
  if (typewriterText) {
    setTimeout(type, 1000);
  }


  // ==========================================
  // 4. ScrollSpy (Highlight active link on scroll)
  // ==========================================
  const sections = document.querySelectorAll('section');
  
  function scrollSpy() {
    const scrollPos = window.scrollY + 200; // offset for nav height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', scrollSpy);


  // ==========================================
  // 5. Intersection Observer for Animations
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const cgpaCircle = document.getElementById('cgpa-circle');

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after showing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(elem => {
    animationObserver.observe(elem);
  });

  // Skills fill progress bar observer
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.getAttribute('data-percent');
        bar.style.width = targetPercent;
        skillsObserver.unobserve(bar);
      }
    });
  }, {
    threshold: 0.5
  });

  skillBars.forEach(bar => {
    skillsObserver.observe(bar);
  });

  // CGPA radial gauge fill observer
  const cgpaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && cgpaCircle) {
        const cgpaValue = parseFloat(cgpaCircle.getAttribute('data-cgpa'));
        const radius = 80;
        const circumference = 2 * Math.PI * radius; // Approx 502
        
        // Calculate offset based on CGPA score (out of 10)
        const cgpaPercentage = cgpaValue / 10.0;
        const offset = circumference - (cgpaPercentage * circumference);
        
        // Animate stroke
        cgpaCircle.style.strokeDasharray = circumference;
        cgpaCircle.style.strokeDashoffset = offset;
        cgpaObserver.unobserve(cgpaCircle);
      }
    });
  }, {
    threshold: 0.2
  });

  if (cgpaCircle) {
    cgpaObserver.observe(cgpaCircle);
  }


  // ==========================================
  // 6. Mock Contact Form Submission Handler
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const feedbackNotice = document.getElementById('form-feedback-notice');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Update button state to sending
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending message <i class="fa-solid fa-circle-notch fa-spin"></i>';
      submitBtn.disabled = true;

      // Simulate API post call delay
      setTimeout(() => {
        // Collect form data values
        const nameVal = document.getElementById('contact-name').value;
        const emailVal = document.getElementById('contact-email').value;

        // Verify successful input parameters
        if (nameVal && emailVal) {
          // Success Response
          feedbackNotice.className = 'form-status success';
          feedbackNotice.innerHTML = `<strong>Success!</strong> Message sent successfully. Thank you for reaching out, ${nameVal}! Prem will get back to you shortly.`;
          
          // Reset form fields
          contactForm.reset();
        } else {
          // Error Response
          feedbackNotice.className = 'form-status error';
          feedbackNotice.innerHTML = '<strong>Error!</strong> There was an issue processing the form. Please check your fields and try again.';
        }

        // Restore button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Auto hide success notice after 8 seconds
        setTimeout(() => {
          feedbackNotice.style.display = 'none';
        }, 8000);

      }, 1500);
    });
  }


  // ==========================================
  // 7. Certificate Lightbox Modal Handler
  // ==========================================
  const certModalOverlay = document.getElementById('certModalOverlay');
  const certModalCloseBtn = document.getElementById('certModalCloseBtn');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalSubtitle = document.getElementById('certModalSubtitle');
  const certModalPreviewImg = document.getElementById('certModalPreviewImg');
  const certModalDownloadBtn = document.getElementById('certModalDownloadBtn');
  const certModalOpenBtn = document.getElementById('certModalOpenBtn');
  const certModalIcon = document.getElementById('certModalIcon');

  const certDataMap = {
    'cert-btn-codealpha-ml': {
      title: 'Machine Learning Internship Certificate',
      subtitle: 'CodeAlpha • Issued 21st July 2026 (ID: CA/DF1/159392)',
      img: 'assets/codealpha_ml_certificate_preview.png',
      pdf: 'assets/codealpha_machine_learning_certificate.pdf',
      icon: '<i class="fa-solid fa-brain" style="color:#a855f7;"></i>'
    },
    'lor-btn-codealpha-ml': {
      title: 'Machine Learning Letter of Recommendation',
      subtitle: 'CodeAlpha • Issued 21st July 2026 (ID: CA/DF1/159392)',
      img: 'assets/codealpha_ml_certificate_preview.png',
      pdf: 'assets/codealpha_machine_learning_lor.pdf',
      icon: '<i class="fa-solid fa-file-pdf" style="color:#a855f7;"></i>'
    },
    'cert-btn-codealpha-frontend': {
      title: 'Frontend Development Internship Certificate',
      subtitle: 'CodeAlpha • Issued 21st July 2026 (ID: CA/DF1/160327)',
      img: 'assets/codealpha_frontend_certificate_preview.png',
      pdf: 'assets/codealpha_frontend_development_certificate.pdf',
      icon: '<i class="fa-solid fa-laptop-code" style="color:#3b82f6;"></i>'
    },
    'lor-btn-codealpha-frontend': {
      title: 'Frontend Development Letter of Recommendation',
      subtitle: 'CodeAlpha • Issued 21st July 2026 (ID: CA/DF1/160327)',
      img: 'assets/codealpha_frontend_certificate_preview.png',
      pdf: 'assets/codealpha_frontend_development_lor.pdf',
      icon: '<i class="fa-solid fa-file-pdf" style="color:#3b82f6;"></i>'
    },
    'cert-btn-appdev': {
      title: 'Application Development Internship Certificate',
      subtitle: 'NexaNova ProTech • Issued Nov 2025',
      img: 'assets/application_development_certificate.pdf',
      pdf: 'assets/application_development_certificate.pdf',
      icon: '<i class="fa-solid fa-mobile-screen-button" style="color:#06b6d4;"></i>'
    },
    'cert-btn-python': {
      title: 'Python Programming Internship Certificate',
      subtitle: 'YBI Foundation • Issued May 2025',
      img: 'assets/python_internship_certificate.pdf',
      pdf: 'assets/python_internship_certificate.pdf',
      icon: '<i class="fa-brands fa-python" style="color:#f59e0b;"></i>'
    },
    'exp-btn-ml-cert': {
      title: 'Machine Learning Internship Certificate',
      subtitle: 'CodeAlpha • Issued 21st July 2026 (ID: CA/DF1/159392)',
      img: 'assets/codealpha_ml_certificate_preview.png',
      pdf: 'assets/codealpha_machine_learning_certificate.pdf',
      icon: '<i class="fa-solid fa-brain" style="color:#a855f7;"></i>'
    },
    'exp-btn-ml-lor': {
      title: 'Machine Learning Letter of Recommendation',
      subtitle: 'CodeAlpha • Issued 21st July 2026 (ID: CA/DF1/159392)',
      img: 'assets/codealpha_ml_certificate_preview.png',
      pdf: 'assets/codealpha_machine_learning_lor.pdf',
      icon: '<i class="fa-solid fa-file-pdf" style="color:#a855f7;"></i>'
    },
    'exp-btn-frontend-cert': {
      title: 'Frontend Development Internship Certificate',
      subtitle: 'CodeAlpha • Issued 21st July 2026 (ID: CA/DF1/160327)',
      img: 'assets/codealpha_frontend_certificate_preview.png',
      pdf: 'assets/codealpha_frontend_development_certificate.pdf',
      icon: '<i class="fa-solid fa-laptop-code" style="color:#3b82f6;"></i>'
    },
    'exp-btn-frontend-lor': {
      title: 'Frontend Development Letter of Recommendation',
      subtitle: 'CodeAlpha • Issued 21st July 2026 (ID: CA/DF1/160327)',
      img: 'assets/codealpha_frontend_certificate_preview.png',
      pdf: 'assets/codealpha_frontend_development_lor.pdf',
      icon: '<i class="fa-solid fa-file-pdf" style="color:#3b82f6;"></i>'
    },
    'exp-btn-appdev-cert': {
      title: 'Application Development Internship Certificate',
      subtitle: 'NexaNova ProTech • Issued Nov 2025',
      img: 'assets/application_development_certificate.pdf',
      pdf: 'assets/application_development_certificate.pdf',
      icon: '<i class="fa-solid fa-mobile-screen-button" style="color:#06b6d4;"></i>'
    },
    'exp-btn-python-cert': {
      title: 'Python Programming Internship Certificate',
      subtitle: 'YBI Foundation • Issued May 2025',
      img: 'assets/python_internship_certificate.pdf',
      pdf: 'assets/python_internship_certificate.pdf',
      icon: '<i class="fa-brands fa-python" style="color:#f59e0b;"></i>'
    }
  };

  Object.keys(certDataMap).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', (e) => {
        const data = certDataMap[btnId];
        if (data && certModalOverlay && (data.img.endsWith('.png') || data.img.endsWith('.jpg'))) {
          e.preventDefault();
          certModalTitle.textContent = data.title;
          certModalSubtitle.textContent = data.subtitle;
          certModalIcon.innerHTML = data.icon;
          certModalDownloadBtn.href = data.pdf;
          certModalOpenBtn.href = data.pdf;
          certModalPreviewImg.src = data.img;

          certModalOverlay.classList.add('active');
          certModalOverlay.setAttribute('aria-hidden', 'false');
        }
      });
    }
  });

  if (certModalCloseBtn && certModalOverlay) {
    certModalCloseBtn.addEventListener('click', () => {
      certModalOverlay.classList.remove('active');
      certModalOverlay.setAttribute('aria-hidden', 'true');
    });

    certModalOverlay.addEventListener('click', (e) => {
      if (e.target === certModalOverlay) {
        certModalOverlay.classList.remove('active');
        certModalOverlay.setAttribute('aria-hidden', 'true');
      }
    });
  }

});
