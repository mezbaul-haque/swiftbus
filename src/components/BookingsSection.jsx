export default function BookingsSection({ view, bookings, setView, openTicket, requestCancelBooking }) {
  return (
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
                {!!b.seats?.length && <div className="booking-meta">Seats: {b.seats.join(", ")}</div>}
                {!!b.pnr && <div className="booking-meta">PNR: {b.pnr}</div>}
                {!!b.passenger?.name && <div className="booking-meta">Passenger: {b.passenger.name}</div>}
              </div>
              <div className="booking-actions">
                <button className="view-ticket-btn" onClick={() => openTicket(b)}>
                  View Ticket
                </button>
                <button className="cancel-booking-btn" onClick={() => requestCancelBooking(b)}>
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
  );
}
