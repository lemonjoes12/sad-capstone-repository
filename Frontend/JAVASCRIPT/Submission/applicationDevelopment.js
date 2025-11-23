document.addEventListener("DOMContentLoaded", () => {
  // ===== SIDEBAR FUNCTIONALITY =====
  const sidebar = document.querySelector(".sidebar");

  // Collapsible Dropdown Menu
  const dropdownToggles = document.querySelectorAll(".menu-item.dropdown-toggle");
  dropdownToggles.forEach((toggle) => {
    const submenu = toggle.nextElementSibling;
    if (!submenu || !submenu.classList.contains("submenu")) return;

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle.classList.toggle("open");
      submenu.classList.toggle("show");
    });
  });

  // Arrow functionality
  const menuItems = document.querySelectorAll('.dropdown-toggle');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  // ===== NOTIFICATION BUTTON =====
  const notificationBtn = document.querySelector(".notification-btn");
  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      alert("You have 3 new notifications");
    });
  }

  // ===== PROFILE BUTTON =====
  const profileBtn = document.querySelector(".profile-btn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "/Frontend/HTML/profile.html";
    });
  }

  // ===== SET ACTIVE MENU ITEM =====
  const currentPage = window.location.pathname;
  const menuLinks = document.querySelectorAll(".menu-item[href], .submenu-item[href]");
  menuLinks.forEach((link) => {
    if (currentPage.includes(link.getAttribute("href"))) {
      link.classList.add("active");
      const parent = link.closest(".submenu");
      if (parent) {
        parent.classList.add("show");
        const toggle = parent.previousElementSibling;
        if (toggle && toggle.classList.contains("dropdown-toggle")) {
          toggle.classList.add("open");
        }
      }
    }
  });

  // ===== LOGOUT FUNCTIONALITY =====
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutPopup = document.getElementById("logoutPopup");
  const confirmBtn = logoutPopup ? logoutPopup.querySelector(".confirm-logout") : null;
  const cancelBtn = logoutPopup ? logoutPopup.querySelector(".cancel-logout") : null;

  function openLogoutPopup() {
    if (!logoutPopup) return;
    logoutPopup.classList.add("show");
    logoutPopup.setAttribute("aria-hidden", "false");
    if (cancelBtn) cancelBtn.focus();
  }

  function closeLogoutPopup() {
    if (!logoutPopup) return;
    logoutPopup.classList.remove("show");
    logoutPopup.setAttribute("aria-hidden", "true");
  }

  function performSmoothLogout() {
    if (!confirmBtn) return;
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
    confirmBtn.disabled = true;
    if (cancelBtn) cancelBtn.disabled = true;
    
    const dashboard = document.querySelector(".dashboard-container");
    if (dashboard) dashboard.style.opacity = "0";

    setTimeout(() => {
      window.location.href = "/Frontend/HTML/logIn.html";
    }, 200);
  }

  if (logoutBtn) logoutBtn.addEventListener("click", (e) => { e.preventDefault(); openLogoutPopup(); });
  if (confirmBtn) confirmBtn.addEventListener("click", performSmoothLogout);
  if (cancelBtn) cancelBtn.addEventListener("click", closeLogoutPopup);

  document.addEventListener("click", (e) => {
    if (!logoutPopup) return;
    if (logoutPopup.classList.contains("show") && e.target === logoutPopup) closeLogoutPopup();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLogoutPopup(); });

  // ===== TEAM MEMBERS FUNCTIONALITY =====
  const addMemberBtn = document.getElementById('addColumnMember');
  const fullNameInput = document.getElementById('fullName');
  const sectionInput = document.getElementById('section');
  const emailInput = document.getElementById('email');
  
  let memberCount = 0;

  // Initialize members table
  function initializeMembersTable() {
    let addedMembersContainer = document.getElementById('addedMembersContainer');
    
    if (!addedMembersContainer) {
      const teamMembersSection = document.querySelector('.team-members-columns');
      addedMembersContainer = document.createElement('div');
      addedMembersContainer.id = 'addedMembersContainer';
      addedMembersContainer.className = 'added-members-container';
      
      // Create table structure
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
          <tbody id="membersTableBody">
          </tbody>
        </table>
      `;
      
      const additionalButtons = document.querySelector('.additional-buttons');
      teamMembersSection.insertBefore(addedMembersContainer, additionalButtons);
    }
    
    return addedMembersContainer;
  }

  // Initialize the table on page load
  initializeMembersTable();

  if (addMemberBtn) {
    addMemberBtn.addEventListener('click', function() {
      const fullName = fullNameInput.value.trim();
      const section = sectionInput.value.trim();
      const email = emailInput.value.trim();

      // Validation
      if (!fullName || !section || !email) {
        alert('Please fill in all fields');
        return;
      }

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
      }

      memberCount++;

      const tbody = document.getElementById('membersTableBody');
      if (!tbody) {
        console.error('Members table body not found');
        return;
      }

      // Create table row
      const row = document.createElement('tr');
      row.className = 'member-row';
      row.innerHTML = `
        <td>${memberCount}</td>
        <td>${fullName}</td>
        <td>${section}</td>
        <td>${email}</td>
        <td>
          <button type="button" class="remove-member-btn" data-member="${memberCount}">
            Remove
          </button>
        </td>
      `;

      tbody.appendChild(row);

      // Clear input fields
      fullNameInput.value = '';
      sectionInput.value = '';
      emailInput.value = '';

      // Add remove functionality
      const removeBtn = row.querySelector('.remove-memberBtn');
      removeBtn.addEventListener('click', function() {
        row.remove();
        updateMemberNumbers();
      });
    });
  }

  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Update member numbers after removal
  function updateMemberNumbers() {
    const rows = document.querySelectorAll('#membersTableBody tr');
    rows.forEach((row, index) => {
      row.cells[0].textContent = index + 1;
    });
    memberCount = rows.length;
  }

  // ===== PDF UPLOAD FUNCTIONALITY =====
  const uploadInput = document.getElementById('upload');
  const uploadBtn = document.querySelector('.upload-btn');
  const pdfBtnText = document.querySelector('.btn-text');
  const fileStatus = document.querySelector('.file-status');

  if (uploadBtn && uploadInput) {
    // Click button to trigger file input
    uploadBtn.addEventListener('click', function() {
      uploadInput.click();
    });

    // Handle file selection
    uploadInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      
      if (file) {
        // Validate file type
        if (file.type !== 'application/pdf') {
          fileStatus.textContent = 'Please select PDF only';
          fileStatus.style.color = '#e74c3c';
          uploadBtn.classList.remove('has-file');
          return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          fileStatus.textContent = 'File too large (max 10MB)';
          fileStatus.style.color = '#e74c3c';
          uploadBtn.classList.remove('has-file');
          return;
        }

        // Success - update UI
        const fileSize = (file.size / (1024 * 1024)).toFixed(2);
        fileStatus.textContent = `${file.name} (${fileSize} MB)`;
        fileStatus.style.color = '#ffffff';
        pdfBtnText.textContent = 'Change File';
        uploadBtn.classList.add('has-file');
        
      } else {
        // No file selected
        fileStatus.textContent = 'No file chosen';
        fileStatus.style.color = 'rgba(255, 255, 255, 0.8)';
        pdfBtnText.textContent = 'Choose PDF File';
        uploadBtn.classList.remove('has-file');
      }
    });

    // Drag and drop functionality
    uploadBtn.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.style.background = 'linear-gradient(135deg, #FF9800, #F57C00)';
    });

    uploadBtn.addEventListener('dragleave', function(e) {
      e.preventDefault();
      if (uploadBtn.classList.contains('has-file')) {
        this.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
      } else {
        this.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      }
    });

    uploadBtn.addEventListener('drop', function(e) {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        uploadInput.files = files;
        uploadInput.dispatchEvent(new Event('change'));
      }
    });
  }

  // ===== PICTURE UPLOAD FUNCTIONALITY =====
  const pictureInput = document.getElementById('pictureUpload');
  const uploadPicturesBtn = document.getElementById('uploadPicturesTrigger');
  const picturesPreview = document.getElementById('picturesPreview');
  const validationMessage = document.getElementById('pictureValidation');

  let selectedPictures = [];

  if (uploadPicturesBtn && pictureInput) {
    const picturesBtnText = uploadPicturesBtn.querySelector('.btn-text');
    const pictureStatus = uploadPicturesBtn.querySelector('.picture-status');

    // Click button to trigger file input
    uploadPicturesBtn.addEventListener('click', function() {
      pictureInput.click();
    });

    // Handle picture selection
    pictureInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      
      if (files.length > 0) {
        // Filter only image files
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
          showValidation('Please select image files only.', 'error');
          return;
        }

        // Add new pictures to existing selection
        selectedPictures = [...selectedPictures, ...imageFiles];
        
        // Update UI
        updatePictureUI();
        
      } else {
        // No files selected
        updatePictureUI();
      }
    });

    // Update picture UI function
    function updatePictureUI() {
      // Clear preview
      if (picturesPreview) {
        picturesPreview.innerHTML = '';
      }
      
      // Create preview for each picture
      selectedPictures.forEach((file, index) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const pictureItem = document.createElement('div');
          pictureItem.className = 'picture-item';
          pictureItem.innerHTML = `
            <img src="${e.target.result}" alt="Preview" class="preview-image">
            <button type="button" class="remove-picture" data-index="${index}">×</button>
          `;
          
          if (picturesPreview) {
            picturesPreview.appendChild(pictureItem);
          }
          
          // Add remove functionality
          const removeBtn = pictureItem.querySelector('.remove-picture');
          removeBtn.addEventListener('click', function() {
            const removeIndex = parseInt(this.getAttribute('data-index'));
            selectedPictures.splice(removeIndex, 1);
            updatePictureUI();
          });
        };
        
        reader.readAsDataURL(file);
      });
      
      // Update status
      const totalPictures = selectedPictures.length;
      if (pictureStatus) {
        pictureStatus.textContent = `${totalPictures} picture(s) selected`;
      }
      
      // Update button text
      if (picturesBtnText) {
        picturesBtnText.textContent = totalPictures > 0 ? 'Add More Pictures' : 'Choose Pictures';
      }
      
      // Check minimum requirement
      if (totalPictures >= 5) {
        uploadPicturesBtn.classList.add('requirements-met');
        showValidation(`Great! You have selected ${totalPictures} pictures. Minimum requirement met.`, 'success');
      } else {
        uploadPicturesBtn.classList.remove('requirements-met');
      }
    }

    // Show validation message
    function showValidation(message, type) {
      if (validationMessage && type === 'success') {
        validationMessage.textContent = message;
        validationMessage.className = `validation-message ${type}`;
      } else if (validationMessage) {
        validationMessage.style.display = 'none';
      }
    }

    // Drag and drop functionality
    uploadPicturesBtn.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.style.background = 'linear-gradient(135deg, #9C27B0, #7B1FA2)';
    });

    uploadPicturesBtn.addEventListener('dragleave', function(e) {
      e.preventDefault();
      updateButtonColor();
    });

    uploadPicturesBtn.addEventListener('drop', function(e) {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        selectedPictures = [...selectedPictures, ...imageFiles];
        updatePictureUI();
      }
      updateButtonColor();
    });

    function updateButtonColor() {
      if (selectedPictures.length >= 5) {
        uploadPicturesBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      } else {
        uploadPicturesBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      }
    }

    // Initialize
    updatePictureUI();
  }

  // Upload Project Button functionality
  const uploadProjectBtn = document.getElementById('uploadProject');
  if (uploadProjectBtn) {
    uploadProjectBtn.addEventListener('click', function() {
      if (selectedPictures.length < 5) {
        alert('Please select at least 5 pictures before uploading the project.');
        return;
      }

      // Show loading state
      const originalText = uploadProjectBtn.innerHTML;
      uploadProjectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
      uploadProjectBtn.disabled = true;

      // Simulate upload process
      setTimeout(() => {
        alert(`Project uploaded successfully with ${selectedPictures.length} pictures!`);
        
        // Reset button
        uploadProjectBtn.innerHTML = originalText;
        uploadProjectBtn.disabled = false;
      }, 2000);
    });
  }

  // ===== SUBMIT PROJECT POPUP FUNCTIONALITY =====
  const submitProjectBtn = document.querySelector('.btn-primary[form="capstoneForm"]');
  const submitPopup = document.getElementById('submitPopup');
  const submitSuccess = document.getElementById('submitSuccess');
  const qrPopup = document.getElementById('qrPopup');

  // Store original button state
  let originalSubmitBtnState = null;

  // Initialize submit functionality
  function initializeSubmitFunctionality() {
    // Store original button state
    if (submitProjectBtn) {
      originalSubmitBtnState = {
        html: submitProjectBtn.innerHTML,
        disabled: submitProjectBtn.disabled
      };
    }

    // Submit project button
    if (submitProjectBtn) {
      submitProjectBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openSubmitPopup();
      });
    }

    // Popup buttons
    const confirmSubmitBtn = submitPopup ? submitPopup.querySelector('.confirm-submit') : null;
    const cancelSubmitBtn = submitPopup ? submitPopup.querySelector('.cancel-submit') : null;

    if (confirmSubmitBtn) {
      confirmSubmitBtn.addEventListener('click', performSubmit);
    }

    if (cancelSubmitBtn) {
      cancelSubmitBtn.addEventListener('click', closeSubmitPopup);
    }

    // Success popup buttons
    const confirmSuccessBtn = submitSuccess ? submitSuccess.querySelector('.confirm-success') : null;
    const generateQrBtn = submitSuccess ? submitSuccess.querySelector('#generateQrBtn') : null;

    if (confirmSuccessBtn) {
      confirmSuccessBtn.addEventListener('click', function() {
        closeSubmitSuccess();
        clearAllTextFields();
        resetSubmitButton();
      });
    }

    if (generateQrBtn) {
      generateQrBtn.addEventListener('click', function() {
        closeSubmitSuccess();
        generateQRCode();
        showQRPopup();
        resetSubmitButton();
      });
    }

    // QR popup buttons
    const closeQrBtn = qrPopup ? qrPopup.querySelector('#closeQrBtn') : null;
    const downloadQrBtn = qrPopup ? qrPopup.querySelector('#downloadQrBtn') : null;

    if (closeQrBtn) {
      closeQrBtn.addEventListener('click', closeQRPopup);
    }

    if (downloadQrBtn) {
      downloadQrBtn.addEventListener('click', downloadQRCode);
    }

    // Add real-time validation for form fields
    addRealTimeValidation();
  }

  // Initialize submit functionality
  initializeSubmitFunctionality();

  function addRealTimeValidation() {
    // Get all required fields
    const requiredFields = [
      { id: 'professor', name: 'Professor' },
      { id: 'title', name: 'Project Title' },
      { id: 'year', name: 'Academic Year' },
      { id: 'abstract', name: 'Abstract' }
    ];

    // Add event listeners for real-time validation
    requiredFields.forEach(field => {
      const element = document.getElementById(field.id);
      if (element) {
        element.addEventListener('input', function() {
          validateField(this);
        });
        
        element.addEventListener('blur', function() {
          validateField(this);
        });
      }
    });

    const addMemberBtn = document.getElementById('addColumnMember');
    if (addMemberBtn) {
      addMemberBtn.addEventListener('click', function() {
        setTimeout(() => {
          validateTeamMembers();
        }, 100);
      });
    }
  }

  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('data-field-name') || field.id;
    
    field.classList.remove('error-field');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    
    if (!value) {
      field.classList.add('error-field');
      
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${getFieldDisplayName(fieldName)} is required
      `;
      
      field.parentNode.appendChild(errorElement);
      return false;
    }
    
    return true;
  }

  // VALIDATE TEAM MEMBERS
  function validateTeamMembers() {
    const teamMembers = document.querySelectorAll('#membersTableBody tr');
    const teamMembersSection = document.querySelector('.team-members-columns');
    
    const existingError = teamMembersSection.querySelector('.team-members-error');
    if (existingError) {
      existingError.remove();
    }
    
    if (teamMembers.length === 0) {
      const errorElement = document.createElement('div');
      errorElement.className = 'team-members-error';
      errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        Please add at least one team member
      `;
      
      teamMembersSection.appendChild(errorElement);
      return false;
    }
    
    return true;
  }

  // VALIDATE ABSTRACT LENGTH
  function validateAbstractLength(field) {
    const maxLength = 500;
    let currentLength = field.value.length;
    
    const container = field.closest('.form-group') || field.parentNode;
    
    let counter = container.querySelector('.char-counter');
    
    if (!counter) {
      counter = document.createElement('div');
      counter.className = 'char-counter';
      container.appendChild(counter);
    }
    
    if (currentLength > maxLength) {
      field.value = field.value.substring(0, maxLength);
      currentLength = maxLength;
    }
    
    counter.textContent = `${currentLength}/${maxLength}`;
    
    if (currentLength >= maxLength) {
      counter.classList.add('limit-reached');
      counter.classList.remove('near-limit');
      field.classList.add('error-field');
      return false;
    } else if (currentLength > maxLength * 0.8) {
      counter.classList.add('near-limit');
      counter.classList.remove('limit-reached');
    } else {
      counter.classList.remove('near-limit', 'limit-reached');
    }
    
    field.classList.remove('error-field');
    return true;
  }

  // Initialize abstract counter
  function initAbstractCounter() {
    const abstractField = document.getElementById('abstract');
    
    if (abstractField) {
      validateAbstractLength(abstractField);
      
      abstractField.addEventListener('input', function() {
        validateAbstractLength(this);
      });
      
      abstractField.addEventListener('keydown', function(e) {
        const maxLength = 500;
        const currentLength = this.value.length;
        
        if (
          e.key === 'Backspace' || 
          e.key === 'Delete' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === 'Tab' ||
          e.ctrlKey || 
          e.metaKey
        ) {
          return true;
        }
        
        if (currentLength >= maxLength) {
          e.preventDefault();
          return false;
        }
      });
    }
  }

  // Initialize abstract counter
  initAbstractCounter();

  function validateFileUpload() {
    const fileInput = document.getElementById('upload');
    const uploadSection = document.querySelector('.upload-section');
    
    const existingError = uploadSection.querySelector('.file-error');
    if (existingError) {
      existingError.remove();
    }
    
    if (!fileInput?.files[0]) {
      const errorElement = document.createElement('div');
      errorElement.className = 'file-error';
      errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        Please upload a PDF file
      `;
      
      uploadSection.appendChild(errorElement);
      return false;
    }
    
    return true;
  }

  function validatePictures() {
    const picturesSection = document.querySelector('.pictures-section');
    
    const existingError = picturesSection.querySelector('.pictures-error');
    if (existingError) {
      existingError.remove();
    }
    
    if (selectedPictures && selectedPictures.length < 5) {
      const errorElement = document.createElement('div');
      errorElement.className = 'pictures-error';
      errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        Please upload at least 5 pictures (currently: ${selectedPictures.length})
      `;
      
      picturesSection.appendChild(errorElement);
      return false;
    }
    
    return true;
  }

  function getFieldDisplayName(fieldId) {
    const fieldNames = {
      'professor': 'Professor',
      'title': 'Project Title',
      'year': 'Academic Year',
      'abstract': 'Abstract'
    };
    
    return fieldNames[fieldId] || fieldId;
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
    
    submitPopup.classList.add('show');
    submitPopup.setAttribute('aria-hidden', 'false');
    
    const cancelSubmitBtn = submitPopup.querySelector('.cancel-submit');
    if (cancelSubmitBtn) cancelSubmitBtn.focus();
  }

  function validateFormBeforeSubmit() {
    const professor = document.getElementById('professor')?.value.trim() || '';
    const title = document.getElementById('title')?.value.trim() || '';
    const year = document.getElementById('year')?.value.trim() || '';
    const abstract = document.getElementById('abstract')?.value.trim() || '';
    const fileInput = document.getElementById('upload');
    const teamMembers = document.querySelectorAll('#membersTableBody tr');
    
    const invalidFields = [];
    let errorMessage = '';
    
    if (!professor) invalidFields.push({ field: 'professor', message: 'Professor is required' });
    if (!title) invalidFields.push({ field: 'title', message: 'Project Title is required' });
    if (!year) invalidFields.push({ field: 'year', message: 'Academic Year is required' });
    if (!abstract) invalidFields.push({ field: 'abstract', message: 'Abstract is required' });
    
    if (abstract && abstract.length > 500) {
      invalidFields.push({ field: 'abstract', message: 'Abstract must be 500 characters or less' });
    }
    
    if (!fileInput?.files[0]) {
      invalidFields.push({ field: 'upload', message: 'PDF file is required' });
    }
    
    if (teamMembers.length === 0) {
      invalidFields.push({ field: 'team-members', message: 'At least one team member is required' });
    }
    
    if (selectedPictures && selectedPictures.length < 5) {
      invalidFields.push({ field: 'pictures', message: 'At least 5 pictures are required' });
    }
    
    if (invalidFields.length > 0) {
      const fieldNames = invalidFields.map(field => {
        const fieldDisplayNames = {
          'professor': 'Professor',
          'title': 'Project Title',
          'year': 'Academic Year',
          'abstract': 'Abstract',
          'upload': 'PDF File',
          'team-members': 'Team Members',
          'pictures': 'Pictures'
        };
        return fieldDisplayNames[field.field] || field.field;
      });
      
      errorMessage = `Please fix the following issues:\n• ${invalidFields.map(f => f.message).join('\n• ')}`;
    }
    
    return { 
      isValid: invalidFields.length === 0, 
      message: errorMessage,
      invalidFields: invalidFields
    };
  }

  function highlightInvalidFields(invalidFields) {
    document.querySelectorAll('.error-field').forEach(field => {
      field.classList.remove('error-field');
    });
    
    document.querySelectorAll('.field-error, .length-error, .team-members-error, .file-error, .pictures-error').forEach(error => {
      error.remove();
    });
    
    invalidFields.forEach(invalidField => {
      switch (invalidField.field) {
        case 'professor':
        case 'title':
        case 'year':
        case 'abstract':
          const field = document.getElementById(invalidField.field);
          if (field) {
            field.classList.add('error-field');
            validateField(field);
          }
          break;
        case 'upload':
          validateFileUpload();
          break;
        case 'team-members':
          validateTeamMembers();
          break;
        case 'pictures':
          validatePictures();
          break;
      }
    });
    
    if (invalidFields.length > 0) {
      const firstField = invalidFields[0];
      let elementToScroll = null;
      
      switch (firstField.field) {
        case 'professor':
        case 'title':
        case 'year':
        case 'abstract':
          elementToScroll = document.getElementById(firstField.field);
          break;
        case 'upload':
          elementToScroll = document.querySelector('.upload-section');
          break;
        case 'team-members':
          elementToScroll = document.querySelector('.team-members-columns');
          break;
        case 'pictures':
          elementToScroll = document.querySelector('.pictures-section');
          break;
      }
      
      if (elementToScroll) {
        elementToScroll.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        if (elementToScroll.tagName === 'INPUT' || elementToScroll.tagName === 'TEXTAREA') {
          elementToScroll.focus();
        }
      }
    }
  }

  function showValidationError(message) {
    const errorPopup = document.getElementById('validationPopup');
    
    if (!errorPopup) return;
    
    errorPopup.style.display = 'flex';
    
    const closeBtn = errorPopup.querySelector('.close-error-btn');
    
    closeBtn.replaceWith(closeBtn.cloneNode(true));
    
    const newCloseBtn = errorPopup.querySelector('.close-error-btn');
    
    newCloseBtn.addEventListener('click', function() {
      errorPopup.style.display = 'none';
    });
    
    errorPopup.addEventListener('click', function(e) {
      if (e.target === errorPopup) {
        errorPopup.style.display = 'none';
      }
    });
    
    newCloseBtn.focus();
  }

  function closeSubmitPopup() {
    if (!submitPopup) return;
    submitPopup.classList.remove('show');
    submitPopup.setAttribute('aria-hidden', 'true');
  }

  function performSubmit() {
    const confirmSubmitBtn = submitPopup ? submitPopup.querySelector('.confirm-submit') : null;
    if (!confirmSubmitBtn) return;
    
    const originalText = confirmSubmitBtn.innerHTML;
    confirmSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    confirmSubmitBtn.disabled = true;
    
    setTimeout(() => {
      closeSubmitPopup();
      openSubmitSuccess();
      
      confirmSubmitBtn.innerHTML = originalText;
      confirmSubmitBtn.disabled = false;
    }, 1000);
  }

  function openSubmitSuccess() {
    if (!submitSuccess) return;
    submitSuccess.classList.add('show');
    submitSuccess.setAttribute('aria-hidden', 'false');
  }

  function closeSubmitSuccess() {
    if (!submitSuccess) return;
    submitSuccess.classList.remove('show');
    submitSuccess.setAttribute('aria-hidden', 'true');
  }

  function showQRPopup() {
    if (!qrPopup) return;
    qrPopup.classList.add('show');
    qrPopup.setAttribute('aria-hidden', 'false');
  }

  function closeQRPopup() {
    if (!qrPopup) return;
    qrPopup.classList.remove('show');
    qrPopup.setAttribute('aria-hidden', 'true');
  }

  // COMBINED FUNCTION: Clear all form fields
  function clearAllTextFields() {
    const capstoneForm = document.getElementById('capstoneForm');
    if (capstoneForm) {
      capstoneForm.reset();
    }

    const professor = document.getElementById('professor');
    const title = document.getElementById('title');
    const year = document.getElementById('year');
    const abstract = document.getElementById('abstract');
    
    if (professor) professor.value = '';
    if (title) title.value = '';
    if (year) year.value = '';
    if (abstract) abstract.value = '';

    if (fullNameInput) fullNameInput.value = '';
    if (sectionInput) sectionInput.value = '';
    if (emailInput) emailInput.value = '';

    if (membersTableBody) {
      membersTableBody.innerHTML = '';
    }

    if (fileStatus) fileStatus.textContent = 'No file chosen';
    if (pdfBtnText) pdfBtnText.textContent = 'Choose PDF File';
    if (uploadBtn) uploadBtn.classList.remove('has-file');
    
    selectedPictures = [];
    
    if (picturesPreview) {
      picturesPreview.innerHTML = '';
    }
    
    const pictureStatus = document.querySelector('.picture-status');
    if (pictureStatus) {
      pictureStatus.textContent = 'No pictures chosen';
    }
    
    const picturesBtnText = document.querySelector('#uploadPicturesTrigger .btn-text');
    if (picturesBtnText) {
      picturesBtnText.textContent = 'Choose Pictures';
    }
    
    if (pictureInput) {
      pictureInput.value = '';
    }
    
    if (uploadPicturesBtn) {
      uploadPicturesBtn.classList.remove('requirements-met');
    }

    memberCount = 0;

    document.querySelectorAll('.error-field').forEach(field => {
      field.classList.remove('error-field');
    });
    
    document.querySelectorAll('.field-error, .length-error, .char-counter, .team-members-error, .file-error, .pictures-error').forEach(error => {
      error.remove();
    });

    showClearSuccessNotification();
  }

  function showClearSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'clear-success-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-broom"></i>
        <span>All form fields have been cleared. Ready for new project submission!</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 500);
      }
    }, 4000);
  }

// ===== QR CODE FUNCTIONALITY =====
// ===== QR CODE FUNCTIONALITY =====
let qrCode = null;

// Add this test function
function testQRCodeFunctionality() {
    console.log('🧪 Testing QR Code functionality...');
    
    if (typeof QRCode === 'undefined') {
        console.error('❌ QRCode library not loaded');
        return false;
    }
    
    const testDiv = document.createElement('div');
    try {
        new QRCode(testDiv, {
            text: 'test',
            width: 100,
            height: 100
        });
        console.log('✅ QR Code functionality test passed');
        return true;
    } catch (error) {
        console.error('❌ QR Code functionality test failed:', error);
        return false;
    }
}

// Add event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing QR code functionality...');
    
    testQRCodeFunctionality();
    
    const generateQrBtn = document.getElementById('generateQrBtn');
    const downloadQrBtn = document.getElementById('downloadQrBtn');
    const skipQrBtn = document.getElementById('skipQrBtn');
    
    if (generateQrBtn) {
        generateQrBtn.addEventListener('click', generateQRCode);
        console.log('✅ Generate QR button listener added');
    }
    
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', downloadQRCode);
    }
    
    if (skipQrBtn) {
        skipQrBtn.addEventListener('click', function() {
            document.getElementById('qrPopup').style.display = 'none';
        });
    }
});

// ✅ FIXED: Optimized QR Code generation
async function generateQRCode() {
    console.log('🔄 Starting OPTIMIZED QR Code generation...');
    
    const qrPopup = document.getElementById('qrPopup');
    const qrCodeDisplay = document.getElementById('qrCodeDisplay');
    
    if (!qrCodeDisplay) {
        console.error('❌ QR Code Display element not found');
        return;
    }
    
    qrCodeDisplay.innerHTML = '<div class="qr-loading">Generating QR Code...</div>';
    
    try {
        qrPopup.style.display = 'flex';
        
        // ✅ FIXED: Generate data ONCE only
        const projectData = generateSimpleProjectData();
        
        if (!projectData) {
            throw new Error('No project data available');
        }
        
        console.log('📄 Project Data:', projectData);
        
        // ✅ FIXED: Use the SAME data for URL generation
        const qrUrl = generateAccessibleURL(projectData);
        
        console.log('🔗 QR Code URL:', qrUrl);
        console.log('📏 URL Length:', qrUrl.length, 'characters');
        
        // Generate QR code
        try {
            qrCodeDisplay.innerHTML = '';
            
            console.log('🎨 Generating QR code...');
            
            // ✅ FIXED: Optimized QR code settings
            qrCode = new QRCode(qrCodeDisplay, {
                text: qrUrl,
                width: 350,  // Optimal size for scanning
                height: 350,
                colorDark: "#000000",
                colorLight: "#FFFFFF",
                correctLevel: QRCode.CorrectLevel.Q,
                margin: 8
            });
            
            console.log('✅ QR Code generated successfully');
            
            // Add styling for better visibility
            const canvas = qrCodeDisplay.querySelector('canvas');
            if (canvas) {
                canvas.style.backgroundColor = '#FFFFFF';
                canvas.style.padding = '15px';
                canvas.style.borderRadius = '10px';
                canvas.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
            }
            
        } catch (error) {
            console.error('❌ Error generating QR code:', error);
            showQRCodeError(error);
        }
        
    } catch (error) {
        console.error('❌ Error in QR generation:', error);
        qrCodeDisplay.innerHTML = '<div class="qr-error">Error: Failed to generate QR code</div>';
    }
}

// ✅ FIXED: Simple URL generation without recursion
function generateAccessibleURL(projectData) {
    const yourIP = '192.168.100.58';
    const port = '5501';
    
    // ✅ FIXED: Use shorter parameter names and limit data size
    const compressedData = {
        t: projectData.title?.substring(0, 100) || '',        // Limit title
        p: projectData.professor?.substring(0, 50) || '',     // Limit professor
        y: projectData.year || '',
        a: projectData.abstract?.substring(0, 300) || '',     // Limit abstract
        m: projectData.members || [],
        id: projectData.id
    };
    
    const jsonData = JSON.stringify(compressedData);
    const encodedData = encodeURIComponent(jsonData);
    
    // ✅ FIXED: Use 'data' parameter (not 'd') to match DisplayQrCode.html
    const qrUrl = `http://${yourIP}:${port}/Frontend/HTML/DisplayQrCode.html?data=${encodedData}`;
    
    console.log('🔗 Generated URL length:', qrUrl.length);
    console.log('📊 Compressed data:', compressedData);
    
    return qrUrl;
}

// ✅ FIXED: Get team members from the TABLE, not input fields
function generateSimpleProjectData() {
    const projectId = 'PROJ-' + Date.now();

    const title = document.getElementById('title')?.value || 'Untitled Project';
    const professor = document.getElementById('professor')?.value || 'Unknown Professor';
    const year = document.getElementById('year')?.value || '2023-2024';
    const abstract = document.getElementById('abstract')?.value || 'No abstract provided';

    // ✅ FIXED: Get team members from the MEMBERS TABLE
    const members = [];
    const memberRows = document.querySelectorAll('#membersTableBody tr');
    
    console.log('👥 Found member rows in table:', memberRows.length);
    
    memberRows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        console.log(`📋 Row ${index + 1} has ${cells.length} cells`);
        
        if (cells.length >= 4) { // Make sure we have all columns
            const memberNumber = cells[0]?.textContent?.trim() || (index + 1).toString();
            const fullName = cells[1]?.textContent?.trim() || `Member ${index + 1}`;
            const section = cells[2]?.textContent?.trim() || 'Not specified';
            const email = cells[3]?.textContent?.trim() || 'Not specified';
            
            members.push({
                fullName: fullName,
                section: section,
                email: email
            });
            
            console.log(`✅ Added member from table: ${fullName}, ${section}, ${email}`);
        }
    });

    // If no members found in table, try input fields as fallback
    if (members.length === 0) {
        console.log('⚠️ No members in table, checking input fields...');
        const fullNameInput = document.getElementById('fullName');
        const sectionInput = document.getElementById('section');
        const emailInput = document.getElementById('email');
        
        if (fullNameInput && fullNameInput.value.trim()) {
            members.push({
                fullName: fullNameInput.value.trim(),
                section: sectionInput?.value?.trim() || 'Not specified',
                email: emailInput?.value?.trim() || 'Not specified'
            });
            console.log('✅ Added member from input fields');
        }
    }

    // If still no members, add a default one
    if (members.length === 0) {
        members.push({
            fullName: 'Project Team',
            section: 'Computer Science',
            email: 'team@university.edu'
        });
        console.log('📝 Added default member');
    }

    const projectData = {
        id: projectId,
        title: title,
        professor: professor,
        year: year,
        abstract: abstract,
        members: members,
        submissionDate: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleString()
    };

    console.log('📄 Final Project Data:', projectData);
    return projectData;
}

