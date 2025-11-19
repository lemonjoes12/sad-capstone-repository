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
      const removeBtn = row.querySelector('.remove-member-btn');
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
  const pdfBtnText = document.querySelector('.btn-text'); // Changed variable name
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
        pdfBtnText.textContent = 'Change File'; // Use renamed variable
        uploadBtn.classList.add('has-file');
        
      } else {
        // No file selected
        fileStatus.textContent = 'No file chosen';
        fileStatus.style.color = 'rgba(255, 255, 255, 0.8)';
        pdfBtnText.textContent = 'Choose PDF File'; // Use renamed variable
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
  const picturesBtnText = uploadPicturesBtn.querySelector('.btn-text'); // Local variable
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
    
    // Check minimum requirement - TANGGAL NA ANG VALIDATION MESSAGE
    if (totalPictures >= 5) {
      uploadPicturesBtn.classList.add('requirements-met');
      showValidation(`Great! You have selected ${totalPictures} pictures. Minimum requirement met.`, 'success');
    } else {
      uploadPicturesBtn.classList.remove('requirements-met');
      // TANGGAL NA: showValidation(`Please select at least ${5 - totalPictures} more picture(s). Minimum 5 pictures required.`, 'error');
    }
  }

  // Show validation message - PANG SUCCESS NA LANG
  function showValidation(message, type) {
    if (validationMessage && type === 'success') { // I-display lang kapag success
      validationMessage.textContent = message;
      validationMessage.className = `validation-message ${type}`;
    } else if (validationMessage) {
      // Hide validation message for errors
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
      // Simple alert na lang instead of validation message
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
}} );

