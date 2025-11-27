class DynamicContentManager {
    constructor() {
        this.currentPage = 'home';
        this.lastNavClick = 0; // guard against double clicks
        this.init();
    }

    init() {
        this.loadNavigationHandlers();
        this.loadInitialContent();
        this.initializeSidebarToggle();
        this.initializeNotification();
        this.initializeProfile();
        this.initializeDropdowns();
        this.initializeLogout();
    }

    loadNavigationHandlers() {
        // Use event delegation on the sidebar (or document as fallback)
        const sidebar = document.querySelector('.sidebar') || document;
        sidebar.addEventListener('click', (e) => {
            // Find nearest clickable that has data-page (menu item, submenu item, action button)
            const link = e.target.closest('.menu-item[data-page], .submenu-item[data-page], .action-btn[data-page]');
            if (!link) return;

            e.preventDefault();

            // Simple debounce to ignore double/triple clicks in quick succession
            const now = Date.now();
            if (now - this.lastNavClick < 350) {
                // ignore rapid clicks
                return;
            }
            this.lastNavClick = now;

            const page = link.getAttribute('data-page');
            if (!page) return;

            // If the clicked page is already active, just update highlight and do nothing else
            if (page === this.currentPage) {
                this.updateActiveNav(link);
                return;
            }

            // Load target page and update nav UI
            this.loadPage(page);
            this.updateActiveNav(link);
        });

        // NOTE: Do NOT bind dropdown toggles here.
        // Binding is handled in initializeDropdowns() to avoid duplicate binding and missing method errors.
    }

    async loadPage(page) {
        try {
            this.currentPage = page;

            // Update page title
            this.updatePageTitle(page);

            let contentUrl = '';

            // For 'home' we intentionally do NOT inject a large home HTML block or a loading spinner.
            if (page === 'home') {
                const container = document.getElementById('dynamicContent');
                if (container) container.innerHTML = '';
                this.initializePageFunctionality('home');
                return;
            } else if ([
                'applicationDevelopment',
                'webApplication',
                'gameDevelopment',
                'internetofThings'
            ].includes(page)) {
                contentUrl = `/Frontend/HTML/Submission/${page}.html`;
            } else if ([
                'appdevData',
                'webappData',
                'gamedevData',
                'iotData'
            ].includes(page)) {
                contentUrl = `/Frontend/HTML/Management/${page}.html`;
            }

            if (contentUrl) {
                // Removed the loading spinner per request.
                const response = await fetch(contentUrl);
                if (!response.ok) throw new Error('Content not found');
                const htmlContent = await response.text();

                // Clear the content area and load the new content
                const dynamicEl = document.getElementById('dynamicContent');
                if (dynamicEl) dynamicEl.innerHTML = htmlContent;

                // IMPORTANT: Load the form-specific JavaScript after the HTML is inserted
                this.loadFormScripts(page);
            }

        } catch (error) {
            console.error('Error loading page:', error);
            this.showErrorContent();
        }
    }

    loadFormScripts(page) {
        const scriptMap = {
            'applicationDevelopment': '/Frontend/JAVASCRIPT/Submission/applicationDevelopment.js',
            'webApplication': '/Frontend/JAVASCRIPT/Submission/webApplication.js',
            'gameDevelopment': '/Frontend/JAVASCRIPT/Submission/gameDevelopment.js',
            'internetofThings': '/Frontend/JAVASCRIPT/Submission/internetofThings.js'
        };

        const scriptUrl = scriptMap[page];
        if (scriptUrl) {
            // Remove existing form script if any
            const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
            if (existingScript) {
                existingScript.remove();
            }

            // Load the new script
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.onload = () => {
                console.log(`${page} script loaded successfully`);
                this.initializePageFunctionality(page);
            };
            script.onerror = () => {
                console.error(`Failed to load ${page} script`);
                this.initializePageFunctionality(page);
            };
            document.body.appendChild(script);
        } else {
            // If no specific script, just initialize the functionality
            this.initializePageFunctionality(page);
        }
    }

    updatePageTitle(page) {
        const titleMap = {
            'home': 'Home',
            'applicationDevelopment': 'Application Development',
            'webApplication': 'Web Application',
            'gameDevelopment': 'Game Development',
            'internetofThings': 'Internet of Things',
            'appdevData': 'App Dev Data Management',
            'webappData': 'Web App Data Management',
            'gamedevData': 'Game Dev Data Management',
            'iotData': 'IoT Data Management'
        };

        const pageTitle = document.getElementById('dynamicPageTitle');
        if (pageTitle) {
            pageTitle.textContent = titleMap[page] || 'E-Capstone';
        }
    }

    updateActiveNav(clickedLink) {
        // Remove active class from all items
        const allItems = document.querySelectorAll('.menu-item, .submenu-item');
        allItems.forEach(item => item.classList.remove('active'));

        // Add active class to clicked item
        clickedLink.classList.add('active');

        // Also activate parent menu item if it's a submenu item
        if (clickedLink.classList.contains('submenu-item')) {
            const parentMenu = clickedLink.closest('.submenu').previousElementSibling;
            if (parentMenu) {
                parentMenu.classList.add('active');
            }
        }

        // Activate home menu if home page
        if (this.currentPage === 'home') {
            const homeMenu = document.querySelector('.menu-item[data-page="home"]');
            if (homeMenu) {
                homeMenu.classList.add('active');
            }
        }
    }

    initializePageFunctionality(page) {
        console.log(`Initializing functionality for: ${page}`);

        switch(page) {
            case 'home':
                this.initializeHomePage();
                break;
            case 'applicationDevelopment':
            case 'webApplication':
            case 'gameDevelopment':
            case 'internetofThings':
                console.log(`Form ${page} should be initialized by its own script`);
                break;
            case 'appdevData':
            case 'webappData':
            case 'gamedevData':
            case 'iotData':
                this.initializeManagementPage(page);
                break;
        }
    }

    initializeHomePage() {
        // Initialize quick action buttons if present in the DOM
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            if (!button.dataset.dynamicBound) {
                button.dataset.dynamicBound = "true";
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const category = button.getAttribute('data-page');
                    if (category && category !== this.currentPage) {
                        this.loadPage(category);
                    }
                });
            }
        });

        // Load stats if DOM elements exist
        this.loadHomeStats();
    }

    initializeManagementPage(page) {
        console.log('Initializing management page:', page);
    }

    loadHomeStats() {
        const totalSubmissions = document.getElementById('totalSubmissions');
        const activeProjects = document.getElementById('activeProjects');
        const completedProjects = document.getElementById('completedProjects');
        const pendingProjects = document.getElementById('pendingProjects');

        if (totalSubmissions) totalSubmissions.textContent = '24';
        if (activeProjects) activeProjects.textContent = '15';
        if (completedProjects) completedProjects.textContent = '9';
        if (pendingProjects) pendingProjects.textContent = '6';
    }

    initializeDropdowns() {
        const dropdownToggles = document.querySelectorAll(".menu-item.dropdown-toggle");
        dropdownToggles.forEach((toggle) => {
            const submenu = toggle.nextElementSibling;
            if (!submenu || !submenu.classList.contains("submenu")) return;

            if (toggle.dataset.dropdownBound) return;
            toggle.dataset.dropdownBound = 'true';

            toggle.addEventListener("click", (e) => {
                e.stopPropagation();

                // Toggle open class for arrow rotation + accessible state
                toggle.classList.toggle("open");

                // Use "open" for styling arrow, "show" for submenu visibility
                submenu.classList.toggle("show");

                // Optionally, set aria-expanded for accessibility
                const expanded = toggle.getAttribute("aria-expanded") === "true";
                toggle.setAttribute("aria-expanded", (!expanded).toString());
            });
        });

        // ===== ARROW =====
        const menuItems = document.querySelectorAll('.dropdown-toggle');
        menuItems.forEach(item => {
            if (item.dataset.arrowBound) return;
            item.dataset.arrowBound = 'true';
            item.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    }

    initializeNotification() {
        const notificationBtn = document.querySelector(".notification-btn");
        if (notificationBtn) {
            notificationBtn.addEventListener("click", () => {
                alert("You have 3 new notifications");
            });
        }
    }

    initializeProfile() {
        const profileBtn = document.querySelector(".profile-btn");
        if (profileBtn) {
            profileBtn.addEventListener("click", () => {
                window.location.href = "/Frontend/HTML/profile.html";
            });
        }
    }

    initializeLogout() {
        const logoutBtn = document.getElementById("logoutBtn");
        const logoutPopup = document.getElementById("logoutPopup");
        const confirmBtn = logoutPopup ? logoutPopup.querySelector(".confirm-logout") : null;
        const cancelBtn = logoutPopup ? logoutPopup.querySelector(".cancel-logout") : null;

        const openLogoutPopup = () => {
            if (!logoutPopup) return;
            logoutPopup.classList.add("show");
            logoutPopup.setAttribute("aria-hidden", "false");
            if (cancelBtn) cancelBtn.focus();
        };

        const closeLogoutPopup = () => {
            if (!logoutPopup) return;
            logoutPopup.classList.remove("show");
            logoutPopup.setAttribute("aria-hidden", "true");
        };

        const performSmoothLogout = () => {
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
        };

        if (logoutBtn) logoutBtn.addEventListener("click", (e) => { e.preventDefault(); openLogoutPopup(); });
        if (confirmBtn) confirmBtn.addEventListener("click", performSmoothLogout);
        if (cancelBtn) cancelBtn.addEventListener("click", closeLogoutPopup);

        // Do NOT close popup on overlay click (consistent with other changes)
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLogoutPopup(); });
    }

    setActiveMenuItem() {
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
    }

    initializeSidebarToggle() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }
    }

    showErrorContent() {
        document.getElementById('dynamicContent').innerHTML = `
            <div class="error-content">
                <h2>Content Not Found</h2>
                <p>The requested page could not be loaded.</p>
                <button onclick="location.reload()">Reload Page</button>
            </div>
        `;
    }

    loadInitialContent() {
        this.loadPage('home');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DynamicContentManager();
});