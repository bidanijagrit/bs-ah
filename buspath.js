document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    let map;
    let markers = [];
    const haryanaCenterLocation = { lat: 29.0588, lng: 76.0856 }; // Haryana center

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: haryanaCenterLocation,
            styles: [
                // Add custom map styles here for better UI
            ]
        });
    }

    // Haryana Districts Data
    const haryanaDistricts = {
        'ambala': ['Ambala City', 'Ambala Cantt', 'Naraingarh'],
        'bhiwani': ['Bhiwani City', 'Charkhi Dadri', 'Tosham'],
        'faridabad': ['Faridabad Old', 'Ballabhgarh', 'NIT Faridabad'],
        'fatehabad': ['Fatehabad City', 'Tohana', 'Ratia'],
        'gurugram': ['Gurugram Bus Stand', 'Sohna', 'Pataudi'],
        'hisar': ['Hisar City', 'Hansi', 'Barwala'],
        'jhajjar': ['Jhajjar City', 'Bahadurgarh', 'Beri'],
        'jind': ['Jind City', 'Narwana', 'Safidon'],
        'kaithal': ['Kaithal City', 'Pundri', 'Kalayat'],
        'karnal': ['Karnal City', 'Gharaunda', 'Nilokheri'],
        'kurukshetra': ['Kurukshetra City', 'Thanesar', 'Pehowa'],
        'mahendragarh': ['Narnaul', 'Mahendragarh', 'Kanina'],
        'nuh': ['Nuh City', 'Ferozepur Jhirka', 'Punhana'],
        'palwal': ['Palwal City', 'Hodal', 'Hathin'],
        'panchkula': ['Panchkula Bus Stand', 'Kalka', 'Pinjore'],
        'panipat': ['Panipat City', 'Samalkha', 'Israna'],
        'rewari': ['Rewari City', 'Bawal', 'Kosli'],
        'rohtak': ['Rohtak City', 'Sampla', 'Kalanaur'],
        'sirsa': ['Sirsa City', 'Ellenabad', 'Dabwali'],
        'sonipat': ['Sonipat City', 'Gohana', 'Ganaur'],
        'yamunanagar': ['Yamunanagar', 'Jagadhri', 'Radaur'],
        'charkhi dadri': ['Charkhi Dadri City', 'Bond Kalan', 'Sanjarwas']
    };

    // Populate districts in dropdowns
    function populateDistricts() {
        const fromDistrict = document.getElementById('fromDistrict');
        const toDistrict = document.getElementById('toDistrict');
        
        Object.keys(haryanaDistricts).forEach(district => {
            const capitalizedDistrict = district.charAt(0).toUpperCase() + district.slice(1);
            
            fromDistrict.innerHTML += `<option value="${district}">${capitalizedDistrict}</option>`;
            toDistrict.innerHTML += `<option value="${district}">${capitalizedDistrict}</option>`;
        });
    }

    // Generate fake buses between districts
    function generateBuses(fromDistrict, toDistrict) {
        const buses = [];
        const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 buses

        for (let i = 0; i < count; i++) {
            const startTime = generateRandomTime();
            const duration = Math.floor(Math.random() * 5) + 2; // 2 to 6 hours
            const endTime = addHours(startTime, duration);

            buses.push({
                busId: 'HR-' + Math.floor(Math.random() * 9000 + 1000),
                type: ['AC Volvo', 'Non-AC Deluxe', 'AC Semi-Deluxe'][Math.floor(Math.random() * 3)],
                departureTime: startTime,
                arrivalTime: endTime,
                fare: Math.floor(Math.random() * 500) + 200,
                stops: generateRouteStops(fromDistrict, toDistrict)
            });
        }
        return buses;
    }

    // Generate route stops
    function generateRouteStops(fromDistrict, toDistrict) {
        const stops = [
            { name: haryanaDistricts[fromDistrict][0], time: '00:00' },
            { name: 'Middle Stop 1', time: '00:00' },
            { name: 'Middle Stop 2', time: '00:00' },
            { name: haryanaDistricts[toDistrict][0], time: '00:00' }
        ];
        return stops;
    }

    // Display buses in the list
    function displayBuses(buses) {
        const busListContainer = document.getElementById('busList');
        busListContainer.innerHTML = '';

        buses.forEach(bus => {
            const busCard = document.createElement('div');
            busCard.className = 'bus-card';
            busCard.innerHTML = `
                <div class="bus-header">
                    <h3>${bus.busId}</h3>
                    <span class="bus-type">${bus.type}</span>
                </div>
                <div class="bus-info">
                    <div class="time-info">
                        <div>
                            <strong>${bus.departureTime}</strong>
                            <span>Departure</span>
                        </div>
                        <div class="journey-line"></div>
                        <div>
                            <strong>${bus.arrivalTime}</strong>
                            <span>Arrival</span>
                        </div>
                    </div>
                    <div class="fare">₹${bus.fare}</div>
                </div>
                <button onclick="showBusRoute('${bus.busId}')" class="track-btn">View Route</button>
            `;
            busListContainer.appendChild(busCard);
        });
    }

    // Show bus route on map
    function showBusRoute(busId) {
        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        markers = [];

        // Get bus details
        const bus = currentBuses.find(b => b.busId === busId);
        if (!bus) return;

        // Draw route on map
        bus.stops.forEach((stop, index) => {
            const marker = new google.maps.Marker({
                position: generateRandomLocationNearby(haryanaCenterLocation),
                map: map,
                title: stop.name,
                label: (index + 1).toString()
            });
            markers.push(marker);
        });

        // Draw path between stops
        const path = new google.maps.Polyline({
            path: markers.map(marker => marker.getPosition()),
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        path.setMap(map);
    }

    // Helper functions
    function generateRandomTime() {
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    function addHours(time, hours) {
        const [h, m] = time.split(':').map(Number);
        const newHours = (h + hours) % 24;
        return `${newHours.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    function generateRandomLocationNearby(center) {
        return {
            lat: center.lat + (Math.random() - 0.5) * 2,
            lng: center.lng + (Math.random() - 0.5) * 2
        };
    }

    // Event Listeners
    let currentBuses = [];
    document.getElementById('searchButton').addEventListener('click', function() {
        const fromDistrict = document.getElementById('fromDistrict').value;
        const toDistrict = document.getElementById('toDistrict').value;
        
        if (fromDistrict && toDistrict && fromDistrict !== toDistrict) {
            currentBuses = generateBuses(fromDistrict, toDistrict);
            displayBuses(currentBuses);
        } else {
            alert('Please select different source and destination districts');
        }
    });

    // Initialize
    populateDistricts();
    initMap();
});document.addEventListener('DOMContentLoaded', function() {
    // Splash Screen Handler
    setTimeout(() => {
        const splashScreen = document.getElementById('splashScreen');
        const mainContent = document.getElementById('mainContent');
        
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, 500);
    }, 2000); // Shows splash screen for 2 seconds

    // Your previous JavaScript code continues here...
});