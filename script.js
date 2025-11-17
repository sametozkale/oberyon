// Smooth scroll behavior and animations
document.addEventListener('DOMContentLoaded', function() {
    // Reset scroll position on page load
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
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

            if (tabName === 'studio') {
                console.log('Studio tab selected');
            } else if (tabName === 'lab') {
                console.log('Lab tab selected');
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

