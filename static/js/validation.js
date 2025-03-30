/**
 * validation.js - Form validation for Duquesne Incline website
 * Implements best practices for form usability and validation
 */

document.addEventListener('DOMContentLoaded', function() {
    initFormValidation();
});

/**
 * Initialize form validation
 */
function initFormValidation() {
    const form = document.getElementById('mailing-list-form');
    if (!form) return;

    // Add input event listeners for real-time validation
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });

        input.addEventListener('blur', function() {
            validateField(this, true);
        });
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') || input.value.trim() !== '') {
                const fieldValid = validateField(input, true);
                isValid = isValid && fieldValid;
            }
        });

        if (isValid) {
            submitForm(form);
        } else {
            // Focus the first invalid field
            const firstInvalid = form.querySelector('input.error');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });
}

/**
 * Validate a specific field
 * @param {HTMLElement} field - Field to validate
 * @param {boolean} showError - Whether to show error message
 * @returns {boolean} - Validation result
 */
function validateField(field, showError = false) {
    // Get field error message element
    const errorEl = document.getElementById(`${field.id}-error`);
    let isValid = true;
    let errorMessage = '';

    // Clear previous validation state
    field.classList.remove('error');
    if (errorEl) errorEl.textContent = '';

    // Skip validation if field is empty and not required
    if (!field.hasAttribute('required') && field.value.trim() === '') {
        return true;
    }

    // Required field validation
    if (field.hasAttribute('required') && field.value.trim() === '') {
        isValid = false;
        errorMessage = 'This field is required';
    } 
    // Field-specific validation
    else {
        switch(field.id) {
            case 'name':
                if (field.value.trim().length < 2) {
                    isValid = false;
                    errorMessage = 'Please enter your full name';
                }
                break;
                
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'phone':
                if (field.value.trim() !== '') {
                    const phonePattern = /^[\d\s\-\(\)\.]+$/;
                    if (!phonePattern.test(field.value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number';
                    }
                }
                break;
                
            case 'zipcode':
                if (field.value.trim() !== '') {
                    const zipPattern = /^\d{5}$/;
                    if (!zipPattern.test(field.value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid 5-digit zip code';
                    }
                }
                break;
        }
    }

    // Show validation state
    if (!isValid && showError) {
        field.classList.add('error');
        if (errorEl) errorEl.textContent = errorMessage;
        
        // Accessibility: Announce error to screen readers
        errorEl.setAttribute('aria-hidden', 'false');
    } else if (errorEl) {
        errorEl.setAttribute('aria-hidden', 'true');
    }

    return isValid;
}

/**
 * Submit the form
 * @param {HTMLFormElement} form - Form to submit
 */
function submitForm(form) {
    // In a real implementation, this would be an AJAX submission
    // For demo purposes, we'll simulate a successful submission
    
    // Hide the form and show success message
    form.style.display = 'none';
    const successMessage = document.getElementById('form-success');
    if (successMessage) {
        successMessage.style.display = 'block';
        
        // Focus on success message for screen readers
        successMessage.setAttribute('tabindex', '-1');
        successMessage.focus();

        // Log submission for demo purposes
        console.log('Form submitted successfully');
        
        // Get form data
        const formData = new FormData(form);
        const formValues = {};
        
        for (const [key, value] of formData.entries()) {
            formValues[key] = value;
        }
        
        console.log('Form data:', formValues);
    }
}

/**
 * Reset form validation state
 * @param {HTMLFormElement} form - Form to reset
 */
function resetForm(form) {
    const inputs = form.querySelectorAll('input');
    const errorMessages = form.querySelectorAll('.error-message');
    
    // Reset inputs
    inputs.forEach(input => {
        input.classList.remove('error');
    });
    
    // Clear error messages
    errorMessages.forEach(el => {
        el.textContent = '';
        el.setAttribute('aria-hidden', 'true');
    });
}

/**
 * Format phone number as user types
 * @param {HTMLInputElement} input - Phone input field
 */
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            input.value = `(${value}`;
        } else if (value.length <= 6) {
            input.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            input.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
} 