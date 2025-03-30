/**
 * visit.js - JavaScript functionality for the Visit page of Duquesne Incline website
 */

document.addEventListener('DOMContentLoaded', function() {
    initVisitPage();
});

/**
 * Initialize all Visit page functionality
 */
function initVisitPage() {
    // Initialize the time indicator for best visit times
    initTimeIndicator();
    
    // Setup video play functionality
    initVideoPlayer();
    
    // Add data attributes to tables for mobile responsiveness
    initResponsiveTables();
    
    // Initialize map if available
    initMap();
}

/**
 * Initialize the time indicator showing best times to visit
 */
function initTimeIndicator() {
    const timelineContainer = document.querySelector('.timeline');
    if (!timelineContainer) return;
    
    // Time blocks configuration - Start time, End time, Traffic level
    const timeBlocks = [
        { start: '05:30', end: '07:30', level: 'low' },    // 5:30am-7:30am: Low traffic
        { start: '07:30', end: '09:30', level: 'medium' }, // 7:30am-9:30am: Medium traffic
        { start: '09:30', end: '11:30', level: 'low' },    // 9:30am-11:30am: Low traffic
        { start: '11:30', end: '14:00', level: 'medium' }, // 11:30am-2:00pm: Medium traffic
        { start: '14:00', end: '17:00', level: 'high' },   // 2:00pm-5:00pm: High traffic
        { start: '17:00', end: '19:00', level: 'medium' }, // 5:00pm-7:00pm: Medium traffic
        { start: '19:00', end: '21:00', level: 'high' },   // 7:00pm-9:00pm: High traffic (sunset views)
        { start: '21:00', end: '00:30', level: 'low' }     // 9:00pm-12:30am: Low traffic
    ];
    
    // Convert time to decimal hours (e.g., "14:30" -> 14.5)
    function timeToDecimal(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours + (minutes / 60);
    }
    
    // Calculate position and width percentages
    const startTime = timeToDecimal('05:30'); // 5:30am
    const endTime = timeToDecimal('00:30') + 24; // 12:30am next day (add 24 hours)
    const totalHours = endTime - startTime;
    
    // Create time blocks
    timeBlocks.forEach((block, index) => {
        let blockStart = timeToDecimal(block.start);
        let blockEnd = timeToDecimal(block.end);
        
        // Adjust times after midnight
        if (blockStart < 5) blockStart += 24;
        if (blockEnd < 5) blockEnd += 24;
        
        // Calculate position and width as percentages
        const startPercent = ((blockStart - startTime) / totalHours) * 100;
        const widthPercent = ((blockEnd - blockStart) / totalHours) * 100;
        
        // Create block element
        const blockEl = document.createElement('div');
        blockEl.className = `time-block time-block-${block.level}`;
        blockEl.style.left = `${startPercent}%`;
        blockEl.style.width = `${widthPercent}%`;
        
        // Add accessibility attributes
        blockEl.setAttribute('aria-label', `${block.start} to ${block.end}: ${block.level} traffic`);
        
        // Add data attributes for possible tooltip functionality
        blockEl.dataset.startTime = block.start;
        blockEl.dataset.endTime = block.end;
        blockEl.dataset.trafficLevel = block.level;
        
        // First and last block specific styling
        if (index === 0) {
            blockEl.classList.add('first-block');
        }
        
        if (index === timeBlocks.length - 1) {
            blockEl.classList.add('last-block');
        }
        
        timelineContainer.appendChild(blockEl);
    });
    
    // Add time labels
    const timeLabelsContainer = document.querySelector('.time-labels');
    if (timeLabelsContainer) {
        // Clear existing labels
        timeLabelsContainer.innerHTML = '';
        
        // Define key time points for the labels (aligned with graph segments)
        const labelTimes = [
            { time: '06:00', display: '6AM' },
            { time: '09:00', display: '9AM' },
            { time: '12:00', display: '12PM' },
            { time: '15:00', display: '3PM' },
            { time: '18:00', display: '6PM' },
            { time: '21:00', display: '9PM' },
            { time: '00:00', display: '12AM' },
            { time: '00:30', display: '12:30AM' }
        ];
        
        // Add labels with improved alignment
        labelTimes.forEach(timePoint => {
            const label = document.createElement('span');
            label.textContent = timePoint.display;
            label.className = 'time-label';
            
            if (timePoint.time === '00:30') {
                label.classList.add('last-label');
            }
            
            timeLabelsContainer.appendChild(label);
        });
    }
    
    // Removed current time indicator to fix the vertical line issue
    // Comment out rather than delete to preserve functionality for future use
    // addCurrentTimeIndicator(timelineContainer, startTime, totalHours);
}

/**
 * Add current time indicator to the timeline if within operating hours
 * @param {HTMLElement} timelineContainer - The timeline container element
 * @param {number} startTime - The start time in decimal hours
 * @param {number} totalHours - The total hours in the timeline
 */
