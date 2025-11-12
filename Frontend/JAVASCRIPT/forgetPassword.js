// ===== Forgot Password Form Logic =====
document.getElementById('forgotForm').addEventListener('submit', function(event) {
  event.preventDefault(); // prevent reload

  const email = document.getElementById('email').value.trim();
  const continueBtn = document.getElementById('continueBtn');
  const loadingMessage = document.getElementById('loadingMessage');

  if (email) {
    // Disable button & show animation
    continueBtn.disabled = true;
    continueBtn.style.opacity = '0.6';
    continueBtn.textContent = 'Sending...';
    loadingMessage.style.display = 'block';

    // Simulate sending email for 2.5 seconds
    setTimeout(() => {
      // Redirect to resetPassword.html
      window.location.href = 'resetPassword.html';
    }, 2500);
  } else {
    alert('Please enter your email.');
  }
});
