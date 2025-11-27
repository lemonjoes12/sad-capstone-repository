class DynamicContentManager {
    constructor() {
        this.currentPage = 'home';
        this.lastNavClick = 0;
        this.logoutInitialized = false;
        this._logoutClickHandler = null;
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
        const sidebar = document.querySelector('.sidebar') || document;
        sidebar.addEventListener('click', (e) => {
            const link = e.target.closest('.menu-item[data-page], .submenu-item[data-page], .action-btn[data-page]');
            if (!link) return;

            e.preventDefault();

            const now = Date.now();
            if (now - this.lastNavClick < 350) return;
            this.lastNavClick = now;

            const page = link.getAttribute('data-page');
            if (!page) return;

            if (page === this.currentPage) {
                this.updateActiveNav(link);
                return;
            }

            this.loadPage(page);
            this.updateActiveNav(link);
        });
    }

    async loadPage(page) {
        try {
            console.log('🔍 START loading page:', page);

            this.currentPage = page;
            this.updatePageTitle(page);

            let contentUrl = '';

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

            console.log('📦 Content URL:', contentUrl);

            if (contentUrl) {
                const response = await fetch(contentUrl);
                console.log('📡 Response status:', response.status);

                if (!response.ok) throw new Error('Content not found');

                const htmlContent = await response.text();

                const dynamicEl = document.getElementById('dynamicContent');
                if (dynamicEl) {
                    // parse fetched HTML into a temporary container
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;

                    // 1) Move any <link rel="stylesheet"> from fetched HTML to document.head (avoid duplicates)
                    const linkEls = Array.from(tempDiv.querySelectorAll('link[rel="stylesheet"]'));
                    linkEls.forEach(link => {
                        try {
                            const href = link.getAttribute('href');
                            if (!href) { link.remove(); return; }
                            // do not add duplicates
                            if (!document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
                                const newLink = document.createElement('link');
                                newLink.rel = 'stylesheet';
                                newLink.href = href;
                                document.head.appendChild(newLink);
                                console.log('✅ Appended stylesheet to head:', href);
                            } else {
                                console.log('ℹ️ Stylesheet already present:', href);
                            }
                        } catch (err) {
                            console.warn('⚠️ Error moving link to head:', err);
                        } finally {
                            // remove from tempDiv so it won't be placed inside #dynamicContent
                            link.remove();
                        }
                    });

                    // 2) Move any <style> tags to head (preserve inline styles)
                    const styleEls = Array.from(tempDiv.querySelectorAll('style'));
                    styleEls.forEach(style => {
                        try {
                            const newStyle = document.createElement('style');
                            newStyle.textContent = style.textContent;
                            document.head.appendChild(newStyle);
                            console.log('✅ Moved inline <style> to head');
                        } catch (err) {
                            console.warn('⚠️ Error moving style to head:', err);
                        } finally {
                            style.remove();
                        }
                    });

                    // 3) Ensure Font / Icon CSS exist (font-awesome / google fonts) - add if missing
                    const faHref = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
                    if (!document.querySelector(`link[href="${faHref}"]`)) {
                        const faLink = document.createElement('link');
                        faLink.rel = 'stylesheet';
                        faLink.href = faHref;
                        document.head.appendChild(faLink);
                        console.log('✅ Added FontAwesome to head');
                    }

                    // 4) MOVE form-specific popups (don't remove them) so application scripts can use them
                    const popupIdsToMove = ['submitPopup', 'submitSuccess', 'qrPopup', 'validationPopup'];
                    popupIdsToMove.forEach(id => {
                        const el = tempDiv.querySelector(`#${id}`);
                        if (el) {
                            // remove existing duplicate in document if any
                            const existing = document.getElementById(id);
                            if (existing) existing.remove();
                            // append to body so popups are top-level and not trapped by stacking contexts
                            document.body.appendChild(el);
                            // ensure hidden and non-blocking initially
                            el.classList.remove('show');
                            el.setAttribute('aria-hidden', 'true');
                            el.style.pointerEvents = 'none';
                            console.log(`📌 Moved popup #${id} to document.body`);
                        }
                    });

                    // 5) Remove any other overlay/popup classes that might conflict (but avoid removing the moved ones)
                    const otherOverlays = Array.from(tempDiv.querySelectorAll('.popup-overlay, .legacy-popup'));
                    otherOverlays.forEach(o => {
                        // if it's one of the moved IDs skip removal (we already moved them)
                        if (o.id && popupIdsToMove.includes(o.id)) return;
                        o.remove();
                    });

                    // 6) Extract scripts: collect <script src> and inline <script> to execute after insertion
                    const scriptEls = Array.from(tempDiv.querySelectorAll('script'));
                    const externalScripts = [];
                    const inlineScripts = [];
                    scriptEls.forEach(s => {
                        const src = s.getAttribute('src');
                        if (src) externalScripts.push(src);
                        else if (s.textContent && s.textContent.trim()) inlineScripts.push(s.textContent);
                        s.remove();
                    });

                    // 7) Insert the cleaned HTML into dynamic content
                    dynamicEl.innerHTML = tempDiv.innerHTML;

                    // 8) Load external scripts sequentially (avoid duplicates)
                    const loadExternalScripts = async () => {
                        for (const src of externalScripts) {
                            if (!document.querySelector(`script[src="${src}"]`)) {
                                await new Promise((resolve) => {
                                    const script = document.createElement('script');
                                    script.src = src;
                                    script.async = false;
                                    script.onload = () => { console.log('✅ Loaded script:', src); resolve(); };
                                    script.onerror = () => { console.warn('⚠️ Failed to load script:', src); resolve(); };
                                    document.body.appendChild(script);
                                });
                            } else {
                                console.log('ℹ️ Script already present:', src);
                            }
                        }
                        // then run inline scripts
                        inlineScripts.forEach(code => {
                            try {
                                const fn = new Function(code);
                                fn();
                                console.log('✅ Executed inline script');
                            } catch (err) {
                                console.warn('⚠️ Error executing inline script:', err);
                            }
                        });
                    };

                    // 9) If there are mapped form CSS files, ensure they're loaded (backward compatibility)
                    this.loadFormCSS(page);

                    // run scripts after a short delay to allow CSS to apply
                    setTimeout(() => {
                        loadExternalScripts().then(() => {
                            // call loader for page-specific JS initializers
                            this.loadFormScripts(page);
                            // re-initialize logout in case DOM moved/popups changed
                            setTimeout(() => this.initializeLogout(), 120);
                        });
                    }, 60);
                }
            }
        } catch (error) {
            console.error('❌ Error loading page:', error);
            this.showErrorContent();
        }
    }

    loadFormCSS(page) {
        const cssMap = {
            'applicationDevelopment': '/Frontend/CSS/Submission/applicationDevelopment.css',
            'webApplication': '/Frontend/CSS/Submission/webApplication.css',
            'gameDevelopment': '/Frontend/CSS/Submission/gameDevelopment.css',
            'internetofThings': '/Frontend/CSS/Submission/internetofThings.css'
        };

        const cssUrl = cssMap[page];
        if (cssUrl) {
            const existingCSS = document.querySelector(`link[href="${cssUrl}"]`);
            if (!existingCSS) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssUrl;
                document.head.appendChild(link);
                console.log(`✅ Loaded CSS: ${cssUrl}`);
            } else {
                console.log(`ℹ️ CSS already loaded: ${cssUrl}`);
            }
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
            const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
            if (existingScript) existingScript.remove();

            setTimeout(() => {
                const script = document.createElement('script');
                script.src = scriptUrl;
                script.onload = () => {
                    console.log(`✅ ${page} script loaded successfully`);
                    this.initializePageFunctionality(page);
                };
                script.onerror = () => {
                    console.error(`❌ Failed to load ${page} script`);
                    this.initializePageFunctionality(page);
                };
                document.body.appendChild(script);
            }, 50);
        } else {
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
        if (pageTitle) pageTitle.textContent = titleMap[page] || 'E-Capstone';
    }

    updateActiveNav(clickedLink) {
        const allItems = document.querySelectorAll('.menu-item, .submenu-item');
        allItems.forEach(item => item.classList.remove('active'));
        clickedLink.classList.add('active');

        if (clickedLink.classList.contains('submenu-item')) {
            const parentMenu = clickedLink.closest('.submenu').previousElementSibling;
            if (parentMenu) parentMenu.classList.add('active');
        }

        if (this.currentPage === 'home') {
            const homeMenu = document.querySelector('.menu-item[data-page="home"]');
            if (homeMenu) homeMenu.classList.add('active');
        }
    }

    initializePageFunctionality(page) {
        console.log(`Initializing functionality for: ${page}`);
        switch (page) {
            case 'home': this.initializeHomePage(); break;
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
                toggle.classList.toggle("open");
                submenu.classList.toggle("show");
                const expanded = toggle.getAttribute("aria-expanded") === "true";
                toggle.setAttribute("aria-expanded", (!expanded).toString());
            });
        });

        const menuItems = document.querySelectorAll('.dropdown-toggle');
        menuItems.forEach(item => {
            if (item.dataset.arrowBound) return;
            item.dataset.arrowBound = 'true';
            item.addEventListener('click', () => item.classList.toggle('active'));
        });
    }

    initializeNotification() {
        const notificationBtn = document.querySelector(".notification-btn");
        if (notificationBtn) {
            notificationBtn.addEventListener("click", () => alert("You have 3 new notifications"));
        }
    }

    initializeProfile() {
        const profileBtn = document.querySelector(".profile-btn");
        if (profileBtn) {
            profileBtn.addEventListener("click", () => window.location.href = "/Frontend/HTML/profile.html");
        }
    }

    initializeLogout() {
        // Make initialization idempotent
        if (this.logoutInitialized) return;
        this.logoutInitialized = true;

        console.log('🔄 Initializing logout functionality');

        const logoutBtn = document.getElementById("logoutBtn");
        let logoutPopup = document.getElementById("logoutPopup");

        console.log('🔍 Logout button exists:', !!logoutBtn);
        console.log('🔍 Logout popup exists:', !!logoutPopup);

        if (!logoutBtn || !logoutPopup) {
            console.error('❌ Logout elements not found!');
            return;
        }

        if (logoutPopup.parentElement !== document.body) {
            try { document.body.appendChild(logoutPopup); console.log('📌 Moved logoutPopup to document.body'); } catch (err) { console.warn(err); }
        }

        // Defensive styles
        logoutPopup.style.position = 'fixed';
        logoutPopup.style.left = '0';
        logoutPopup.style.top = '0';
        logoutPopup.style.right = '0';
        logoutPopup.style.bottom = '0';
        logoutPopup.style.zIndex = '120000';

        const popupContent = logoutPopup.querySelector('.popup-content');
        if (popupContent) popupContent.style.zIndex = '120001';

        // delegated click handler bound once
        this._logoutClickHandler = (e) => {
            if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
                e.preventDefault();
                e.stopPropagation();
                this.openLogoutPopup();
            }
        };
        document.addEventListener('click', this._logoutClickHandler);

        const confirmBtn = logoutPopup.querySelector(".confirm-logout");
        const cancelBtn = logoutPopup.querySelector(".cancel-logout");

        // initial state: non-blocking while hidden
        logoutPopup.style.pointerEvents = 'none';

        this.openLogoutPopup = () => {
            if (logoutPopup.parentElement !== document.body) {
                try { document.body.appendChild(logoutPopup); } catch (err) { /* ignore */ }
            }

            // inline fallback (makes sure it's visible if other CSS overrides)
            logoutPopup.style.pointerEvents = 'auto';
            logoutPopup.style.opacity = '1';
            logoutPopup.style.visibility = 'visible';
            if (popupContent) {
                popupContent.style.opacity = '1';
                popupContent.style.visibility = 'visible';
                popupContent.style.transform = 'translateY(0) scale(1)';
                popupContent.style.zIndex = '120001';
            }

            logoutPopup.classList.add("show", "force-show");
            logoutPopup.setAttribute("aria-hidden", "false");
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            if (cancelBtn) cancelBtn.focus();
            console.log('📱 Opening logout popup...');
        };

        this.closeLogoutPopup = () => {
            logoutPopup.classList.remove("show", "force-show");
            logoutPopup.setAttribute("aria-hidden", "true");
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            logoutPopup.style.pointerEvents = 'none';
            // clean inline fallback styles
            logoutPopup.style.opacity = '';
            logoutPopup.style.visibility = '';
            if (popupContent) {
                popupContent.style.opacity = '';
                popupContent.style.visibility = '';
                popupContent.style.transform = '';
            }
            console.log('📴 Closed logout popup');
        };

        const performSmoothLogout = () => {
            console.log('🚪 Performing logout...');
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

        if (confirmBtn) confirmBtn.onclick = performSmoothLogout;
        if (cancelBtn) cancelBtn.onclick = this.closeLogoutPopup;

        document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.closeLogoutPopup(); });

        console.log('✅ Logout functionality initialized');
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
            menuToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
        }
    }

    showErrorContent() {
        const dynamicContent = document.getElementById('dynamicContent');
        if (dynamicContent) {
            dynamicContent.innerHTML = `
                <div class="error-content">
                    <h2>Content Not Found</h2>
                    <p>The requested page could not be loaded.</p>
                    <button onclick="location.reload()">Reload Page</button>
                </div>
            `;
        }
    }

    loadInitialContent() {
        this.loadPage('home');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DynamicContentManager();
});