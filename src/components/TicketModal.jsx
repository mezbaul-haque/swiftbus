export default function TicketModal({ ticketOpen, activeTicket, setTicketOpen, printTicket }) {
  if (!ticketOpen || !activeTicket) return null;

  return (
    <div className="seat-plan-overlay" onClick={() => setTicketOpen(false)}>
      <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ticket-head">
          <h3>SwiftBus E-Ticket</h3>
          <span className="ticket-pnr">PNR: {activeTicket.pnr || "N/A"}</span>
        </div>
        <div className="ticket-body">
          <div className="ticket-details">
            <p><strong>Passenger:</strong> {activeTicket.passenger?.name || "N/A"}</p>
            <p><strong>Phone:</strong> {activeTicket.passenger?.phone || "N/A"}</p>
            <p><strong>Bus:</strong> {activeTicket.name}</p>
            <p><strong>Route:</strong> {activeTicket.from} → {activeTicket.to}</p>
            <p><strong>Date:</strong> {activeTicket.date || "N/A"}</p>
            <p><strong>Seats:</strong> {(activeTicket.seats || []).join(", ")}</p>
            <p><strong>Total Fare:</strong> ৳{activeTicket.price}</p>
          </div>
          <div className="ticket-qr-wrap">
            {activeTicket.qrDataUrl ? (
              <img src={activeTicket.qrDataUrl} alt="Ticket QR code" className="ticket-qr" />
            ) : (
              <div className="ticket-qr-placeholder">QR unavailable</div>
            )}
          </div>
        </div>
        <div className="checkout-actions">
          <button type="button" className="ghost-btn" onClick={() => setTicketOpen(false)}>
            Close
          </button>
          <button type="button" className="book-now-btn" onClick={() => printTicket(activeTicket)}>
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
