// Handle form submission
document.getElementById('applicationDevForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const projectData = {
    title: formData.get('projectTitle'),
    description: formData.get('description'),
    technologies: formData.get('technologies'),
    githubLink: formData.get('githubLink'),
    file: formData.get('fileUpload')
  };

  // Validate required fields
  if (!projectData.title || !projectData.description || !projectData.technologies) {
    alert('Please fill in all required fields!');
    return;
  }

  // Here you would typically send the data to your backend
  console.log('Application Development Project Submission:', projectData);

  // Show success message
  alert('Application Development project submitted successfully!');

  // Reset form
  this.reset();
});

// Handle sidebar menu toggle for mobile
document.querySelector('.menu-toggle').addEventListener('click', function() {
  document.querySelector('.sidebar').classList.toggle('active');
});

// Close sidebar when clicking on a menu item
document.querySelectorAll('.menu-item, .submenu-item').forEach(item => {
  item.addEventListener('click', function() {
    if (window.innerWidth <= 768) {
      document.querySelector('.sidebar').classList.remove('active');
    }
  });
});

// Toggle dropdown function
function toggleDropdown(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const toggle = event ? event.currentTarget : this;
  const submenu = toggle.nextElementSibling;

  if (!submenu || !submenu.classList.contains('submenu')) {
    return;
  }

  const isOpen = toggle.classList.contains('open');

  // Toggle current dropdown (allow multiple dropdowns to be open)
  if (isOpen) {
    toggle.classList.remove('open');
    submenu.classList.remove('show');
  } else {
    toggle.classList.add('open');
    submenu.classList.add('show');
  }
}

// Initialize dropdown menus
document.addEventListener('DOMContentLoaded', function() {
  const dropdownToggles = document.querySelectorAll('.menu-item.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown.call(this, e);
    });
  });

  // Also handle clicks on submenu items to close dropdown
  document.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', function(e) {
      const submenu = this.closest('.submenu');
      if (submenu) {
        const toggle = submenu.previousElementSibling;
        if (toggle && toggle.classList.contains('menu-item')) {
          toggle.classList.remove('open');
          submenu.classList.remove('show');
        }
      }
    });
  });
});
