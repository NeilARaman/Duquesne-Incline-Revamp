// timeline.js - Interactive timeline functionality for the Duquesne Incline website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize timeline
    initTimeline();
});

// Function to initialize timeline
function initTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    // Add event listeners for timeline events
    initTimelineEvents();
    
    // Add animation for timeline viewing
    animateTimelineOnScroll();
}

// Function to initialize timeline events
function initTimelineEvents() {
    const timelineEvents = document.querySelectorAll('.timeline-event');
    
    timelineEvents.forEach(event => {
        const content = event.querySelector('.timeline-content');
        
        if (content) {
            // Add click handler to expand/collapse content on mobile
            content.addEventListener('click', function() {
                // Only apply this behavior on mobile
                if (window.innerWidth <= 768) {
                    this.classList.toggle('expanded');
                }
            });
        }
    });
}

// Function to animate timeline on scroll
function animateTimelineOnScroll() {
    const timelineEvents = document.querySelectorAll('.timeline-event');
    
    // Create an intersection observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // Add animation class when element is visible
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // For debug
                console.log('Timeline event is now visible', entry.target);
            }
        });
    }, {
        root: null, // Use viewport
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '-50px' // Offset
    });
    
    // Observe each timeline event
    timelineEvents.forEach(event => {
        // Initially set opacity to 0
        event.style.opacity = '0';
        event.style.transform = 'translateY(20px)';
        
        observer.observe(event);
    });
}

// Add timeline animation styles
function addTimelineStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Timeline animations */
        .timeline-event {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .timeline-event.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Staggered animation delay based on position */
        .timeline-event:nth-child(odd).visible {
            transition-delay: 0.2s;
        }
        
        .timeline-event:nth-child(even).visible {
            transition-delay: 0.4s;
        }
        
        /* Mobile expanded content */
        @media (max-width: 768px) {
            .timeline-content {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .timeline-content.expanded {
                transform: scale(1.03);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            
            .timeline-content .timeline-img {
                max-height: 150px;
                overflow: hidden;
                transition: max-height 0.5s ease;
            }
            
            .timeline-content.expanded .timeline-img {
                max-height: 300px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Call the style function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addTimelineStyles();
});
