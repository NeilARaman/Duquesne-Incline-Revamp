/**
 * video.js - Video player functionality for the Duquesne Incline website
 */

document.addEventListener('DOMContentLoaded', function() {
    initVideoPlayers();
});

/**
 * Initialize all video players on the page
 */
function initVideoPlayers() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        setupVideoPlayer(container);
    });
}

/**
 * Set up a single video player
 * @param {HTMLElement} container - The video container element
 */
function setupVideoPlayer(container) {
    const playButton = container.querySelector('.video-play-button');
    if (!playButton) return;
    
    // Check if there's a data-video-id attribute, otherwise use a default
    const videoId = container.getAttribute('data-video-id') || 'VIDEO_ID';
    
    playButton.addEventListener('click', function() {
        loadYouTubeVideo(container, videoId);
    });
    
    // Add keyboard support for accessibility
    playButton.setAttribute('tabindex', '0');
    playButton.setAttribute('role', 'button');
    
    playButton.addEventListener('keydown', function(e) {
        // Play on Enter or Space
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            loadYouTubeVideo(container, videoId);
        }
    });
}

/**
 * Load a YouTube video in the container using privacy-enhanced mode
 * @param {HTMLElement} container - The video container element
 * @param {string} videoId - The YouTube video ID
 */
function loadYouTubeVideo(container, videoId) {
    const playButton = container.querySelector('.video-play-button');
    
    // Create iframe if it doesn't exist
    let iframe = container.querySelector('iframe');
    
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.setAttribute('title', 'Experience the Duquesne Incline');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        
        // Set the video source with autoplay using privacy-enhanced mode
        iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?si=GEGnEvNZE53MOPGP&autoplay=1&rel=0`);
        
        container.appendChild(iframe);
    } else {
        // Update existing iframe
        iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?si=GEGnEvNZE53MOPGP&autoplay=1&rel=0`);
    }
    
    // Hide the play button
    if (playButton) {
        playButton.style.display = 'none';
    }
    
    // Log event for analytics (if implemented)
    console.log('Video playback started:', videoId);
}

/**
 * Set the video ID for a specific container
 * @param {string} containerId - The ID of the container element
 * @param {string} videoId - The YouTube video ID
 */
function setVideoId(containerId, videoId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.setAttribute('data-video-id', videoId);
    }
}
