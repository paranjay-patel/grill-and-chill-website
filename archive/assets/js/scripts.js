document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('[data-category-tab]');
  const sections = document.querySelectorAll('section[data-category]');
  const navButtons = document.querySelectorAll('[data-nav-target]');

  navButtons.forEach(button => {
    button.addEventListener('click', function () {
      const target = this.dataset.navTarget;
      if (target) {
        window.location.href = target;
      }
    });
  });

  if (buttons.length && sections.length) {
    // Add transition classes initially to all sections
    sections.forEach(section => {
      section.classList.add('transition-all', 'duration-300', 'ease-in-out', 'transform');
    });

    let isTransitioning = false;

    function setActiveCategory(category) {
      if (isTransitioning) return;
      
      const activeSection = Array.from(sections).find(s => s.style.display === 'block');
      const targetSection = Array.from(sections).find(s => s.dataset.category === category);
      
      // Update button styling immediately
      buttons.forEach(btn => {
        const btnCategory = btn.dataset.categoryTab || btn.textContent.trim().toLowerCase().replace(/\s+/g, ' ');
        if (btnCategory === category) {
          btn.classList.remove('bg-surface-container-highest', 'text-on-surface', 'hover:bg-surface-bright');
          btn.classList.add('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
        } else {
          btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
          btn.classList.add('bg-surface-container-highest', 'text-on-surface', 'hover:bg-surface-bright');
        }
      });

      if (activeSection && activeSection !== targetSection) {
        isTransitioning = true;
        // Fade out currently active section
        activeSection.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
        activeSection.classList.add('opacity-0', 'scale-95', 'translate-y-2');
        
        setTimeout(() => {
          activeSection.style.display = 'none';
          
          if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
            targetSection.classList.add('opacity-0', 'scale-95', 'translate-y-2');
            
            // Force browser reflow to register new styles before transition starts
            targetSection.offsetHeight;
            
            targetSection.classList.remove('opacity-0', 'scale-95', 'translate-y-2');
            targetSection.classList.add('opacity-100', 'scale-100', 'translate-y-0');
          }
          isTransitioning = false;
        }, 150); // wait for fade-out half duration
      } else {
        // Initial setup on page load
        sections.forEach(sec => {
          if (sec === targetSection) {
            sec.style.display = 'block';
            sec.classList.remove('opacity-0', 'scale-95', 'translate-y-2');
            sec.classList.add('opacity-100', 'scale-100', 'translate-y-0');
          } else {
            sec.style.display = 'none';
            sec.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
            sec.classList.add('opacity-0', 'scale-95', 'translate-y-2');
          }
        });
      }
    }

    // Set initial category from hash or default to 'chinese'
    const initialHash = window.location.hash.slice(1);
    const initialCategory = initialHash || 'chinese';
    setActiveCategory(initialCategory);

    buttons.forEach(button => {
      button.addEventListener('click', function () {
        if (isTransitioning) return;
        const category = this.dataset.categoryTab || this.textContent.trim().toLowerCase().replace(/\s+/g, ' ');
        window.location.hash = category;
      });
    });

    // Listen to hashchange for SPA routing and external link clicks
    window.addEventListener('hashchange', function () {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const hasMatch = Array.from(sections).some(section => section.dataset.category === hash);
        if (hasMatch) {
          // Clear search bar and reset items if a category tab is selected
          const searchInput = document.getElementById('menu-search-input');
          if (searchInput && searchInput.value !== '') {
            searchInput.value = '';
            // Reset categories / search visibility
            sections.forEach(sec => {
              sec.querySelectorAll('.group, li, .flex').forEach(item => item.style.display = '');
              sec.querySelectorAll('section, .grid, .lg\\:col-span-1, .lg\\:col-span-2, .p-8').forEach(sub => sub.style.display = '');
            });
            document.querySelectorAll('[data-category-tab]').forEach(btn => {
              btn.style.opacity = '1';
              btn.style.pointerEvents = 'auto';
            });
          }
          setActiveCategory(hash);
        }
      }
    });
  }

  function highlightActiveNavbarLink() {
    const navLinks = document.querySelectorAll('nav a[href], #mobile-menu-overlay a[href]');
    if (!navLinks.length) return;

    let currentPath = location.pathname.toLowerCase();
    if (currentPath === '/' || currentPath === '') {
      currentPath = '/index';
    }
    if (currentPath.endsWith('.html')) {
      currentPath = currentPath.slice(0, -5);
    }
    if (currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }

    navLinks.forEach(link => {
      let href = link.getAttribute('href')?.split('#')[0].toLowerCase() || '';
      if (href.endsWith('.html')) {
        href = href.slice(0, -5);
      }
      const cleanHref = href.replace(/^(\.\/|\/)/, '');
      const cleanPath = currentPath.replace(/^\//, '');

      if (cleanHref === cleanPath) {
        link.classList.remove('text-[#FFB3AC]/80');
        link.classList.add('active-nav-link');
      } else {
        link.classList.remove('active-nav-link');
        link.classList.add('text-[#FFB3AC]/80');
      }
    });
  }

  highlightActiveNavbarLink();

  // Mobile navigation drawer toggle with full accessibility (a11y)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');

  if (mobileMenuBtn && mobileMenuOverlay) {
    // Dynamic initialization of ARIA attributes for cleaner markup and portability
    mobileMenuBtn.setAttribute('aria-haspopup', 'dialog');
    mobileMenuBtn.setAttribute('aria-controls', 'mobile-menu-overlay');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');

    mobileMenuOverlay.setAttribute('role', 'dialog');
    mobileMenuOverlay.setAttribute('aria-modal', 'true');
    mobileMenuOverlay.setAttribute('aria-label', 'Mobile Navigation');
    mobileMenuOverlay.setAttribute('aria-hidden', 'true');

    // Keep track of the active element before menu was opened to restore focus later
    let previousActiveElement;

    function openMobileMenu() {
      previousActiveElement = document.activeElement;
      mobileMenuOverlay.classList.remove('translate-x-full');
      mobileMenuOverlay.classList.add('translate-x-0');
      document.body.classList.add('overflow-hidden');

      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileMenuOverlay.setAttribute('aria-hidden', 'false');

      // Shift focus inside the drawer after it transitions in
      setTimeout(() => {
        if (mobileMenuCloseBtn) {
          mobileMenuCloseBtn.focus();
        }
      }, 100);
    }

    function closeMobileMenu() {
      mobileMenuOverlay.classList.remove('translate-x-0');
      mobileMenuOverlay.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');

      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuOverlay.setAttribute('aria-hidden', 'true');

      // Restore focus
      if (previousActiveElement) {
        previousActiveElement.focus();
      } else {
        mobileMenuBtn.focus();
      }
    }

    mobileMenuBtn.addEventListener('click', openMobileMenu);

    if (mobileMenuCloseBtn) {
      mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
    }

    // Close on link clicks
    const overlayLinks = mobileMenuOverlay.querySelectorAll('a');
    overlayLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Keyboard navigation: Escape key to close & focus trapping (keyboard trap)
    mobileMenuOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      } else if (e.key === 'Tab') {
        const focusables = mobileMenuOverlay.querySelectorAll('a, button');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    });

    // Clicking outside the drawer content closes the menu
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });
  }

  // --- NEW FEATURE 1: MENU DIETARY INDICATORS (VEG vs NON-VEG DOTS) ---
  function addDietaryIndicators() {
    const sections = document.querySelectorAll('section[data-category]');
    if (!sections.length) return;

    sections.forEach(section => {
      const category = section.dataset.category;
      const isChicken = category === 'chicken';

      // Find all elements containing prices & identify corresponding name elements
      const items = section.querySelectorAll('.group, li, .flex');
      items.forEach(item => {
        const children = Array.from(item.children);
        let priceElement = null;
        let nameElement = null;

        children.forEach(child => {
          const txt = child.textContent.trim();
          if (/^\d+\s*\/\-\s*$/.test(txt) || /^₹\s*\d+$/.test(txt)) {
            priceElement = child;
          }
        });

        if (priceElement) {
          children.forEach(child => {
            if (child === priceElement) return;
            if (['H3', 'H4', 'SPAN'].includes(child.tagName)) {
              nameElement = child;
            } else if (child.tagName === 'DIV' && child.querySelector('h4, h3, span')) {
              nameElement = child.querySelector('h4, h3, span');
            }
          });

          if (nameElement) {
            if (!nameElement.querySelector('.dietary-dot')) {
              const border = isChicken ? 'border-red-600' : 'border-green-600';
              const dotBg = isChicken ? 'bg-red-600' : 'bg-green-600';
              
              const indicator = document.createElement('span');
              indicator.className = `dietary-dot inline-flex items-center justify-center w-3 h-3 border ${border} rounded-sm p-[1px] mr-1.5 flex-shrink-0 align-middle`;
              indicator.style.verticalAlign = 'middle';
              indicator.style.transform = 'translateY(-1px)';
              indicator.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${dotBg}"></span>`;
              
              nameElement.insertBefore(indicator, nameElement.firstChild);
            }
          }
        }
      });
    });
  }

  addDietaryIndicators();

  // --- NEW FEATURE 2: REAL-TIME MENU SEARCH ---
  function setupMenuSearch() {
    const searchInput = document.getElementById('menu-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const sections = document.querySelectorAll('section[data-category]');
      
      if (query === '') {
        // Restore category tab visibility and target tab selection
        const activeTab = document.querySelector('[data-category-tab].bg-primary');
        const activeCategory = activeTab ? activeTab.dataset.categoryTab : 'chinese';
        
        sections.forEach(section => {
          if (section.dataset.category === activeCategory) {
            section.style.display = 'block';
            section.classList.remove('opacity-0', 'scale-95', 'translate-y-2');
            section.classList.add('opacity-100', 'scale-100', 'translate-y-0');
          } else {
            section.style.display = 'none';
            section.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
            section.classList.add('opacity-0', 'scale-95', 'translate-y-2');
          }
          
          // Show all items & containers
          section.querySelectorAll('.group, li, .flex').forEach(item => {
            item.style.display = '';
          });
          section.querySelectorAll('section, .grid, .lg\\:col-span-1, .lg\\:col-span-2, .p-8').forEach(sub => {
            sub.style.display = '';
          });
        });
        
        document.querySelectorAll('[data-category-tab]').forEach(btn => {
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        });
        return;
      }

      // Hide/disable category buttons while searching to highlight global search
      document.querySelectorAll('[data-category-tab]').forEach(btn => {
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
      });

      sections.forEach(section => {
        let sectionHasMatches = false;
        
        // Find sub-layout wrappers
        const subContainers = section.querySelectorAll('section, .grid, .lg\\:col-span-1, .lg\\:col-span-2, .p-8');
        
        subContainers.forEach(sub => {
          const items = sub.querySelectorAll('.group, li, .flex');
          let subHasMatches = false;
          let hasFoodItems = false;
          
          items.forEach(item => {
            const children = Array.from(item.children);
            const hasPrice = children.some(child => {
              const txt = child.textContent.trim();
              return /^\d+\s*\/\-\s*$/.test(txt) || /^₹\s*\d+$/.test(txt);
            });
            
            if (!hasPrice) return;
            hasFoodItems = true;

            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
              item.style.setProperty('display', '', '');
              subHasMatches = true;
              sectionHasMatches = true;
            } else {
              item.style.setProperty('display', 'none', 'important');
            }
          });

          if (hasFoodItems) {
            if (subHasMatches) {
              sub.style.setProperty('display', '', '');
            } else {
              sub.style.setProperty('display', 'none', 'important');
            }
          }
        });

        if (sectionHasMatches) {
          section.style.setProperty('display', 'block', '');
          section.classList.remove('opacity-0', 'scale-95', 'translate-y-2');
          section.classList.add('opacity-100', 'scale-100', 'translate-y-0');
        } else {
          section.style.setProperty('display', 'none', 'important');
        }
      });
    });
  }

  setupMenuSearch();

  // --- NEW FEATURE 3: INTERACTIVE BOOKING MODAL (WHATSAPP LEAD GEN) ---
  function setupBookingModal() {
    const isCateringPage = window.location.pathname.toLowerCase().includes('catering');
    const isTiffinPage = window.location.pathname.toLowerCase().includes('tiffin');
    if (!isCateringPage && !isTiffinPage) return;

    // Create Modal element and append to DOM
    const modalDiv = document.createElement('div');
    modalDiv.id = 'booking-modal';
    modalDiv.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300';
    modalDiv.style.display = 'none'; // Prevent flash of unstyled content before Tailwind CDN loads
    modalDiv.innerHTML = `
      <div class="bg-[#2a0506] border border-primary/20 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl relative transform scale-95 transition-all duration-300">
        <button id="close-booking-modal" class="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors" aria-label="Close">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
        
        <h3 id="modal-package-title" class="font-headline text-2xl font-black text-secondary-fixed uppercase tracking-tight mb-2">Configure Package</h3>
        <p class="text-xs text-on-surface-variant font-label uppercase tracking-widest mb-6">Grill & Chill Service Inquiry</p>
        
        <form id="booking-form" class="space-y-4">
          <input type="hidden" id="modal-package-name" value="" />
          
          <div id="guest-count-group">
            <label class="block text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1.5">Number of Guests / Plates</label>
            <input type="number" id="guest-count" min="20" max="1000" placeholder="e.g. 50 (Min. 20)" 
              class="w-full px-4 py-2.5 bg-[#310002] border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary text-sm" required />
          </div>
          
          <div id="duration-group" style="display: none;">
            <label class="block text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1.5">Subscription Duration</label>
            <select id="tiffin-duration" class="w-full px-4 py-2.5 bg-[#310002] border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary text-sm">
              <option value="1 Week">1 Week Trial</option>
              <option value="1 Month">1 Month Subscription</option>
              <option value="Custom Duration">Custom Period</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1.5">Preference</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="flex items-center justify-center gap-2 py-2 px-3 bg-[#310002] border border-primary/20 rounded-lg cursor-pointer hover:bg-[#420003] transition-colors">
                <input type="radio" name="diet-pref" value="Veg" checked class="text-primary focus:ring-0 bg-transparent border-primary/40" />
                <span class="text-sm font-body text-white">Pure Veg</span>
              </label>
              <label class="flex items-center justify-center gap-2 py-2 px-3 bg-[#310002] border border-primary/20 rounded-lg cursor-pointer hover:bg-[#420003] transition-colors">
                <input type="radio" name="diet-pref" value="Mix (Veg & Non-Veg)" class="text-primary focus:ring-0 bg-transparent border-primary/40" />
                <span class="text-sm font-body text-white">Mix / Non-Veg</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1.5">Preferred Event / Start Date</label>
            <input type="date" id="booking-date" 
              class="w-full px-4 py-2.5 bg-[#310002] border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary text-sm" required />
          </div>

          <div>
            <label class="block text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1.5">Delivery Location (Surat)</label>
            <select id="booking-location" class="w-full px-4 py-2.5 bg-[#310002] border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary text-sm">
              <option value="Vesu">Vesu</option>
              <option value="Piplod">Piplod</option>
              <option value="Adajan">Adajan</option>
              <option value="Magdalla">Magdalla</option>
              <option value="Dumas">Dumas</option>
              <option value="Other Area">Other (Specify in Chat)</option>
            </select>
          </div>

          <button type="submit" class="w-full py-3 mt-4 bg-primary hover:bg-secondary-fixed text-on-primary hover:text-on-secondary-fixed font-headline font-extrabold uppercase tracking-widest text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-primary/25">
            <span class="material-symbols-outlined text-lg">chat</span> Send to WhatsApp
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(modalDiv);

    const modal = document.getElementById('booking-modal');
    const modalContent = modal.querySelector('div');
    const closeBtn = document.getElementById('close-booking-modal');
    const form = document.getElementById('booking-form');
    const packageTitle = document.getElementById('modal-package-title');
    const packageNameHidden = document.getElementById('modal-package-name');
    
    const guestGroup = document.getElementById('guest-count-group');
    const durationGroup = document.getElementById('duration-group');

    // Date prefill (tomorrow)
    const dateInput = document.getElementById('booking-date');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];

    function openModal(packageName) {
      packageNameHidden.value = packageName;
      packageTitle.textContent = packageName;

      if (isTiffinPage) {
        guestGroup.style.display = 'none';
        document.getElementById('guest-count').removeAttribute('required');
        durationGroup.style.display = 'block';
        
        const tiffinDurationSelect = document.getElementById('tiffin-duration');
        if (packageName.toLowerCase().includes('weekly')) {
          tiffinDurationSelect.value = '1 Week';
        } else if (packageName.toLowerCase().includes('monthly')) {
          tiffinDurationSelect.value = '1 Month';
        } else {
          tiffinDurationSelect.value = 'Custom Duration';
        }
      } else {
        guestGroup.style.display = 'block';
        document.getElementById('guest-count').setAttribute('required', 'required');
        durationGroup.style.display = 'none';
      }

      modal.style.display = 'flex';
      // Force layout reflow
      modal.offsetHeight;

      modal.classList.remove('opacity-0', 'pointer-events-none');
      modalContent.classList.remove('scale-95');
      modalContent.classList.add('scale-100');
      document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
      modal.classList.add('opacity-0', 'pointer-events-none');
      modalContent.classList.remove('scale-100');
      modalContent.classList.add('scale-95');
      document.body.classList.remove('overflow-hidden');

      setTimeout(() => {
        if (modal.classList.contains('opacity-0')) {
          modal.style.display = 'none';
        }
      }, 300);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    let buttons = [];
    if (isCateringPage) {
      buttons = Array.from(document.querySelectorAll('button')).filter(btn => {
        const text = btn.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
        return text.includes('select basic') || text.includes('book standard') || text.includes('select premium');
      });

      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const text = btn.textContent.replace(/\s+/g, ' ').trim();
          let pkg = "Catering: Standard Package";
          if (text.toLowerCase().includes('basic')) pkg = "Catering: Basic Package";
          if (text.toLowerCase().includes('premium')) pkg = "Catering: Premium Package";
          openModal(pkg);
        });
      });
    } else if (isTiffinPage) {
      buttons = Array.from(document.querySelectorAll('button')).filter(btn => {
        const text = btn.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
        return text.includes('start trial') || text.includes('subscribe now') || text.includes('contact sales') || text.includes('order now');
      });

      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const text = btn.textContent.replace(/\s+/g, ' ').trim();
          let pkg = "Tiffin: Monthly Subscription";
          if (text.toLowerCase().includes('trial') || text.toLowerCase().includes('week')) pkg = "Tiffin: Weekly Trial";
          if (text.toLowerCase().includes('sales') || text.toLowerCase().includes('corporate')) pkg = "Tiffin: Corporate Plan";
          if (text.toLowerCase().includes('order now')) pkg = "Tiffin: Plan Inquiry";
          openModal(pkg);
        });
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const pkg = packageNameHidden.value;
      const diet = form.elements['diet-pref'].value;
      const date = document.getElementById('booking-date').value;
      const loc = document.getElementById('booking-location').value;
      
      let detailLine = "";
      if (isTiffinPage) {
        const dur = document.getElementById('tiffin-duration').value;
        detailLine = `Duration: ${dur}`;
      } else {
        const count = document.getElementById('guest-count').value;
        detailLine = `Estimated Guests: ${count}`;
      }

      const msg = `Hi Grill & Chill, I would like to make an inquiry:
• Package: ${pkg}
• Diet Preference: ${diet}
• Date: ${date}
• Location: ${loc}
• ${detailLine}

Please confirm availability. Thanks!`;

      const phoneDigits = (typeof RESTAURANT !== 'undefined' && RESTAURANT.phone) ? RESTAURANT.phone.replace(/\D/g, '') : '918980356776';
      const waLink = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}`;
      
      window.open(waLink, '_blank', 'noopener,noreferrer');
      closeModal();
    });
  }

  setupBookingModal();

  // --- NEW FEATURE 4: LIVE STATUS INDICATOR ---
  function setupLiveStatusIndicator() {
    const timingSpans = document.querySelectorAll('[data-restaurant-text="timings"]');
    if (!timingSpans.length) return;

    const openHour = 11;
    const closeHour = 23;

    function checkStatus() {
      let now;
      try {
        const istString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        now = new Date(istString);
      } catch (e) {
        now = new Date();
      }

      const currentHour = now.getHours();
      const isOpen = currentHour >= openHour && currentHour < closeHour;

      timingSpans.forEach(span => {
        let indicator = span.nextElementSibling;
        if (!indicator || !indicator.classList.contains('live-status')) {
          indicator = document.createElement('span');
          indicator.className = 'live-status';
          span.parentNode.insertBefore(indicator, span.nextSibling);
        }

        if (isOpen) {
          indicator.className = 'live-status inline-flex items-center gap-1.5 ml-2 font-headline text-[9px] md:text-[10px] tracking-wider font-extrabold uppercase text-green-400 align-middle';
          indicator.innerHTML = `
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Open Now
          `;
        } else {
          indicator.className = 'live-status inline-flex items-center gap-1.5 ml-2 font-headline text-[9px] md:text-[10px] tracking-wider font-extrabold uppercase text-on-surface-variant/60 align-middle';
          indicator.innerHTML = `
            <span class="relative flex h-2 w-2">
              <span class="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
            </span>
            Closed
          `;
        }
      });
    }

    checkStatus();
    setInterval(checkStatus, 30000);
  }

  setupLiveStatusIndicator();

  // --- NEW FEATURE 5: GOOGLE REVIEW & WHATSAPP FEEDBACK DIALOG ---
  function setupFeedbackModal() {
    const triggerBtn = document.getElementById('feedback-trigger-btn');
    if (!triggerBtn) return;

    const initialContent = `
      <div class="bg-[#2a0506] border border-primary/20 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl relative transform scale-95 transition-all duration-300">
        <button id="close-feedback-modal" class="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors" aria-label="Close">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
        
        <h3 class="font-headline text-2xl font-black text-secondary-fixed uppercase tracking-tight mb-2">Share Your Experience</h3>
        <p class="text-xs text-on-surface-variant font-label uppercase tracking-widest mb-6">Your feedback shapes our hearth</p>
        
        <div class="space-y-4">
          <!-- Option 1: Public Google Review -->
          <a href="https://www.google.com/maps/place/Grill+%26+Chill/@21.146208,72.759325,14z/data=!4m6!3m5!1s0x3be0527f87e48501:0xcce1104d05e07735!8m2!3d21.146208!4d72.759325!16s%2Fg%2F11c6t0k6d4?entry=ttu" 
             target="_blank" rel="noopener noreferrer" id="google-review-link"
             class="flex items-center gap-4 p-5 bg-[#310002] border border-primary/20 rounded-xl hover:border-brand-gold/40 hover:bg-[#420003] transition-all group">
            <div class="w-12 h-12 rounded-full bg-secondary-fixed/10 flex items-center justify-center text-secondary-fixed group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-2xl">star_rate</span>
            </div>
            <div class="flex-grow">
              <h4 class="font-headline text-sm font-bold text-white uppercase tracking-wider mb-1">Review on Google</h4>
              <p class="text-xs text-on-surface-variant font-body">Help others discover our Punjabi & Chinese flavors.</p>
            </div>
            <span class="material-symbols-outlined text-brand-gold/60 group-hover:text-brand-gold transition-colors">arrow_forward</span>
          </a>

          <!-- Option 2: Private WhatsApp Feedback -->
          <button id="whatsapp-feedback-trigger"
             class="w-full flex items-center text-left gap-4 p-5 bg-[#310002] border border-primary/20 rounded-xl hover:border-green-500/40 hover:bg-[#420003] transition-all group">
            <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-2xl">chat</span>
            </div>
            <div class="flex-grow">
              <h4 class="font-headline text-sm font-bold text-white uppercase tracking-wider mb-1">Private Feedback</h4>
              <p class="text-xs text-on-surface-variant font-body">Share suggestions or issues directly with our team.</p>
            </div>
            <span class="material-symbols-outlined text-green-500/60 group-hover:text-green-500 transition-colors">arrow_forward</span>
          </button>
        </div>
      </div>
    `;

    // Create Modal Element
    const modalDiv = document.createElement('div');
    modalDiv.id = 'feedback-modal';
    modalDiv.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300';
    modalDiv.style.display = 'none'; // Prevent flash of unstyled content before Tailwind CDN loads
    modalDiv.innerHTML = initialContent;
    document.body.appendChild(modalDiv);

    const modal = document.getElementById('feedback-modal');
    const modalContent = modal.querySelector('div');
    
    function openModal() {
      modal.innerHTML = initialContent;
      attachInitialListeners();

      modal.style.display = 'flex';
      // Force layout reflow
      modal.offsetHeight;

      modal.classList.remove('opacity-0', 'pointer-events-none');
      const currentModalContent = modal.querySelector('div');
      if (currentModalContent) {
        currentModalContent.classList.remove('scale-95');
        currentModalContent.classList.add('scale-100');
      }
      document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
      modal.classList.add('opacity-0', 'pointer-events-none');
      const currentModalContent = modal.querySelector('div');
      if (currentModalContent) {
        currentModalContent.classList.remove('scale-100');
        currentModalContent.classList.add('scale-95');
      }
      document.body.classList.remove('overflow-hidden');

      setTimeout(() => {
        if (modal.classList.contains('opacity-0')) {
          modal.style.display = 'none';
        }
      }, 300);
    }

    function attachInitialListeners() {
      const closeBtn = modal.querySelector('#close-feedback-modal');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      const googleLink = modal.querySelector('#google-review-link');
      if (googleLink) googleLink.addEventListener('click', closeModal);

      const waTrigger = modal.querySelector('#whatsapp-feedback-trigger');
      if (waTrigger) {
        waTrigger.addEventListener('click', () => {
          modal.innerHTML = `
            <div class="bg-[#2a0506] border border-primary/20 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl relative transform scale-100 transition-all duration-300">
              <button id="back-feedback-modal" class="absolute top-4 left-4 text-on-surface-variant hover:text-white transition-colors" aria-label="Back">
                <span class="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              <button id="close-feedback-modal" class="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors" aria-label="Close">
                <span class="material-symbols-outlined text-2xl">close</span>
              </button>
              
              <h3 class="font-headline text-2xl font-black text-secondary-fixed uppercase tracking-tight mb-2">Private Feedback</h3>
              <p class="text-xs text-on-surface-variant font-label uppercase tracking-widest mb-6">Send your thoughts directly to us</p>
              
              <form id="private-feedback-form" class="space-y-4">
                <div>
                  <label class="block text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1.5">Your Name</label>
                  <input type="text" id="feedback-name" placeholder="e.g. Rahul Patel" 
                    class="w-full px-4 py-2.5 bg-[#310002] border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary text-sm" required />
                </div>
                <div>
                  <label class="block text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1.5">Your Message</label>
                  <textarea id="feedback-message" rows="4" placeholder="How was the food, service, or delivery? Let us know!" 
                    class="w-full px-4 py-2.5 bg-[#310002] border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary text-sm resize-none" required></textarea>
                </div>
                <button type="submit" class="w-full py-3 mt-4 bg-primary hover:bg-secondary-fixed text-on-primary hover:text-on-secondary-fixed font-headline font-extrabold uppercase tracking-widest text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-primary/25">
                  <span class="material-symbols-outlined text-lg">send</span> Submit via WhatsApp
                </button>
              </form>
            </div>
          `;

          const backBtn = modal.querySelector('#back-feedback-modal');
          if (backBtn) backBtn.addEventListener('click', openModal);

          const closeFormBtn = modal.querySelector('#close-feedback-modal');
          if (closeFormBtn) closeFormBtn.addEventListener('click', closeModal);

          const form = modal.querySelector('#private-feedback-form');
          if (form) {
            form.addEventListener('submit', (e) => {
              e.preventDefault();
              const name = modal.querySelector('#feedback-name').value;
              const message = modal.querySelector('#feedback-message').value;

              const msg = `Hi Grill & Chill, I'd like to share some private feedback:
• Name: ${name}
• Message: ${message}`;

              const phoneDigits = (typeof RESTAURANT !== 'undefined' && RESTAURANT.phone) ? RESTAURANT.phone.replace(/\D/g, '') : '918980356776';
              const waLink = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}`;
              
              window.open(waLink, '_blank', 'noopener,noreferrer');
              closeModal();
            });
          }
        });
      }
    }

    triggerBtn.addEventListener('click', openModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  setupFeedbackModal();

  // --- NEW FEATURE 6: FLOATING BACK TO TOP BUTTON WITH SCROLL PROGRESS RING ---
  function setupBackToTopButton() {
    const btnHtml = `
      <button id="back-to-top" style="display: none;" class="fixed right-6 bottom-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#2a0506]/95 border border-primary/10 text-primary shadow-2xl backdrop-blur-md opacity-0 translate-y-4 pointer-events-none transition-all duration-300 hover:scale-110 hover:text-white group" aria-label="Back to top">
        <!-- Circular Progress Ring -->
        <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle class="text-primary/10" stroke="currentColor" stroke-width="3" fill="transparent" r="21" cx="24" cy="24"></circle>
          <circle id="scroll-progress-ring" class="text-primary transition-all duration-75" stroke="currentColor" stroke-width="3" stroke-dasharray="132" stroke-dashoffset="132" stroke-linecap="round" fill="transparent" r="21" cx="24" cy="24"></circle>
        </svg>
        <!-- Icon -->
        <span class="material-symbols-outlined text-xl relative z-10 transition-transform group-hover:-translate-y-0.5">arrow_upward</span>
      </button>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = btnHtml;
    const btn = tempDiv.firstElementChild;
    document.body.appendChild(btn);

    const progressRing = btn.querySelector('#scroll-progress-ring');
    const circumference = 132; // 2 * PI * r (21)

    function updateScrollProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Calculate scroll ratio (0 to 1)
      const scrollRatio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      
      // Calculate stroke-dashoffset
      const offset = circumference - (scrollRatio * circumference);
      progressRing.style.strokeDashoffset = offset;

      // Show/hide button based on scroll position
      if (scrollTop > 300) {
        if (btn.style.display === 'none') {
          btn.style.display = 'flex';
          // Force layout reflow
          btn.offsetHeight;
        }
        btn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        btn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
      } else {
        btn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        btn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
        setTimeout(() => {
          if (btn.classList.contains('opacity-0')) {
            btn.style.display = 'none';
          }
        }, 300);
      }
    }

    // Scroll to top on click
    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', updateScrollProgress);
    // Initial call
    updateScrollProgress();
  }

  // --- NEW FEATURE 7: FLOATING WHATSAPP CHAT WIDGET ---
  function setupWhatsAppWidget() {
    if (document.getElementById('whatsapp-widget')) return;

    const phoneDigits = (typeof RESTAURANT !== 'undefined' && RESTAURANT.phone) ? RESTAURANT.phone.replace(/\D/g, '') : '918980356776';
    const waLink = `https://wa.me/${phoneDigits}?text=${encodeURIComponent('Hi Grill & Chill, I have an inquiry about ordering food / services.')}`;

    const widgetHtml = `
      <div id="whatsapp-widget" class="fixed left-6 bottom-6 z-50 font-body">
        <!-- Popup Chat Window -->
        <div id="whatsapp-chat-popup" style="display: none;" class="absolute bottom-16 left-0 w-80 max-w-[calc(100vw-3rem)] bg-[#2a0506] border border-primary/20 rounded-2xl shadow-2xl overflow-hidden transform scale-95 opacity-0 pointer-events-none transition-all duration-300 origin-bottom-left">
          <!-- Header -->
          <div class="bg-[#310002] border-b border-primary/10 p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="relative w-10 h-10 rounded-full border border-primary/20 overflow-hidden bg-background flex-shrink-0">
                <img src="assets/images/favicon.png" alt="Grill & Chill Logo" class="w-full h-full object-contain" />
                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#310002] animate-pulse"></span>
              </div>
              <div>
                <h4 class="font-headline text-sm font-bold text-white uppercase tracking-wider leading-none mb-1">Grill &amp; Chill</h4>
                <p class="text-[10px] text-green-400 font-label uppercase tracking-widest leading-none">Online • Replies in mins</p>
              </div>
            </div>
            <button id="close-whatsapp-chat" class="text-on-surface-variant hover:text-white transition-colors" aria-label="Close chat">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <!-- Body -->
          <div class="p-4 bg-[#200001] space-y-4">
            <div class="flex gap-2">
              <div class="bg-[#310002] border border-primary/10 rounded-2xl rounded-tl-none p-3.5 max-w-[85%] text-xs text-on-surface-variant leading-relaxed shadow-inner">
                Hey! 👋 Ready to order some fresh Punjabi mains, wok-fired Chinese, or inquiring about Catering / Tiffin services?
              </div>
            </div>
          </div>
          <!-- Footer -->
          <div class="p-4 bg-[#2a0506] border-t border-primary/10">
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" id="whatsapp-chat-submit" class="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-headline font-extrabold uppercase tracking-widest text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
              </svg>
              Start Chat
            </a>
          </div>
        </div>
        <!-- Floating Bubble Trigger -->
        <button id="whatsapp-widget-trigger" class="flex items-center justify-center w-12 h-12 rounded-full bg-green-600 border border-green-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-green-500 relative" aria-label="Open WhatsApp chat popup">
          <!-- Notification dot -->
          <span id="whatsapp-widget-badge" class="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-green-600 flex items-center justify-center font-label text-[8px] font-black text-white animate-bounce">1</span>
          <!-- SVG Icon -->
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
          </svg>
        </button>
      </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = widgetHtml;
    const widget = tempDiv.firstElementChild;
    document.body.appendChild(widget);

    const trigger = widget.querySelector('#whatsapp-widget-trigger');
    const popup = widget.querySelector('#whatsapp-chat-popup');
    const closeBtn = widget.querySelector('#close-whatsapp-chat');
    const badge = widget.querySelector('#whatsapp-widget-badge');
    const submitBtn = widget.querySelector('#whatsapp-chat-submit');

    let isOpen = false;

    function openChat() {
      isOpen = true;
      popup.style.display = 'block';
      // Force layout reflow
      popup.offsetHeight;

      popup.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
      popup.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
      if (badge) {
        badge.style.display = 'none';
      }
    }

    function closeChat() {
      isOpen = false;
      popup.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
      popup.classList.add('opacity-0', 'pointer-events-none', 'scale-95');

      setTimeout(() => {
        if (!isOpen && popup.classList.contains('opacity-0')) {
          popup.style.display = 'none';
        }
      }, 300);
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isOpen) {
        closeChat();
      } else {
        openChat();
      }
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeChat();
    });

    document.addEventListener('click', (e) => {
      if (isOpen && !widget.contains(e.target)) {
        closeChat();
      }
    });

    submitBtn.addEventListener('click', () => {
      closeChat();
    });
  }

  setupWhatsAppWidget();

  setupBackToTopButton();
});
