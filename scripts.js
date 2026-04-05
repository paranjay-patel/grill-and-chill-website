document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.sticky button');
  const sections = document.querySelectorAll('section[data-category]');

  if (!buttons.length || !sections.length) {
    return;
  }

  sections.forEach(section => {
    section.style.display = section.dataset.category === 'chinese' ? 'block' : 'none';
  });

  buttons.forEach(button => {
    button.addEventListener('click', async function () {
      const category = this.textContent.trim().toLowerCase().replace(/\s+/g, '');

      if (category === 'panjabi') {
        try {
          const response = await fetch('panjabi.html');
          if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const mainContent = doc.querySelector('main')?.innerHTML;
            const panjabiSection = document.querySelector('section[data-category="panjabi"]');
            if (mainContent && panjabiSection) {
              panjabiSection.innerHTML = mainContent;
            }
          }
        } catch (e) {
          console.error('Failed to load dynamically, using static content', e);
        }
      }

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
});
