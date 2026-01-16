// Smooth scroll behavior and animations
document.addEventListener('DOMContentLoaded', function() {
    // Reset scroll position on page load
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
    
    // Handle broken logo images with fallback
    function createLogoFallback(img, companyName) {
        // Create a simple SVG placeholder
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', img.width || '12');
        svg.setAttribute('height', img.height || '12');
        svg.setAttribute('viewBox', '0 0 48 48');
        svg.style.borderRadius = '4px';
        
        // Create background circle/rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '48');
        rect.setAttribute('height', '48');
        rect.setAttribute('fill', '#F4F4EE');
        rect.setAttribute('rx', '4');
        svg.appendChild(rect);
        
        // Create text with first letter(s) of company name
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const initials = companyName ? companyName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
        text.setAttribute('x', '24');
        text.setAttribute('y', '32');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-family', 'Inter, sans-serif');
        text.setAttribute('font-size', '16');
        text.setAttribute('font-weight', '600');
        text.setAttribute('fill', '#073040');
        text.textContent = initials;
        svg.appendChild(text);
        
        return svg;
    }
    
    // Setup logo error handlers
    function setupLogoFallbacks() {
        // Portfolio label icons
        const portfolioLogos = document.querySelectorAll('.portfolio-label-icon');
        portfolioLogos.forEach(img => {
            img.addEventListener('error', function() {
                if (this.dataset.fallbackApplied) return;
                this.dataset.fallbackApplied = 'true';
                
                const parentLink = this.closest('.portfolio-label');
                const companyName = parentLink ? parentLink.textContent.trim() : '';
                const fallback = createLogoFallback(this, companyName);
                fallback.setAttribute('class', 'portfolio-label-icon');
                this.style.display = 'none';
                parentLink.insertBefore(fallback, this);
            }, { once: true });
            
            // Also check if image fails to load after a timeout
            setTimeout(() => {
                if (!this.complete || this.naturalWidth === 0) {
                    if (!this.dataset.fallbackApplied) {
                        this.dispatchEvent(new Event('error'));
                    }
                }
            }, 3000);
        });
        
        // Lab card logos
        const labCardLogos = document.querySelectorAll('.lab-card-logo');
        labCardLogos.forEach(img => {
            img.addEventListener('error', function() {
                if (this.dataset.fallbackApplied) return;
                this.dataset.fallbackApplied = 'true';
                
                const cardHeader = this.closest('.lab-card-header');
                const cardTitle = cardHeader ? cardHeader.querySelector('.lab-card-title') : null;
                const companyName = cardTitle ? cardTitle.textContent.trim() : '';
                const fallback = createLogoFallback(this, companyName);
                fallback.setAttribute('width', '48');
                fallback.setAttribute('height', '48');
                fallback.setAttribute('viewBox', '0 0 48 48');
                fallback.setAttribute('class', 'lab-card-logo');
                fallback.style.borderRadius = '12px';
                this.style.display = 'none';
                this.parentNode.insertBefore(fallback, this);
            }, { once: true });
            
            // Also check if image fails to load after a timeout
            setTimeout(() => {
                if (!this.complete || this.naturalWidth === 0) {
                    if (!this.dataset.fallbackApplied) {
                        this.dispatchEvent(new Event('error'));
                    }
                }
            }, 3000);
        });
    }
    
    // Setup logo fallbacks
    setupLogoFallbacks();
    
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
    
    // Sync Meyn banner height with Mues banner height (exact same dimensions)
    function syncMeynBannerWithMues() {
        const muesBannerContainer = document.querySelector('.lab-card:first-child .lab-card-banner');
        const meynBannerContainer = document.querySelector('.lab-card:last-child .lab-card-banner');
        const muesBannerImage = document.querySelector('.lab-card:first-child .lab-card-banner-image');
        const meynBannerImage = document.querySelector('.lab-card:last-child .lab-card-banner-image');
        
        if (muesBannerContainer && meynBannerContainer && muesBannerImage && meynBannerImage) {
            const updateMeynHeight = () => {
                // Get the computed height of Mues banner container
                const muesHeight = muesBannerContainer.offsetHeight;
                
                // Also get computed width for consistency
                const muesWidth = muesBannerContainer.offsetWidth;
                
                if (muesHeight > 0) {
                    // Set Meyn banner container to exact same dimensions
                    meynBannerContainer.style.height = muesHeight + 'px';
                    meynBannerContainer.style.width = muesWidth + 'px';
                    meynBannerContainer.style.overflow = 'hidden';
                    
                    // Make sure banner image fills the container
                    meynBannerImage.style.width = '100%';
                    meynBannerImage.style.height = '100%';
                    meynBannerImage.style.objectFit = 'cover';
                    meynBannerImage.style.objectPosition = 'center';
                }
            };
            
            // Update when both images are loaded
            const updateWhenReady = () => {
                if (muesBannerImage.complete && meynBannerImage.complete) {
                    // Wait a bit for layout to settle
                    setTimeout(updateMeynHeight, 50);
                }
            };
            
            // Check if images are already loaded
            if (muesBannerImage.complete && meynBannerImage.complete) {
                updateMeynHeight();
            } else {
                muesBannerImage.addEventListener('load', updateWhenReady, { once: true });
                meynBannerImage.addEventListener('load', updateWhenReady, { once: true });
            }
            
            // Also update after a delay to ensure layout is complete
            setTimeout(updateMeynHeight, 100);
        }
    }
    
    // Sync heights on load, after images load, and on resize
    syncBannerHeights();
    syncMeynBannerWithMues();
    window.addEventListener('load', function() {
        syncBannerHeights();
        syncMeynBannerWithMues();
    });
    window.addEventListener('resize', function() {
        syncBannerHeights();
        syncMeynBannerWithMues();
    });
    
    // Also sync after DOM is fully ready
    setTimeout(function() {
        syncBannerHeights();
        syncMeynBannerWithMues();
    }, 500);
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
            
            if (buttonText === 'Book an intro call') {
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
            const bookButton = document.querySelector('.btn-primary');
            
            // Find feature items
            const featureItems = document.querySelectorAll('.feature-item');
            const skillsetFeatureItem = featureItems[0];
            const aboutFeatureItem = featureItems[1];
            
            const skillsetTitle = skillsetFeatureItem ? skillsetFeatureItem.querySelector('.feature-title') : null;
            const skillsetList = skillsetFeatureItem ? skillsetFeatureItem.querySelector('.feature-list') : null;
            const aboutTitle = aboutFeatureItem ? aboutFeatureItem.querySelector('.feature-title') : null;
            const aboutList = aboutFeatureItem ? aboutFeatureItem.querySelector('.feature-list') : null;
            
            if (heroTitle && heroSubtitle) {
                if (tabName === 'studio') {
                    heroTitle.textContent = 'Design partner for ambitious founders';
                    heroSubtitle.textContent = 'Oberyon partners with founders and startups to create high-converting, meaningful and purpose-driven design for users.';
                    
                    // Update button for Studio tab
                    if (bookButton) {
                        bookButton.textContent = 'Book an intro call';
                        bookButton.href = 'https://cal.com/sametozkale/oberyon-intro-call';
                        bookButton.setAttribute('aria-label', 'Book an intro call');
                    }
                    
                    // Update Skillset section for Studio tab
                    if (skillsetTitle && skillsetList) {
                        skillsetTitle.textContent = 'Skillset';
                        skillsetList.innerHTML = `
                            <li>Digital product design</li>
                            <li>Web design</li>
                            <li>App design</li>
                            <li>Design systems</li>
                            <li>Vibe coding</li>
                        `;
                    }
                    
                    // Update About section for Studio tab
                    if (aboutTitle && aboutList) {
                        aboutTitle.textContent = 'About';
                        aboutList.innerHTML = `
                            <li>GMT+2</li>
                            <li>Worldwide service</li>
                            <li>10+ years of experience</li>
                            <li>25+ projects completed</li>
                            <li>English, Turkish, German</li>
                        `;
                    }
                    
                    console.log('Studio tab selected');
                } else if (tabName === 'lab') {
                    heroTitle.textContent = 'AI-focused product lab founded by entrepreneurs';
                    heroSubtitle.textContent = 'We like to ship fast, be autonomous, talk openly, and reject the things that get in the way of that. You\'ll find beautiful software and small stellar teams here.';
                    
                    // Update button for Lab tab
                    if (bookButton) {
                        bookButton.textContent = 'Join us';
                        bookButton.href = 'https://cal.com/sametozkale/oberyon-join-us';
                        bookButton.setAttribute('aria-label', 'Work with us');
                    }
                    
                    // Update Looking for section for Lab tab
                    if (skillsetTitle && skillsetList) {
                        skillsetTitle.textContent = 'Looking for (side-hustle)';
                        skillsetList.innerHTML = `
                            <li>AI engineers</li>
                            <li>GTM engineers</li>
                            <li>Design engineers</li>
                            <li>Marketing enthusiasts</li>
                            <li>Chiefs of staff</li>
                        `;
                    }
                    
                    // Update Focus section for Lab tab
                    if (aboutTitle && aboutList) {
                        aboutTitle.textContent = 'Focus';
                        aboutList.innerHTML = `
                            <li>Software interaction</li>
                            <li>Agentic AI</li>
                            <li>Vibe-coding process</li>
                            <li>Agent universe</li>
                            <li>Agent to Agent protocol</li>
                        `;
                    }
                    
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

// Move footer after main-content on responsive
function handleResponsiveFooter() {
    const footer = document.querySelector('.sidebar-footer');
    const layout = document.querySelector('.layout');
    const mainContent = document.querySelector('.main-content');
    
    if (!footer || !layout || !mainContent) return;
    
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    
    if (isMobile) {
        // Move footer to layout level after main-content
        if (footer.parentElement === layout) {
            // Already moved, do nothing
            return;
        }
        // Remove from sidebar
        footer.remove();
        // Insert after main-content in layout
        layout.insertBefore(footer, mainContent.nextSibling);
        footer.style.display = 'flex';
    } else {
        // Move footer back to sidebar on desktop
        const sidebarContent = document.querySelector('.sidebar-content');
        if (sidebarContent && footer.parentElement === layout) {
            footer.remove();
            sidebarContent.parentElement.appendChild(footer);
            footer.style.display = '';
        }
    }
}

// Handle footer on load and resize
handleResponsiveFooter();
window.addEventListener('resize', handleResponsiveFooter);

// Performance optimization: Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

