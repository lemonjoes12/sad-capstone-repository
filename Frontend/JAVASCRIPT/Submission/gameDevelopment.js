// Fixed + enhanced applicationDevelopment.js
// - Ensures initialization works when loaded dynamically
// - Loads QRCode library on demand if missing
// - Makes popup show/hide consistent (uses .show + aria-hidden)
// - Handles QR generation/clearing and downloading (canvas or img)
// - Misc small robustness improvements
// - Prevents overlay click from closing popups; traps focus inside popups
(function () {
  const QR_LIB_CDN = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";

  function run() {
    const addMemberBtn = document.getElementById("addColumnMember");
    const fullNameInput = document.getElementById("fullName");
    const sectionInput = document.getElementById("section");
    const emailInput = document.getElementById("email");

    let memberCount = 0;
    let membersTableBody = null;

    const uploadInput = document.getElementById("upload");
    const uploadBtn = document.querySelector(".upload-btn");
    const pdfBtnText = document.querySelector(".btn-text");
    const fileStatus = document.querySelector(".file-status");

    const pictureInput = document.getElementById("pictureUpload");
    const uploadPicturesBtn = document.getElementById("uploadPicturesTrigger");
    const picturesPreview = document.getElementById("picturesPreview");
    const validationMessage = document.getElementById("pictureValidation");
    let selectedPictures = [];

    const submitProjectBtn = document.querySelector('.btn.btn-primary[form="capstoneForm"], .btn-primary[form="capstoneForm"]');
    const submitPopup = document.getElementById("submitPopup");
    const submitSuccess = document.getElementById("submitSuccess");
    const qrPopup = document.getElementById("qrPopup");
    const validationPopup = document.getElementById("validationPopup");

    let originalSubmitBtnState = null;
    let qrCodeInstance = null;
    // store last submitted project data so we can generate QR after clearing the form
    let lastSubmittedProjectData = null;

    // Focus trap deactivators (WeakMap keyed by modal element)
    const focusTrapDeactivators = new WeakMap();

    // ===== Helpers =====
    function ensureQRCodeLibLoaded() {
      return new Promise((resolve, reject) => {
        if (typeof window.QRCode !== "undefined") return resolve(window.QRCode);

        // Check if a script tag with src=QR_LIB_CDN already exists
        const existing = Array.from(document.scripts).find(s => s.src && s.src.includes("qrcode.min.js"));
        if (existing) {
          existing.addEventListener("load", () => resolve(window.QRCode));
          existing.addEventListener("error", () => reject(new Error("Failed to load QRCode library")));
          return;
        }

        const script = document.createElement("script");
        script.src = QR_LIB_CDN;
        script.async = true;
        script.onload = () => {
          if (typeof window.QRCode !== "undefined") resolve(window.QRCode);
          else reject(new Error("QRCode library loaded but global QRCode not present"));
        };
        script.onerror = () => reject(new Error("Failed to load QRCode library"));
        document.head.appendChild(script);
      });
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // Focus trap utilities
    function isVisible(el) {
      if (!el) return false;
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }
    const focusableSelector = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function activateFocusTrap(modal) {
      if (!modal) return () => {};
      // ensure modal container can receive focus
      modal.setAttribute("tabindex", "-1");
      // focus the modal itself so key events bubble there
      modal.focus();

      // detect focusable elements inside modal
      function getFocusable() {
        return Array.from(modal.querySelectorAll(focusableSelector)).filter(isVisible);
      }

      function keyHandler(e) {
        if (e.key === "Tab") {
          const focusable = getFocusable();
          if (!focusable.length) {
            e.preventDefault();
            return;
          }
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first || document.activeElement === modal) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last || document.activeElement === modal) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      }

      modal.addEventListener("keydown", keyHandler);
      // return deactivation function
      return () => {
        modal.removeEventListener("keydown", keyHandler);
        try { modal.removeAttribute("tabindex"); } catch (err) { /* ignore */ }
      };
    }

    function enableFocusTrapFor(modal) {
      if (!modal) return;
      // deactivate existing if present
      const existing = focusTrapDeactivators.get(modal);
      if (existing) existing();
      const deact = activateFocusTrap(modal);
      focusTrapDeactivators.set(modal, deact);
    }

    function deactivateFocusTrapFor(modal) {
      if (!modal) return;
      const deact = focusTrapDeactivators.get(modal);
      if (typeof deact === "function") {
        deact();
        focusTrapDeactivators.delete(modal);
      }
    }

    // ===== TEAM MEMBERS =====
    function initializeMembersTable() {
      let addedMembersContainer = document.getElementById("addedMembersContainer");

      if (!addedMembersContainer) {
        const teamMembersSection = document.querySelector(".team-members-columns");
        if (!teamMembersSection) return null;

        addedMembersContainer = document.createElement("div");
        addedMembersContainer.id = "addedMembersContainer";
        addedMembersContainer.className = "added-members-container";

        addedMembersContainer.innerHTML = `
          <table class="members-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Section</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="membersTableBody"></tbody>
          </table>
        `;

        const additionalButtons = document.querySelector(".additional-buttons");
        if (additionalButtons && additionalButtons.parentNode === teamMembersSection) {
          teamMembersSection.insertBefore(addedMembersContainer, additionalButtons);
        } else {
          teamMembersSection.appendChild(addedMembersContainer);
        }
      }

      membersTableBody = document.getElementById("membersTableBody");
      return addedMembersContainer;
    }

    initializeMembersTable();

    if (addMemberBtn) {
      addMemberBtn.addEventListener("click", function () {
        const fullName = fullNameInput?.value.trim() || "";
        const section = sectionInput?.value.trim() || "";
        const email = emailInput?.value.trim() || "";

        if (!fullName || !section || !email) {
          alert("Please fill in all fields");
          return;
        }

        if (!isValidEmail(email)) {
          alert("Please enter a valid email address");
          return;
        }

        memberCount++;

        if (!membersTableBody) {
          console.error("Members table body not found");
          return;
        }

        const row = document.createElement("tr");
        row.className = "member-row";
        row.innerHTML = `
          <td>${memberCount}</td>
          <td>${escapeHtml(fullName)}</td>
          <td>${escapeHtml(section)}</td>
          <td>${escapeHtml(email)}</td>
          <td>
            <button type="button" class="remove-member-btn" data-member="${memberCount}">Remove</button>
          </td>
        `;

        membersTableBody.appendChild(row);

        if (fullNameInput) fullNameInput.value = "";
        if (sectionInput) sectionInput.value = "";
        if (emailInput) emailInput.value = "";

        const removeBtn = row.querySelector(".remove-member-btn");
        if (removeBtn) {
          removeBtn.addEventListener("click", function () {
            row.remove();
            updateMemberNumbers();
          });
        }
      });
    }

    function updateMemberNumbers() {
      const rows = document.querySelectorAll("#membersTableBody tr");
      rows.forEach((row, index) => {
        if (row.cells && row.cells[0]) {
          row.cells[0].textContent = index + 1;
        }
      });
      memberCount = rows.length;
    }

    // ===== PDF UPLOAD =====
    if (uploadBtn && uploadInput) {
      uploadBtn.addEventListener("click", () => uploadInput.click());

      uploadInput.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
          if (!isPdf) {
            if (fileStatus) { fileStatus.textContent = "Please select PDF only"; fileStatus.style.color = "#e74c3c"; }
            uploadBtn.classList.remove("has-file");
            return;
          }
          const maxSize = 30 * 1024 * 1024;
          if (file.size > maxSize) {
            if (fileStatus) { fileStatus.textContent = "File too large (max 30MB)"; fileStatus.style.color = "#e74c3c"; }
            uploadBtn.classList.remove("has-file");
            return;
          }
          const fileSize = (file.size / (1024 * 1024)).toFixed(2);
          if (fileStatus) { fileStatus.textContent = `${file.name} (${fileSize} MB)`; fileStatus.style.color = "#ffffff"; }
          if (pdfBtnText) pdfBtnText.textContent = "Change File";
          uploadBtn.classList.add("has-file");
        } else {
          if (fileStatus) { fileStatus.textContent = "No file chosen"; fileStatus.style.color = "rgba(255,255,255,0.8)"; }
          if (pdfBtnText) pdfBtnText.textContent = "Choose PDF File";
          uploadBtn.classList.remove("has-file");
        }
      });

      uploadBtn.addEventListener("dragover", function (e) { e.preventDefault(); this.style.background = "linear-gradient(135deg, #FF9800, #F57C00)"; });
      uploadBtn.addEventListener("dragleave", function (e) { e.preventDefault(); this.style.background = uploadBtn.classList.contains("has-file") ? "linear-gradient(135deg, #2196F3, #1976D2)" : "linear-gradient(135deg, #4CAF50, #45a049)"; });
      uploadBtn.addEventListener("drop", function (e) { e.preventDefault(); const files = e.dataTransfer.files; if (files.length) { uploadInput.files = files; uploadInput.dispatchEvent(new Event("change")); } });
    }

    // ===== PICTURE UPLOAD =====
    // We'll keep updatePictureUI defined only if picture upload exists, but clearing will also handle resetting inputs
    let updatePictureUI = null;
    let updateButtonColor = null;
    if (uploadPicturesBtn && pictureInput) {
      const picturesBtnText = uploadPicturesBtn.querySelector(".btn-text");
      const pictureStatus = uploadPicturesBtn.querySelector(".picture-status");

      uploadPicturesBtn.addEventListener("click", () => pictureInput.click());

      pictureInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) { updatePictureUI(); return; }

        const imageFiles = files.filter((f) => f.type.startsWith("image/"));
        if (!imageFiles.length) { showValidation("Please select image files only.", "error"); return; }

        const totalAfterAdd = selectedPictures.length + imageFiles.length;
        if (totalAfterAdd > 5) {
          const availableSlots = 5 - selectedPictures.length;
          showValidation(`You can only add ${availableSlots} more picture(s). Maximum limit is 5.`, "error");
          pictureInput.value = "";
          return;
        }

        selectedPictures = selectedPictures.concat(imageFiles);
        updatePictureUI();
      });

      updatePictureUI = function () {
        if (picturesPreview) picturesPreview.innerHTML = "";

        selectedPictures.forEach((file, index) => {
          const reader = new FileReader();
          reader.onload = function (evt) {
            const pictureItem = document.createElement("div");
            pictureItem.className = "picture-item";

            const img = document.createElement("img");
            img.src = evt.target.result;
            img.alt = "Preview";
            img.className = "preview-image";

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "remove-picture";
            removeBtn.setAttribute("data-index", String(index));
            removeBtn.innerHTML = "×";

            pictureItem.appendChild(img);
            pictureItem.appendChild(removeBtn);
            picturesPreview.appendChild(pictureItem);

            removeBtn.addEventListener("click", function () {
              const removeIndex = Number(this.getAttribute("data-index"));
              if (!Number.isNaN(removeIndex)) {
                selectedPictures.splice(removeIndex, 1);
                updatePictureUI();
              }
            });
          };
          reader.readAsDataURL(file);
        });

        const total = selectedPictures.length;
        if (pictureStatus) pictureStatus.textContent = `${total}/5 picture(s) selected`;
        if (picturesBtnText) {
          if (total >= 5) {
            picturesBtnText.textContent = "Maximum Reached";
            uploadPicturesBtn.disabled = true;
            uploadPicturesBtn.style.opacity = "0.6";
            uploadPicturesBtn.style.cursor = "not-allowed";
          } else {
            picturesBtnText.textContent = total > 0 ? "Add More Pictures" : "Choose Pictures";
            uploadPicturesBtn.disabled = false;
            uploadPicturesBtn.style.opacity = "1";
            uploadPicturesBtn.style.cursor = "pointer";
          }
        }

        if (total >= 5) {
          uploadPicturesBtn.classList.add("requirements-met");
        } else {
          uploadPicturesBtn.classList.remove("requirements-met");
          if (validationMessage && validationMessage.classList.contains("success")) validationMessage.style.display = "none";
        }

        updateButtonColor();
      };

      function showValidation(message, type) {
        if (!validationMessage) return;
        validationMessage.textContent = message;
        validationMessage.className = "validation-message " + (type === "success" ? "success" : "error");
        validationMessage.style.display = "block";
        if (type !== "success") {
          setTimeout(() => { if (validationMessage.classList.contains("error")) validationMessage.style.display = "none"; }, 3000);
        }
      }

      uploadPicturesBtn.addEventListener("dragover", (e) => { e.preventDefault(); if (selectedPictures.length < 5) uploadPicturesBtn.style.background = "linear-gradient(135deg, #9C27B0, #7B1FA2)"; });
      uploadPicturesBtn.addEventListener("dragleave", (e) => { e.preventDefault(); updateButtonColor(); });
      uploadPicturesBtn.addEventListener("drop", (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files || []);
        if (!files.length || selectedPictures.length >= 5) return;
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));
        const totalAfter = selectedPictures.length + imageFiles.length;
        if (totalAfter > 5) { showValidation(`You can only add ${5 - selectedPictures.length} more picture(s).`, "error"); return; }
        selectedPictures = selectedPictures.concat(imageFiles);
        updatePictureUI();
      });

      updateButtonColor = function () {
        if (!uploadPicturesBtn) return;

        if (selectedPictures.length >= 5) {
          uploadPicturesBtn.classList.add('requirements-met');
          uploadPicturesBtn.classList.remove('requirements-not-met');
        } else {
          uploadPicturesBtn.classList.add('requirements-not-met');
          uploadPicturesBtn.classList.remove('requirements-met');
        }
      };

      // init
      updatePictureUI();
    }

    // ===== FORM SUBMIT + POPUPS =====
    function initializeSubmitFunctionality() {
      if (submitProjectBtn) {
        originalSubmitBtnState = { html: submitProjectBtn.innerHTML, disabled: submitProjectBtn.disabled };
        submitProjectBtn.addEventListener("click", function (e) {
          e.preventDefault();
          openSubmitPopup();
        });
      }

      const confirmSubmitBtn = submitPopup?.querySelector(".confirm-submit") ?? null;
      const cancelSubmitBtn = submitPopup?.querySelector(".cancel-submit") ?? null;

      if (confirmSubmitBtn) confirmSubmitBtn.addEventListener("click", performSubmit);
      if (cancelSubmitBtn) cancelSubmitBtn.addEventListener("click", closeSubmitPopup);

      const confirmSuccessBtn = submitSuccess?.querySelector(".confirm-success") ?? null;
      const generateQrBtn = submitSuccess?.querySelector("#generateQrBtn") ?? null;

      if (confirmSuccessBtn) {
        confirmSuccessBtn.addEventListener("click", () => {
          closeSubmitSuccess();
          // clear any stored submitted data so user starts fresh
          lastSubmittedProjectData = null;
          clearAllTextFields();
          resetSubmitButton();
        });
      }

      if (generateQrBtn) {
        generateQrBtn.addEventListener("click", async () => {
          // If we have a stored lastSubmittedProjectData use it; otherwise read from form
          closeSubmitSuccess();
          await generateQRCode(lastSubmittedProjectData);
          // generateQRCode opens QR popup itself
          resetSubmitButton();
        });
      }

      const closeQrBtn = qrPopup?.querySelector("#closeQrBtn") ?? null;
      const downloadQrBtn = qrPopup?.querySelector("#downloadQrBtn") ?? null;
      const skipQrBtn = qrPopup?.querySelector("#skipQrBtn") ?? null;

      if (closeQrBtn) closeQrBtn.addEventListener("click", closeQRPopup);
      if (downloadQrBtn) downloadQrBtn.addEventListener("click", downloadQRCode);
      if (skipQrBtn) skipQrBtn.addEventListener("click", function () { closeQRPopup(); setTimeout(() => openSubmitSuccess(), 250); });

      addRealTimeValidation();
    }

    initializeSubmitFunctionality();

    function addRealTimeValidation() {
      const requiredFields = ["professor", "title", "year", "abstract"];
      requiredFields.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", () => validateField(el));
        el.addEventListener("blur", () => validateField(el));
      });
      const addMemberBtnLocal = document.getElementById("addColumnMember");
      if (addMemberBtnLocal) addMemberBtnLocal.addEventListener("click", () => setTimeout(validateTeamMembers, 120));
    }

    function validateField(field) {
      if (!field) return true;
      const value = field.value.trim();
      const fieldName = field.getAttribute("data-field-name") || field.id;

      field.classList.remove("error-field");
      const existingError = field.parentNode?.querySelector(".field-error");
      if (existingError) existingError.remove();

      if (!value) {
        field.classList.add("error-field");
        const errorElement = document.createElement("div");
        errorElement.className = "field-error";
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${getFieldDisplayName(fieldName)} is required`;
        field.parentNode?.appendChild(errorElement);
        return false;
      }
      return true;
    }

    function validateTeamMembers() {
      const teamMembers = document.querySelectorAll("#membersTableBody tr");
      const teamMembersSection = document.querySelector(".team-members-columns");
      if (!teamMembersSection) return teamMembers.length > 0;
      const existingError = teamMembersSection.querySelector(".team-members-error");
      if (existingError) existingError.remove();
      if (teamMembers.length === 0) {
        const errorElement = document.createElement("div");
        errorElement.className = "team-members-error";
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please add at least one team member`;
        teamMembersSection.appendChild(errorElement);
        return false;
      }
      return true;
    }

    function validateAbstractLength(field) {
      if (!field) return true;
      const maxLength = 500;
      let currentLength = field.value.length;
      const container = field.closest(".form-group") || field.parentNode;
      let counter = container?.querySelector(".char-counter") ?? null;
      if (!counter && container) { counter = document.createElement("div"); counter.className = "char-counter"; container.appendChild(counter); }
      if (currentLength > maxLength) { field.value = field.value.substring(0, maxLength); currentLength = maxLength; }
      if (counter) counter.textContent = `${currentLength}/${maxLength}`;
      if (currentLength >= maxLength) { counter?.classList.add("limit-reached"); counter?.classList.remove("near-limit"); field.classList.add("error-field"); return false; }
      if (currentLength > maxLength * 0.8) { counter?.classList.add("near-limit"); counter?.classList.remove("limit-reached"); }
      else { counter?.classList.remove("near-limit", "limit-reached"); }
      field.classList.remove("error-field"); return true;
    }

    (function initAbstractCounter() {
      const abstractField = document.getElementById("abstract");
      if (!abstractField) return;
      validateAbstractLength(abstractField);
      abstractField.addEventListener("input", function () { validateAbstractLength(this); });
      abstractField.addEventListener("keydown", function (e) {
        const maxLength = 500;
        const currentLength = this.value.length;
        if (["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key) || e.ctrlKey || e.metaKey) return true;
        if (currentLength >= maxLength) { e.preventDefault(); return false; }
      });
    })();

    function validateFileUpload() {
      const fileInput = document.getElementById("upload");
      const uploadSection = document.querySelector(".upload-section");
      if (!uploadSection) return !!fileInput?.files?.[0];
      const existingError = uploadSection.querySelector(".file-error");
      if (existingError) existingError.remove();
      if (!fileInput?.files?.[0]) {
        const errorElement = document.createElement("div");
        errorElement.className = "file-error";
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please upload a PDF file`;
        uploadSection.appendChild(errorElement);
        return false;
      }
      return true;
    }

    function validatePictures() {
      const picturesSection = document.querySelector(".pictures-section");
      if (!picturesSection) return (selectedPictures && selectedPictures.length >= 5);
      const existingError = picturesSection.querySelector(".pictures-error");
      if (existingError) existingError.remove();
      if (!selectedPictures || selectedPictures.length < 5) {
        const errorElement = document.createElement("div");
        errorElement.className = "pictures-error";
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please upload at least 5 pictures (currently: ${selectedPictures.length})`;
        picturesSection.appendChild(errorElement);
        return false;
      }
      return true;
    }

    function getFieldDisplayName(fieldId) {
      const map = { professor: "Professor", title: "Project Title", year: "Academic Year", abstract: "Abstract" };
      return map[fieldId] || fieldId;
    }

    function resetSubmitButton() {
      if (submitProjectBtn && originalSubmitBtnState) {
        submitProjectBtn.innerHTML = originalSubmitBtnState.html;
        submitProjectBtn.disabled = originalSubmitBtnState.disabled;
      }
    }

    function openSubmitPopup() {
      if (!submitPopup) return;
      const validationResult = validateFormBeforeSubmit();
      if (!validationResult.isValid) {
        showValidationError(validationResult.message);
        highlightInvalidFields(validationResult.invalidFields);
        return;
      }
      submitPopup.classList.add("show");
      submitPopup.setAttribute("aria-hidden", "false");
      // set focus trap
      enableFocusTrapFor(submitPopup);
      const cancelSubmitBtn = submitPopup.querySelector(".cancel-submit");
      // focus first actionable element
      (cancelSubmitBtn || submitPopup).focus();
    }

    function validateFormBeforeSubmit() {
      const professor = document.getElementById("professor")?.value.trim() || "";
      const title = document.getElementById("title")?.value.trim() || "";
      const year = document.getElementById("year")?.value.trim() || "";
      const abstract = document.getElementById("abstract")?.value.trim() || "";
      const fileInput = document.getElementById("upload");
      const teamMembers = document.querySelectorAll("#membersTableBody tr");
      const invalidFields = [];
      if (!professor) invalidFields.push({ field: "professor", message: "Professor is required" });
      if (!title) invalidFields.push({ field: "title", message: "Project Title is required" });
      if (!year) invalidFields.push({ field: "year", message: "Academic Year is required" });
      if (!abstract) invalidFields.push({ field: "abstract", message: "Abstract is required" });
      if (abstract && abstract.length > 500) invalidFields.push({ field: "abstract", message: "Abstract must be 500 characters or less" });
      if (!fileInput?.files?.[0]) invalidFields.push({ field: "upload", message: "PDF file is required" });
      if (teamMembers.length === 0) invalidFields.push({ field: "team-members", message: "At least one team member is required" });
      if (!selectedPictures || selectedPictures.length < 5) invalidFields.push({ field: "pictures", message: "At least 5 pictures are required" });
      return { isValid: invalidFields.length === 0, message: invalidFields.length ? `Please fix the following issues:\n• ${invalidFields.map(f=>f.message).join("\n• ")}` : "", invalidFields };
    }

    function highlightInvalidFields(invalidFields) {
      document.querySelectorAll(".error-field").forEach(f => f.classList.remove("error-field"));
      document.querySelectorAll(".field-error, .length-error, .team-members-error, .file-error, .pictures-error").forEach(e => e.remove());
      invalidFields.forEach((invalid) => {
        switch (invalid.field) {
          case "professor":
          case "title":
          case "year":
          case "abstract": {
            const fld = document.getElementById(invalid.field);
            if (fld) { fld.classList.add("error-field"); validateField(fld); }
            break;
          }
          case "upload": validateFileUpload(); break;
          case "team-members": validateTeamMembers(); break;
          case "pictures": validatePictures(); break;
        }
      });
      if (invalidFields.length) {
        const first = invalidFields[0];
        let el = null;
        if (["professor","title","year","abstract"].includes(first.field)) el = document.getElementById(first.field);
        if (first.field === "upload") el = document.querySelector(".upload-section") ?? document.getElementById("upload");
        if (first.field === "team-members") el = document.querySelector(".team-members-columns");
        if (first.field === "pictures") el = document.querySelector(".pictures-preview") ?? document.querySelector(".pictures-section");
        if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); (el.tagName === "INPUT" || el.tagName === "TEXTAREA") && el.focus(); }
      }
    }

    function showValidationError(message) {
      const errorPopup = validationPopup;
      if (!errorPopup) {
        // fallback: alert
        alert(message || "Validation error");
        return;
      }
      const msgEl = errorPopup.querySelector("#validationMessage");
      if (msgEl) msgEl.textContent = message || "Please check the form for errors.";
      errorPopup.classList.add("show");
      errorPopup.setAttribute("aria-hidden", "false");

      // set up focus trap for validation popup
      enableFocusTrapFor(errorPopup);

      const closeBtn = errorPopup.querySelector(".close-error-btn");
      if (!closeBtn) return;
      const closeHandler = () => {
        closeValidationPopup();
        closeBtn.removeEventListener("click", closeHandler);
      };
      closeBtn.addEventListener("click", closeHandler);
      // DO NOT close on overlay click (per request)
      closeBtn.focus();
    }

    function closeSubmitPopup() {
      if (!submitPopup) return;
      submitPopup.classList.remove("show");
      submitPopup.setAttribute("aria-hidden", "true");
      deactivateFocusTrapFor(submitPopup);
    }

    function performSubmit() {
      const confirmSubmitBtn = submitPopup?.querySelector(".confirm-submit") ?? null;
      if (!confirmSubmitBtn) return;
      const originalText = confirmSubmitBtn.innerHTML;
      confirmSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      confirmSubmitBtn.disabled = true;

      // Gather project data before clearing the form so we can still generate a QR from the same submission
      const projectDataForStorage = generateSimpleProjectData();

      setTimeout(() => {
        // store the submitted data for later (e.g. QR generation)
        lastSubmittedProjectData = projectDataForStorage;

        closeSubmitPopup();
        openSubmitSuccess();

        // Immediately reset the form so user can start filling a new submission
        clearAllTextFields();

        confirmSubmitBtn.innerHTML = originalText;
        confirmSubmitBtn.disabled = false;
      }, 900);
    }

    function openSubmitSuccess() {
      if (!submitSuccess) return;
      submitSuccess.classList.add("show");
      submitSuccess.setAttribute("aria-hidden", "false");
      enableFocusTrapFor(submitSuccess);
      const confirmBtn = submitSuccess.querySelector(".confirm-success") || submitSuccess;
      confirmBtn.focus();
    }

    function closeSubmitSuccess() {
      if (!submitSuccess) return;
      submitSuccess.classList.remove("show");
      submitSuccess.setAttribute("aria-hidden", "true");
      deactivateFocusTrapFor(submitSuccess);
    }

    function openQRPopup() {
      if (!qrPopup) return;
      qrPopup.classList.add("show");
      qrPopup.setAttribute("aria-hidden", "false");
      enableFocusTrapFor(qrPopup);
      const closeBtn = qrPopup.querySelector("#closeQrBtn") || qrPopup;
      closeBtn.focus();
    }

    function closeQRPopup() {
      if (!qrPopup) return;
      qrPopup.classList.remove("show");
      qrPopup.setAttribute("aria-hidden", "true");
      // clear QR visual but keep DOM for reuse
      const display = document.getElementById("qrCodeDisplay");
      if (display) display.innerHTML = "";
      qrCodeInstance = null;
      deactivateFocusTrapFor(qrPopup);
    }

    function closeValidationPopup() {
      if (!validationPopup) return;
      validationPopup.classList.remove("show");
      validationPopup.setAttribute("aria-hidden", "true");
      deactivateFocusTrapFor(validationPopup);
    }

    function clearAllTextFields() {
      const capstoneForm = document.getElementById("capstoneForm");
      capstoneForm?.reset();
      ["professor","title","year","abstract","fullName","section","email"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
      if (membersTableBody) membersTableBody.innerHTML = "";
      if (fileStatus) fileStatus.textContent = "No file chosen";
      if (pdfBtnText) pdfBtnText.textContent = "Choose PDF File";
      uploadBtn?.classList.remove("has-file");
      // clear the pdf input value (if any)
      if (uploadInput) {
        try { uploadInput.value = ""; } catch (err) { /* ignore readonly file inputs in some browsers */ }
      }
      // reset pictures
      selectedPictures = [];
      if (picturesPreview) picturesPreview.innerHTML = "";
      if (pictureInput) {
        try { pictureInput.value = ""; } catch (err) { /* ignore */ }
      }
      // update picture UI indicators
      const pictureStatusEls = document.querySelectorAll(".picture-status");
      pictureStatusEls.forEach(el => el.textContent = "0/5 picture(s) selected");
      if (uploadPicturesBtn) {
        const picturesBtnTextEl = uploadPicturesBtn.querySelector(".btn-text");
        if (picturesBtnTextEl) picturesBtnTextEl.textContent = "Choose Pictures";
        uploadPicturesBtn.classList.remove("requirements-met");
        uploadPicturesBtn.disabled = false;
        uploadPicturesBtn.style.opacity = "1";
        updateButtonColor && updateButtonColor();
      }
      document.querySelectorAll(".picture-status, .file-status").forEach(n => { /* keep as-is */ });
      memberCount = 0;
      document.querySelectorAll(".error-field").forEach(f => f.classList.remove("error-field"));
      document.querySelectorAll(".field-error, .length-error, .char-counter, .team-members-error, .file-error, .pictures-error").forEach(e => e.remove());
      showClearSuccessNotification();
    }

    function showClearSuccessNotification() {
      const notification = document.getElementById("clearSuccess");
      if (!notification) return;
      notification.style.display = "block";
      setTimeout(() => notification.classList.add("show"), 10);
      setTimeout(() => { notification.classList.remove("show"); setTimeout(() => { notification.style.display = "none"; }, 500); }, 4000);
    }

    // ===== QR CODE =====
    async function testQRCodeFunctionality() {
      try {
        await ensureQRCodeLibLoaded();
        const testDiv = document.createElement("div");
        try {
          new window.QRCode(testDiv, { text: "test", width: 64, height: 64 });
          console.log("✅ QR Code functionality test passed");
          return true;
        } catch (err) {
          console.error("❌ QR Code creation failed:", err);
          return false;
        }
      } catch (err) {
        console.warn("QRCode lib not available:", err);
        return false;
      }
    }

    // Accept an optional projectData object so QR can be created after the form was reset
    async function generateQRCode(projectData = null) {
      const qrCodeDisplay = document.getElementById("qrCodeDisplay");
      if (!qrCodeDisplay) return console.error("QR display element not found.");

      // Ensure QR lib present
      try {
        await ensureQRCodeLibLoaded();
      } catch (err) {
        showValidationError("Unable to load QR generator. Please check your connection.");
        console.error(err);
        return;
      }

      // Prepare data & UI
      qrCodeDisplay.innerHTML = '<div class="qr-loading">Generating QR Code...</div>';
      try {
        // use provided projectData (from last submission) or read current form
        const projectDataToUse = projectData || generateSimpleProjectData();
        const qrUrl = generateAccessibleURL(projectDataToUse);

        // clear previous instance
        qrCodeDisplay.innerHTML = "";
        qrCodeInstance = new window.QRCode(qrCodeDisplay, {
          text: qrUrl,
          width: 350,
          height: 350,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: window.QRCode.CorrectLevel?.Q ?? 3,
          margin: 8
        });

        // style the produced canvas or img
        const canvas = qrCodeDisplay.querySelector("canvas");
        const img = qrCodeDisplay.querySelector("img");
        const target = canvas || img;
        if (target) {
          target.style.backgroundColor = "#FFF";
          target.style.padding = "12px";
          target.style.borderRadius = "10px";
          target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
        }
        openQRPopup();
      } catch (err) {
        qrCodeDisplay.innerHTML = '<div class="qr-error">Error generating QR Code.</div>';
        console.error("Error generating QR:", err);
      }
    }

    function generateAccessibleURL(projectData) {
      const ip = "192.168.100.58";
      const port = "5501";
      const compressed = {
        t: projectData.title?.slice(0, 100),
        p: projectData.professor?.slice(0, 50),
        y: projectData.year,
        a: projectData.abstract?.slice(0, 300),
        m: projectData.members,
        id: projectData.id
      };
      const encoded = encodeURIComponent(JSON.stringify(compressed));
      return `http://${ip}:${port}/Frontend/HTML/DisplayQrCode.html?data=${encoded}`;
    }

    function generateSimpleProjectData() {
      const projectId = "PROJ-" + Date.now();
      const title = document.getElementById("title")?.value || "Untitled";
      const professor = document.getElementById("professor")?.value || "Unknown";
      const year = document.getElementById("year")?.value || "2023-2024";
      const abstract = document.getElementById("abstract")?.value || "No abstract";

      const members = [];
      const rows = document.querySelectorAll("#membersTableBody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 4) {
          members.push({ fullName: cells[1].textContent.trim(), section: cells[2].textContent.trim(), email: cells[3].textContent.trim() });
        }
      });
      if (members.length === 0) members.push({ fullName: "Project Team", section: "Computer Science", email: "team@university.edu" });

      return { id: projectId, title, professor, year, abstract, members, submissionDate: new Date().toISOString().split("T")[0], timestamp: new Date().toLocaleString() };
    }

    async function downloadQRCode() {
      const container = document.getElementById("qrCodeDisplay");
      if (!container) return alert("Generate the QR Code first!");

      const canvas = container.querySelector("canvas");
      const img = container.querySelector("img");

      if (canvas) {
        const link = document.createElement("a");
        link.download = "capstone-project-qr.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        return;
      }

      if (img) {
        // direct download if src is data URL or same-origin
        const link = document.createElement("a");
        link.download = "capstone-project-qr.png";
        link.href = img.src;
        link.click();
        return;
      }

      // fallback: try to regenerate to canvas then download (use last submitted data if available)
      try {
        await generateQRCode(lastSubmittedProjectData);
        setTimeout(downloadQRCode, 500);
      } catch (err) {
        alert("Unable to download QR Code.");
        console.error(err);
      }
    }

    // small accessibility / cleanups:
    // Do NOT close popups when clicking outside; popups should remain until explicitly closed.
    // Keep Escape behavior to close popups but ensure focus-trap deactivates correctly.

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // close each popup via its close function (which deactivates focus trap)
        closeSubmitPopup();
        closeSubmitSuccess();
        closeQRPopup();
        closeValidationPopup();
      }
    });

    // test QR lib load in background (not required)
    testQRCodeFunctionality().then(ok => { if (!ok) console.log("QRCode library not available yet — will load on demand."); });

    console.log("🚀 applicationDevelopment script initialized");
  } // end run

  // Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();