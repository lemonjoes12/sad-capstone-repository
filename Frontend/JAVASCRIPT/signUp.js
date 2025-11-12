function previewImage(event) {
  const input = event.target;
  const preview = document.getElementById('previewImg');
  const uploadBox = document.getElementById('uploadBox');

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result; // set preview image source
      preview.style.display = 'block'; // show image
      uploadBox.classList.add('uploaded'); // hide upload icon
    }
    reader.readAsDataURL(input.files[0]);
  }
}




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
  
// ===== Popup Functions (based on logIn.js) =====
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

// Event listeners for popup close
document.addEventListener('DOMContentLoaded', () => {
  // Close button inside popup
  const closeBtn = document.getElementById('closePopup');
  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }

  // Close on overlay/background click
  document.addEventListener('click', (e) => {
    const popup = document.getElementById('successPopup');
    if (!popup) return;
    if (popup.classList.contains('show') && e.target === popup) {
      closePopup();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePopup();
    }
  });

  // Wire form submit to show popup (optional: add validation first)
  const form = document.getElementById('signupForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // prevent actual submission
      // TODO: Add form validation and backend call here
      openSuccessPopup();
    });
  }
});




