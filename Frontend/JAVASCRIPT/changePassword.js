document.addEventListener("DOMContentLoaded", () => {
  // Ensure popups are hidden on page load
  const successPopup = document.getElementById("successPopup");
  const logoutPopup = document.getElementById("logoutPopup");
  
  if (successPopup) successPopup.classList.remove("show");
  if (logoutPopup) logoutPopup.classList.remove("show");

  // Rest of your existing JavaScript code...
  const form = document.querySelector(".change-password-form");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const cancelBtn = document.getElementById("cancelBtn");

  const newPasswordError = document.getElementById("newPasswordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  const successCloseBtn = document.getElementById("successCloseBtn");

  // ===== LOGOUT FUNCTIONALITY =====
  const logoutBtn = document.getElementById("logoutBtn");
  const confirmLogoutBtn = logoutPopup ? logoutPopup.querySelector(".confirm-logout") : null;
  const cancelLogoutBtn = logoutPopup ? logoutPopup.querySelector(".cancel-logout") : null;

  // Open logout popup
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (logoutPopup) {
        logoutPopup.classList.add("show");
      }
    });
  }

  // Close logout popup
  if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener("click", () => {
      if (logoutPopup) {
        logoutPopup.classList.remove("show");
      }
    });
  }

  // Confirm logout
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", () => {
      // Perform logout action
      window.location.href = "/Frontend/HTML/logIn.html";
    });
  }

  // Close popup when clicking outside
  document.addEventListener("click", (e) => {
    if (logoutPopup && e.target === logoutPopup) {
      logoutPopup.classList.remove("show");
    }
    if (successPopup && e.target === successPopup) {
      successPopup.classList.remove("show");
    }
  });

  // Close popup with ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (logoutPopup) logoutPopup.classList.remove("show");
      if (successPopup) successPopup.classList.remove("show");
    }
  });

  // ===== Toggle password visibility =====
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = icon.previousElementSibling;
      if (input.type === "password") {
        input.type = "text";
        icon.src = "/Frontend/IMAGES/hide.png";
      } else {
        input.type = "password";
        icon.src = "/Frontend/IMAGES/view.png";
      }
    });
  });

  // ===== Validate password change =====
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset previous errors
    newPasswordError.textContent = "";
    confirmPasswordError.textContent = "";

    // Check New Password
    if (newPassword.value.trim() === "") {
      newPasswordError.textContent = "Please enter a new password.";
      isValid = false;
    } else if (newPassword.value.length < 6) {
      newPasswordError.textContent = "Password must be at least 6 characters.";
      isValid = false;
    }

    // Check Confirm Password
    if (confirmPassword.value.trim() === "") {
      confirmPasswordError.textContent = "Please confirm your new password.";
      isValid = false;
    } else if (newPassword.value !== confirmPassword.value) {
      confirmPasswordError.textContent = "Passwords do not match.";
      isValid = false;
    }

    // If all valid, show success
    if (isValid) {
      successPopup.classList.add("show");
    }
  });

  // ===== Real-time validation =====
  newPassword.addEventListener("input", () => {
    if (newPassword.value.trim() !== "") {
      newPasswordError.textContent = "";
    }
  });

  confirmPassword.addEventListener("input", () => {
    if (confirmPassword.value.trim() !== "") {
      confirmPasswordError.textContent = "";
    }
  });

// ===== Close success popup =====
successCloseBtn.addEventListener("click", () => {
  successPopup.classList.remove("show");
  form.reset();

  // Reset eye icons
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    const input = icon.previousElementSibling;
    input.type = "password";
    icon.src = "/Frontend/IMAGES/view.png";
  });

  // Redirect to profile page
  window.location.href = "/Frontend/HTML/profile.html";
});
});

// ===== Cancel button functionality =====
cancelBtn.addEventListener("click", () => {
  window.location.href = "/Frontend/HTML/profile.html";
});
