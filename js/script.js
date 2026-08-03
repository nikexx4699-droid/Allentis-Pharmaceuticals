/**
 * Allentis Pharmaceuticals Pvt. Ltd. - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initializations
  initThemeToggle();
  initStickyNavbar();
  initScrollCounters();
  initProductSearchFilter();
  initProductModal();
  initLiveChat();
  initCookieBanner();
  initScrollTop();
  initFormsValidation();
  initFranchiseCalculator();
  initHeroSlider();
  initCatalogueDownload();
});

/* ==========================================
   1. Dark / Light Mode Toggle
   ========================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('allentis_theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('allentis_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;
  const icon = toggleBtn.querySelector('i');
  if (icon) {
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun text-warning';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  }
}

/* ==========================================
   2. Sticky Navbar & Active Link Highlight
   ========================================== */
function initStickyNavbar() {
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('shadow-sm');
    } else {
      header?.classList.remove('shadow-sm');
    }
  });

  // Highlight active link based on window location
  const path = window.location.pathname;
  const pageName = path.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================
   3. Hero Slider Auto & Manual Controls
   ========================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide-item');
  if (slides.length <= 1) return;

  let currentSlide = 0;
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'flex' : 'none';
      if (i === index) {
        slide.classList.add('fade-in');
      }
    });
  }

  showSlide(currentSlide);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
  }

  // Auto-play interval
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 6000);
}

/* ==========================================
   4. Animated Stat Counters
   ========================================== */
function initScrollCounters() {
  const counterElements = document.querySelectorAll('.counter-value');
  if (counterElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endValue = parseInt(target.getAttribute('data-count') || '0', 10);
        let startValue = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / endValue));

        const timer = setInterval(() => {
          startValue += Math.ceil(endValue / 50);
          if (startValue >= endValue) {
            target.textContent = endValue.toLocaleString() + '+';
            clearInterval(timer);
          } else {
            target.textContent = startValue.toLocaleString() + '+';
          }
        }, stepTime);

        obs.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

/* ==========================================
   5. Interactive Product Search & Filter
   ========================================== */
function initProductSearchFilter() {
  const searchInput = document.getElementById('productSearchInput');
  const categoryFilters = document.querySelectorAll('.category-filter-btn');
  const productItems = document.querySelectorAll('.product-grid-item');
  const noResultsMsg = document.getElementById('noProductsFound');

  let activeCategory = 'all';

  function filterProducts() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    let visibleCount = 0;

    productItems.forEach(item => {
      const category = item.getAttribute('data-category') || '';
      const title = item.querySelector('.product-title')?.textContent.toLowerCase() || '';
      const desc = item.querySelector('.product-desc')?.textContent.toLowerCase() || '';

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesQuery = (title.includes(query) || desc.includes(query));

      if (matchesCategory && matchesQuery) {
        item.style.display = 'block';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }

  categoryFilters.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      categoryFilters.forEach(b => b.classList.remove('active', 'btn-primary-brand'));
      categoryFilters.forEach(b => b.classList.add('btn-outline-brand'));

      btn.classList.remove('btn-outline-brand');
      btn.classList.add('active', 'btn-primary-brand');

      activeCategory = btn.getAttribute('data-category') || 'all';
      filterProducts();
    });
  });
}

/* ==========================================
   6. Product Learn More Modal Details
   ========================================== */
function initProductModal() {
  const modalElement = document.getElementById('productDetailModal');
  if (!modalElement) return;

  const detailButtons = document.querySelectorAll('.view-product-details');

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name') || 'Pharmaceutical Product';
      const category = btn.getAttribute('data-category') || 'General Healthcare';
      const composition = btn.getAttribute('data-composition') || 'Active Pharmaceutical Ingredient';
      const packaging = btn.getAttribute('data-packaging') || '10 x 10 Blister Pack';
      const indication = btn.getAttribute('data-indication') || 'Consult healthcare practitioner for usage instructions.';
      const img = btn.getAttribute('data-img') || 'https://picsum.photos/seed/med1/600/400';

      document.getElementById('modalProdTitle').textContent = name;
      document.getElementById('modalProdCat').textContent = category;
      document.getElementById('modalProdComp').textContent = composition;
      document.getElementById('modalProdPack').textContent = packaging;
      document.getElementById('modalProdIndic').textContent = indication;
      document.getElementById('modalProdImg').setAttribute('src', img);

      // Pre-fill inquiry product name
      const inqField = document.getElementById('inquiryProductName');
      if (inqField) inqField.value = name;
    });
  });
}

