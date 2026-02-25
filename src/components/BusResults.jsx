import { AMENITY_LABELS } from "../data/constants";

export default function BusResults({ view, filteredBuses, getAvailableSeatCount, selectedDate, openSeatPlan }) {
  return (
    <section className={`bus-results ${view === "bookings" ? "hidden" : ""}`}>
      <h2>Available Buses</h2>
      <div className="bus-list">
        {filteredBuses.length === 0 ? (
          <p className="no-results">No buses found matching your criteria.</p>
        ) : (
          filteredBuses.map((bus) => {
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
                  <button className="book-now-btn" disabled={soldOut} onClick={() => openSeatPlan(bus)}>
                    <i className={`fas ${soldOut ? "fa-ban" : "fa-chair"}`}></i> {soldOut ? "Sold Out" : "Choose Seat"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
