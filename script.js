document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');
  
  mobileMenuBtn.addEventListener('click', function() {
    mobileNav.classList.toggle('open');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  });
  
  // Scroll to section
  const scrollButtons = document.querySelectorAll('[data-scroll-to]');
  scrollButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-scroll-to');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Navigation active state
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  function setActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', setActiveNavLink);
  
  // Navigation click handling
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 100,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        mobileNav.classList.remove('open');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    });
  });

  // Handle project card interactions
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    // When hovering over a project card, we still want to show the overlay
    // but we don't need the play button logic anymore since we have iframes now
    card.addEventListener('mouseenter', function() {
      const line = this.querySelector('.project-line');
      if (line) {
        line.style.transform = 'scaleX(1)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const line = this.querySelector('.project-line');
      if (line) {
        line.style.transform = 'scaleX(0)';
      }
    });
  });
  
  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('form-message');
  const submitBtn = document.getElementById('submit-btn');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Simple validation
      if (!name || !email || !message) {
        showMessage('Please fill in all fields', 'error');
        return;
      }
      
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Send to backend endpoint
      fetch('https://formspree.io/f/mldrkylo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then(data => {
        showMessage('Thank you for your message! I will get back to you soon.', 'success');
        contactForm.reset();
      })
      .catch(error => {
        console.error('Error:', error);
        showMessage('Sorry, there was a problem sending your message. Please try again later.', 'error');
      })
      .finally(() => {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
    });
  }
  
  // Helper function to show form messages
  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.classList.remove('hidden', 'success', 'error');
    formMessage.classList.add(type);
    
    // Automatically hide the message after 5 seconds
    setTimeout(() => {
      formMessage.classList.add('hidden');
    }, 5000);
  }
});