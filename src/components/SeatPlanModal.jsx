export default function SeatPlanModal({
  seatPlanBus,
  selectedDate,
  setSeatPlanBus,
  seatLayout,
  seatRows,
  bookedSeatsForPlan,
  selectedSeats,
  toggleSeatSelection,
  seatError,
  startCheckout
}) {
  if (!seatPlanBus) return null;

  return (
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
          <span><i className="fas fa-th-large"></i> Layout: {seatLayout.label}</span>
        </div>

        <div className="driver-badge">Driver</div>
        <div className="seat-grid">
          {seatRows.map((row, rowIdx) => (
            <div
              className="seat-row"
              key={`row-${rowIdx}`}
              style={{
                gridTemplateColumns: `repeat(${seatLayout.left.length}, 1fr) 26px repeat(${seatLayout.right.length}, 1fr)`
              }}
            >
              {row.left.map((seatNo, idx) => seatNo ? (
                <button
                  key={`left-${rowIdx}-${idx}`}
                  type="button"
                  className={`seat-btn ${bookedSeatsForPlan.has(seatNo) ? "booked" : ""} ${selectedSeats.includes(seatNo) ? "selected" : ""}`}
                  disabled={bookedSeatsForPlan.has(seatNo)}
                  onClick={() => toggleSeatSelection(seatNo, bookedSeatsForPlan)}
                >
                  {seatNo}
                </button>
              ) : <div className="seat-empty" key={`left-empty-${rowIdx}-${idx}`}></div>)}
              <div className="seat-aisle"></div>
              {row.right.map((seatNo, idx) => seatNo ? (
                <button
                  key={`right-${rowIdx}-${idx}`}
                  type="button"
                  className={`seat-btn ${bookedSeatsForPlan.has(seatNo) ? "booked" : ""} ${selectedSeats.includes(seatNo) ? "selected" : ""}`}
                  disabled={bookedSeatsForPlan.has(seatNo)}
                  onClick={() => toggleSeatSelection(seatNo, bookedSeatsForPlan)}
                >
                  {seatNo}
                </button>
              ) : <div className="seat-empty" key={`right-empty-${rowIdx}-${idx}`}></div>)}
            </div>
          ))}
        </div>

        {seatError && <p className="seat-error">{seatError}</p>}

        <div className="seat-plan-footer">
          <div className="seat-summary">
            {selectedSeats.length ? `Selected: ${selectedSeats.join(", ")}` : "Select seats to continue"}
          </div>
          <button type="button" className="book-now-btn" disabled={!selectedSeats.length} onClick={startCheckout}>
            Continue Checkout (৳{seatPlanBus.price * selectedSeats.length})
          </button>
        </div>
      </div>
    </div>
  );
}
