// maps.js - Google Maps integration for the Duquesne Incline website

// Initialize the map when the API has loaded
function initMap() {
    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Define the coordinates for upper and lower stations
    const upperStation = { lat: 40.4395, lng: -80.0205 }; // Upper station coordinates
    const lowerStation = { lat: 40.4418, lng: -80.0232 }; // Lower station coordinates
    
    // Create a new map centered between the stations
    const map = new google.maps.Map(mapContainer, {
        center: { 
            lat: (upperStation.lat + lowerStation.lat) / 2, 
            lng: (upperStation.lng + lowerStation.lng) / 2 
        },
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    });
    
    // Add marker for upper station
    const upperMarker = new google.maps.Marker({
        position: upperStation,
        map: map,
        title: 'Upper Station',
        icon: {
            url: '../static/images/incline-marker.png',
            scaledSize: new google.maps.Size(30, 30)
        }
    });
    
    // Add info window for upper station
    const upperInfoWindow = new google.maps.InfoWindow({
        content: `
            <div class="info-window">
                <h3>Upper Station</h3>
                <p>1220 Grandview Ave, Pittsburgh, PA 15211</p>
                <p>Wheelchair accessible entrance and observation deck</p>
            </div>
        `
    });
    
    upperMarker.addListener('click', function() {
        upperInfoWindow.open(map, upperMarker);
    });
    
    // Add marker for lower station
    const lowerMarker = new google.maps.Marker({
        position: lowerStation,
        map: map,
        title: 'Lower Station',
        icon: {
            url: '../static/images/incline-marker.png',
            scaledSize: new google.maps.Size(30, 30)
        }
    });
    
    // Add info window for lower station
    const lowerInfoWindow = new google.maps.InfoWindow({
        content: `
            <div class="info-window">
                <h3>Lower Station</h3>
                <p>1197 West Carson St, Pittsburgh, PA 15219</p>
                <p>Parking available nearby</p>
            </div>
        `
    });
    
    lowerMarker.addListener('click', function() {
        lowerInfoWindow.open(map, lowerMarker);
    });
    
    // Add parking marker
    const parkingLocation = { lat: 40.4420, lng: -80.0240 }; // Parking coordinates
    
    const parkingMarker = new google.maps.Marker({
        position: parkingLocation,
        map: map,
        title: 'Parking',
        icon: {
            url: '../static/images/parking-marker.png',
            scaledSize: new google.maps.Size(25, 25)
        }
    });
    
    // Add info window for parking
    const parkingInfoWindow = new google.maps.InfoWindow({
        content: `
            <div class="info-window">
                <h3>Parking</h3>
                <p>Parking available near the Lower Station</p>
            </div>
        `
    });
    
    parkingMarker.addListener('click', function() {
        parkingInfoWindow.open(map, parkingMarker);
    });
    
    // Draw a line representing the incline track
    const inclinePath = new google.maps.Polyline({
        path: [upperStation, lowerStation],
        geodesic: true,
        strokeColor: '#A62D38',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    
    inclinePath.setMap(map);
}

// Add custom styles for info windows
function addInfoWindowStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .info-window {
            padding: 5px;
        }
        
        .info-window h3 {
            color: #A62D38;
            margin-bottom: 5px;
            font-family: 'Playfair Display', 'Times New Roman', serif;
        }
        
        .info-window p {
            margin: 3px 0;
            font-size: 14px;
        }
    `;
    
    document.head.appendChild(style);
}

// Call the style function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addInfoWindowStyles();
});

function handleMapError() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    mapContainer.innerHTML = `
        <div class="map-error">
            <p>Map is currently unavailable.</p>
            <p>Lower Station: 1197 West Carson St, Pittsburgh, PA 15219</p>
            <p>Upper Station: 1220 Grandview Ave, Pittsburgh, PA 15211</p>
        </div>
    `;
    
    // Add error styling
    const style = document.createElement('style');
    style.textContent = `
        .map-error {
            padding: 20px;
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
}

// Add error handling to map initialization
window.gm_authFailure = function() {
    handleMapError();
};

// Add DOM content loaded listener to handle map errors
document.addEventListener('DOMContentLoaded', function() {
    // Check if Google Maps API failed to load after 3 seconds
    setTimeout(function() {
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            handleMapError();
        }
    }, 3000);
});
