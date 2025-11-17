// =====================
// Eye toggle icons
// =====================
const eyeSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const eyeOffSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a25.37 25.37 0 0 1 5.94-6.94"/><path d="M1 1l22 22"/></svg>';

// =====================
// Toggle password visibility
// =====================
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".eye");
  if (!btn) return;
  const input = btn.previousElementSibling;
  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    btn.innerHTML = eyeOffSvg;
    btn.setAttribute("aria-label", "Hide password");
  } else {
    input.type = "password";
    btn.innerHTML = eyeSvg;
    btn.setAttribute("aria-label", "Show password");
  }
});


// =====================
// Floating label animation
// =====================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".field input").forEach((input) => {
    const field = input.closest(".field");
    if (!field) return;

    const update = () => {
      if (input.value.trim() !== "") field.classList.add("filled");
      else field.classList.remove("filled");
    };

    const btn = field.querySelector(".eye");
    if (btn) btn.innerHTML = eyeSvg;

    update();
    input.addEventListener("input", update);
    input.addEventListener("blur", update);
  });
});

// =====================
// Login button click
// =====================
document.getElementById("loginBtn").addEventListener("click", (e) => {
  e.preventDefault();
  loginUser();
});

// =====================
// Login function (AXIOS VERSION)
// =====================
function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  axios.post(
      "http://localhost:8080/api/auth/login",
      { email, password },
      { withCredentials: true } // Needed for Spring Boot session cookies
    )
    .then((response) => {
      console.log("✅ Login success:", response.data);
      openSuccessPopup();
    })
    .catch((error) => {
      console.error("❌ Login error:", error);
      alert("Login failed: Invalid email or password");
    });
}

// =====================
// Popup control
// =====================
function openSuccessPopup() {
  const popup = document.getElementById("successPopup");
  if (!popup) return;
  popup.classList.add("show");
  popup.setAttribute("aria-hidden", "false");

  const btn = popup.querySelector(".success-btn");
  if (btn) btn.focus();
}

function closePopup() {
  const popup = document.getElementById("successPopup");
  if (!popup) return;
  popup.classList.remove("show");
  popup.setAttribute("aria-hidden", "true");
}

function goToHome() {
  closePopup();
  window.location.href = "/Frontend/HTML/homePage.html";
}

// Close popup by clicking overlay
document.addEventListener("click", (e) => {
  const popup = document.getElementById("successPopup");
  if (popup && popup.classList.contains("show") && e.target === popup) {
    closePopup();
  }
});

// Close popup on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePopup();
});
