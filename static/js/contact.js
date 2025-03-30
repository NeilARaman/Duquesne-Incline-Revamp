/**
 * contact.js - JavaScript functionality for the Duquesne Incline Contact page
 */

document.addEventListener('DOMContentLoaded', function() {
    initContactPage();
});

/**
 * Initialize all contact page functionality
 */
function initContactPage() {
    initFormValidation();
    initParallax();
}

/**
 * Initialize form validation for the mailing list form
 */
function initFormValidation() {
    const form = document.querySelector('.mailing-form');
    if (!form) return;

    // Real-time validation for text inputs
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const zipInput = form.querySelector('input[name="zipcode"]');

    // Add input event listeners for validation
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            validateField(this, 'name');
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateField(this, 'email');
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
            validateField(this, 'phone');
        });
    }

    if (zipInput) {
        zipInput.addEventListener('input', function() {
            validateField(this, 'zipcode');
        });
    }

    // Set up form reset functionality
    const resetButton = form.querySelector('.reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Use the standard form reset method
            form.reset();
            
            // Clear any validation error messages and styling
            clearValidationErrors(form);
        });
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        
        if (nameInput && !validateField(nameInput, 'name')) {
            isValid = false;
        }
        
        if (emailInput && !validateField(emailInput, 'email')) {
            isValid = false;
        }
        
        if (phoneInput && !validateField(phoneInput, 'phone')) {
            isValid = false;
        }
        
        if (zipInput && !validateField(zipInput, 'zipcode')) {
            isValid = false;
        }
        
        // If all fields are valid, submit the form
        if (isValid) {
            submitForm(form);
        }
    });
}

/**
 * Clear all validation error messages and styling from a form
 * @param {HTMLFormElement} form - The form to clear
 */
function clearValidationErrors(form) {
    // Remove error classes from all inputs
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('error');
    });
    
    // Remove all error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
        message.textContent = '';
    });
}

/**
 * Validate a field based on its type
 * @param {HTMLElement} field - The field to validate
 * @param {string} type - The type of validation to perform
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field, type) {
    let isValid = true;
    let errorMessage = '';
    
    // Remove any existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Check if the field is required and empty
    if (field.required && field.value.trim() === '') {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // Perform type-specific validation
        switch (type) {
            case 'name':
                if (field.value.trim().length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
                
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value) && field.value.trim() !== '') {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'phone':
                const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
                if (!phonePattern.test(field.value) && field.value.trim() !== '') {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
                
            case 'zipcode':
                const zipPattern = /^\d{5}(-\d{4})?$/;
                if (!zipPattern.test(field.value) && field.value.trim() !== '') {
                    isValid = false;
                    errorMessage = 'Please enter a valid ZIP code';
                }
                break;
        }
    }
    
    // If the field is invalid, display an error message
    if (!isValid) {
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        field.parentNode.appendChild(errorElement);
        
        // Add error styling to the field
        field.classList.add('error');
    } else {
        // Remove error styling from the field
        field.classList.remove('error');
    }
    
    return isValid;
}

/**
 * Format a phone number as the user types
 * @param {HTMLElement} field - The phone number input field
 */
function formatPhoneNumber(field) {
    // Get the input value without non-numeric characters
    let input = field.value.replace(/\D/g, '');
    
    // Limit input to 10 digits
    input = input.substring(0, 10);
    
    // Format the phone number as (XXX) XXX-XXXX
    if (input.length > 0) {
        if (input.length < 4) {
            field.value = '(' + input;
        } else if (input.length < 7) {
            field.value = '(' + input.substring(0, 3) + ') ' + input.substring(3);
        } else {
            field.value = '(' + input.substring(0, 3) + ') ' + 
                input.substring(3, 6) + '-' + input.substring(6);
        }
    }
}

/**
 * Submit the form and display a success message
 * @param {HTMLFormElement} form - The form to submit
 */
function submitForm(form) {
    // Get the form data
    const formData = new FormData(form);
    const formObject = {};
    
    // Convert form data to object
    for (const [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Log the form data (in a real implementation, this would be sent to a server)
    console.log('Form submitted:', formObject);
    
    // Hide the form and display a success message
    form.style.display = 'none';
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Thank You!</h3>
            <p>You've been successfully added to our mailing list. We'll send you updates about special events, seasonal schedules, and more.</p>
        </div>
    `;
    
    // Add the success message to the page
    form.parentNode.appendChild(successMessage);
}

/**
 * Initialize parallax effect for hero section
 */
function initParallax() {
    const hero = document.querySelector('.contact-hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const parallaxValue = scrollPosition * 0.3;
        
        hero.style.backgroundPositionY = `calc(50% + ${parallaxValue}px)`;
    });
}
