// =====================
// Image Preview
// =====================
function previewImage(event) {
  const input = event.target;
  const preview = document.getElementById('previewImg');
  const uploadBox = document.getElementById('uploadBox');

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      uploadBox.classList.add('uploaded');
    }
    reader.readAsDataURL(input.files[0]);
  }
}

// =====================
// Toggle Password
// =====================
function togglePassword(id, icon) {
  const input = document.getElementById(id);
  const isHidden = input.type === "password";

  input.type = isHidden ? "text" : "password";
  icon.src = isHidden 
    ? "/Frontend/IMAGES/hide.png"
    : "/Frontend/IMAGES/view.png";
}

// =====================
// Popup
// =====================
function openSuccessPopup() {
  const popup = document.getElementById('successPopup');
  if (!popup) return;
  popup.classList.add('show');
  popup.setAttribute('aria-hidden', 'false');

  const btn = popup.querySelector('.success-btn');
  if (btn) btn.focus();
}

function closePopup() {
  const popup = document.getElementById('successPopup');
  if (!popup) return;
  popup.classList.remove('show');
  popup.setAttribute('aria-hidden', 'true');
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closePopup');
  if (closeBtn) closeBtn.addEventListener('click', closePopup);

  document.addEventListener('click', (e) => {
    const popup = document.getElementById('successPopup');
    if (popup && popup.classList.contains('show') && e.target === popup) closePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });

  // =====================
  // FORM SUBMIT WITH AXIOS
  // =====================
  const form = document.getElementById('signupForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const adminRequest = {
        adminName: form.querySelector('input[placeholder="Full name"]').value,
        adminId: form.querySelector('input[placeholder="ID number"]').value,
        email: form.querySelector('input[placeholder="Email"]').value,
        password: form.querySelector('#password').value
      };

      // Confirm password validation
      const confirmPass = document.getElementById("confirmPassword").value;
      if (adminRequest.password !== confirmPass) {
        alert("Passwords do not match.");
        return;
      }

      try {
          await axios.post(
          "http://localhost:8080/api/auth/signup",
          adminRequest,
          { withCredentials: true }
        );

        openSuccessPopup();

      } catch (err) {
        console.error(err);
        
        if (err.response && err.response.data) {
          alert("Signup failed: " + err.response.data);
        } else {
          alert("Server error. Check if Spring Boot is running.");
        }
      }
    });
  }
});
