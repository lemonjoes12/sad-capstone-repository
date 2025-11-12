// ===== Toggle Password Visibility =====
function togglePassword(id, icon) {
  const input = document.getElementById(id);
  const isHidden = input.type === "password";

  // toggle input type
  input.type = isHidden ? "text" : "password";

  // update icon image
  icon.src = isHidden 
    ? "/Frontend/IMAGES/hide.png"   // kapag nag-show
    : "/Frontend/IMAGES/view.png";  // kapag nag-hide
}

// ===== Success Popup Functions =====
function openSuccessPopup() {
  const popup = document.getElementById('successPopup');
  if (!popup) return;
  popup.classList.add('show');
  popup.setAttribute('aria-hidden', 'false');
  const btn = popup.querySelector('.success-btn');
  if (btn) btn.focus();
}

function closeSuccessPopup() {
  const popup = document.getElementById('successPopup');
  if (!popup) return;
  popup.classList.remove('show');
  popup.setAttribute('aria-hidden', 'true');
}

function goToLogin() {
  // Close popup and redirect to login
  closeSuccessPopup();
  window.location.href = '/Frontend/HTML/logIn.html';
}

// ===== Verification Code - Numbers Only =====
document.addEventListener('DOMContentLoaded', () => {
  const verificationInput = document.getElementById('verification');
  
  // Allow only numbers on input
  if (verificationInput) {
    verificationInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }

  // Close popup on overlay click or ESC
  const popup = document.getElementById('successPopup');
  
  if (popup) {
    document.addEventListener('click', (e) => {
      if (popup.classList.contains('show') && e.target === popup) {
        closeSuccessPopup();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('show')) {
        closeSuccessPopup();
      }
    });
  }

  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const verification = document.getElementById('verification').value;
      const newPass = document.getElementById('newpass').value;
      const confirmPass = document.getElementById('confirmpass').value;
      
      // Basic validation
      if (!verification || !newPass || !confirmPass) {
        alert('Please fill in all fields');
        return;
      }
      
      if (verification.length !== 6) {
        alert('Verification code must be 6 digits');
        return;
      }
      
      if (newPass !== confirmPass) {
        alert('Passwords do not match');
        return;
      }
      
      // TODO: Send to backend for verification and password reset
      console.log('Password reset form submitted', {
        verification,
        newPass
      });
      
      // Show success popup instead of alert
      openSuccessPopup();
    });
  }
});
