// Global variables
let memberCount = 0;
let selectedPictures = [];

// DOM Elements
const capstoneForm = document.getElementById('capstoneForm');
const submitProjectBtn = document.getElementById('submitProjectBtn');
const submitPopup = document.getElementById('submitPopup');
const submitSuccess = document.getElementById('submitSuccess');
const qrPopup = document.getElementById('qrPopup');
const clearSuccess = document.getElementById('clearSuccess');

// Team Members
const fullNameInput = document.getElementById('fullName');
const sectionInput = document.getElementById('section');
const emailInput = document.getElementById('email');
const addMemberBtn = document.getElementById('addMemberBtn');
const membersTableBody = document.getElementById('membersTableBody');

// File Uploads
const pdfUpload = document.getElementById('pdfUpload');
const uploadBtn = document.querySelector('.upload-btn');
const fileStatus = document.querySelector('.file-status');
const btnText = document.querySelector('.btn-text');
const pictureUpload = document.getElementById('pictureUpload');
const uploadPicturesTrigger = document.getElementById('uploadPicturesTrigger');
const picturesBtnText = document.querySelector('#uploadPicturesTrigger .btn-text');
const pictureStatus = document.querySelector('.picture-status');
const picturesPreview = document.getElementById('picturesPreview');

// Popup Buttons
const confirmSubmitBtn = document.querySelector('.confirm-submit');
const cancelSubmitBtn = document.querySelector('.cancel-submit');
const confirmSuccessBtn = document.querySelector('.confirm-success');
const generateQrBtn = document.getElementById('generateQrBtn');
const closeQrBtn = document.getElementById('closeQrBtn');
const downloadQrBtn = document.getElementById('downloadQrBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Submit project button
    if (submitProjectBtn) {
        submitProjectBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSubmitPopup();
        });
    }
    
    // Team member addition
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', addTeamMember);
    }
    
    // File uploads
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            pdfUpload.click();
        });
    }
    
    if (pdfUpload) {
        pdfUpload.addEventListener('change', handlePdfUpload);
    }
    
    if (uploadPicturesTrigger) {
        uploadPicturesTrigger.addEventListener('click', function() {
            pictureUpload.click();
        });
    }
    
    if (pictureUpload) {
        pictureUpload.addEventListener('change', handlePictureUpload);
    }
    
    // Popup buttons
    if (confirmSubmitBtn) {
        confirmSubmitBtn.addEventListener('click', performSubmit);
    }
    
    if (cancelSubmitBtn) {
        cancelSubmitBtn.addEventListener('click', closeSubmitPopup);
    }
    
    if (confirmSuccessBtn) {
        confirmSuccessBtn.addEventListener('click', function() {
            closeSubmitSuccess();
            clearAllTextFields();
        });
    }
    
    if (generateQrBtn) {
        generateQrBtn.addEventListener('click', function() {
            closeSubmitSuccess();
            generateQRCode();
            showQRPopup();
        });
    }
    
    if (closeQrBtn) {
        closeQrBtn.addEventListener('click', closeQRPopup);
    }
    
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', downloadQRCode);
    }
}

// Team Member Functions
function addTeamMember() {
    const fullName = fullNameInput.value.trim();
    const section = sectionInput.value.trim();
    const email = emailInput.value.trim();
    
    if (!fullName || !section || !email) {
        alert('Please fill in all fields for team member');
        return;
    }
    
    memberCount++;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${fullName}</td>
        <td>${section}</td>
        <td>${email}</td>
        <td>
            <button type="button" class="delete-member" data-id="${memberCount}">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    membersTableBody.appendChild(row);
    
    // Clear input fields
    fullNameInput.value = '';
    sectionInput.value = '';
    emailInput.value = '';
    
    // Add event listener to delete button
    const deleteBtn = row.querySelector('.delete-member');
    deleteBtn.addEventListener('click', function() {
        row.remove();
    });
}

// File Upload Functions
function handlePdfUpload() {
    if (pdfUpload.files.length > 0) {
        const fileName = pdfUpload.files[0].name;
        fileStatus.textContent = fileName;
        btnText.textContent = 'Change PDF File';
        uploadBtn.classList.add('has-file');
    } else {
        fileStatus.textContent = 'No file chosen';
        btnText.textContent = 'Choose PDF File';
        uploadBtn.classList.remove('has-file');
    }
}

