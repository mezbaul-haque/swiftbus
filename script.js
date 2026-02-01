document.addEventListener('DOMContentLoaded', function() {
    // Sample bus data - comprehensive Bangladesh routes
    const buses = [
        { id: 1, name: "Green Line", from: "Dhaka", to: "Jessore", departure: "08:00 AM", arrival: "12:30 PM", price: 1200, seats: 45, amenities: ['wifi', 'ac', 'charging'] },
        { id: 2, name: "Shohagh Paribahan", from: "Dhaka", to: "Jessore", departure: "09:30 AM", arrival: "02:00 PM", price: 1000, seats: 60, amenities: ['ac', 'charging'] },
        { id: 3, name: "ENA Express", from: "Dhaka", to: "Jessore", departure: "11:00 AM", arrival: "03:30 PM", price: 900, seats: 50, amenities: ['ac'] },
        { id: 4, name: "Hanif Enterprise", from: "Dhaka", to: "Jessore", departure: "02:00 PM", arrival: "06:30 PM", price: 1100, seats: 55, amenities: ['wifi', 'ac', 'charging', 'water'] },
        { id: 5, name: "Soudia Transport", from: "Dhaka", to: "Jessore", departure: "04:00 PM", arrival: "08:15 PM", price: 1050, seats: 48, amenities: ['wifi', 'ac'] },
        { id: 6, name: "BD Express", from: "Dhaka", to: "Sylhet", departure: "07:00 AM", arrival: "12:00 PM", price: 1500, seats: 40, amenities: ['wifi', 'ac', 'charging'] },
        { id: 7, name: "Hill Transport", from: "Dhaka", to: "Sylhet", departure: "10:00 AM", arrival: "03:00 PM", price: 1400, seats: 50, amenities: ['ac', 'water'] },
        { id: 8, name: "Transtar", from: "Dhaka", to: "Chittagong", departure: "08:30 AM", arrival: "01:00 PM", price: 1100, seats: 55, amenities: ['wifi', 'ac', 'charging'] },
        { id: 9, name: "Sohag Express", from: "Dhaka", to: "Chittagong", departure: "11:00 AM", arrival: "04:00 PM", price: 950, seats: 65, amenities: ['ac'] },
        { id: 10, name: "Ocean Travels", from: "Dhaka", to: "Khulna", departure: "09:00 AM", arrival: "02:00 PM", price: 1300, seats: 45, amenities: ['wifi', 'ac', 'charging', 'water'] },
        { id: 11, name: "Royal Coach", from: "Dhaka", to: "Rajshahi", departure: "06:00 AM", arrival: "11:00 AM", price: 1250, seats: 50, amenities: ['ac', 'charging'] },
        { id: 12, name: "Star Travels", from: "Dhaka", to: "Bogra", departure: "07:30 AM", arrival: "11:30 AM", price: 900, seats: 60, amenities: ['ac'] },
        { id: 13, name: "Metro Transport", from: "Dhaka", to: "Mymensingh", departure: "08:00 AM", arrival: "10:30 AM", price: 700, seats: 55, amenities: ['wifi', 'ac'] },
        { id: 14, name: "Comfort Bus", from: "Chittagong", to: "Sylhet", departure: "06:00 AM", arrival: "02:00 PM", price: 1600, seats: 40, amenities: ['wifi', 'ac', 'charging'] },
        { id: 15, name: "Coastal Travels", from: "Chittagong", to: "Jessore", departure: "07:00 AM", arrival: "03:00 PM", price: 1800, seats: 45, amenities: ['ac', 'water'] },
        { id: 16, name: "Khulna Connect", from: "Khulna", to: "Jessore", departure: "08:00 AM", arrival: "11:00 AM", price: 700, seats: 50, amenities: ['ac'] },
        { id: 17, name: "North Express", from: "Rajshahi", to: "Bogra", departure: "09:00 AM", arrival: "12:00 PM", price: 600, seats: 55, amenities: ['ac', 'charging'] },
        { id: 18, name: "Rangpur Link", from: "Dhaka", to: "Rangpur", departure: "06:00 AM", arrival: "10:00 AM", price: 1100, seats: 60, amenities: ['wifi', 'ac'] },
        { id: 19, name: "Barisal Direct", from: "Dhaka", to: "Barisal", departure: "08:00 AM", arrival: "01:00 PM", price: 1400, seats: 50, amenities: ['ac', 'charging', 'water'] },
        { id: 20, name: "Comilla Express", from: "Dhaka", to: "Comilla", departure: "07:00 AM", arrival: "11:00 AM", price: 950, seats: 65, amenities: ['ac'] }
    ];

    const busList = document.getElementById('bus-list');
    const searchForm = document.querySelector('.search-form');
    const logo = document.getElementById('logo');
    const homeLink = document.getElementById('home-link');
    const myBookingsLink = document.getElementById('my-bookings-link');
    const bookingsSection = document.getElementById('bookings-section');
    const bookingsList = document.getElementById('bookings-list');
    const backToSearch = document.getElementById('back-to-search');

    // Autocomplete elements
    const fromInput = document.getElementById('from-city');
    const toInput = document.getElementById('to-city');
    const fromSuggestionsEl = document.getElementById('from-suggestions');
    const toSuggestionsEl = document.getElementById('to-suggestions');

    let bookings = JSON.parse(localStorage.getItem('swiftbus_bookings') || '[]');

    // build unique city list from bus data
    const citySet = new Set();
    buses.forEach(b => { citySet.add(b.from); citySet.add(b.to); });
    const uniqueCities = Array.from(citySet).sort();

    // Display all buses initially
    displayBuses(buses);

    // Search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fromCity = document.getElementById('from-city').value.toLowerCase().trim();
        const toCity = document.getElementById('to-city').value.toLowerCase().trim();
        
        if (!fromCity && !toCity) {
            displayBuses(buses);
            return;
        }
        
        const filteredBuses = buses.filter(bus => {
            const matchFrom = !fromCity || bus.from.toLowerCase().includes(fromCity);
            const matchTo = !toCity || bus.to.toLowerCase().includes(toCity);
            return matchFrom && matchTo;
        });
        
        displayBuses(filteredBuses);
    });

    // Function to display buses
    function displayBuses(busesToDisplay) {
        busList.innerHTML = '';
        
        if (busesToDisplay.length === 0) {
            busList.innerHTML = '<p class="no-results">No buses found matching your criteria.</p>';
            return;
        }
        
        busesToDisplay.forEach(bus => {
            const busCard = document.createElement('div');
            busCard.className = 'bus-card';
            
            busCard.innerHTML = `
                <div class="bus-info">
                    <div class="bus-header">
                        <h3 class="bus-name"><i class="fas fa-bus"></i> ${bus.name}</h3>
                        <span class="seats-available">${bus.seats} seats</span>
                    </div>
                    
                    <div class="timing">
                        <div class="departure">
                            <p class="time">${bus.departure}</p>
                            <p class="city">${bus.from}</p>
                        </div>
                        <div class="route-arrow">
                            <span class="arrow">→</span>
                            <span class="duration">4.5h</span>
                        </div>
                        <div class="arrival">
                            <p class="time">${bus.arrival}</p>
                            <p class="city">${bus.to}</p>
                        </div>
                    </div>
                    
                    <div class="amenities">
                        ${bus.amenities.includes('wifi') ? '<span class="amenity-badge"><i class="fas fa-wifi"></i> WiFi</span>' : ''}
                        ${bus.amenities.includes('ac') ? '<span class="amenity-badge"><i class="fas fa-snowflake"></i> AC</span>' : ''}
                        ${bus.amenities.includes('charging') ? '<span class="amenity-badge"><i class="fas fa-plug"></i> Charging</span>' : ''}
                        ${bus.amenities.includes('water') ? '<span class="amenity-badge"><i class="fas fa-tint"></i> Water</span>' : ''}
                    </div>
                </div>
                
                <div class="bus-cta">
                    <div class="price-section">
                        <span class="currency">৳</span>
                        <span class="price">${bus.price}</span>
                        <span class="per-seat">per seat</span>
                    </div>
                    <button class="book-now-btn" onclick="bookBus(${bus.id}, '${bus.name}', ${bus.price})">
                        <i class="fas fa-shopping-cart"></i> Book Now
                    </button>
                </div>
            `;
            
            busList.appendChild(busCard);
        });
    }
    
    // Book bus function
    window.bookBus = function(busId, busName, price) {
        const bus = buses.find(b => b.id === busId) || { from: '', to: '' };
        const travelDate = document.getElementById('travel-date').value || '';
        const booking = {
            bookingId: Date.now(),
            busId: busId,
            name: busName,
            from: bus.from,
            to: bus.to,
            date: travelDate,
            price: price,
            createdAt: new Date().toISOString()
        };
        bookings.push(booking);
        localStorage.setItem('swiftbus_bookings', JSON.stringify(bookings));
        showBookings();
    };

    function renderBookings() {
        bookingsList.innerHTML = '';
        if (!bookings || bookings.length === 0) {
            bookingsList.innerHTML = '<p class="no-results">You have no bookings yet.</p>';
            return;
        }

        bookings.forEach(b => {
            const card = document.createElement('div');
            card.className = 'booking-card';
            card.innerHTML = `
                <div class="booking-info">
                    <div style="font-weight:700;">${b.name} — ৳${b.price}</div>
                    <div class="booking-meta">${b.from} → ${b.to} ${b.date ? '• ' + b.date : ''}</div>
                </div>
                <div class="booking-actions">
                    <button class="cancel-booking-btn" data-id="${b.bookingId}">Cancel</button>
                </div>
            `;
            bookingsList.appendChild(card);
        });

        bookingsList.querySelectorAll('.cancel-booking-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = Number(this.getAttribute('data-id'));
                cancelBooking(id);
            });
        });
    }

    function cancelBooking(bookingId) {
        bookings = bookings.filter(b => b.bookingId !== bookingId);
        localStorage.setItem('swiftbus_bookings', JSON.stringify(bookings));
        renderBookings();
    }

    function showBookings() {
        document.querySelector('.bus-results').classList.add('hidden');
        bookingsSection.classList.remove('hidden');
        renderBookings();
    }

    function showSearch() {
        bookingsSection.classList.add('hidden');
        document.querySelector('.bus-results').classList.remove('hidden');
    }

    if (myBookingsLink) {
        myBookingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showBookings();
        });
    }

    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSearch();
        });
    }

    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', function() {
            showSearch();
        });
    }

    if (backToSearch) {
        backToSearch.addEventListener('click', function() {
            showSearch();
        });
    }

    /* ---------- Autocomplete logic ---------- */
    function filterCities(query) {
        if (!query) return [];
        const q = query.toLowerCase();
        return uniqueCities.filter(c => c.toLowerCase().includes(q));
    }

    function renderSuggestions(listEl, items) {
        listEl.innerHTML = '';
        if (!items || items.length === 0) {
            listEl.style.display = 'none';
            return;
        }
        
        // Position the suggestions list relative to the input
        const inputRect = listEl.previousElementSibling.getBoundingClientRect();
        listEl.style.left = inputRect.left + 'px';
        listEl.style.top = (inputRect.bottom + 6) + 'px';
        listEl.style.width = inputRect.width + 'px';
        
        items.forEach((city, idx) => {
            const li = document.createElement('li');
            li.textContent = city;
            li.setAttribute('data-index', idx);
            li.addEventListener('mousedown', function(e) {
                // use mousedown to prevent blur before click
                listEl.previousElementSibling.value = city;
                listEl.innerHTML = '';
                listEl.style.display = 'none';
            });
            listEl.appendChild(li);
        });
        listEl.style.display = 'block';
    }

    function hookAutocomplete(inputEl, listEl) {
        let selected = -1;

        // Show all cities on focus
        inputEl.addEventListener('focus', function() {
            renderSuggestions(listEl, uniqueCities);
            selected = -1;
        });

        // Filter as user types
        inputEl.addEventListener('input', function() {
            const items = filterCities(this.value);
            renderSuggestions(listEl, items);
            selected = -1;
        });

        inputEl.addEventListener('keydown', function(e) {
            const items = listEl.querySelectorAll('li');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selected = Math.min(selected + 1, items.length - 1);
                updateActive(items, selected);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selected = Math.max(selected - 1, 0);
                updateActive(items, selected);
            } else if (e.key === 'Enter') {
                if (selected >= 0 && items[selected]) {
                    e.preventDefault();
                    inputEl.value = items[selected].textContent;
                    listEl.innerHTML = '';
                    listEl.style.display = 'none';
                }
            } else if (e.key === 'Escape') {
                listEl.innerHTML = '';
                listEl.style.display = 'none';
            }
        });

        // hide when clicking outside
        document.addEventListener('click', function(e) {
            if (!inputEl.contains(e.target) && !listEl.contains(e.target)) {
                listEl.innerHTML = '';
                listEl.style.display = 'none';
            }
        });
    }

    function updateActive(items, selected) {
        items.forEach((it, i) => {
            if (i === selected) it.classList.add('active'); else it.classList.remove('active');
        });
    }

    // hook both inputs
    if (fromInput && fromSuggestionsEl) hookAutocomplete(fromInput, fromSuggestionsEl);
    if (toInput && toSuggestionsEl) hookAutocomplete(toInput, toSuggestionsEl);

});
