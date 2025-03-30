// gallery.js - Gallery and lightbox functionality for the Duquesne Incline website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the image gallery
    initGallery();
    addLightboxStyles();
    enhanceGalleryWithJQuery();
});

/**
 * Initialize gallery functionality
 */
function initGallery() {
    // Initialize history page gallery with lightbox
    initHistoryGallery();
}

/**
 * Initialize the history page gallery with lightbox
 */
function initHistoryGallery() {
    // Check for gallery on history page
    const historyGallery = document.querySelector('.history-gallery-section');
    
    if (historyGallery) {
        // Create lightbox elements if they don't exist
        if (!document.querySelector('.gallery-lightbox')) {
            createLightbox();
        }
        
        const galleryItems = document.querySelectorAll('.history-gallery .gallery-item');
        const lightbox = document.querySelector('.gallery-lightbox');
        const lightboxImg = document.querySelector('.lightbox-img');
        const lightboxCaption = document.querySelector('.lightbox-caption');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        
        let currentIndex = 0;
        
        // Add click event to each gallery item
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                updateLightboxContent(currentIndex, galleryItems, lightboxImg, lightboxCaption);
                lightbox.classList.add('active');
                
                // Disable body scroll when lightbox is open
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close lightbox when clicking the close button
        lightboxClose.addEventListener('click', () => {
            closeLightbox(lightbox);
        });
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox(lightbox);
            }
        });
        
        // Previous and next buttons
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxContent(currentIndex, galleryItems, lightboxImg, lightboxCaption);
        });
        
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateLightboxContent(currentIndex, galleryItems, lightboxImg, lightboxCaption);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox(lightbox);
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                updateLightboxContent(currentIndex, galleryItems, lightboxImg, lightboxCaption);
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % galleryItems.length;
                updateLightboxContent(currentIndex, galleryItems, lightboxImg, lightboxCaption);
            }
        });
    }
}

/**
 * Close the lightbox
 */
function closeLightbox(lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Create the lightbox HTML structure
 */
function createLightbox() {
    const lightboxHTML = `
        <div class="gallery-lightbox">
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <img src="" alt="" class="lightbox-img">
                <div class="lightbox-caption"></div>
                <div class="lightbox-nav">
                    <button class="lightbox-prev" aria-label="Previous image">&lsaquo;</button>
                    <button class="lightbox-next" aria-label="Next image">&rsaquo;</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
}

/**
 * Update the lightbox content with the selected image
 */
function updateLightboxContent(index, items, imgElement, captionElement) {
    const selectedItem = items[index];
    const img = selectedItem.querySelector('img');
    const caption = selectedItem.querySelector('.gallery-overlay span').textContent;
    
    // Preload image for smoother transitions
    const preloadImg = new Image();
    preloadImg.src = img.src;
    
    preloadImg.onload = function() {
        imgElement.src = img.src;
        imgElement.alt = img.alt;
        captionElement.textContent = caption;
    };
    
    // If preload fails, update immediately
    preloadImg.onerror = function() {
        imgElement.src = img.src;
        imgElement.alt = img.alt;
        captionElement.textContent = caption;
    };
}

/**
 * Add lightbox styles to the page
 */
function addLightboxStyles() {
    // Remove existing lightbox styles if they exist
    const existingStyles = document.getElementById('lightbox-styles');
    if (existingStyles) {
        existingStyles.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'lightbox-styles';
    style.textContent = `
        .gallery-lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .gallery-lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .lightbox-img {
            max-width: 100%;
            max-height: 75vh;
            border: 3px solid white;
            border-radius: 4px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            object-fit: contain;
        }
        
        .lightbox-caption {
            color: white;
            margin-top: 1rem;
            font-style: italic;
            text-align: center;
            max-width: 90%;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2.5rem;
            cursor: pointer;
            transition: color 0.3s ease;
            z-index: 10;
        }
        
        .lightbox-close:hover {
            color: var(--accent-color, #BB8B78);
        }
        
        .lightbox-nav {
            position: absolute;
            top: 50%;
            width: 100%;
            display: flex;
            justify-content: space-between;
            transform: translateY(-50%);
            z-index: 10;
            pointer-events: none;
        }
        
        .lightbox-prev,
        .lightbox-next {
            background: rgba(0, 0, 0, 0.5);
            border: none;
            color: white;
            font-size: 3rem;
            padding: 1rem 0.75rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            border-radius: 4px;
            pointer-events: auto;
        }
        
        .lightbox-prev:hover,
        .lightbox-next:hover {
            background-color: rgba(0, 0, 0, 0.8);
            color: var(--accent-color, #BB8B78);
        }
        
        @media (max-width: 768px) {
            .lightbox-img {
                max-height: 70vh;
            }
            
            .lightbox-prev,
            .lightbox-next {
                font-size: 2rem;
                padding: 0.75rem 0.5rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Implement a jQuery-based feature for the gallery
function enhanceGalleryWithJQuery() {
    // Only proceed if jQuery is available
    if (typeof jQuery === 'undefined') return;
    
    // Add hover effects to gallery items using jQuery's CSS method instead of animate
    jQuery('.gallery-item').hover(
        function() {
            jQuery(this).css({
                'transform': 'scale(1.05)',
                'transition': 'transform 0.3s ease'
            });
        },
        function() {
            jQuery(this).css({
                'transform': 'scale(1)',
                'transition': 'transform 0.3s ease'
            });
        }
    );
    
    // Add smooth scrolling to gallery section when clicked
    jQuery('.gallery-preview h2, .history-gallery-section h2').click(function() {
        const galleryContainer = jQuery(this).parent().next('.history-gallery, .gallery-container');
        jQuery('html, body').animate({
            scrollTop: galleryContainer.offset().top - 100
        }, 1000);
    });
}
