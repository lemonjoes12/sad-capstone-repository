// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Close menu when a menu item is clicked (on mobile)
  const menuItems = document.querySelectorAll('.menu-item:not(.dropdown-toggle)');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
      }
    });
  });

  // Close menu when clicking outside (on mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });

  // ===== Collapsible Dropdown Menu (support multiple) =====
  const dropdownToggles = document.querySelectorAll('.menu-item.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    // next sibling is expected to be the submenu
    const submenu = toggle.nextElementSibling;
    if (!submenu || !submenu.classList.contains('submenu')) return;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle.classList.toggle('open');
      submenu.classList.toggle('show');
    });
  });

  // ===== Notification Button =====
  const notificationBtn = document.querySelector('.notification-btn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      alert('You have 3 new notifications');
      // TODO: Show notification panel/dropdown
    });
  }

  // ===== Profile Button =====
  const profileBtn = document.querySelector('.profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = '/Frontend/HTML/profile.html';
    });
  }

  // ===== Set Active Menu Item Based on URL =====
  const currentPage = window.location.pathname;
  const menuLinks = document.querySelectorAll('.menu-item[href], .submenu-item[href]');
  
  menuLinks.forEach(link => {
    if (currentPage.includes(link.getAttribute('href'))) {
      link.classList.add('active');
      // If submenu item, also open parent submenu
      const parent = link.closest('.submenu');
      if (parent) {
        parent.classList.add('show');
        const toggle = parent.previousElementSibling;
        if (toggle && toggle.classList.contains('dropdown-toggle')) {
          toggle.classList.add('open');
        }
      }
    }
  });

});
  document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutPopup = document.getElementById('logoutPopup');
  const confirmBtn = logoutPopup ? logoutPopup.querySelector('.confirm-logout') : null;
  const cancelBtn = logoutPopup ? logoutPopup.querySelector('.cancel-logout') : null;

  function openLogoutPopup() {
    if (!logoutPopup) return;
    logoutPopup.classList.add('show');
    logoutPopup.setAttribute('aria-hidden', 'false');
    if (cancelBtn) cancelBtn.focus();
  }

  function closeLogoutPopup() {
    if (!logoutPopup) return;
    logoutPopup.classList.remove('show');
    logoutPopup.setAttribute('aria-hidden', 'true');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openLogoutPopup();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      window.location.href = '/Frontend/HTML/logIn.html';
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      closeLogoutPopup();
    });
  }

  // Close when clicking outside popup
  logoutPopup.addEventListener('click', (e) => {
    if (e.target === logoutPopup) closeLogoutPopup();
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLogoutPopup();
  });
});
