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

//UPLOAD PHOTO FUNCTIONALITY
{
    const profilePhoto = document.getElementById('profilePhoto');
    const profileAvatarCircle = document.getElementById('profileAvatarCircle');
    const profileAvatarImage = document.getElementById('profileAvatarImage');
    const defaultCircle = document.querySelector('.default-circle');

    // Click on circle to upload photo
    profileAvatarCircle.addEventListener('click', function() {
        profilePhoto.click();
    });

    // When photo is selected, automatically show it
    profilePhoto.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Hide default icon and show the uploaded photo
                defaultCircle.style.display = 'none';
                profileAvatarImage.src = e.target.result;
                profileAvatarImage.style.display = 'block';
            }
            
            reader.readAsDataURL(file);
        }
    });
}

// Edit Profile Functionality
document.addEventListener('DOMContentLoaded', function() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileOverlay = document.getElementById('editProfileOverlay');
    const cancelEdit = document.getElementById('cancelEdit');
    const editProfileForm = document.getElementById('editProfileForm');
    
    // Form elements
    const editPhoto = document.getElementById('editPhoto');
    const editFullname = document.getElementById('editFullname');
    const editIdNumber = document.getElementById('editIdNumber');
    const previewImage = document.getElementById('previewImage');
    const defaultAvatar = document.querySelector('.default-avatar');

    // Open edit profile
    editProfileBtn.addEventListener('click', function() {
        // Clear previous values
        editFullname.value = '';
        editIdNumber.value = '';
        editPhoto.value = '';
        previewImage.style.display = 'none';
        defaultAvatar.style.display = 'flex';
        
        // Show edit overlay
        editProfileOverlay.classList.add('active');
    });

    // Close edit profile
    function closeEditOverlay() {
        editProfileOverlay.classList.remove('active');
    }

    // Close with cancel button
    cancelEdit.addEventListener('click', closeEditOverlay);

    // Photo preview functionality - Circular
    editPhoto.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Hide default avatar and show preview image
                defaultAvatar.style.display = 'none';
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            }
            
            reader.readAsDataURL(file);
        }
    });

    // Form validation function - UPDATED: Allow letters, symbols, and numbers
    function validateForm() {
        const fullname = editFullname.value.trim();
        const idNumber = editIdNumber.value.trim();

        // Fullname validation
        if (!fullname) {
            alert('Please enter your fullname');
            editFullname.focus();
            return false;
        }

        // ID Number validation - ANY CHARACTERS ALLOWED (letters, symbols, numbers)
        if (!idNumber) {
            alert('Please enter your ID number');
            editIdNumber.focus();
            return false;
        }

        return true; // All validations passed
    }

    // Form submission
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            return; // Stop if validation fails
        }

        // Close edit overlay
        closeEditOverlay();
        
        // Show success message
        alert('Profile updated successfully!');
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEditOverlay();
        }
    });
});