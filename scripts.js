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
    const navLinks = document.querySelectorAll('nav a[href]');
    if (!navLinks.length) return;

    const currentPage = location.pathname.split('/').pop() || 'home.html';
    const normalizedPage = currentPage === '' ? 'home.html' : currentPage;

    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.split('#')[0] || '';
      const linkPage = href.split('/').pop() || '';

      if (linkPage === normalizedPage) {
        // Active state: full opacity and darker color
        link.classList.remove('text-[#FFB3AC]/80');
        link.classList.add('active-nav-link');
      } else {
        // Inactive state: reduced opacity
        link.classList.remove('active-nav-link');
        link.classList.add('text-[#FFB3AC]/80');
      }
    });
  }

  highlightActiveNavbarLink();
});
