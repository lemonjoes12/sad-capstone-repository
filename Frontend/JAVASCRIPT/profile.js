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

// Edit Profile Functionality
// Edit Profile Functionality
document.addEventListener('DOMContentLoaded', function() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileOverlay = document.getElementById('editProfileOverlay');
    const cancelEdit = document.getElementById('cancelEdit');
    const editProfileForm = document.getElementById('editProfileForm');
    const successPopup = document.getElementById('successPopup'); // ADD THIS
    const successDoneBtn = document.getElementById('successDoneBtn'); // ADD THIS
    
    const fullnameInput = document.getElementById('Fullname');
    const emailInput = document.getElementById('email');
    const idnumberInput = document.getElementById('idnumber');
    
    const editFullname = document.getElementById('editFullname');
    const editEmail = document.getElementById('editEmail');
    const editIdNumber = document.getElementById('editIdNumber');

    // Open edit profile
    editProfileBtn.addEventListener('click', function() {
        // Populate edit form with current values (empty for now)
        editFullname.value = fullnameInput.value;
        editEmail.value = emailInput.value;
        editIdNumber.value = idnumberInput.value;
        
        // Show edit overlay
        editProfileOverlay.classList.add('active');
    });

    // Close edit profile
    function closeEditOverlay() {
        editProfileOverlay.classList.remove('active');
    }

    // Close success popup
    function closeSuccessPopup() {
        successPopup.classList.remove('show');
    }

    // Close with cancel button ONLY
    cancelEdit.addEventListener('click', closeEditOverlay);

    // Close success popup when Done button is clicked
    successDoneBtn.addEventListener('click', closeSuccessPopup);

    // Real-time validation for ID Number - numbers only
    editIdNumber.addEventListener('input', function(e) {
        // Remove any non-digit characters
        this.value = this.value.replace(/[^\d]/g, '');
    });

    // Handle form submission
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form first
        if (!validateForm()) {
            return; // Stop if validation fails
        }
        
        // Update the profile values
        fullnameInput.value = editFullname.value;
        emailInput.value = editEmail.value;
        idnumberInput.value = editIdNumber.value;
        
        // Close the edit overlay
        closeEditOverlay();
        
        // Show success popup instead of alert
        setTimeout(() => {
            successPopup.classList.add('show');
        }, 300);
    });

    // Form validation function
    function validateForm() {
        const fullname = editFullname.value.trim();
        const email = editEmail.value.trim();
        const idNumber = editIdNumber.value.trim();

        // Fullname validation
        if (!fullname) {
            alert('Please enter your fullname');
            editFullname.focus();
            return false;
        }

        // Email validation
        if (!email) {
            alert('Please enter your email');
            editEmail.focus();
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            editEmail.focus();
            return false;
        }

        // ID Number validation - numbers only
        if (!idNumber) {
            alert('Please enter your ID number');
            editIdNumber.focus();
            return false;
        }

        // Check if ID number contains only digits
        const numberRegex = /^\d+$/;
        if (!numberRegex.test(idNumber)) {
            alert('ID number must contain numbers only');
            editIdNumber.focus();
            return false;
        }

        return true; // All validations passed
    }
});

