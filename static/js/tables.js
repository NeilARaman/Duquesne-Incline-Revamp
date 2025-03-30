/**
 * tables.js - Table functionality for the Duquesne Incline website
 */

document.addEventListener('DOMContentLoaded', function() {
    initResponsiveTables();
});

/**
 * Initialize responsive tables with data attributes for mobile view
 */
function initResponsiveTables() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        // Add responsive class for styling
        table.classList.add('responsive-table');
        
        const headerCells = table.querySelectorAll('th');
        if (headerCells.length === 0) return;
        
        // Get header text values to use as data-labels
        const headerTexts = Array.from(headerCells).map(cell => cell.textContent.trim());
        
        // For each row in tbody, add data-label attributes to cells
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            
            cells.forEach((cell, index) => {
                if (index < headerTexts.length) {
                    cell.setAttribute('data-label', headerTexts[index]);
                }
            });
        });
    });
    
    // Handle horizontal scrolling on small screens
    addTableScroll();
}

/**
 * Add wrapper for horizontal scrolling on small screens
 */
function addTableScroll() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        // Skip if already wrapped
        if (table.parentNode.classList.contains('table-scroll-wrapper')) return;
        
        // Skip if table is already responsive with data-labels
        if (table.classList.contains('responsive-table')) return;
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'table-scroll-wrapper';
        
        // Insert wrapper before table in the DOM
        table.parentNode.insertBefore(wrapper, table);
        
        // Move table into wrapper
        wrapper.appendChild(table);
    });
}

/**
 * Check if table is wider than its container
 * @param {HTMLElement} table - The table element to check
 * @returns {boolean} - Whether the table is wider than its container
 */
function isTableOverflowing(table) {
    return table.offsetWidth > table.parentNode.offsetWidth;
}

/**
 * Add a label to indicate scrollable tables
 * @param {HTMLElement} tableWrapper - The table wrapper element
 */
function addScrollIndicator(tableWrapper) {
    // Check if indicator already exists
    if (tableWrapper.querySelector('.table-scroll-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'table-scroll-indicator';
    indicator.innerHTML = '<i class="fas fa-arrows-left-right"></i> Scroll to see more';
    
    tableWrapper.appendChild(indicator);
    
    // Hide indicator after user has scrolled
    tableWrapper.addEventListener('scroll', function() {
        indicator.style.opacity = '0';
        
        // Remove indicator after fade animation
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 500);
    }, { once: true });
}

/**
 * Add zebra striping to tables
 * @param {string} selector - CSS selector for tables to add striping to
 */
function addTableStriping(selector = 'table') {
    const tables = document.querySelectorAll(selector);
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach((row, index) => {
            if (index % 2 === 1) {
                row.classList.add('table-striped');
            }
        });
    });
}

// Handle window resize for responsive tables
window.addEventListener('resize', function() {
    const tableWrappers = document.querySelectorAll('.table-scroll-wrapper');
    
    tableWrappers.forEach(wrapper => {
        const table = wrapper.querySelector('table');
        if (table && isTableOverflowing(table)) {
            addScrollIndicator(wrapper);
        }
    });
});
