document.getElementById('forgotForm').addEventListener('submit', function(event) {
  event.preventDefault(); // prevent reload

  const email = document.getElementById('email').value.trim();
  const continueBtn = document.getElementById('continueBtn');
  const loadingMessage = document.getElementById('loadingMessage');

  if (!email) {
    alert('Please enter your email.');
    return;
  }

  // Disable button & show animation
  continueBtn.disabled = true;
  continueBtn.style.opacity = '0.6';
  continueBtn.textContent = 'Sending...';
  loadingMessage.style.display = 'block';

  // Send request to server to check email
  axios.post(
    "http://localhost:8080/api/auth/forgotPassword",
    { email },
    { withCredentials: true }
  )
  .then((response) => {
    console.log("✅ Forgot Password success:", response.data);

    // If server confirms email exists, redirect
    if (response.data.exists) {  // assume your API sends { exists: true/false }
      window.location.href = 'resetPassword.html';
    } else {
      alert('Email not found in our system, please check and try again.');
      continueBtn.disabled = false;
      continueBtn.style.opacity = '1';
      continueBtn.textContent = 'Continue';
      loadingMessage.style.display = 'none';
    }
  })
  .catch((error) => {
    console.error("❌ Forgot Password error:", error);
    alert('Something went wrong. Please try again.');
    continueBtn.disabled = false;
    continueBtn.style.opacity = '1';
    continueBtn.textContent = 'Continue';
    loadingMessage.style.display = 'none';
  });
});
