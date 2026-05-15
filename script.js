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
    
    function removePortfolioLabelLogo(img) {
        const parentLink = img.closest('.portfolio-label');
        if (!parentLink) return;

        const logoRemoved = img.dataset
            ? img.dataset.logoRemoved
            : img.getAttribute('data-logo-removed');
        if (logoRemoved) return;

        if (img.dataset) {
            img.dataset.logoRemoved = 'true';
        } else {
            img.setAttribute('data-logo-removed', 'true');
        }

        img.remove();
        parentLink.classList.add('portfolio-label--text-only');
    }

    function getPortfolioFaviconCandidates(href) {
        const url = new URL(href);
        const domain = url.hostname.replace(/^www\./, '');

        return [
            `https://img.logo.dev/${domain}?token=pk_ZEzq3CwgSRiCk2Od_jlvBg`,
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
            `https://icon.horse/icon/${domain}`,
            `${url.origin}/favicon.ico`
        ];
    }

    function handlePortfolioLogoFailure(img) {
        if (!img || !img.isConnected) return;

        const logoRemoved = img.dataset
            ? img.dataset.logoRemoved
            : img.getAttribute('data-logo-removed');
        if (logoRemoved) return;

        const parentLink = img.closest('.portfolio-label');
        if (!parentLink || !parentLink.href) {
            removePortfolioLabelLogo(img);
            return;
        }

        if (!img.dataset?.originalSrc && !img.getAttribute('data-original-src')) {
            if (img.dataset) {
                img.dataset.originalSrc = img.currentSrc || img.src;
            } else {
                img.setAttribute('data-original-src', img.currentSrc || img.src);
            }
        }

        let faviconAttempt = 0;
        if (img.dataset?.faviconAttempt) {
            faviconAttempt = parseInt(img.dataset.faviconAttempt, 10);
        } else if (img.getAttribute('data-favicon-attempt')) {
            faviconAttempt = parseInt(img.getAttribute('data-favicon-attempt'), 10);
        }

        let candidates = [];
        try {
            candidates = getPortfolioFaviconCandidates(parentLink.href);
        } catch (error) {
            candidates = [];
        }

        while (faviconAttempt < candidates.length) {
            const nextSrc = candidates[faviconAttempt];
            faviconAttempt += 1;

            if (img.dataset) {
                img.dataset.faviconAttempt = String(faviconAttempt);
            } else {
                img.setAttribute('data-favicon-attempt', String(faviconAttempt));
            }

            const currentSrc = img.currentSrc || img.src;
            if (nextSrc === currentSrc) {
                continue;
            }

            img.src = nextSrc;
            return;
        }

        removePortfolioLabelLogo(img);
    }

    // Setup logo error handlers
    function setupLogoFallbacks() {
        // Portfolio label icons
        const portfolioLogos = document.querySelectorAll('.portfolio-label-icon');
        portfolioLogos.forEach(img => {
            img.addEventListener('error', function() {
                handlePortfolioLogoFailure(this);
            });

            img.addEventListener('load', function() {
                if (this.naturalWidth === 0 || this.naturalHeight === 0) {
                    handlePortfolioLogoFailure(this);
                }
            });

            // Also check if image fails to load after a timeout
            setTimeout(() => {
                if (!img || !img.isConnected || typeof img.dispatchEvent !== 'function') return;
                const logoRemoved = img.dataset
                    ? img.dataset.logoRemoved
                    : img.getAttribute('data-logo-removed');
                if (logoRemoved) return;
                if (!img.complete || img.naturalWidth === 0) {
                    img.dispatchEvent(new Event('error'));
                }
            }, 3000);
        });
        
        // Lab card logos
        const labCardLogos = document.querySelectorAll('.lab-card-logo');
        labCardLogos.forEach(img => {
            img.addEventListener('error', function() {
                if (!this) return;
                const fallbackApplied = this.dataset
                    ? this.dataset.fallbackApplied
                    : this.getAttribute('data-fallback-applied');
                if (fallbackApplied) return;
                if (this.dataset) {
                    this.dataset.fallbackApplied = 'true';
                } else {
                    this.setAttribute('data-fallback-applied', 'true');
                }
                
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
                if (!img || typeof img.dispatchEvent !== 'function') return;
                if (!img.complete || img.naturalWidth === 0) {
                    const fallbackApplied = img.dataset
                        ? img.dataset.fallbackApplied
                        : img.getAttribute('data-fallback-applied');
                    if (!fallbackApplied) {
                        img.dispatchEvent(new Event('error'));
                    }
                }
            }, 3000);
        });
    }
    
    // Setup logo fallbacks
    setupLogoFallbacks();

    // Intro modal (shows 10 seconds after page load)
    const introModalOverlay = document.getElementById('introModalOverlay');
    const introModalClose = document.getElementById('introModalClose');
    let introModalOpen = false;
    let introModalOpenTimerId = null;

    function openIntroModal() {
        if (!introModalOverlay || introModalOpen) return;
        if (introModalOpenTimerId) {
            clearTimeout(introModalOpenTimerId);
            introModalOpenTimerId = null;
        }
        introModalOverlay.classList.add('is-open');
        introModalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        introModalOpen = true;
    }

    function closeIntroModal() {
        if (!introModalOverlay || !introModalOpen) return;
        introModalOverlay.classList.remove('is-open');
        introModalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        introModalOpen = false;
    }

    if (introModalClose) {
        introModalClose.addEventListener('click', closeIntroModal);
    }

    if (introModalOverlay) {
        introModalOverlay.addEventListener('click', function (event) {
            if (event.target === introModalOverlay) {
                closeIntroModal();
            }
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && introModalOpen) {
            closeIntroModal();
        }
    });

    introModalOpenTimerId = setTimeout(openIntroModal, 10000);
    
    // Trusted Logos Slider Animation - Commented out for future use
    /*
    function initTrustedLogosSlider() {
        const wrapper = document.querySelector('.trusted-logos-wrapper');
        const container = document.querySelector('.trusted-logos-container');
        const logoItems = document.querySelectorAll('.trusted-logo-item');
        
        if (!wrapper || logoItems.length === 0) return;
        
        let scrollPosition = 0;
        const scrollSpeed = 0.3; // pixels per frame
        let isPaused = false;
        let animationFrameId = null;
        
        // Calculate the width of one set of logos
        const firstSetLogos = Array.from(logoItems).slice(0, 8);
        let logoSetWidth = 0;
        
        function calculateLogoSetWidth() {
            logoSetWidth = firstSetLogos.reduce((sum, item) => {
                return sum + (item.offsetWidth || 60) + 32; // 32px is the gap
            }, 0);
        }
        
        // Initial calculation
        calculateLogoSetWidth();
        
        // Recalculate on resize
        window.addEventListener('resize', calculateLogoSetWidth);
        
        function scroll() {
            if (!isPaused) {
                scrollPosition += scrollSpeed;
                // Reset position when we've scrolled one full set
                if (scrollPosition >= logoSetWidth) {
                    scrollPosition = 0;
                }
                wrapper.style.transform = `translateX(-${scrollPosition}px)`;
            }
            animationFrameId = requestAnimationFrame(scroll);
        }
        
        // Pause on hover
        if (container) {
            container.addEventListener('mouseenter', () => {
                isPaused = true;
            });
            
            container.addEventListener('mouseleave', () => {
                isPaused = false;
            });
        }
        
        // Start animation
        scroll();
        
        // Cleanup function
        return function cleanup() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            window.removeEventListener('resize', calculateLogoSetWidth);
        };
    }
    
    // Initialize slider after DOM is ready
    let sliderCleanup = null;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            sliderCleanup = initTrustedLogosSlider();
        });
    } else {
        sliderCleanup = initTrustedLogosSlider();
    }
    */
    
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
            const labelEl = this.querySelector(':scope > span');
            const buttonText = labelEl ? labelEl.textContent.trim() : this.textContent.trim();
            
            if (buttonText === 'Book intro call') {
                console.log('Intro call CTA clicked');
            }
        });
    });

    function createFeatureListItem(iconClass, label) {
        return `<li><i class="hgi-stroke ${iconClass} feature-list-icon" aria-hidden="true"></i><span>${label}</span></li>`;
    }

    function setFeatureList(listElement, items) {
        if (!listElement) return;
        listElement.innerHTML = items.map(([iconClass, label]) => createFeatureListItem(iconClass, label)).join('');
    }

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
            const bookButton = document.querySelector('.hero-buttons .btn-primary');
            const bookButtonLabel = bookButton ? bookButton.querySelector(':scope > span') : null;
            
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
                    heroTitle.textContent = 'From kickoff to handoff intentional designs';
                    heroSubtitle.textContent = 'We help ambitious founders elevate their visual design. From standout marketing websites to refined product UI, our work focuses on thoughtful execution and a deep care for craft. If that resonates, we\'d love to hear more about what you\'re building.';
                    
                    // Update button for Studio tab
                    if (bookButton) {
                        if (bookButtonLabel) bookButtonLabel.textContent = 'Book intro call';
                        bookButton.href = 'https://cal.com/sametozkale/oberyon-intro-call';
                        bookButton.setAttribute('aria-label', 'Book an intro call');
                    }
                    
                    // Update Skillset section for Studio tab
                    if (skillsetTitle && skillsetList) {
                        skillsetTitle.textContent = 'Services';
                        setFeatureList(skillsetList, [
                            ['hgi-pen-tool-02', 'Digital product design'],
                            ['hgi-browser', 'Web design'],
                            ['hgi-smart-phone-01', 'App design'],
                            ['hgi-component', 'Design systems']
                        ]);
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
                        if (bookButtonLabel) bookButtonLabel.textContent = 'Join us';
                        bookButton.href = 'https://cal.com/sametozkale/oberyon-join-us';
                        bookButton.setAttribute('aria-label', 'Work with us');
                    }
                    
                    // Update Looking for section for Lab tab
                    if (skillsetTitle && skillsetList) {
                        skillsetTitle.textContent = 'Looking for';
                        setFeatureList(skillsetList, [
                            ['hgi-ai-brain-01', 'AI engineers'],
                            ['hgi-rocket-01', 'GTM engineers'],
                            ['hgi-user-group', 'Chiefs of staff']
                        ]);
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
        const introModalOverlay = document.getElementById('introModalOverlay');
        if (introModalOverlay && introModalOverlay.classList.contains('is-open')) {
            introModalOverlay.classList.remove('is-open');
            introModalOverlay.setAttribute('aria-hidden', 'true');
        }
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

