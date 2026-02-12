const { useEffect, useMemo, useRef, useState } = React;

const BUS_DATA = [
  { id: 1, name: "Green Line", from: "Dhaka", to: "Jessore", departure: "08:00 AM", arrival: "12:30 PM", price: 1200, seats: 45, amenities: ["wifi", "ac", "charging"] },
  { id: 2, name: "Shohagh Paribahan", from: "Dhaka", to: "Jessore", departure: "09:30 AM", arrival: "02:00 PM", price: 1000, seats: 60, amenities: ["ac", "charging"] },
  { id: 3, name: "ENA Express", from: "Dhaka", to: "Jessore", departure: "11:00 AM", arrival: "03:30 PM", price: 900, seats: 50, amenities: ["ac"] },
  { id: 4, name: "Hanif Enterprise", from: "Dhaka", to: "Jessore", departure: "02:00 PM", arrival: "06:30 PM", price: 1100, seats: 55, amenities: ["wifi", "ac", "charging", "water"] },
  { id: 5, name: "Soudia Transport", from: "Dhaka", to: "Jessore", departure: "04:00 PM", arrival: "08:15 PM", price: 1050, seats: 48, amenities: ["wifi", "ac"] },
  { id: 6, name: "BD Express", from: "Dhaka", to: "Sylhet", departure: "07:00 AM", arrival: "12:00 PM", price: 1500, seats: 40, amenities: ["wifi", "ac", "charging"] },
  { id: 7, name: "Hill Transport", from: "Dhaka", to: "Sylhet", departure: "10:00 AM", arrival: "03:00 PM", price: 1400, seats: 50, amenities: ["ac", "water"] },
  { id: 8, name: "Transtar", from: "Dhaka", to: "Chittagong", departure: "08:30 AM", arrival: "01:00 PM", price: 1100, seats: 55, amenities: ["wifi", "ac", "charging"] },
  { id: 9, name: "Sohag Express", from: "Dhaka", to: "Chittagong", departure: "11:00 AM", arrival: "04:00 PM", price: 950, seats: 65, amenities: ["ac"] },
  { id: 10, name: "Ocean Travels", from: "Dhaka", to: "Khulna", departure: "09:00 AM", arrival: "02:00 PM", price: 1300, seats: 45, amenities: ["wifi", "ac", "charging", "water"] },
  { id: 11, name: "Royal Coach", from: "Dhaka", to: "Rajshahi", departure: "06:00 AM", arrival: "11:00 AM", price: 1250, seats: 50, amenities: ["ac", "charging"] },
  { id: 12, name: "Star Travels", from: "Dhaka", to: "Bogra", departure: "07:30 AM", arrival: "11:30 AM", price: 900, seats: 60, amenities: ["ac"] },
  { id: 13, name: "Metro Transport", from: "Dhaka", to: "Mymensingh", departure: "08:00 AM", arrival: "10:30 AM", price: 700, seats: 55, amenities: ["wifi", "ac"] },
  { id: 14, name: "Comfort Bus", from: "Chittagong", to: "Sylhet", departure: "06:00 AM", arrival: "02:00 PM", price: 1600, seats: 40, amenities: ["wifi", "ac", "charging"] },
  { id: 15, name: "Coastal Travels", from: "Chittagong", to: "Jessore", departure: "07:00 AM", arrival: "03:00 PM", price: 1800, seats: 45, amenities: ["ac", "water"] },
  { id: 16, name: "Khulna Connect", from: "Khulna", to: "Jessore", departure: "08:00 AM", arrival: "11:00 AM", price: 700, seats: 50, amenities: ["ac"] },
  { id: 17, name: "North Express", from: "Rajshahi", to: "Bogra", departure: "09:00 AM", arrival: "12:00 PM", price: 600, seats: 55, amenities: ["ac", "charging"] },
  { id: 18, name: "Rangpur Link", from: "Dhaka", to: "Rangpur", departure: "06:00 AM", arrival: "10:00 AM", price: 1100, seats: 60, amenities: ["wifi", "ac"] },
  { id: 19, name: "Barisal Direct", from: "Dhaka", to: "Barisal", departure: "08:00 AM", arrival: "01:00 PM", price: 1400, seats: 50, amenities: ["ac", "charging", "water"] },
  { id: 20, name: "Comilla Express", from: "Dhaka", to: "Comilla", departure: "07:00 AM", arrival: "11:00 AM", price: 950, seats: 65, amenities: ["ac"] }
];