function handlePictureUpload() {
    if (pictureUpload.files.length > 0) {
        const files = Array.from(pictureUpload.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const pictureId = Date.now() + Math.random();
                    selectedPictures.push({
                        id: pictureId,
                        file: file,
                        url: e.target.result
                    });
                    
                    displayPicturePreview(pictureId, e.target.result);
                    updatePictureStatus();
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        picturesBtnText.textContent = 'Add More Pictures';
        uploadPicturesTrigger.classList.add('requirements-met');
    }
}

function displayPicturePreview(id, url) {
    const preview = document.createElement('div');
    preview.className = 'picture-preview';
    preview.innerHTML = `
        <img src="${url}" alt="Preview">
        <button type="button" class="remove-picture" data-id="${id}">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    picturesPreview.appendChild(preview);
    
    // Add event listener to remove button
    const removeBtn = preview.querySelector('.remove-picture');
    removeBtn.addEventListener('click', function() {
        removePicture(id);
    });
}

function removePicture(id) {
    // Remove from array
    selectedPictures = selectedPictures.filter(picture => picture.id !== id);
    
    // Remove from DOM
    const preview = document.querySelector(`.remove-picture[data-id="${id}"]`).closest('.picture-preview');
    preview.remove();
    
    updatePictureStatus();
}

function updatePictureStatus() {
    const count = selectedPictures.length;
    pictureStatus.textContent = count === 1 ? '1 picture chosen' : `${count} pictures chosen`;
    
    if (count === 0) {
        picturesBtnText.textContent = 'Choose Pictures';
        uploadPicturesTrigger.classList.remove('requirements-met');
    }
}

// Popup Functions
function openSubmitPopup() {
    submitPopup.classList.add('active');
}

function closeSubmitPopup() {
    submitPopup.classList.remove('active');
}

function openSubmitSuccess() {
    submitSuccess.classList.add('active');
}

function closeSubmitSuccess() {
    submitSuccess.classList.remove('active');
}

function showQRPopup() {
    qrPopup.classList.add('active');
}

function closeQRPopup() {
    qrPopup.classList.remove('active');
}

function showClearSuccessNotification() {
    clearSuccess.classList.add('active');
    
    setTimeout(() => {
        clearSuccess.classList.remove('active');
    }, 3000);
}

// Submission Flow Functions
function performSubmit() {
    // Here you would typically submit the form data to a server
    console.log('Project submitted successfully!');
    
    // Close the confirmation popup and show success popup
    closeSubmitPopup();
    openSubmitSuccess();
}

function generateQRCode() {
    const qrCodeDisplay = document.getElementById('qrCodeDisplay');
    
    // In a real application, you would generate an actual QR code
    // For this example, we'll create a placeholder
    qrCodeDisplay.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 200px; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 1px solid #ddd;">
                <span style="color: #7f8c8d;">QR Code Placeholder</span>
            </div>
            <p style="margin-top: 10px; color: #7f8c8d;">QR code would be generated here with project data</p>
        </div>
    `;
}

function downloadQRCode() {
    // In a real application, you would implement QR code download functionality
    alert('QR Code download functionality would be implemented here');
}

// Clear Form Function
function clearAllTextFields() {
    // Reset main form
    if (capstoneForm) {
        capstoneForm.reset();
    }

    // Clear specific text fields
    const professor = document.getElementById('professor');
    const title = document.getElementById('title');
    const year = document.getElementById('year');
    const abstract = document.getElementById('abstract');
    
    if (professor) professor.value = '';
    if (title) title.value = '';
    if (year) year.value = '';
    if (abstract) abstract.value = '';

    // Clear team member input fields
    if (fullNameInput) fullNameInput.value = '';
    if (sectionInput) sectionInput.value = '';
    if (emailInput) emailInput.value = '';

    // Clear team members table
    if (membersTableBody) {
        membersTableBody.innerHTML = '';
    }

    // Reset file upload
    if (fileStatus) fileStatus.textContent = 'No file chosen';
    if (btnText) btnText.textContent = 'Choose PDF File';
    if (uploadBtn) uploadBtn.classList.remove('has-file');
    
    // Reset pictures
    selectedPictures = [];
    
    // Clear pictures preview
    if (picturesPreview) {
        picturesPreview.innerHTML = '';
    }
    
    // Reset picture status
    if (pictureStatus) {
        pictureStatus.textContent = 'No pictures chosen';
    }
    
    // Reset picture button text
    if (picturesBtnText) {
        picturesBtnText.textContent = 'Choose Pictures';
    }
    
    // Reset picture input file
    if (pictureUpload) {
        pictureUpload.value = '';
    }
    
    // Reset picture upload button styling
    if (uploadPicturesTrigger) {
        uploadPicturesTrigger.classList.remove('requirements-met');
    }

    // Reset counters
    memberCount = 0;

    showClearSuccessNotification();
}