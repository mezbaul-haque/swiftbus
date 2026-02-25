import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import SearchHeader from "./components/SearchHeader";
import BusResults from "./components/BusResults";
import BookingsSection from "./components/BookingsSection";
import CalendarPicker from "./components/CalendarPicker";
import SeatPlanModal from "./components/SeatPlanModal";
import { CancelBookingModal, CheckoutModal } from "./components/CheckoutModal";
import TicketModal from "./components/TicketModal";
import { BUS_DATA, EMPTY_PASSENGER, MAX_SEAT_SELECTION } from "./data/constants";
import {
  formatDateISO,
  getSeatLayout,
  getSeatRows,
  getUniquePNR,
  hasDuplicateBooking,
  isValidBdPhone,
  isValidEmail,
  normalizePhone
} from "./utils/booking";
import useLocalStorageState from "./hooks/useLocalStorageState";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function App() {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [filteredBuses, setFilteredBuses] = useState(BUS_DATA);
  const [view, setView] = useState("search");
  const [bookings, setBookings] = useLocalStorageState("swiftbus_bookings", []);
  const [selectedDate, setSelectedDate] = useState("");
  const [seatPlanBus, setSeatPlanBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatError, setSeatError] = useState("");
  const [checkoutData, setCheckoutData] = useState(null);
  const [passenger, setPassenger] = useState(EMPTY_PASSENGER);
  const [checkoutError, setCheckoutError] = useState("");
  const [activeTicket, setActiveTicket] = useState(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [confirmCancelBooking, setConfirmCancelBooking] = useState(null);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const bookingList = Array.isArray(bookings) ? bookings : [];

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

  function normalizeCity(value) {
    return value.trim().toLowerCase();
  }

  function isSameCityPair(fromValue, toValue) {
    const from = normalizeCity(fromValue);
    const to = normalizeCity(toValue);
    return !!from && !!to && from === to;
  }

  function setSameCityError() {
    setSearchError("From and To cannot be the same city.");
  }

  function trySetFromCity(nextFrom) {
    if (isSameCityPair(nextFrom, toCity)) {
      setSameCityError();
      return false;
    }
    setFromCity(nextFrom);
    return true;
  }

  function trySetToCity(nextTo) {
    if (isSameCityPair(fromCity, nextTo)) {
      setSameCityError();
      return false;
    }
    setToCity(nextTo);
    return true;
  }

  const uniqueCities = useMemo(() => {
    const set = new Set();
    BUS_DATA.forEach((b) => {
      set.add(b.from);
      set.add(b.to);
    });
    return Array.from(set).sort();
  }, []);

  useEffect(() => {
    try {
      const storedSearch = JSON.parse(localStorage.getItem("swiftbus_last_search") || "{}");
      const storedFrom = typeof storedSearch.fromCity === "string" ? storedSearch.fromCity : "";
      const rawStoredTo = typeof storedSearch.toCity === "string" ? storedSearch.toCity : "";
      const storedTo = isSameCityPair(storedFrom, rawStoredTo) ? "" : rawStoredTo;
      const storedDate = typeof storedSearch.selectedDate === "string" ? storedSearch.selectedDate : "";
      setFromCity(storedFrom);
      setToCity(storedTo);
      setSelectedDate(storedDate);

      if (!storedFrom.trim() && !storedTo.trim()) {
        setFilteredBuses(BUS_DATA);
      } else {
        const from = storedFrom.trim().toLowerCase();
        const to = storedTo.trim().toLowerCase();
        setFilteredBuses(BUS_DATA.filter((bus) => {
          const matchFrom = !from || bus.from.toLowerCase().includes(from);
          const matchTo = !to || bus.to.toLowerCase().includes(to);
          return matchFrom && matchTo;
        }));
      }
    } catch {
      setFromCity("");
      setToCity("");
      setSelectedDate("");
      setFilteredBuses(BUS_DATA);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("swiftbus_last_search", JSON.stringify({
      fromCity,
      toCity,
      selectedDate
    }));
  }, [fromCity, toCity, selectedDate]);

  useEffect(() => {
    if (!searchError) return;
    setSearchError("");
  }, [fromCity, toCity, selectedDate]);

  useEffect(() => {
    function handleOutsideClick(e) {
      const fromList = fromListRef.current;
      const toList = toListRef.current;
      const fromInput = fromInputRef.current;
      const toInput = toInputRef.current;

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

  function updateSuggestionPosition(inputRef, target) {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    const next = {
      left: rect.left,
      top: rect.bottom + 6,
      width: rect.width
    };

    if (target === "from") {
      setFromSugPos(next);
    } else {
      setToSugPos(next);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const from = normalizeCity(fromCity);
    const to = normalizeCity(toCity);

    if (!selectedDate) {
      setSearchError("Please select a travel date before searching.");
      return;
    }

    if (from && to && from === to) {
      setSameCityError();
      return;
    }

    setSearchError("");

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

  function handleSwapCities() {
    setFromCity(toCity);
    setToCity(fromCity);
    setSearchError("");
    setFromSuggestions([]);
    setToSuggestions([]);
    setFromActiveIdx(-1);
    setToActiveIdx(-1);
  }

  function getBookedSeatSet(busId, date) {
    const set = new Set();
    bookingList.forEach((booking) => {
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
      setSearchError("Please select a travel date before choosing seats.");
      return;
    }
    setSeatPlanBus(bus);
    setSelectedSeats([]);
    setSeatError("");
    setCheckoutData(null);
    setCheckoutError("");
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

  function startCheckout() {
    if (!seatPlanBus || !selectedSeats.length) return;
    const latestBooked = getBookedSeatSet(seatPlanBus.id, selectedDate);
    const alreadyTaken = selectedSeats.filter((seat) => latestBooked.has(seat));
    if (alreadyTaken.length) {
      setSeatError(`Seat already booked: ${alreadyTaken.join(", ")}. Please choose different seats.`);
      setSelectedSeats((prev) => prev.filter((seat) => !alreadyTaken.includes(seat)));
      return;
    }
    setCheckoutData({
      busId: seatPlanBus.id,
      name: seatPlanBus.name,
      from: seatPlanBus.from,
      to: seatPlanBus.to,
      date: selectedDate,
      seats: [...selectedSeats],
      seatCount: selectedSeats.length,
      pricePerSeat: seatPlanBus.price,
      price: seatPlanBus.price * selectedSeats.length
    });
    setCheckoutError("");
  }

  async function finalizeBooking() {
    if (!checkoutData || isBookingSubmitting) return;
    const name = passenger.name.trim();
    const phone = normalizePhone(passenger.phone);
    const email = passenger.email.trim();

    if (!name || !phone) {
      setCheckoutError("Passenger name and phone are required.");
      return;
    }
    if (!isValidBdPhone(phone)) {
      setCheckoutError("Enter a valid Bangladeshi phone number (e.g., 01XXXXXXXXX or +8801XXXXXXXXX).");
      return;
    }
    if (email && !isValidEmail(email)) {
      setCheckoutError("Enter a valid email address or leave it empty.");
      return;
    }

    const latestBooked = getBookedSeatSet(checkoutData.busId, checkoutData.date);
    const alreadyTaken = checkoutData.seats.filter((seat) => latestBooked.has(seat));
    if (alreadyTaken.length) {
      setCheckoutError(`Seat already booked: ${alreadyTaken.join(", ")}. Please choose different seats.`);
      setSelectedSeats((prev) => prev.filter((seat) => !alreadyTaken.includes(seat)));
      return;
    }
    const duplicate = bookingList.some((booking) => hasDuplicateBooking(booking, {
      busId: checkoutData.busId,
      date: checkoutData.date,
      phone,
      seats: checkoutData.seats
    }));
    if (duplicate) {
      setCheckoutError("This booking already exists for the same passenger and seats.");
      return;
    }

    setIsBookingSubmitting(true);
    try {
      const pnr = getUniquePNR(bookingList);
      const booking = {
        bookingId: Date.now(),
        busId: checkoutData.busId,
        pnr,
        name: checkoutData.name,
        from: checkoutData.from,
        to: checkoutData.to,
        date: checkoutData.date,
        seats: checkoutData.seats,
        seatCount: checkoutData.seatCount,
        pricePerSeat: checkoutData.pricePerSeat,
        price: checkoutData.price,
        passenger: {
          name,
          phone,
          email
        },
        createdAt: new Date().toISOString()
      };

      const ticketText = [
        "SwiftBus E-Ticket",
        `PNR: ${pnr}`,
        `Passenger: ${booking.passenger.name}`,
        `Route: ${booking.from} -> ${booking.to}`,
        `Date: ${booking.date}`,
        `Seats: ${booking.seats.join(", ")}`,
        `Fare: BDT ${booking.price}`
      ].join("\n");

      try {
        booking.qrDataUrl = await QRCode.toDataURL(ticketText, { width: 200, margin: 1 });
      } catch {
        booking.qrDataUrl = "";
      }

      setBookings((prev) => [...(Array.isArray(prev) ? prev : []), booking]);
      setActiveTicket(booking);
      setTicketOpen(true);
      setCheckoutData(null);
      setPassenger(EMPTY_PASSENGER);
      setCheckoutError("");
      setSeatPlanBus(null);
      setSelectedSeats([]);
      setSeatError("");
      setView("bookings");
    } catch {
      setCheckoutError("Unable to issue ticket right now. Please try again.");
    } finally {
      setIsBookingSubmitting(false);
    }
  }

  function cancelBooking(id) {
    setBookings((prev) => prev.filter((b) => b.bookingId !== id));
  }

  function requestCancelBooking(booking) {
    setConfirmCancelBooking(booking);
  }

  function confirmCancel() {
    if (!confirmCancelBooking) return;
    cancelBooking(confirmCancelBooking.bookingId);
    setConfirmCancelBooking(null);
  }

  function openTicket(booking) {
    setActiveTicket(booking);
    setTicketOpen(true);
  }

  function printTicket(booking) {
    if (!booking) return;
    const popup = window.open("", "_blank", "width=760,height=840");
    if (!popup) return;

    const createdDate = new Date(booking.createdAt).toLocaleString();
    const qrSection = booking.qrDataUrl
      ? `<img src="${booking.qrDataUrl}" alt="QR Code" style="width:160px;height:160px;" />`
      : `<div style="padding:12px;border:1px dashed #999;border-radius:8px;">QR unavailable</div>`;

    popup.document.write(`
      <html>
        <head>
          <title>SwiftBus Ticket ${booking.pnr || ""}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; padding: 28px; }
            .card { max-width: 620px; margin: 0 auto; border: 1px solid #d1d5db; border-radius: 12px; padding: 20px; }
            .row { margin-bottom: 10px; font-size: 14px; }
            .title { font-size: 24px; margin: 0 0 14px; color: #059669; }
            .pnr { display: inline-block; background: #ecfdf5; color: #065f46; padding: 6px 10px; border-radius: 999px; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1 class="title">SwiftBus E-Ticket</h1>
            <div class="row"><span class="pnr">PNR: ${booking.pnr || "N/A"}</span></div>
            <div class="row"><strong>Passenger:</strong> ${booking.passenger?.name || "N/A"}</div>
            <div class="row"><strong>Phone:</strong> ${booking.passenger?.phone || "N/A"}</div>
            <div class="row"><strong>Bus:</strong> ${booking.name}</div>
            <div class="row"><strong>Route:</strong> ${booking.from} -> ${booking.to}</div>
            <div class="row"><strong>Travel Date:</strong> ${booking.date || "N/A"}</div>
            <div class="row"><strong>Seats:</strong> ${(booking.seats || []).join(", ")}</div>
            <div class="row"><strong>Total Fare:</strong> BDT ${booking.price}</div>
            <div class="row"><strong>Booked At:</strong> ${createdDate}</div>
            <div class="row">${qrSection}</div>
          </div>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
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

    for (let i = firstDay - 1; i >= 0; i -= 1) {
      cells.push({
        label: String(daysInPrevMonth - i),
        type: "other",
        key: `prev-${i}`
      });
    }

    for (let i = 1; i <= daysInMonth; i += 1) {
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
  const seatLayout = useMemo(() => getSeatLayout(seatPlanBus), [seatPlanBus]);
  const seatRows = useMemo(() => {
    if (!seatPlanBus) return [];
    return getSeatRows(seatPlanBus.seats, seatLayout);
  }, [seatPlanBus, seatLayout]);
  const bookedSeatsForPlan = useMemo(() => {
    if (!seatPlanBus) return new Set();
    return getBookedSeatSet(seatPlanBus.id, selectedDate);
  }, [seatPlanBus, selectedDate, bookingList]);

  return (
    <>
      <SearchHeader
        setView={setView}
        uniqueCities={uniqueCities}
        fromCity={fromCity}
        toCity={toCity}
        selectedDate={selectedDate}
        handleSearchSubmit={handleSearchSubmit}
        handleSwapCities={handleSwapCities}
        travelDateRef={travelDateRef}
        openCalendar={openCalendar}
        fromInputRef={fromInputRef}
        toInputRef={toInputRef}
        fromSuggestions={fromSuggestions}
        toSuggestions={toSuggestions}
        fromActiveIdx={fromActiveIdx}
        toActiveIdx={toActiveIdx}
        setFromActiveIdx={setFromActiveIdx}
        setToActiveIdx={setToActiveIdx}
        fromSugPos={fromSugPos}
        toSugPos={toSugPos}
        fromListRef={fromListRef}
        toListRef={toListRef}
        trySetFromCity={trySetFromCity}
        trySetToCity={trySetToCity}
        setFromSuggestions={setFromSuggestions}
        setToSuggestions={setToSuggestions}
        filterCities={filterCities}
        updateSuggestionPosition={updateSuggestionPosition}
        searchError={searchError}
      />

      <main className="container">
        <BusResults
          view={view}
          filteredBuses={filteredBuses}
          getAvailableSeatCount={getAvailableSeatCount}
          selectedDate={selectedDate}
          openSeatPlan={openSeatPlan}
        />

        <BookingsSection
          view={view}
          bookings={bookingList}
          setView={setView}
          openTicket={openTicket}
          requestCancelBooking={requestCancelBooking}
        />
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

      <CalendarPicker
        calendarOpen={calendarOpen}
        calendarRef={calendarRef}
        calendarPos={calendarPos}
        calendarDate={calendarDate}
        setCalendarDate={setCalendarDate}
        monthNames={monthNames}
        calendarCells={calendarCells}
        setSelectedDate={setSelectedDate}
        setSearchError={setSearchError}
        setCalendarOpen={setCalendarOpen}
      />

      <SeatPlanModal
        seatPlanBus={seatPlanBus}
        selectedDate={selectedDate}
        setSeatPlanBus={setSeatPlanBus}
        seatLayout={seatLayout}
        seatRows={seatRows}
        bookedSeatsForPlan={bookedSeatsForPlan}
        selectedSeats={selectedSeats}
        toggleSeatSelection={toggleSeatSelection}
        seatError={seatError}
        startCheckout={startCheckout}
      />

      <CheckoutModal
        checkoutData={checkoutData}
        isBookingSubmitting={isBookingSubmitting}
        setCheckoutData={setCheckoutData}
        passenger={passenger}
        setPassenger={setPassenger}
        checkoutError={checkoutError}
        finalizeBooking={finalizeBooking}
      />

      <CancelBookingModal
        confirmCancelBooking={confirmCancelBooking}
        setConfirmCancelBooking={setConfirmCancelBooking}
        confirmCancel={confirmCancel}
      />

      <TicketModal
        ticketOpen={ticketOpen}
        activeTicket={activeTicket}
        setTicketOpen={setTicketOpen}
        printTicket={printTicket}
      />
    </>
  );
}
