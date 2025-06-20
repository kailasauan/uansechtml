// semantic-converter.js
// Converts semantic CSS classes to Tailwind CSS classes and injects dynamic UI components.

document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * Main initialization function. Orchestrates all setup tasks.
     */
    function init() {
        if (!window.SITE_THEME) {
            console.warn('SITE_THEME configuration object not found. UI will not be fully rendered.');
            return;
        }
        
        const theme = window.SITE_THEME;

        configureTailwind(theme);
        injectNavigation(theme);
        // Pass banner configuration directly
        if (theme.banner) {
            injectBanner(theme.banner.title, theme.banner.imageUrl);
        }
        injectFooter(theme);
        applySemanticStyles(theme);
        setupEventListeners();
    }

    /**
     * Configures Tailwind with custom colors from the theme object.
     * @param {object} theme - The SITE_THEME object.
     */
    function configureTailwind(theme) {
        if (theme.colors) {
            tailwind.config = {
                theme: {
                    extend: {
                        colors: theme.colors
                    }
                }
            };
        }
    }

    /**
     * Applies semantic class transformations to elements on the page.
     * @param {object} theme - The SITE_THEME object.
     */
    function applySemanticStyles(theme) {
        if (!theme.classes) {
            console.warn('SITE_THEME.classes not found. No semantic styles will be applied.');
            return;
        }
        
        Object.entries(theme.classes).forEach(([semanticClass, tailwindClasses]) => {
            const elements = document.querySelectorAll(`.${semanticClass}`);
            elements.forEach(element => {
                element.classList.remove(semanticClass);
                // Ensure tailwindClasses is a non-empty string before splitting
                if (tailwindClasses && typeof tailwindClasses === 'string') {
                    element.classList.add(...tailwindClasses.split(' ').filter(Boolean));
                }
            });
        });
    }

    /**
     * Injects the main navigation menu, built dynamically from the theme object.
     * @param {object} theme - The SITE_THEME object.
     */
    function injectNavigation(theme) {
        const navLinksHTML = (theme.navigation || [])
            .map(link => `
                <a href="${link.href}" class="nav-link relative text-white hover:text-gold font-medium text-lg tracking-wide transition-all duration-300 ease-out py-2 px-3 rounded-lg hover:bg-white/10 hover:shadow-lg group">
                    <span class="relative z-10">${link.name}</span>
                    <span class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gold transition-all duration-300 ease-out group-hover:w-full group-hover:left-0 rounded-full"></span>
                </a>
            `)
            .join('');

        const mobileLinksHTML = (theme.navigation || [])
            .map((link, index, arr) => {
                const borderClass = index < arr.length - 1 ? 'border-b border-white/20' : '';
                return `
                    <a href="${link.href}" class="block text-white hover:text-gold font-medium text-lg py-4 px-4 ${borderClass} transition-all duration-300 ease-out hover:bg-white/10 hover:pl-6 rounded-lg hover:shadow-md">
                        ${link.name}
                    </a>
                `;
            })
            .join('');

        const nav = document.createElement('nav');
        nav.className = 'absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-md border-b border-white/10';
        nav.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    <!-- Mobile menu button -->
                    <button class="mobile-menu-open md:hidden text-white hover:text-gold transition-all duration-300 ease-out hover:scale-110 p-2 rounded-lg hover:bg-white/10">
                        <svg class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    
                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex space-x-2 mx-auto">
                        ${navLinksHTML}
                    </div>
                    
                    <!-- Empty div for flex spacing on mobile -->
                    <div class="md:hidden w-6"></div>
                </div>
            </div>
            
            <!-- Mobile Menu -->
            <div class="mobile-menu fixed top-0 right-0 h-full w-80 bg-primary/95 backdrop-blur-lg md:hidden translate-x-full transition-all duration-500 ease-out shadow-2xl border-l border-gold/20">
                <div class="flex justify-end p-6">
                    <button class="mobile-menu-close text-white hover:text-gold transition-all duration-300 ease-out hover:scale-110 hover:rotate-90 p-2 rounded-lg hover:bg-white/10">
                        <svg class="w-6 h-6 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <nav class="px-6 space-y-2">
                    ${mobileLinksHTML}
                </nav>
            </div>
            
            <!-- Mobile Menu Overlay -->
            <div class="mobile-menu-overlay fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden opacity-0 invisible transition-all duration-500 ease-out"></div>
        `;
        document.body.prepend(nav);
    }

    /**
     * Injects the hero banner with a dynamic title and background image.
     * @param {string} title - The main heading for the banner.
     * @param {string} imageUrl - The URL for the background image.
     */
    function injectBanner(title, imageUrl) {
        const banner = document.createElement('section');
        banner.className = 'relative h-[500px] flex items-end justify-center text-center text-white overflow-hidden';
        banner.innerHTML = `
            <img src="${imageUrl}" alt="Banner background" class="absolute top-0 left-0 w-full h-full object-cover z-10 transition-transform duration-700 ease-out hover:scale-105">
            <!-- <div class="absolute top-0 left-0 w-full h-full banner-overlay-gradient z-20"></div> -->
            
            <div class="absolute top-20 left-5 md:top-24 md:left-8 z-30 flex flex-col items-center gap-2.5 p-4 animate-fade-in-up">
                <img src="${window.SITE_THEME.logoUrl || ''}" alt="UAN Logo" class="w-48 md:w-72 h-auto object-contain logo-glow transition-all duration-500 ease-out hover:scale-105 drop-shadow-2xl">
            </div>

            <div class="banner-content relative z-30 max-w-5xl px-5 pb-16 animate-fade-in-up-delayed">
                <p class="text-xl md:text-2xl mb-5 font-normal text-shadow-enhanced tracking-wide opacity-90 transition-all duration-500 ease-out hover:opacity-100">
                    United Ancient Indigenous Enlightened Nations (UAN)
                </p>
                <h1 class="text-4xl md:text-6xl font-bold text-shadow-enhanced tracking-wider text-white transition-all duration-500 ease-out hover:text-gold">
                    ${title}
                </h1>
            </div>
        `;
        // Insert banner after the navigation
        const navElement = document.querySelector('nav');
        if (navElement) {
            navElement.after(banner);
        } else {
            document.body.prepend(banner);
        }
    }

    /**
     * Injects the footer, built dynamically from the theme object.
     * @param {object} theme - The SITE_THEME object.
     */
    function injectFooter(theme) {
        const footerConfig = theme.footer || {};
        const contact = footerConfig.contact || {};
        const copyright = footerConfig.copyright || `© ${new Date().getFullYear()} Your Organization`;
        
        const footer = document.createElement('footer');
        footer.className = 'bg-gradient-to-r from-primary to-primary/90 text-white py-12 w-full shadow-2xl border-t border-gold/20';
        footer.innerHTML = `
        <div class="w-full px-5 md:px-8 lg:px-12">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                <div class="flex items-center gap-4 group">
                    <img src="${theme.logoUrl || ''}" alt="UAN Logo" class="w-[280px] h-auto object-contain transition-all duration-500 ease-out group-hover:scale-105 drop-shadow-lg">
                </div>
                
                <div class="text-left md:text-right space-y-2">
                    ${contact.phone ? `<div class="text-base mb-1 transition-colors duration-300 hover:text-gold cursor-pointer">${contact.phone}</div>` : ''}
                    ${contact.email ? `<div class="text-base transition-colors duration-300 hover:text-gold cursor-pointer">${contact.email}</div>` : ''}
                </div>
            </div>
            
            <div class="border-t border-white/20 pt-6">
                <div class="text-base text-center md:text-left opacity-80">
                    ${copyright}
                </div>
            </div>
        </div>
        `;
        document.body.appendChild(footer);
    }

    /**
     * Sets up event listeners for interactive elements like the mobile menu.
     */
    function setupEventListeners() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const openButton = document.querySelector('.mobile-menu-open');
        const closeButton = document.querySelector('.mobile-menu-close');

        if (mobileMenu && openButton && closeButton && mobileMenuOverlay) {
            const openMenu = () => {
                mobileMenu.classList.remove('translate-x-full');
                mobileMenuOverlay.classList.remove('opacity-0', 'invisible');
                document.body.style.overflow = 'hidden';
            };
            
            const closeMenu = () => {
                mobileMenu.classList.add('translate-x-full');
                mobileMenuOverlay.classList.add('opacity-0', 'invisible');
                document.body.style.overflow = '';
            };
            
            openButton.addEventListener('click', openMenu);
            closeButton.addEventListener('click', closeMenu);
            mobileMenuOverlay.addEventListener('click', closeMenu);
        }
    }

    // Run the initialization function
    init();
});