function downloadQRCode() {
    if (!qrCode) {
        alert('Please generate QR code first');
        return;
    }
    
    try {
        const canvas = document.querySelector('#qrCodeDisplay canvas');
        if (!canvas) {
            throw new Error('QR Code canvas not found');
        }
        
        const link = document.createElement('a');
        link.download = 'capstone-project-qr.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ QR Code downloaded successfully');
    } catch (error) {
        console.error('❌ Error downloading QR code:', error);
        alert('Error downloading QR code: ' + error.message);
    }
}

function showQRCodeError(error) {
    const qrCodeDisplay = document.getElementById('qrCodeDisplay');
    qrCodeDisplay.innerHTML = `
        <div class="qr-error">
            <p><strong>QR Code Generation Error:</strong></p>
            <p>${error.message}</p>
            <button onclick="testQRCodeFunctionality()" class="test-btn">
                Test QR Code Functionality
            </button>
        </div>
    `;
}

// ===== END OF QR CODE FUNCTIONALITY =====
// ===== END OF QR CODE FUNCTIONALITY ===

// Remove the extra DOMContentLoaded at the end
  function generateProjectData() {
    const projectId = 'PROJ-' + Date.now();

    const title = document.getElementById('title')?.value || 'Untitled Project';
    const professor = document.getElementById('professor')?.value || 'Unknown Professor';
    const year = document.getElementById('year')?.value || '2023-2024';
    const abstract = document.getElementById('abstract')?.value || '';

    const members = [{
      fullName: 'Project Team',
      section: 'Computer Science',
      email: 'team@university.edu'
    }];

    const projectData = {
      id: projectId,
      title: title,
      professor: professor,
      year: year,
      abstract: abstract,
      members: members,
      submissionDate: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleString()
    };

    console.log('📄 Generated Project Data:', projectData);
    return projectData;
  }
});

