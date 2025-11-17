// Smooth scroll behavior and animations
document.addEventListener('DOMContentLoaded', function() {
    // Reset scroll position on page load
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
    
    // Sync gradient banner height with image banner height
    function syncBannerHeights() {
        const imageBanner = document.querySelector('.lab-card-banner-image');
        const gradientBanner = document.querySelector('.lab-card-banner-gradient');
        
        if (imageBanner && gradientBanner) {
            // Use a more reliable method to get image height
            const updateHeight = () => {
                // Try both naturalHeight and offsetHeight
                let imageHeight = imageBanner.naturalHeight || imageBanner.offsetHeight || imageBanner.clientHeight;
                
                // If natural height is available but might be 0 due to CSS, use offsetHeight
                if (imageHeight === 0 || !imageHeight) {
                    imageHeight = imageBanner.offsetHeight || imageBanner.clientHeight;
                }
                
                // Also check the parent container height
                const bannerContainer = imageBanner.closest('.lab-card-banner');
                if (bannerContainer && !imageHeight) {
                    imageHeight = bannerContainer.offsetHeight;
                }
                
                if (imageHeight > 0) {
                    gradientBanner.style.height = imageHeight + 'px';
                }
            };
            
            // Check if image is already loaded
            if (imageBanner.complete && imageBanner.naturalHeight !== 0) {
                updateHeight();
            } else {
                // Wait for image to load
                imageBanner.addEventListener('load', updateHeight, { once: true });
                // Also update after a short delay in case load event already fired
                setTimeout(updateHeight, 100);
            }
        }
    }
    
    // Sync heights on load, after images load, and on resize
    syncBannerHeights();
    window.addEventListener('load', syncBannerHeights);
    window.addEventListener('resize', syncBannerHeights);
    
    // Also sync after DOM is fully ready
    setTimeout(syncBannerHeights, 500);
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for animation (excluding .portfolio and .sidebar-footer as they have fixed positioning)
    const sections = document.querySelectorAll('.hero-content, .features-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Portfolio item interactions
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        // Keyboard navigation support
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Add portfolio item click functionality here
                const project = this.getAttribute('data-project');
                console.log(`Viewing ${project} project`);
            }
        });

        // Click handler for portfolio items
        item.addEventListener('click', function() {
            const project = this.getAttribute('data-project');
            console.log(`Viewing ${project} project`);
            // Add actual navigation functionality here
        });
    });

    // Button click handlers
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            
            if (buttonText === 'Chat' || this.classList.contains('btn-chat')) {
                // Telegram link is already in HTML, so no need for additional handling
                console.log('Chat button clicked');
            } else if (buttonText === 'Book an intro call') {
                // Add booking functionality here
                console.log('Book an intro call button clicked');
                // Could open a modal or navigate to a booking page
            }
        });
    });

    // Tabs functionality
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    const sidebar = document.querySelector('.sidebar-content');
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabItems.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Handle tab switching
            tabContents.forEach(section => {
                const matches = section.getAttribute('data-tab-content') === tabName;
                section.hidden = !matches;
            });

            if (sidebar) {
                sidebar.dataset.currentTab = tabName;
            }

            // Update hero title and subtitle based on selected tab
            const heroTitle = document.querySelector('.hero-title');
            const heroSubtitle = document.querySelector('.hero-subtitle');
            
            if (heroTitle && heroSubtitle) {
                if (tabName === 'studio') {
                    heroTitle.textContent = 'Design partner for ambitious founders';
                    heroSubtitle.textContent = 'Oberyon partners with founders and startups to create high-converting, meaningful and purpose-driven design for users.';
                    console.log('Studio tab selected');
                } else if (tabName === 'lab') {
                    heroTitle.textContent = 'AI-focused product lab founded by entrepreneurs';
                    heroSubtitle.textContent = 'We like to ship fast, be autonomous, talk openly, and reject the things that get in the way of that. You\'ll find beautiful software and small stellar teams here.';
                    console.log('Lab tab selected');
                }
            }
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any modals or overlays if needed
        console.log('Escape pressed');
    }
    
    // Allow keyboard navigation for portfolio items
    if (e.key === 'Tab') {
        // Ensure portfolio items are focusable
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            if (!item.hasAttribute('tabindex')) {
                item.setAttribute('tabindex', '0');
            }
        });
    }
});

// Reset scroll position on page refresh
window.addEventListener('beforeunload', function() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        sessionStorage.setItem('mainContentScroll', '0');
    }
});

window.addEventListener('load', function() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
        // Also prevent scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }
});

// Performance optimization: Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

