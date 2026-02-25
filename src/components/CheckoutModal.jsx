export function CheckoutModal({ checkoutData, isBookingSubmitting, setCheckoutData, passenger, setPassenger, checkoutError, finalizeBooking }) {
  if (!checkoutData) return null;

  return (
    <div className="seat-plan-overlay" onClick={() => !isBookingSubmitting && setCheckoutData(null)}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Passenger Checkout</h3>
        <p className="checkout-route">
          {checkoutData.name} • {checkoutData.from} → {checkoutData.to} • {checkoutData.date}
        </p>
        <p className="checkout-route">Seats: {checkoutData.seats.join(", ")} • Total: ৳{checkoutData.price}</p>

        <div className="checkout-form-grid">
          <label>
            Full Name
            <input
              type="text"
              value={passenger.name}
              onChange={(e) => setPassenger((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Passenger full name"
            />
          </label>
          <label>
            Phone Number
            <input
              type="text"
              value={passenger.phone}
              onChange={(e) => setPassenger((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="01XXXXXXXXX"
              inputMode="numeric"
              autoComplete="tel"
            />
          </label>
          <label>
            Email (Optional)
            <input
              type="email"
              value={passenger.email}
              onChange={(e) => setPassenger((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="name@email.com"
              autoComplete="email"
            />
          </label>
        </div>

        {checkoutError && <p className="seat-error">{checkoutError}</p>}

        <div className="checkout-actions">
          <button type="button" className="ghost-btn" disabled={isBookingSubmitting} onClick={() => setCheckoutData(null)}>
            Back
          </button>
          <button type="button" className="book-now-btn" disabled={isBookingSubmitting} onClick={finalizeBooking}>
            {isBookingSubmitting ? "Issuing Ticket..." : "Confirm & Issue Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CancelBookingModal({ confirmCancelBooking, setConfirmCancelBooking, confirmCancel }) {
  if (!confirmCancelBooking) return null;

  return (
    <div className="seat-plan-overlay" onClick={() => setConfirmCancelBooking(null)}>
      <div className="checkout-modal cancel-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Cancel Booking</h3>
        <p className="checkout-route">
          Cancel booking for {confirmCancelBooking.from} → {confirmCancelBooking.to}
          {confirmCancelBooking.date ? ` on ${confirmCancelBooking.date}` : ""}?
        </p>
        <p className="checkout-route">PNR: {confirmCancelBooking.pnr || "N/A"}</p>
        <div className="checkout-actions">
          <button type="button" className="ghost-btn" onClick={() => setConfirmCancelBooking(null)}>
            Keep Booking
          </button>
          <button type="button" className="cancel-booking-btn" onClick={confirmCancel}>
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
