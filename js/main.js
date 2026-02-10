// Image Lightbox Module (IIFE to encapsulate variables)
const LightboxModule = (() => {
    // Private variables
    const lightboxData = {
        dotnet: [
            'images/dotnet1.jpg',
            'images/dotnet2.jpg',
            'images/dotnet.jpg',
            'images/dotnet-conf.jpg'
        ],
        aws: [
            'images/AWS-Events.jpg',
            'images/AWS-Meetup.jpg',
            'images/AWS-Skills-Centre.jpg',
            'images/AWS-USER.jpg',
            'images/AWS-USERM.jpg',
            'images/reinvent-recap.jpg',
            'images/Tech-Talks.jpg',
            'images/Tech-Talks-2.jpg'
        ],
        offerzen: [
            'images/Offerzen-Characters.jpg',
            'images/Healthy-Eng-Team.jpg'
        ],
        cptmsdug: [
            'images/CPTMSDUG.jpg',
            'images/CPTMSDUG2.jpg'
        ],
        sui: [
            'images/Sui.jpg'
        ],
        ATF: [
            'images/NextGenTalent.jpg'
        ]
    };

    let currentGallery = [];
    let currentIndex = 0;
    let lightboxElement = null;
    let keydownHandlerAttached = false;

    // Create lightbox HTML structure
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Image gallery lightbox');
        
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <img id="lightbox-img" src="" alt="Lightbox image">
                <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
                <button class="lightbox-next" aria-label="Next image">&#10095;</button>
                <div class="lightbox-counter" aria-live="polite"></div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #lightbox {
                display: none;
                position: fixed;
                z-index: 9999;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.95);
                justify-content: center;
                align-items: center;
            }
            
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            #lightbox-img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 0.5rem;
            }
            
            .lightbox-close {
                position: absolute;
                top: -50px;
                right: 0;
                color: white;
                font-size: 40px;
                font-weight: bold;
                cursor: pointer;
                background: transparent;
                border: none;
                padding: 0.5rem;
                transition: color 0.3s ease;
                z-index: 10000;
            }
            
            .lightbox-close:hover,
            .lightbox-close:focus {
                color: #3b82f6;
                outline: 2px solid #3b82f6;
                outline-offset: 4px;
            }
            
            .lightbox-prev,
            .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background-color: rgba(37, 99, 235, 0.8);
                color: white;
                border: none;
                padding: 1rem;
                font-size: 1.5rem;
                cursor: pointer;
                border-radius: 0.5rem;
                transition: background-color 0.3s ease;
            }
            
            .lightbox-prev:hover,
            .lightbox-next:hover,
            .lightbox-prev:focus,
            .lightbox-next:focus {
                background-color: rgba(30, 64, 175, 0.9);
                outline: 2px solid white;
                outline-offset: 2px;
            }
            
            .lightbox-prev {
                left: 20px;
            }
            
            .lightbox-next {
                right: 20px;
            }
            
            .lightbox-counter {
                position: absolute;
                bottom: -40px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                font-size: 1rem;
                background: rgba(0, 0, 0, 0.5);
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
            }
            
            @media (max-width: 768px) {
                .lightbox-prev {
                    left: 10px;
                    padding: 0.75rem;
                    font-size: 1.25rem;
                }
                
                .lightbox-next {
                    right: 10px;
                    padding: 0.75rem;
                    font-size: 1.25rem;
                }
                
                .lightbox-close {
                    top: 10px;
                    right: 10px;
                    font-size: 32px;
                }
                
                .lightbox-counter {
                    bottom: 10px;
                    font-size: 0.875rem;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(lightbox);
        
        // Event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        return lightbox;
    }

    // Attach keyboard navigation (only once)
    function attachKeyboardNavigation() {
        if (keydownHandlerAttached) return;
        
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('lightbox');
            if (lightbox && lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
                if (e.key === 'ArrowRight') navigateLightbox(1);
            }
        });
        
        keydownHandlerAttached = true;
    }

    // Update lightbox image
    function updateLightboxImage() {
        const img = document.getElementById('lightbox-img');
        const counter = document.querySelector('.lightbox-counter');
        
        if (img && currentGallery[currentIndex]) {
            img.src = currentGallery[currentIndex];
            img.alt = `Gallery image ${currentIndex + 1} of ${currentGallery.length}`;
            
            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
            }
        }
    }

    // Navigate lightbox
    function navigateLightbox(direction) {
        currentIndex += direction;
        
        if (currentIndex < 0) {
            currentIndex = currentGallery.length - 1;
        } else if (currentIndex >= currentGallery.length) {
            currentIndex = 0;
        }
        
        updateLightboxImage();
    }

    // Close lightbox
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Open lightbox (public method)
    function openLightbox(gallery, index) {
        currentGallery = lightboxData[gallery] || [];
        currentIndex = index;
        
        if (currentGallery.length === 0) return;
        
        // Create lightbox if it doesn't exist
        if (!lightboxElement) {
            lightboxElement = createLightbox();
            attachKeyboardNavigation();
        }
        
        updateLightboxImage();
        lightboxElement.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus on close button for accessibility
        setTimeout(() => {
            const closeButton = lightboxElement.querySelector('.lightbox-close');
            if (closeButton) closeButton.focus();
        }, 100);
    }

    // Return public API
    return {
        open: openLightbox
    };
})();

// Make openLightbox globally accessible for inline onclick handlers
function openLightbox(gallery, index) {
    LightboxModule.open(gallery, index);
}

// Navigation active state
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Remove any existing active class
        link.classList.remove('active');
        
        // Add active class to current page
        if (href === currentPage) {
            link.classList.add('active');
        }
        
        // Handle index.html as default
        if (currentPage === '' && href === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Contact form handler
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        // Check if this is a Netlify form (has data-netlify attribute)
        if (contactForm.hasAttribute('data-netlify')) {
            // Let Netlify handle the submission, but show confirmation
            const confirmation = document.getElementById('form-confirmation');
            if (confirmation) {
                // Show a processing message
                confirmation.textContent = 'Sending your message...';
                confirmation.classList.add('success');
                
                // The form will be submitted by Netlify
                // Netlify will redirect to a success page or show a message
            }
            // Don't prevent default - let Netlify handle it
            return;
        }
        
        // Fallback for non-Netlify environments
        e.preventDefault();
        
        const confirmation = document.getElementById('form-confirmation');
        if (confirmation) {
            confirmation.textContent = 'Thank you for your message! I will get back to you soon.';
            confirmation.classList.add('success');
            
            // Hide confirmation after 5 seconds
            setTimeout(() => {
                confirmation.classList.remove('success');
            }, 5000);
        }
        
        contactForm.reset();
    });
}

// Scroll animation observer
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .project, .event-card, .skills-list > li');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add footer content
function setupFooter() {
    const footer = document.querySelector('footer');
    if (footer && !footer.innerHTML.trim()) {
        const currentYear = new Date().getFullYear();
        footer.innerHTML = `
            <p>&copy; ${currentYear} Khanya Mgebisa. Built with passion and purpose.</p>
        `;
    }
}

// Hamburger menu functionality
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Prevent body scroll when menu is open
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize all functionality on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setActiveNavLink();
    setupContactForm();
    setupScrollAnimations();
    setupFooter();
});