/* ==========================================
   7. Live Chat Drawer Widget
   ========================================== */
function initLiveChat() {
  const toggleChatBtn = document.getElementById('toggleChatBtn');
  const chatBox = document.getElementById('chatWidgetBox');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');

  if (!toggleChatBtn || !chatBox) return;

  toggleChatBtn.addEventListener('click', () => {
    chatBox.classList.toggle('active');
  });

  if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => {
      chatBox.classList.remove('active');
    });
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg chat-msg-user';
    userMsg.textContent = text;
    chatBody.appendChild(userMsg);

    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulated Automated Response
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg chat-msg-bot';
      botMsg.innerHTML = `Thank you for contacting <strong>Allentis Pharmaceuticals</strong>. A medical representative will assist you shortly. You can also call us at <strong>+91 22 8890 1234</strong> or email <strong>info@allentispharma.com</strong>.`;
      chatBody.appendChild(botMsg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
  }

  if (sendChatBtn) {
    sendChatBtn.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
}

/* ==========================================
   8. Cookie Consent Banner
   ========================================== */
function initCookieBanner() {
  const banner = document.getElementById('cookieConsentBanner');
  const acceptBtn = document.getElementById('acceptCookiesBtn');

  if (!banner) return;

  const accepted = localStorage.getItem('allentis_cookies_accepted');
  if (!accepted) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 1500);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('allentis_cookies_accepted', 'true');
      banner.classList.remove('show');
    });
  }
}

/* ==========================================
   9. Scroll To Top Button
   ========================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================
   10. Form Validation & Submission Alerts
   ========================================== */
function initFormsValidation() {
  const forms = document.querySelectorAll('.needs-validation');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      form.classList.add('was-validated');

      // Success Feedback
      const alertBox = document.createElement('div');
      alertBox.className = 'alert alert-success alert-dismissible fade show mt-3';
      alertBox.role = 'alert';
      alertBox.innerHTML = `
        <i class="fa-solid fa-circle-check me-2"></i>
        <strong>Thank you!</strong> Your submission has been received. Our team at Allentis Pharmaceuticals will respond within 24 hours.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

      form.appendChild(alertBox);
      form.reset();
      form.classList.remove('was-validated');
    });
  });
}

/* ==========================================
   11. PCD Pharma Franchise Investment Calculator
   ========================================== */
function initFranchiseCalculator() {
  const rangeInput = document.getElementById('franchiseInvestmentRange');
  const investmentVal = document.getElementById('investmentValueDisplay');
  const returnEstVal = document.getElementById('returnEstDisplay');

  if (!rangeInput || !investmentVal) return;

  rangeInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    investmentVal.textContent = '₹ ' + val.toLocaleString('en-IN');
    
    // Estimated ROI calculation (Approx 35-45% margin)
    const estReturn = Math.round(val * 1.4);
    if (returnEstVal) {
      returnEstVal.textContent = '₹ ' + estReturn.toLocaleString('en-IN');
    }
  });
}

/* ==========================================
   12. Product Catalogue Download Simulation
   ========================================== */
function initCatalogueDownload() {
  const downloadBtns = document.querySelectorAll('.btn-download-catalogue');

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const userEmail = prompt('Please enter your email address to receive the Allentis Product Catalogue 2026:');
      if (userEmail && userEmail.includes('@')) {
        alert(`Success! The complete WHO-GMP Product Catalogue has been dispatched to ${userEmail}. Downloading sample brochure...`);
        
        // Trigger synthetic text file download as PDF placeholder brochure
        const blob = new Blob([
          `ALLENTIS PHARMACEUTICALS PVT. LTD.\nOfficial Product Catalogue 2026\nWHO-GMP & ISO 9001:2015 Certified\n\nFeatured Categories:\n1. Tablets & Capsules (Antibiotics, Analgesics, Cardiac, Diabetes)\n2. Liquid Syrups & Suspensions\n3. Sterile Injectables & Infusions\n4. Topicals, Ointments & Creams\n5. Eye/Ear Drops & Pediatric Specialties\n6. Nutraceuticals & Herbal Formulations\n\nContact Us: info@allentispharma.com | +91 22 8890 1234\nWebsite: www.allentispharma.com`
        ], { type: 'text/plain' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Allentis_Pharmaceuticals_Product_Catalogue_2026.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (userEmail !== null) {
        alert('Please provide a valid email address.');
      }
    });
  });
}
