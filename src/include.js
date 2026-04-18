// 1. Set initial theme immediately to prevent "flash"
(function() {
    const isDark = localStorage.getItem('theme') === 'dark' || 
                  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
})();

async function loadComponent(url, targetId) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const container = document.getElementById(targetId);
        if (container) {
            container.innerHTML = html;
            // Initialize JS logic only AFTER the HTML is injected
            if (targetId === 'navbar') initNavbar();
        }
    } catch (err) {
        console.error(`Failed to load ${url}:`, err);
    }
}

function initNavbar() {
    const desktopBtn = document.getElementById('darkModeToggleDesktop');
    const mobileBtn = document.getElementById('darkModeToggleMobile');
    const html = document.documentElement;

    // --- DARK MODE LOGIC ---
    function updateIcons(isDark) {
        document.querySelectorAll('.theme-icon-sun').forEach(s => s.classList.toggle('hidden', !isDark));
        document.querySelectorAll('.theme-icon-moon').forEach(m => m.classList.toggle('hidden', isDark));
    }

    function toggleDarkMode() {
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcons(isDark);
    }

    // Sync icons with current state on load
    updateIcons(html.classList.contains('dark'));

    desktopBtn?.addEventListener('click', toggleDarkMode);
    mobileBtn?.addEventListener('click', toggleDarkMode);

    // --- MOBILE MENU LOGIC ---
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (!btn || !menu) return;

    function toggleMenu() {
        const isHidden = menu.classList.toggle('hidden');
        btn.setAttribute('aria-expanded', !isHidden);
        menuIcon?.classList.toggle('hidden', !isHidden);
        closeIcon?.classList.toggle('hidden', isHidden);
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close on link click or outside click
    document.addEventListener('click', (e) => {
        if (!menu.classList.contains('hidden') && !menu.contains(e.target) && !btn.contains(e.target)) {
            toggleMenu();
        }
    });

    // Reset on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            menuIcon?.classList.remove('hidden');
            closeIcon?.classList.add('hidden');
        }
    });
}

// 4. Load components
loadComponent('/src/components/navbar.html', 'navbar');
fetch('/src/components/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data)
    .catch(err => console.error('Footer error:', err));

    const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px" // Triggers slightly before the element is fully in view
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Optional: stop observing once shown to improve performance
      // observer.unobserve(entry.target); 
    }
  });
}, observerOptions);

// Apply to all elements you want to animate
document.querySelectorAll('.reveal-new').forEach((el) => observer.observe(el));