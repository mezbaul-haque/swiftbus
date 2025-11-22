document.addEventListener('DOMContentLoaded', function() {
    // Sample bus data
    const buses = [
        {
            id: 1,
            name: "Green Line",
            from: "Dhaka",
            to: "Jessore",
            departure: "08:00 AM",
            arrival: "12:30 PM",
            price: 1200,
            seats: 45,
            amenities: ['wifi', 'ac', 'charging']
        },
        {
            id: 2,
            name: "Shohagh Paribahan",
            from: "Dhaka",
            to: "Jessore",
            departure: "09:30 AM",
            arrival: "02:00 PM",
            price: 1000,
            seats: 60,
            amenities: ['ac', 'charging']
        },
        {
            id: 3,
            name: "ENA Express",
            from: "Dhaka",
            to: "Jessore",
            departure: "11:00 AM",
            arrival: "03:30 PM",
            price: 900,
            seats: 50,
            amenities: ['ac']
        },
        {
            id: 4,
            name: "Hanif Enterprise",
            from: "Dhaka",
            to: "Jessore",
            departure: "02:00 PM",
            arrival: "06:30 PM",
            price: 1100,
            seats: 55,
            amenities: ['wifi', 'ac', 'charging', 'water']
        },
        {
            id: 5,
            name: "Soudia Transport",
            from: "Dhaka",
            to: "Jessore",
            departure: "04:00 PM",
            arrival: "08:15 PM",
            price: 1050,
            seats: 48,
            amenities: ['wifi', 'ac']
        }
    ];

    const busList = document.getElementById('bus-list');
    const searchForm = document.querySelector('.search-form');

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
        alert(`Booking initiated for ${busName}\nPrice: ৳${price}\nBus ID: ${busId}\n\nProceeding to checkout...`);
    };
});