function addCurrentTimeIndicator(timelineContainer, startTime, totalHours) {
    const now = new Date();
    let currentHour = now.getHours() + (now.getMinutes() / 60);
    
    // Adjust for times after midnight but before closing
    if (currentHour < 5) {
        currentHour += 24;
    }
    
    // Check if current time is within operating hours (5:30am-12:30am)
    if (currentHour >= 5.5 && currentHour <= 24.5) {
        // Calculate position as percentage
        const currentPercent = ((currentHour - startTime) / totalHours) * 100;
        
        // Create indicator element
        const indicator = document.createElement('div');
        indicator.className = 'current-time-indicator';
        indicator.style.left = `${currentPercent}%`;
        
        // Add label showing current time
        const indicatorLabel = document.createElement('div');
        indicatorLabel.className = 'current-time-indicator-label';
        
        // Format time for display
        let displayHour = now.getHours();
        const displayMinutes = now.getMinutes().toString().padStart(2, '0');
        const amPm = displayHour >= 12 ? 'PM' : 'AM';
        
        displayHour = displayHour % 12;
        displayHour = displayHour ? displayHour : 12; // Convert 0 to 12
        
        indicatorLabel.textContent = `Current Time: ${displayHour}:${displayMinutes}${amPm}`;
        
        indicator.appendChild(indicatorLabel);
        timelineContainer.appendChild(indicator);
        
        // Add aria-live region for screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.className = 'visually-hidden';
        liveRegion.textContent = `Current time is ${displayHour}:${displayMinutes}${amPm}. ${getCurrentTrafficLevel(currentHour)}`;
        
        timelineContainer.parentNode.appendChild(liveRegion);
    }
}

/**
 * Get the current traffic level based on the hour
 * @param {number} currentHour - The current hour in decimal format
 * @returns {string} - Description of current traffic level
 */
function getCurrentTrafficLevel(currentHour) {
    // Define time ranges and their traffic levels
    const trafficLevels = [
        { start: 5.5, end: 7.5, level: 'low' },
        { start: 7.5, end: 9.5, level: 'medium' },
        { start: 9.5, end: 11.5, level: 'low' },
        { start: 11.5, end: 14, level: 'medium' },
        { start: 14, end: 17, level: 'high' },
        { start: 17, end: 19, level: 'medium' },
        { start: 19, end: 21, level: 'high' },
        { start: 21, end: 24.5, level: 'low' }
    ];
    
    // Find current traffic level
    for (const period of trafficLevels) {
        if (currentHour >= period.start && currentHour < period.end) {
            return `Current traffic level is ${period.level}.`;
        }
    }
    
    return 'The incline is currently closed.';
}

/**
 * Initialize responsive tables with data attributes for mobile view
 */
function initResponsiveTables() {
    const tables = document.querySelectorAll('.hours-table, .fares-table');
    
    tables.forEach(table => {
        const headerCells = table.querySelectorAll('th');
        const headerTexts = Array.from(headerCells).map(cell => cell.textContent);
        
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            
            cells.forEach((cell, index) => {
                if (headerTexts[index]) {
                    cell.setAttribute('data-label', headerTexts[index]);
                }
            });
        });
    });
}

/**
 * Initialize video player functionality
 */
function initVideoPlayer() {
    const videoContainer = document.querySelector('.video-container');
    const playButton = document.querySelector('.video-play-button');
    
    if (!videoContainer || !playButton) return;
    
    playButton.addEventListener('click', function() {
        // Get iframe or create it if it doesn't exist
        let iframe = videoContainer.querySelector('iframe');
        
        if (!iframe) {
            // Get video ID from container
            const videoId = videoContainer.getAttribute('data-video-id') || 'VIDEO_ID';
            
            // Create YouTube iframe using privacy-enhanced mode
            iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`);
            iframe.setAttribute('title', 'Experience the Duquesne Incline');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            
            videoContainer.appendChild(iframe);
        } else {
            // If iframe exists, update src to autoplay with privacy-enhanced mode
            const currentSrc = iframe.getAttribute('src');
            // Replace regular YouTube with privacy-enhanced version
            const newSrc = currentSrc.replace('youtube.com', 'youtube-nocookie.com');
            if (!newSrc.includes('autoplay=1')) {
                iframe.setAttribute('src', newSrc + (newSrc.includes('?') ? '&' : '?') + 'autoplay=1');
            }
        }
        
        // Hide play button
        playButton.style.display = 'none';
    });
    
    // Add keyboard accessibility
    playButton.setAttribute('tabindex', '0');
    playButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
}

/**
 * Handle maps initialization if Google Maps is available
 */
function initMap() {
    // This function will be called by Google Maps API when it loads
    // The actual map initialization is in maps.js
    
    // If Google Maps fails to load, display backup information
    setTimeout(function() {
        const mapContainer = document.querySelector('.map-container');
        
        if (mapContainer && !window.google && !mapContainer.querySelector('iframe')) {
            mapContainer.innerHTML = `
                <div class="map-fallback">
                    <h3>Map Unavailable</h3>
                    <p>Please find our locations at:</p>
                    <p><strong>Lower Station:</strong> 1197 West Carson St., Pittsburgh, PA 15219</p>
                    <p><strong>Upper Station:</strong> 1220 Grandview Ave., Pittsburgh, PA 15211</p>
                    <a href="https://maps.google.com/maps?q=duquesne+incline+pittsburgh" target="_blank" rel="noopener noreferrer" class="cta-button map-cta">View on Google Maps</a>
                </div>
            `;
        }
    }, 3000); // Check after 3 seconds
}
