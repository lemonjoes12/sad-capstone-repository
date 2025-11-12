// Toggle password visibility
function togglePassword(fieldId, imgElement) {
  const field = document.getElementById(fieldId);

  if (field.type === 'password') {
    field.type = 'text';
    imgElement.src = '../IMAGES/hide.png';
    field.classList.remove('masked');
  } else {
    field.type = 'password';
    imgElement.src = '../IMAGES/view.png';
    field.classList.add('masked');
  }
}

// Show success popup
function showSuccessPopup() {
  const popup = document.getElementById('successPopup');
  popup.classList.add('show');
}

// Close success popup
function closeSuccessPopup() {
  const popup = document.getElementById('successPopup');
  popup.classList.remove('show');
  
  // Redirect to profile page after closing
  setTimeout(() => {
    window.location.href = 'profile.html';
  }, 300);
}

// Handle form submission
document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Validate passwords match
  if (newPassword !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  // Validate password length
  if (newPassword.length < 6) {
    alert('Password must be at least 6 characters long!');
    return;
  }
  
  // Here you would typically send the password change request to your backend
  // For now, we'll just show the success popup
  console.log('Password change request:', {
    newPassword: newPassword,
    confirmPassword: confirmPassword
  });
  
  // Show success popup
  showSuccessPopup();
  
  // Reset form
  this.reset();
});

// Close popup when clicking outside of it
document.addEventListener('click', function(event) {
  const popup = document.getElementById('successPopup');
  const popupContent = document.querySelector('.popup-content');
  
  if (event.target === popup) {
    closeSuccessPopup();
  }
});

// Prevent closing popup when clicking inside the content
document.querySelector('.popup-content').addEventListener('click', function(event) {
  event.stopPropagation();
});

// Handle sidebar menu toggle for mobile
document.querySelector('.menu-toggle').addEventListener('click', function() {
  document.querySelector('.sidebar').classList.toggle('active');
});

// Close sidebar when clicking on a menu item
document.querySelectorAll('.menu-item, .submenu-item').forEach(item => {
  item.addEventListener('click', function() {
    if (window.innerWidth <= 768) {
      document.querySelector('.sidebar').classList.remove('active');
    }
  });
});

// Toggle dropdown function
function toggleDropdown(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const toggle = event ? event.currentTarget : this;
  const submenu = toggle.nextElementSibling;
  
  if (!submenu || !submenu.classList.contains('submenu')) {
    return;
  }
  
  const isOpen = toggle.classList.contains('open');
  
  // Toggle current dropdown (allow multiple dropdowns to be open)
  if (isOpen) {
    toggle.classList.remove('open');
    submenu.classList.remove('show');
  } else {
    toggle.classList.add('open');
    submenu.classList.add('show');
  }
}

// Initialize dropdown menus
document.addEventListener('DOMContentLoaded', function() {
  const dropdownToggles = document.querySelectorAll('.menu-item.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown.call(this, e);
    });
  });
  
  // Also handle clicks on submenu items to close dropdown
  document.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', function(e) {
      const submenu = this.closest('.submenu');
      if (submenu) {
        const toggle = submenu.previousElementSibling;
        if (toggle && toggle.classList.contains('menu-item')) {
          toggle.classList.remove('open');
          submenu.classList.remove('show');
        }
      }
    });
  });
});
