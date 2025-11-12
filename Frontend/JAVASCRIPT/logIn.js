
// ...existing code...
// Toggle password visibility and manage .filled class for floating labels
const eyeSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const eyeOffSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a25.37 25.37 0 0 1 5.94-6.94"/><path d="M1 1l22 22"/></svg>';

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.eye');
  if (!btn) return;
  const field = btn.closest('.field');
  if (!field) return;
  const input = field.querySelector('input');
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Hide password');
    btn.innerHTML = eyeOffSvg;
  } else {
    input.type = 'password';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Show password');
    btn.innerHTML = eyeSvg;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.field input').forEach(input => {
    const field = input.closest('.field');
    if (!field) return;
    const update = () => {
      if (input.value && input.value.trim() !== '') field.classList.add('filled');
      else field.classList.remove('filled');
    };
    // set initial icon state (if eye button exists)
    const btn = field.querySelector('.eye');
    if (btn) {
      btn.innerHTML = (input.type === 'password') ? eyeSvg : eyeOffSvg;
      btn.setAttribute('aria-label', (input.type === 'password') ? 'Show password' : 'Hide password');
      btn.setAttribute('aria-pressed', 'false');
    }
    update();
    input.addEventListener('input', update);
    input.addEventListener('blur', update);
  });
});

function openSuccessPopup() {
  const p = document.getElementById('successPopup');
  if (!p) return;
  p.classList.add('show');
  p.setAttribute('aria-hidden', 'false');
  const btn = p.querySelector('.success-btn');
  if (btn) btn.focus();
}

function closePopup() {
  const p = document.getElementById('successPopup');
  if (!p) return;
  p.classList.remove('show');
  p.setAttribute('aria-hidden', 'true');
}

function goToHome() {
  // Close the popup and navigate to the dashboard/home page
  try { closePopup(); } catch (e) { /* ignore */ }
  // use absolute path consistent with other links in the project
  window.location.href = '/Frontend/HTML/homePage.html';
}

/* optional: close on overlay click or Esc */
document.addEventListener('click', (e) => {
  const p = document.getElementById('successPopup');
  if (!p) return;
  if (p.classList.contains('show') && e.target === p) closePopup();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});