// ===== SUBMIT PROJECT POPUP FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", function() {
    const submitProjectBtn = document.querySelector('.btn-primary[form="capstoneForm"]');
    const submitPopup = document.getElementById('submitPopup');
    const confirmSubmitBtn = submitPopup ? submitPopup.querySelector('.confirm-submit') : null;
    const cancelSubmitBtn = submitPopup ? submitPopup.querySelector('.cancel-submit') : null;

    function openSubmitPopup() {
        if (!submitPopup) return;
        
        // Validate form before showing popup
        const validationResult = validateFormBeforeSubmit();
        if (!validationResult.isValid) {
            showValidationError(validationResult.message);
            return; // Don't open popup if validation fails
        }
        
        submitPopup.classList.add('show');
        submitPopup.setAttribute('aria-hidden', 'false');
        
        // Focus on cancel button for accessibility
        if (cancelSubmitBtn) cancelSubmitBtn.focus();
    }

    function validateFormBeforeSubmit() {
        const professor = document.getElementById('professor').value.trim();
        const title = document.getElementById('title').value.trim();
        const year = document.getElementById('year').value.trim();
        const abstract = document.getElementById('abstract').value.trim();
        const fileInput = document.getElementById('upload');
        const teamMembers = document.querySelectorAll('#membersTableBody tr');
        
        // Check required fields
        const missingFields = [];
        if (!professor) missingFields.push('Professor');
        if (!title) missingFields.push('Project Title');
        if (!year) missingFields.push('Academic Year');
        if (!abstract) missingFields.push('Abstract');
        
        if (missingFields.length > 0) {
            return {
                isValid: false,
                message: `Please fill in the following required fields: ${missingFields.join(', ')}.`
            };
        }
        
        // Check abstract length
        if (abstract.length > 500) {
            return {
                isValid: false,
                message: 'Abstract must be 500 characters or less.'
            };
        }
        
        // Check PDF file
        if (!fileInput.files[0]) {
            return {
                isValid: false,
                message: 'Please upload a PDF file.'
            };
        }
        
        // Check team members
        if (teamMembers.length === 0) {
            return {
                isValid: false,
                message: 'Please add at least one team member.'
            };
        }
        
        // Check pictures (only if pictures functionality exists)
        if (typeof selectedPictures !== 'undefined' && selectedPictures.length < 5) {
            return {
                isValid: false,
                message: 'Please upload at least 5 pictures for the project.'
            };
        }
        
        return { isValid: true, message: '' };
    }

    function showValidationError(message) {
    // Create a nice validation error popup
    const errorPopup = document.createElement('div');
    errorPopup.className = 'validation-popup error-popup';
    errorPopup.innerHTML = `
        <div class="popup-content">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="error-title">Validation Error</div>
            <div class="error-message">${message}</div>
            <button type="button" class="close-error-btn">OK</button>
        </div>
    `;
    
    document.body.appendChild(errorPopup);
    
    // Add close functionality
    const closeBtn = errorPopup.querySelector('.close-error-btn');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(errorPopup);
    });
    
    // Close on overlay click
    errorPopup.addEventListener('click', function(e) {
        if (e.target === errorPopup) {
            document.body.removeChild(errorPopup);
        }
    });
    
    // Close on ESC key
    const closeOnEsc = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(errorPopup);
            document.removeEventListener('keydown', closeOnEsc);
        }
    };
    document.addEventListener('keydown', closeOnEsc);
}

    function closeSubmitPopup() {
        if (!submitPopup) return;
        submitPopup.classList.remove('show');
        submitPopup.setAttribute('aria-hidden', 'true');
    }

    function performSubmit() {
        if (!confirmSubmitBtn) return;
        
        // Show loading state
        const originalText = confirmSubmitBtn.innerHTML;
        confirmSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        confirmSubmitBtn.disabled = true;
        
        if (cancelSubmitBtn) cancelSubmitBtn.disabled = true;
        
        // Simulate submission process
        setTimeout(() => {
            // Here you would normally submit the form data
            // For now, we'll show a success message
            showSubmitSuccess();
            
        }, 2000);
    }

    function showSubmitSuccess() {
        // Update popup content to show success
        const successIcon = submitPopup.querySelector('.success-icon');
        const successTitle = submitPopup.querySelector('.success-title');
        const successSub = submitPopup.querySelector('.success-sub');
        const submitActions = submitPopup.querySelector('.submit-actions');
        
        // Change to success content
        if (successIcon) {
            successIcon.innerHTML = '<i class="fas fa-check-circle fa-3x" style="color: #4CAF50;"></i>';
        }
        if (successTitle) successTitle.textContent = 'Project Submitted Successfully!';
        if (successSub) successSub.textContent = 'Your capstone project has been submitted successfully.';
        
        // Replace buttons with success button
        submitActions.innerHTML = `
            <button type="button" class="success-btn close-success">OK</button>
        `;
        
        // Add event listener to close button
        const closeSuccessBtn = submitActions.querySelector('.close-success');
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', function() {
                closeSubmitPopup();
                resetForm(); // Reset the form
                resetPopupContent(); // Reset popup for next use
            });
        }
    }

    function resetForm() {
        // Reset all form fields
        document.getElementById('capstoneForm').reset();
        
        // Reset file upload
        const fileStatus = document.querySelector('.file-status');
        const btnText = document.querySelector('.btn-text');
        const uploadBtn = document.querySelector('.upload-btn');
        
        if (fileStatus) fileStatus.textContent = 'No file chosen';
        if (btnText) btnText.textContent = 'Choose PDF File';
        if (uploadBtn) uploadBtn.classList.remove('has-file');
        
        // Reset team members
        const tbody = document.getElementById('membersTableBody');
        if (tbody) tbody.innerHTML = '';
        memberCount = 0;
        
        // Reset pictures
        if (typeof selectedPictures !== 'undefined') {
            selectedPictures = [];
            const picturesPreview = document.getElementById('picturesPreview');
            if (picturesPreview) picturesPreview.innerHTML = '';
            const pictureStatus = document.querySelector('.picture-status');
            if (pictureStatus) pictureStatus.textContent = 'No pictures chosen';
            const picturesBtnText = document.querySelector('#uploadPicturesTrigger .btn-text');
            if (picturesBtnText) picturesBtnText.textContent = 'Choose Pictures';
        }
    }

    function resetPopupContent() {
        const successIcon = submitPopup.querySelector('.success-icon');
        const successTitle = submitPopup.querySelector('.success-title');
        const successSub = submitPopup.querySelector('.success-sub');
        const submitActions = submitPopup.querySelector('.submit-actions');
        
        // Reset to original content
        if (successIcon) {
            successIcon.innerHTML = '<img src="/Frontend/IMAGES/submit-icon.png" alt="Submit Icon" class="submit-popup-image" />';
        }
        if (successTitle) successTitle.textContent = 'Submit Project?';
        if (successSub) successSub.textContent = 'Are you sure you want to submit this capstone project? This action cannot be undone.';
        if (submitActions) {
            submitActions.innerHTML = `
                <button type="button" class="success-btn confirm-submit">Yes, Submit Project</button>
                <button type="button" class="cancel-submit">Cancel</button>
            `;
            
            // Re-attach event listeners
            const newConfirmBtn = submitActions.querySelector('.confirm-submit');
            const newCancelBtn = submitActions.querySelector('.cancel-submit');
            
            if (newConfirmBtn) newConfirmBtn.addEventListener('click', performSubmit);
            if (newCancelBtn) newCancelBtn.addEventListener('click', closeSubmitPopup);
        }
    }

    // Event Listeners
    if (submitProjectBtn) {
        submitProjectBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form submission
            openSubmitPopup();
        });
    }

    if (confirmSubmitBtn) {
        confirmSubmitBtn.addEventListener('click', performSubmit);
    }

    if (cancelSubmitBtn) {
        cancelSubmitBtn.addEventListener('click', closeSubmitPopup);
    }

    // Close popup on overlay click or ESC
    document.addEventListener('click', function(e) {
        if (!submitPopup) return;
        if (submitPopup.classList.contains('show') && e.target === submitPopup) {
            closeSubmitPopup();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (!submitPopup) return;
        if (e.key === 'Escape' && submitPopup.classList.contains('show')) {
            closeSubmitPopup();
        }
    });
});