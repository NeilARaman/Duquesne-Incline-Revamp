// gift-shop.js - JavaScript functionality for Duquesne Incline Gift Shop page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all page functionality
    initImageZoom();
    initSmoothScrolling();
    enhanceAccessibility();
});

/**
 * Initialize image zoom functionality for product images
 */
function initImageZoom() {
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(imageContainer => {
        const img = imageContainer.querySelector('img');
        if (!img) return;
        
        // Enhanced hover effects with progressive scaling
        imageContainer.addEventListener('mouseenter', function() {
            img.style.transition = 'transform 0.5s ease';
            img.style.transform = 'scale(1.05)';
        });
        
        imageContainer.addEventListener('mouseleave', function() {
            img.style.transition = 'transform 0.5s ease';
            img.style.transform = 'scale(1)';
        });
    });
}

/**
 * Smooth scroll to shop section when clicking on navigation links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Set focus to target element for better accessibility
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({preventScroll: true});
        });
    });
}

/**
 * Enhance accessibility for interactive elements
 */
function enhanceAccessibility() {
    // Ensure proper keyboard accessibility for interactive elements
    document.querySelectorAll('.grid-item, .product-item, .cta-button').forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        // Handle keyboard events for interactive elements
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                
                // If there's a link inside, click it
                const link = element.querySelector('a');
                if (link) {
                    link.click();
                } else {
                    // Otherwise trigger a click on the element itself
                    element.click();
                }
            }
        });
    });
    
    // Add ARIA descriptions to product images
    document.querySelectorAll('.product-img').forEach(img => {
        if (img.alt) {
            const id = 'desc-' + Math.random().toString(36).substring(2, 9);
            const parent = img.closest('.product-item');
            
            if (parent) {
                const description = document.createElement('div');
                description.id = id;
                description.className = 'visually-hidden';
                description.textContent = img.alt;
                
                parent.appendChild(description);
                img.setAttribute('aria-describedby', id);
            }
        }
    });
}
