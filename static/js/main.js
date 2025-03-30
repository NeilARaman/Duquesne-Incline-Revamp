// main.js - Core functionality for the Duquesne Incline website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize mobile menu toggle if needed
    initMobileMenu();
    
    // Initialize sticky section navigation
    initStickyNav();
    
    // Initialize active section highlighting
    initActiveSection();
});

// Function to handle header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Function to handle smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for sticky header and section nav
                const offset = document.querySelector('.section-nav') ? 100 : 20;
                
                const y = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
                
                // Update URL but don't scroll again
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Function to handle mobile menu toggle if needed
function initMobileMenu() {
    // This would be expanded if a mobile menu toggle is implemented
    // For now, keeping as a placeholder for future enhancement
}

// Function to handle sticky section navigation
function initStickyNav() {
    const sectionNav = document.querySelector('.section-nav');
    
    if (sectionNav) {
        const sectionNavTop = sectionNav.offsetTop;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY >= sectionNavTop) {
                sectionNav.classList.add('sticky');
            } else {
                sectionNav.classList.remove('sticky');
            }
        });
    }
}

// Function to highlight active section in navigation
function initActiveSection() {
    const sectionNav = document.querySelector('.section-nav');
    
    if (sectionNav) {
        const navLinks = sectionNav.querySelectorAll('a');
        const sections = [];
        
        // Collect all sections that correspond to nav links
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href');
            const section = document.querySelector(sectionId);
            if (section) {
                sections.push(section);
            }
        });
        
        // Function to determine which section is in view
        function setActiveSection() {
            const scrollPosition = window.scrollY + 200; // Offset for better UX
            
            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remove active class from all links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current section's link
                    navLinks[index].classList.add('active');
                }
            });
        }
        
        // Initial check on page load
        setActiveSection();
        
        // Check on scroll
        window.addEventListener('scroll', setActiveSection);
    }
}