const AMENITY_LABELS = {
  wifi: { icon: "fa-wifi", label: "WiFi" },
  ac: { icon: "fa-snowflake", label: "AC" },
  charging: { icon: "fa-plug", label: "Charging" },
  water: { icon: "fa-tint", label: "Water" }
};

const MAX_SEAT_SELECTION = 4;

function formatDateISO(date) {
  return date.toISOString().split("T")[0];
}

function getSeatLabels(totalSeats) {
  const cols = ["A", "B", "C", "D"];
  return Array.from({ length: totalSeats }, (_, idx) => {
    const row = Math.floor(idx / cols.length) + 1;
    const col = cols[idx % cols.length];
    return `${row}${col}`;
  });
}

function App() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [filteredBuses, setFilteredBuses] = useState(BUS_DATA);
  const [view, setView] = useState("search");
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [seatPlanBus, setSeatPlanBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatError, setSeatError] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromActiveIdx, setFromActiveIdx] = useState(-1);
  const [toActiveIdx, setToActiveIdx] = useState(-1);
  const [fromSugPos, setFromSugPos] = useState({ top: 0, left: 0, width: 0 });
  const [toSugPos, setToSugPos] = useState({ top: 0, left: 0, width: 0 });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });

  const travelDateRef = useRef(null);
  const calendarRef = useRef(null);
  const fromListRef = useRef(null);
  const toListRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const uniqueCities = useMemo(() => {
    const set = new Set();
    BUS_DATA.forEach((b) => {
      set.add(b.from);
      set.add(b.to);
    });
    return Array.from(set).sort();
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("swiftbus_bookings") || "[]");
    setBookings(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("swiftbus_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    function handleOutsideClick(e) {
      const fromList = fromListRef.current;
      const toList = toListRef.current;
      const fromInput = document.getElementById("from-city");
      const toInput = document.getElementById("to-city");

      if (fromList && fromInput && !fromList.contains(e.target) && !fromInput.contains(e.target)) {
        setFromSuggestions([]);
      }
      if (toList && toInput && !toList.contains(e.target) && !toInput.contains(e.target)) {
        setToSuggestions([]);
      }

      if (calendarRef.current && travelDateRef.current) {
        if (!calendarRef.current.contains(e.target) && !travelDateRef.current.contains(e.target)) {
          setCalendarOpen(false);
        }
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  function filterCities(query) {
    if (!query) return [];
    const q = query.toLowerCase();
    return uniqueCities.filter((c) => c.toLowerCase().includes(q));
  }

  function updateSuggestionPosition(inputRef, setPos) {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setPos({
      left: rect.left,
      top: rect.bottom + 6,
      width: rect.width
    });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const from = fromCity.trim().toLowerCase();
    const to = toCity.trim().toLowerCase();

    if (!from && !to) {
      setFilteredBuses(BUS_DATA);
      return;
    }

    const filtered = BUS_DATA.filter((bus) => {
      const matchFrom = !from || bus.from.toLowerCase().includes(from);
      const matchTo = !to || bus.to.toLowerCase().includes(to);
      return matchFrom && matchTo;
    });
    setFilteredBuses(filtered);
  }

  function getBookedSeatSet(busId, date) {
    const set = new Set();
    bookings.forEach((booking) => {
      if (booking.busId !== busId) return;
      if ((booking.date || "") !== (date || "")) return;
      const seats = Array.isArray(booking.seats) ? booking.seats : [];
      seats.forEach((seat) => set.add(seat));
    });
    return set;
  }

  function getAvailableSeatCount(busId, totalSeats) {
    if (!selectedDate) return totalSeats;
    return totalSeats - getBookedSeatSet(busId, selectedDate).size;
  }

  function openSeatPlan(bus) {
    if (!selectedDate) {
      alert("Please select a travel date before choosing seats.");
      return;
    }
    setSeatPlanBus(bus);
    setSelectedSeats([]);
    setSeatError("");
  }

  function toggleSeatSelection(seatNo, bookedSet) {
    if (bookedSet.has(seatNo)) return;
    setSeatError("");
    setSelectedSeats((prev) => {
      if (prev.includes(seatNo)) {
        return prev.filter((seat) => seat !== seatNo);
      }
      if (prev.length >= MAX_SEAT_SELECTION) {
        setSeatError(`You can select up to ${MAX_SEAT_SELECTION} seats at once.`);
        return prev;
      }
      return [...prev, seatNo];
    });
  }

  function confirmSeatBooking() {
    if (!seatPlanBus || !selectedSeats.length) return;
    const latestBooked = getBookedSeatSet(seatPlanBus.id, selectedDate);
    const alreadyTaken = selectedSeats.filter((seat) => latestBooked.has(seat));
    if (alreadyTaken.length) {
      setSeatError(`Seat already booked: ${alreadyTaken.join(", ")}. Please choose different seats.`);
      setSelectedSeats((prev) => prev.filter((seat) => !alreadyTaken.includes(seat)));
      return;
    }
    const bus = BUS_DATA.find((b) => b.id === seatPlanBus.id) || { from: "", to: "" };
    const booking = {
      bookingId: Date.now(),
      busId: bus.id,
      name: bus.name,
      from: bus.from,
      to: bus.to,
      date: selectedDate,
      seats: selectedSeats,
      seatCount: selectedSeats.length,
      pricePerSeat: bus.price,
      price: bus.price * selectedSeats.length,
      createdAt: new Date().toISOString()
    };
    setBookings((prev) => [...prev, booking]);
    setSeatPlanBus(null);
    setSelectedSeats([]);
    setSeatError("");
    setView("bookings");
  }

  function cancelBooking(id) {
    setBookings((prev) => prev.filter((b) => b.bookingId !== id));
  }

  function openCalendar() {
    if (!travelDateRef.current) return;
    const rect = travelDateRef.current.getBoundingClientRect();
    setCalendarPos({ top: rect.bottom + 10, left: rect.left - 50 });
    setCalendarOpen(true);
  }

  function renderCalendarDays() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const today = new Date();
    const todayStr = formatDateISO(today);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({
        label: String(daysInPrevMonth - i),
        type: "other",
        key: `prev-${i}`
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = formatDateISO(date);
      const isPast = date < new Date(todayStr);
      cells.push({
        label: String(i),
        type: "current",
        key: dateStr,
        dateStr,
        isToday: dateStr === todayStr,
        isSelected: selectedDate === dateStr,
        isPast
      });
    }

    while (cells.length < 42) {
      const nextIndex = cells.length - (firstDay + daysInMonth) + 1;
      cells.push({
        label: String(nextIndex),
        type: "other",
        key: `next-${nextIndex}`
      });
    }

    return cells;
  }

  const calendarCells = renderCalendarDays();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const seatRows = useMemo(() => {
    if (!seatPlanBus) return [];
    const allSeats = getSeatLabels(seatPlanBus.seats);
    const rows = [];
    for (let i = 0; i < allSeats.length; i += 4) {
      const row = allSeats.slice(i, i + 4);
      while (row.length < 4) row.push(null);
      rows.push(row);
    }
    return rows;
  }, [seatPlanBus]);
  const bookedSeatsForPlan = useMemo(() => {
    if (!seatPlanBus) return new Set();
    return getBookedSeatSet(seatPlanBus.id, selectedDate);
  }, [seatPlanBus, selectedDate, bookings]);

  return (
    <>
      <header className="hero">
        <nav>
          <div
            className="logo"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setView("search");
              window.scrollTo(0, 0);
            }}
          >
            <img src="logo.svg" alt="SwiftBus logo" />
          </div>
          <div className="nav-links">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setView("search");
                window.scrollTo(0, 0);
              }}
            >
              Home
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setView("bookings");
              }}
            >
              My Bookings
            </a>
            <a href="#">Contact</a>
            <button className="btn-login">Login</button>
          </div>
        </nav>

        <div className="hero-content">
          <h1>Book Bus Tickets in Minutes</h1>
          <p>Travel across Bangladesh with comfort and ease</p>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="form-group">
              <label>From</label>
              <div className="autocomplete">
                <input
                  type="text"
                  placeholder="Enter origin city"
                  id="from-city"
                  autoComplete="off"
                  value={fromCity}
                  ref={fromInputRef}
                  onFocus={() => {
                    setFromSuggestions(uniqueCities);
                    setFromActiveIdx(-1);
                    updateSuggestionPosition(fromInputRef, setFromSugPos);
                  }}
                  onChange={(e) => {
                    setFromCity(e.target.value);
                    setFromSuggestions(filterCities(e.target.value));
                    setFromActiveIdx(-1);
                    updateSuggestionPosition(fromInputRef, setFromSugPos);
                  }}
                  onKeyDown={(e) => {
                    if (!fromSuggestions.length) return;
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setFromActiveIdx((prev) => Math.min(prev + 1, fromSuggestions.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setFromActiveIdx((prev) => Math.max(prev - 1, 0));
                    } else if (e.key === "Enter") {
                      if (fromActiveIdx >= 0) {
                        e.preventDefault();
                        setFromCity(fromSuggestions[fromActiveIdx]);
                        setFromSuggestions([]);
                      }
                    } else if (e.key === "Escape") {
                      setFromSuggestions([]);
                    }
                  }}
                />
                <ul
                  className="suggestions"
                  id="from-suggestions"
                  ref={fromListRef}
                  style={{
                    display: fromSuggestions.length ? "block" : "none",
                    left: `${fromSugPos.left}px`,
                    top: `${fromSugPos.top}px`,
                    width: `${fromSugPos.width}px`
                  }}
                >
                  {fromSuggestions.map((city, idx) => (
                    <li
                      key={`${city}-${idx}`}
                      className={idx === fromActiveIdx ? "active" : ""}
                      onMouseDown={() => {
                        setFromCity(city);
                        setFromSuggestions([]);
                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="form-group">
              <label>To</label>
              <div className="autocomplete">
                <input
                  type="text"
                  placeholder="Enter destination city"
                  id="to-city"
                  autoComplete="off"
                  value={toCity}
                  ref={toInputRef}
                  onFocus={() => {
                    setToSuggestions(uniqueCities);
                    setToActiveIdx(-1);
                    updateSuggestionPosition(toInputRef, setToSugPos);
                  }}
                  onChange={(e) => {
                    setToCity(e.target.value);
                    setToSuggestions(filterCities(e.target.value));
                    setToActiveIdx(-1);
                    updateSuggestionPosition(toInputRef, setToSugPos);
                  }}
                  onKeyDown={(e) => {
                    if (!toSuggestions.length) return;
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setToActiveIdx((prev) => Math.min(prev + 1, toSuggestions.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setToActiveIdx((prev) => Math.max(prev - 1, 0));
                    } else if (e.key === "Enter") {
                      if (toActiveIdx >= 0) {
                        e.preventDefault();
                        setToCity(toSuggestions[toActiveIdx]);
                        setToSuggestions([]);
                      }
                    } else if (e.key === "Escape") {
                      setToSuggestions([]);
                    }
                  }}
                />
                <ul
                  className="suggestions"
                  id="to-suggestions"
                  ref={toListRef}
                  style={{
                    display: toSuggestions.length ? "block" : "none",
                    left: `${toSugPos.left}px`,
                    top: `${toSugPos.top}px`,
                    width: `${toSugPos.width}px`
                  }}
                >
                  {toSuggestions.map((city, idx) => (
                    <li
                      key={`${city}-${idx}`}
                      className={idx === toActiveIdx ? "active" : ""}
                      onMouseDown={() => {
                        setToCity(city);
                        setToSuggestions([]);
                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                id="travel-date"
                placeholder="YYYY-MM-DD"
                autoComplete="off"
                readOnly
                value={selectedDate}
                ref={travelDateRef}
                onClick={openCalendar}
              />
            </div>

            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i> Search
            </button>
          </form>
        </div>
      </header>

      <main className="container">
        <section className={`bus-results ${view === "bookings" ? "hidden" : ""}`}>
          <h2>Available Buses</h2>
          <div className="bus-list">
            {filteredBuses.length === 0 ? (
              <p className="no-results">No buses found matching your criteria.</p>
            ) : (
              filteredBuses.map((bus) => (
                (() => {
                  const availableSeats = getAvailableSeatCount(bus.id, bus.seats);
                  const soldOut = selectedDate && availableSeats <= 0;
                  return (
                    <div className="bus-card" key={bus.id}>
                      <div className="bus-info">
                        <div className="bus-header">
                          <h3 className="bus-name">
                            <i className="fas fa-bus"></i> {bus.name}
                          </h3>
                          <span className="seats-available">{availableSeats} seats</span>
                        </div>

                        <div className="timing">
                          <div className="departure">
                            <p className="time">{bus.departure}</p>
                            <p className="city">{bus.from}</p>
                          </div>
                          <div className="route-arrow">
                            <span className="arrow">→</span>
                            <span className="duration">4.5h</span>
                          </div>
                          <div className="arrival">
                            <p className="time">{bus.arrival}</p>
                            <p className="city">{bus.to}</p>
                          </div>
                        </div>

                        <div className="amenities">
                          {bus.amenities.map((amenity) => {
                            const data = AMENITY_LABELS[amenity];
                            if (!data) return null;
                            return (
                              <span className="amenity-badge" key={amenity}>
                                <i className={`fas ${data.icon}`}></i> {data.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bus-cta">
                        <div className="price-section">
                          <span className="currency">৳</span>
                          <span className="price">{bus.price}</span>
                          <span className="per-seat">per seat</span>
                        </div>
                        <button
                          className="book-now-btn"
                          disabled={soldOut}
                          onClick={() => openSeatPlan(bus)}
                        >
                          <i className={`fas ${soldOut ? "fa-ban" : "fa-chair"}`}></i> {soldOut ? "Sold Out" : "Choose Seat"}
                        </button>
                      </div>
                    </div>
                  );
                })()
              ))
            )}
          </div>
        </section>

        <section id="bookings-section" className={`bookings ${view === "bookings" ? "" : "hidden"}`}>
          <h2>My Bookings</h2>
          <div id="bookings-list">
            {bookings.length === 0 ? (
              <p className="no-results">You have no bookings yet.</p>
            ) : (
              bookings.map((b) => (
                <div className="booking-card" key={b.bookingId}>
                  <div className="booking-info">
                    <div style={{ fontWeight: 700 }}>{b.name} — ৳{b.price}</div>
                    <div className="booking-meta">
                      {b.from} → {b.to} {b.date ? `• ${b.date}` : ""}
                    </div>
                    {!!b.seats?.length && (
                      <div className="booking-meta">Seats: {b.seats.join(", ")}</div>
                    )}
                  </div>
                  <div className="booking-actions">
                    <button className="cancel-booking-btn" onClick={() => cancelBooking(b.bookingId)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ marginTop: "1.25rem" }}>
            <button className="book-now-btn" onClick={() => setView("search")}>
              Back to Search
            </button>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>SwiftBus</h3>
            <p>Your trusted partner for comfortable bus travel across Bangladesh.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">FAQs</a>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@swiftbus.com</p>
            <p>Phone: +880 1234 567890</p>
          </div>
        </div>
        <div className="copyright">&copy; 2024 SwiftBus. All rights reserved.</div>
      </footer>

      <div
        className={`calendar-picker ${calendarOpen ? "active" : ""}`}
        id="calendar-picker"
        ref={calendarRef}
        style={{ top: `${calendarPos.top}px`, left: `${calendarPos.left}px` }}
      >
        <div className="calendar-header">
          <button
            type="button"
            onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="calendar-month-year">
            <span id="month-year">{monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}</span>
          </div>
          <button
            type="button"
            onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="calendar-weekdays">
          <div className="calendar-weekday">Sun</div>
          <div className="calendar-weekday">Mon</div>
          <div className="calendar-weekday">Tue</div>
          <div className="calendar-weekday">Wed</div>
          <div className="calendar-weekday">Thu</div>
          <div className="calendar-weekday">Fri</div>
          <div className="calendar-weekday">Sat</div>
        </div>
        <div className="calendar-days" id="calendar-days">
          {calendarCells.map((cell) => {
            if (cell.type === "other") {
              return (
                <div className="calendar-day other-month" key={cell.key}>
                  {cell.label}
                </div>
              );
            }

            const classes = ["calendar-day"];
            if (cell.isToday) classes.push("today");
            if (cell.isSelected) classes.push("selected");
            if (cell.isPast) classes.push("disabled");

            return (
              <div
                key={cell.key}
                className={classes.join(" ")}
                style={cell.isPast ? { opacity: 0.4, pointerEvents: "none" } : null}
                onClick={() => {
                  if (cell.isPast) return;
                  setSelectedDate(cell.dateStr);
                  setCalendarOpen(false);
                }}
              >
                {cell.label}
              </div>
            );
          })}
        </div>
      </div>

      {seatPlanBus && (
        <div className="seat-plan-overlay" onClick={() => setSeatPlanBus(null)}>
          <div className="seat-plan-modal" onClick={(e) => e.stopPropagation()}>
            <div className="seat-plan-header">
              <div>
                <h3>{seatPlanBus.name}</h3>
                <p>
                  {seatPlanBus.from} → {seatPlanBus.to} {selectedDate ? `• ${selectedDate}` : ""}
                </p>
              </div>
              <button type="button" className="seat-plan-close" onClick={() => setSeatPlanBus(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="seat-legend">
              <span><i className="fas fa-square-full seat-legend-icon available"></i> Available</span>
              <span><i className="fas fa-square-full seat-legend-icon selected"></i> Selected</span>
              <span><i className="fas fa-square-full seat-legend-icon booked"></i> Booked</span>
            </div>

            <div className="driver-badge">Driver</div>
            <div className="seat-grid">
              {seatRows.map((row, rowIdx) => (
                <div className="seat-row" key={`row-${rowIdx}`}>
                  {row[0] ? (
                    <button
                      type="button"
                      className={`seat-btn ${bookedSeatsForPlan.has(row[0]) ? "booked" : ""} ${selectedSeats.includes(row[0]) ? "selected" : ""}`}
                      disabled={bookedSeatsForPlan.has(row[0])}
                      onClick={() => toggleSeatSelection(row[0], bookedSeatsForPlan)}
                    >
                      {row[0]}
                    </button>
                  ) : <div className="seat-empty"></div>}
                  {row[1] ? (
                    <button
                      type="button"
                      className={`seat-btn ${bookedSeatsForPlan.has(row[1]) ? "booked" : ""} ${selectedSeats.includes(row[1]) ? "selected" : ""}`}
                      disabled={bookedSeatsForPlan.has(row[1])}
                      onClick={() => toggleSeatSelection(row[1], bookedSeatsForPlan)}
                    >
                      {row[1]}
                    </button>
                  ) : <div className="seat-empty"></div>}
                  <div className="seat-aisle"></div>
                  {row[2] ? (
                    <button
                      type="button"
                      className={`seat-btn ${bookedSeatsForPlan.has(row[2]) ? "booked" : ""} ${selectedSeats.includes(row[2]) ? "selected" : ""}`}
                      disabled={bookedSeatsForPlan.has(row[2])}
                      onClick={() => toggleSeatSelection(row[2], bookedSeatsForPlan)}
                    >
                      {row[2]}
                    </button>
                  ) : <div className="seat-empty"></div>}
                  {row[3] ? (
                    <button
                      type="button"
                      className={`seat-btn ${bookedSeatsForPlan.has(row[3]) ? "booked" : ""} ${selectedSeats.includes(row[3]) ? "selected" : ""}`}
                      disabled={bookedSeatsForPlan.has(row[3])}
                      onClick={() => toggleSeatSelection(row[3], bookedSeatsForPlan)}
                    >
                      {row[3]}
                    </button>
                  ) : <div className="seat-empty"></div>}
                </div>
              ))}
            </div>

            {seatError && <p className="seat-error">{seatError}</p>}

            <div className="seat-plan-footer">
              <div className="seat-summary">
                {selectedSeats.length ? `Selected: ${selectedSeats.join(", ")}` : "Select seats to continue"}
              </div>
              <button type="button" className="book-now-btn" disabled={!selectedSeats.length} onClick={confirmSeatBooking}>
                Confirm Booking (৳{seatPlanBus.price * selectedSeats.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
