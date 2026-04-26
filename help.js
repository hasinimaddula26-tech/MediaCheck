let hospitalsDb = [];
let userLocation = null;
let map = null;
let markers = [];
let locationRequested = false;

document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('hospital-list');
    const filterDist = document.getElementById('distance-filter');
    const filterRate = document.getElementById('rating-filter');
    const viewToggle = document.getElementById('view-toggle');
    const mapView = document.getElementById('map-view');

    // Initial Prompt State
    listContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 40px; background: rgba(255,255,255,0.6); border-radius:12px;">
            <i class="fa-solid fa-location-dot" style="font-size:2.5rem; color:var(--primary); margin-bottom:15px;"></i>
            <h3 style="color:var(--text); margin-bottom:10px;">Find Hospitals Near You</h3>
            <p style="color:var(--text-muted);">Please adjust the filters above or toggle the map view to securely find real pediatric cancer centers in your area.</p>
        </div>`;

    function requestLocationAndFetch() {
        if (locationRequested) return;
        locationRequested = true;

        listContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding: 30px;"><i class="fa-solid fa-spinner fa-spin" style="font-size:2rem; color:var(--primary);"></i><p style="margin-top:10px;">Requesting location and fetching live hospital data...</p></div>';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    initMapAndFetchPlaces();
                },
                (error) => {
                    console.warn("Geolocation denied or failed.", error);
                    // Fallback to New Delhi
                    userLocation = new google.maps.LatLng(28.6139, 77.2090);
                    initMapAndFetchPlaces(true); // pass true to indicate fallback
                }
            );
        } else {
            // Fallback to New Delhi if not supported
            userLocation = new google.maps.LatLng(28.6139, 77.2090);
            initMapAndFetchPlaces(true);
        }
    }

    function initMapAndFetchPlaces(isFallback = false) {
        // Initialize Map
        map = new google.maps.Map(mapView, {
            center: userLocation,
            zoom: 12
        });

        // Add User/Center Marker
        new google.maps.Marker({
            position: userLocation,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            title: isFallback ? 'Default Center (New Delhi)' : 'Your Location'
        });

        // Fetch Places
        const service = new google.maps.places.PlacesService(map);
        const request = {
            location: userLocation,
            radius: 50000, // 50km
            keyword: 'cancer hospital'
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                hospitalsDb = results.map(place => {
                    const placeLoc = place.geometry.location;
                    const dist = google.maps.geometry.spherical.computeDistanceBetween(userLocation, placeLoc) / 1000;
                    return {
                        id: place.place_id,
                        name: place.name,
                        location: place.vicinity || 'Local Area',
                        distance: parseFloat(dist.toFixed(1)),
                        rating: place.rating || 0,
                        oncology: true,
                        placeObj: placeLoc
                    };
                });
                renderHospitals(isFallback);
            } else {
                listContainer.innerHTML = '<p style="grid-column:1/-1;text-align:center;">No specialized hospitals found nearby.</p>';
            }
        });
    }

    function clearMarkers() {
        markers.forEach(m => m.setMap(null));
        markers = [];
    }

    function renderHospitals(isFallback = false) {
        if(!userLocation || hospitalsDb.length === 0) return;

        // Get filter values
        const maxDist = parseInt(filterDist.value);
        const minRate = parseFloat(filterRate.value);

        // Filter real Google Places array
        const filtered = hospitalsDb.filter(h => h.distance <= maxDist && h.rating >= minRate);
        
        // Sort by distance
        filtered.sort((a, b) => a.distance - b.distance);

        // Render List
        listContainer.innerHTML = '';
        clearMarkers(); // Clear map markers
        
        if(isFallback) {
            listContainer.innerHTML += `
                <div style="grid-column: 1 / -1; background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--warning); padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                    <strong>Location Denied.</strong> Showing fallback results around New Delhi.
                </div>
            `;
        }

        if(filtered.length === 0) {
            listContainer.innerHTML += `
                <div style="grid-column: 1 / -1; text-align:center; padding: 30px; background: rgba(255,255,255,0.5); border-radius:12px;">
                    <i class="fa-solid fa-hospital-slash" style="font-size:2rem; color:#94a3b8; margin-bottom:10px;"></i>
                    <p style="color:var(--text-muted);">No hospitals match your exact filters. Try expanding the distance.</p>
                </div>
            `;
            if(map) {
                map.setCenter(userLocation);
                map.setZoom(12);
            }
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(userLocation);

        filtered.forEach(h => {
            const badge = h.oncology ? `<span class="h-badge badge-oncology"><i class="fa-solid fa-check"></i> Oncology Support</span>` : '';
            
            let stars = '';
            for(let i=1; i<=5; i++) {
                if(i <= Math.floor(h.rating)) stars += '<i class="fa-solid fa-star" style="color:#fbbf24;"></i>';
                else if(i === Math.ceil(h.rating)) stars += '<i class="fa-solid fa-star-half-stroke" style="color:#fbbf24;"></i>';
                else stars += '<i class="fa-regular fa-star" style="color:#cbd5e1;"></i>';
            }

            listContainer.innerHTML += `
                <div class="hospital-card">
                    <h4>${h.name}</h4>
                    <p><i class="fa-solid fa-location-dot" style="width:15px; color:#cbd5e1;"></i> ${h.location} (~${h.distance} km away)</p>
                    <p><i class="fa-solid fa-star" style="width:15px; color:transparent;"></i> ${stars} <span style="margin-left:5px; font-weight:600;">${h.rating > 0 ? h.rating : 'N/A'}</span></p>
                    ${badge}
                </div>
            `;

            // Plot Map Marker
            const marker = new google.maps.Marker({
                position: h.placeObj,
                map: map,
                title: h.name,
                animation: google.maps.Animation.DROP
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `<div style="padding:5px; color:#333;"><strong>${h.name}</strong><br>Distance: ${h.distance} km<br>Rating: ${h.rating > 0 ? h.rating : 'N/A'}</div>`
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            markers.push(marker);
            bounds.extend(h.placeObj);
        });

        if(map && markers.length > 0) {
            map.fitBounds(bounds);
            const listener = google.maps.event.addListener(map, "idle", function() { 
                if (map.getZoom() > 14) map.setZoom(14); 
                google.maps.event.removeListener(listener); 
            });
        }
    }

    // Event Listeners for Filters
    filterDist.addEventListener('change', () => {
        if (!userLocation) requestLocationAndFetch();
        else renderHospitals();
    });
    
    filterRate.addEventListener('change', () => {
        if (!userLocation) requestLocationAndFetch();
        else renderHospitals();
    });

    // View Toggle Logic
    viewToggle.addEventListener('click', () => {
        if (!userLocation) {
            requestLocationAndFetch();
        }

        if(viewToggle.dataset.view === 'list') {
            viewToggle.dataset.view = 'map';
            viewToggle.innerHTML = '<i class="fa-solid fa-list"></i> Toggle List View';
            listContainer.style.display = 'none';
            mapView.style.display = 'block';

            if(map) {
                google.maps.event.trigger(map, 'resize');
                if(markers.length > 0) {
                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(userLocation);
                    markers.forEach(m => bounds.extend(m.getPosition()));
                    map.fitBounds(bounds);
                } else {
                    map.setCenter(userLocation);
                }
            } else {
                // Map not loaded yet (waiting for location)
                mapView.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100%; color:var(--primary);"><i class="fa-solid fa-spinner fa-spin" style="font-size:2rem;"></i><span style="margin-left:10px; font-weight:500;">Waiting for Location Access... Check your browser prompt.</span></div>';
            }
        } else {
            viewToggle.dataset.view = 'list';
            viewToggle.innerHTML = '<i class="fa-solid fa-map"></i> Toggle Map View';
            listContainer.style.display = 'grid';
            mapView.style.display = 'none';
        }
    });

});
