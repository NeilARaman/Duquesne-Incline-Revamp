// validation.js - Form validation for the Duquesne Incline website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    initFormValidation();
});

// Function to initialize form validation
function initFormValidation() {
    const mailingForm = document.getElementById('mailing-list-form');
    if (!mailingForm) return;
    
    // Add form submission handler
    mailingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all form fields
        if (validateForm()) {
            // Show success message
            document.getElementById('form-success').style.display = 'block';
            // Clear form
            mailingForm.reset();
        }
    });
    
    // Add real-time validation for input fields
    initRealTimeValidation();
}

// Function to validate the entire form
function validateForm() {
    let isValid = true;
    
    // Validate name (required)
    const nameInput = document.getElementById('name');
    if (!validateRequired(nameInput)) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
    } else {
        clearError(nameInput);
    }
    
    // Validate email (required and format)
    const emailInput = document.getElementById('email');
    if (!validateRequired(emailInput)) {
        showError(emailInput, 'Please enter your email address');
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError(emailInput);
    }
    
    // Validate phone (if provided)
    const phoneInput = document.getElementById('phone');
    if (phoneInput.value.trim() !== '' && !validatePhone(phoneInput.value)) {
        showError(phoneInput, 'Please enter a valid phone number');
        isValid = false;
    } else {
        clearError(phoneInput);
    }
    
    // Validate zipcode (if provided)
    const zipInput = document.getElementById('zipcode');
    if (zipInput.value.trim() !== '' && !validateZipcode(zipInput.value)) {
        showError(zipInput, 'Please enter a valid 5-digit zipcode');
        isValid = false;
    } else {
        clearError(zipInput);
    }
    
    return isValid;
}

// Function to initialize real-time validation
function initRealTimeValidation() {
    // Add blur event listeners to each form field
    
    // Name field validation
    const nameInput = document.getElementById('name');
    nameInput.addEventListener('blur', function() {
        if (!validateRequired(this)) {
            showError(this, 'Please enter your name');
        } else {
            clearError(this);
        }
    });
    
    // Email field validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        if (!validateRequired(this)) {
            showError(this, 'Please enter your email address');
        } else if (!validateEmail(this.value)) {
            showError(this, 'Please enter a valid email address');
        } else {
            clearError(this);
        }
    });
    
    // Phone field validation (optional)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', function() {
        if (this.value.trim() !== '' && !validatePhone(this.value)) {
            showError(this, 'Please enter a valid phone number');
        } else {
            clearError(this);
        }
    });
    
    // Zipcode field validation (optional)
    const zipInput = document.getElementById('zipcode');
    zipInput.addEventListener('blur', function() {
        if (this.value.trim() !== '' && !validateZipcode(this.value)) {
            showError(this, 'Please enter a valid 5-digit zipcode');
        } else {
            clearError(this);
        }
    });
}

// Function to validate if a field is required
function validateRequired(input) {
    return input.value.trim() !== '';
}

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate phone number format
function validatePhone(phone) {
    // Allow formats like (123) 456-7890, 123-456-7890, 1234567890
    const phoneRegex = /^[\d\s()+-.]*$/;
    // Must have at least 10 digits
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
}

// Function to validate zipcode format
function validateZipcode(zipcode) {
    // Must be exactly 5 digits
    const zipcodeRegex = /^\d{5}$/;
    return zipcodeRegex.test(zipcode);
}

// Function to show error message
function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        input.classList.add('error');
    }
}

// Function to clear error message
function clearError(input) {
    const errorElement = document.getElementById(`${input.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        input.classList.remove('error');
    }
}
