// ===== Profile Page Interactions =====

document.addEventListener('DOMContentLoaded', () => {
  // ===== Mobile Menu Toggle =====
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

  // ===== Logout Popup =====
  const logoutBtn = document.getElementById('logoutBtn');
  const logoutPopup = document.getElementById('logoutPopup');
  const confirmLogout = document.querySelector('.confirm-logout');
  const cancelLogout = document.querySelector('.cancel-logout');
  const popupOverlay = document.querySelector('.popup');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (logoutPopup) {
        logoutPopup.classList.add('show');
      }
    });
  }

  if (confirmLogout) {
    confirmLogout.addEventListener('click', function () {
      window.location.href = '/Frontend/HTML/logIn.html';
    });
  }

  if (cancelLogout) {
    cancelLogout.addEventListener('click', function () {
      if (logoutPopup) {
        logoutPopup.classList.remove('show');
      }
    });
  }

  // Close popup on ESC or overlay click
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && logoutPopup && logoutPopup.classList.contains('show')) {
      logoutPopup.classList.remove('show');
    }
  });

  if (popupOverlay) {
    popupOverlay.addEventListener('click', function (e) {
      if (e.target === this && logoutPopup && logoutPopup.classList.contains('show')) {
        logoutPopup.classList.remove('show');
      }
    });
  }

  // ===== Edit Profile Button =====
  const editProfileBtn = document.getElementById('editProfileBtn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function () {
      alert('Edit Profile feature coming soon!');
    });
  }

  // ===== Change Password Button =====
  const changePassBtn = document.getElementById('changePassBtn');
  if (changePassBtn) {
    changePassBtn.addEventListener('click', function () {
      window.location.href = '/Frontend/HTML/resetPassword.html';
    });
  }

  // ===== Profile Button (Top Right) =====
  const profileBtn = document.querySelector('.profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', function () {
      // Already on profile page, show notification or do nothing
      console.log('Already on profile page');
    });
  }

  // ===== Notification Bell =====
  const notificationBtn = document.querySelector('.notification-btn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', function () {
      alert('Notifications coming soon!');
    });
  }
});
