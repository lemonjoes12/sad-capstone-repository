document.addEventListener("DOMContentLoaded", () => {
  // Ensure popups are hidden on page load
  const successPopup = document.getElementById("successPopup");
  const logoutPopup = document.getElementById("logoutPopup");
  
  if (successPopup) successPopup.classList.remove("show");
  if (logoutPopup) logoutPopup.classList.remove("show");

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

  // ===== PASSWORD CHANGE FUNCTIONALITY =====
  // ===== Toggle password visibility =====
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", function() {
      const input = this.previousElementSibling;
      if (input.type === "password") {
        input.type = "text";
        this.src = "/Frontend/IMAGES/hide.png";
      } else {
        input.type = "password";
        this.src = "/Frontend/IMAGES/view.png";
      }
    });
  });

  // ===== Form Elements =====
  const form = document.getElementById("changePasswordForm");
  const oldPassword = document.getElementById("oldPassword");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const oldPasswordError = document.getElementById("oldPasswordError");
  const newPasswordError = document.getElementById("newPasswordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  const cancelBtn = document.getElementById("cancelBtn");
  const successCloseBtn = document.getElementById("successCloseBtn");

  // ===== Validate password change =====
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset previous errors
      oldPasswordError.textContent = "";
      newPasswordError.textContent = "";
      confirmPasswordError.textContent = "";

      // Check Old Password
      if (oldPassword.value.trim() === "") {
        oldPasswordError.textContent = "Please enter your old password.";
        isValid = false;
      } else if (oldPassword.value.length < 6) {
        oldPasswordError.textContent = "Old password must be at least 6 characters.";
        isValid = false;
      }

      // Check New Password
      if (newPassword.value.trim() === "") {
        newPasswordError.textContent = "Please enter a new password.";
        isValid = false;
      } else if (newPassword.value.length < 6) {
        newPasswordError.textContent = "Password must be at least 6 characters.";
        isValid = false;
      }

      // Check if new password is same as old password
      if (newPassword.value === oldPassword.value) {
        newPasswordError.textContent = "New password must be different from old password.";
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
        if (successPopup) {
          successPopup.classList.add("show");
        } else {
          alert("Password changed successfully!");
          window.location.href = "/Frontend/HTML/profile.html";
        }
      }
    });
  }

  // ===== Real-time validation =====
  if (oldPassword) {
    oldPassword.addEventListener("input", () => {
      if (oldPassword.value.trim() !== "") {
        oldPasswordError.textContent = "";
      }
    });
  }

  if (newPassword) {
    newPassword.addEventListener("input", () => {
      if (newPassword.value.trim() !== "") {
        newPasswordError.textContent = "";
        
        // Clear confirm password error if new password changes
        if (confirmPassword.value !== "" && newPassword.value === confirmPassword.value) {
          confirmPasswordError.textContent = "";
        }
      }
    });
  }

  if (confirmPassword) {
    confirmPassword.addEventListener("input", () => {
      if (confirmPassword.value.trim() !== "") {
        confirmPasswordError.textContent = "";
      }
    });
  }

  // ===== Close success popup =====
  if (successCloseBtn) {
    successCloseBtn.addEventListener("click", () => {
      if (successPopup) {
        successPopup.classList.remove("show");
      }
      if (form) {
        form.reset();
      }

      // Reset eye icons
      document.querySelectorAll(".toggle-password").forEach((icon) => {
        const input = icon.previousElementSibling;
        input.type = "password";
        icon.src = "/Frontend/IMAGES/view.png";
      });

      // Redirect to profile page
      window.location.href = "/Frontend/HTML/profile.html";
    });
  }

  // ===== Cancel button functionality =====
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "/Frontend/HTML/profile.html";
    });
  }

  // ===== Close popups when clicking outside =====
  document.addEventListener("click", (e) => {
    if (logoutPopup && e.target === logoutPopup) {
      logoutPopup.classList.remove("show");
    }
    if (successPopup && e.target === successPopup) {
      successPopup.classList.remove("show");
    }
  });

  // ===== Close popups with ESC key =====
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (logoutPopup) logoutPopup.classList.remove("show");
      if (successPopup) successPopup.classList.remove("show");
    }
  });
});