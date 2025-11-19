document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");

  // ===== Collapsible Dropdown Menu =====
const dropdownToggles = document.querySelectorAll(".menu-item.dropdown-toggle");
dropdownToggles.forEach((toggle) => {
  const submenu = toggle.nextElementSibling;
  if (!submenu || !submenu.classList.contains("submenu")) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle.classList.toggle("open");   // para sa arrow rotation
    submenu.classList.toggle("show");  // para sa smooth slide
  });
});
  // ===== ARROW =====
const menuItems = document.querySelectorAll('.dropdown-toggle');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    // toggle "active" class sa clicked menu item lang
    item.classList.toggle('active');
  });
});


  // ===== Notification Button =====
  const notificationBtn = document.querySelector(".notification-btn");
  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      alert("You have 3 new notifications");
      // TODO: Show notification panel/dropdown
    });
  }

  // ===== Profile Button =====
  const profileBtn = document.querySelector(".profile-btn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "/Frontend/HTML/profile.html";
    });
  }

  // ===== Set Active Menu Item Based on URL =====
  const currentPage = window.location.pathname;
  const menuLinks = document.querySelectorAll(".menu-item[href], .submenu-item[href]");

  menuLinks.forEach((link) => {
    if (currentPage.includes(link.getAttribute("href"))) {
      link.classList.add("active");

      const parent = link.closest(".submenu");
      if (parent) {
        parent.classList.add("show");
        const toggle = parent.previousElementSibling;
        if (toggle && toggle.classList.contains("dropdown-toggle")) {
          toggle.classList.add("open");
        }
      }
    }
  });

  // ===== Logout confirmation popup =====
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutPopup = document.getElementById("logoutPopup");
  const confirmBtn = logoutPopup ? logoutPopup.querySelector(".confirm-logout") : null;
  const cancelBtn = logoutPopup ? logoutPopup.querySelector(".cancel-logout") : null;

  function openLogoutPopup() {
    if (!logoutPopup) return;
    logoutPopup.classList.add("show");
    logoutPopup.setAttribute("aria-hidden", "false");
    if (cancelBtn) cancelBtn.focus();
  }

  function closeLogoutPopup() {
    if (!logoutPopup) return;
    logoutPopup.classList.remove("show");
    logoutPopup.setAttribute("aria-hidden", "true");
  }

  function performSmoothLogout() {
    if (!confirmBtn) return;

    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
    confirmBtn.disabled = true;

    if (cancelBtn) cancelBtn.disabled = true;

    const dashboard = document.querySelector(".dashboard-container");
    if (dashboard) dashboard.style.opacity = "0";

    setTimeout(() => {
      window.location.href = "/Frontend/HTML/logIn.html";
    }, 200);
  }

  if (logoutBtn) logoutBtn.addEventListener("click", (e) => { e.preventDefault(); openLogoutPopup(); });
  if (confirmBtn) confirmBtn.addEventListener("click", performSmoothLogout);
  if (cancelBtn) cancelBtn.addEventListener("click", closeLogoutPopup);

  // Close popup on overlay click or ESC
  document.addEventListener("click", (e) => {
    if (!logoutPopup) return;
    if (logoutPopup.classList.contains("show") && e.target === logoutPopup) closeLogoutPopup();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLogoutPopup(); });
});
