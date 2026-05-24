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
    // Check if there's a hash in the URL
    const hash = window.location.hash.slice(1); // Remove #
    const initialCategory = hash || 'chinese';

    // Show/hide sections based on initial category or hash
    sections.forEach(section => {
      section.style.display = section.dataset.category === initialCategory ? 'block' : 'none';
    });

    // Highlight the correct button based on initial category
    buttons.forEach(btn => {
      const btnCategory = btn.dataset.categoryTab || btn.textContent.trim().toLowerCase().replace(/\s+/g, '');
      if (btnCategory === initialCategory) {
        btn.classList.remove('bg-surface-container-highest', 'text-on-surface', 'hover:bg-surface-bright');
        btn.classList.add('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
      } else {
        btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
        btn.classList.add('bg-surface-container-highest', 'text-on-surface', 'hover:bg-surface-bright');
      }
    });

    buttons.forEach(button => {
      button.addEventListener('click', async function () {
        const category = this.dataset.categoryTab || this.textContent.trim().toLowerCase().replace(/\s+/g, '');

        sections.forEach(section => {
          if (section.dataset.category === category) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });

        buttons.forEach(btn => {
          if (btn === this) {
            btn.classList.remove('bg-surface-container-highest', 'text-on-surface', 'hover:bg-surface-bright');
            btn.classList.add('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
          } else {
            btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/20');
            btn.classList.add('bg-surface-container-highest', 'text-on-surface', 'hover:bg-surface-bright');
          }
        });
      });
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

  // Mobile navigation drawer toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');

  if (mobileMenuBtn && mobileMenuOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuOverlay.classList.remove('translate-x-full');
      mobileMenuOverlay.classList.add('translate-x-0');
      document.body.classList.add('overflow-hidden');
    });
  }

  if (mobileMenuCloseBtn && mobileMenuOverlay) {
    mobileMenuCloseBtn.addEventListener('click', () => {
      mobileMenuOverlay.classList.remove('translate-x-0');
      mobileMenuOverlay.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');
    });
  }

  if (mobileMenuOverlay) {
    const overlayLinks = mobileMenuOverlay.querySelectorAll('a');
    overlayLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('translate-x-0');
        mobileMenuOverlay.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
      });
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
          section.style.display = section.dataset.category === activeCategory ? 'block' : 'none';
          
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
    modalDiv.innerHTML = initialContent;
    document.body.appendChild(modalDiv);

    const modal = document.getElementById('feedback-modal');
    const modalContent = modal.querySelector('div');
    
    function openModal() {
      modal.innerHTML = initialContent;
      attachInitialListeners();
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
});
