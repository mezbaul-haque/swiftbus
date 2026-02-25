export default function SearchHeader({
  setView,
  uniqueCities,
  fromCity,
  toCity,
  selectedDate,
  handleSearchSubmit,
  handleSwapCities,
  travelDateRef,
  openCalendar,
  fromInputRef,
  toInputRef,
  fromSuggestions,
  toSuggestions,
  fromActiveIdx,
  toActiveIdx,
  setFromActiveIdx,
  setToActiveIdx,
  fromSugPos,
  toSugPos,
  fromListRef,
  toListRef,
  trySetFromCity,
  trySetToCity,
  setFromSuggestions,
  setToSuggestions,
  filterCities,
  updateSuggestionPosition,
  searchError
}) {
  return (
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
          <img src="/logo.svg" alt="SwiftBus logo" />
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
                  updateSuggestionPosition(fromInputRef, "from");
                }}
                onChange={(e) => {
                  const nextFrom = e.target.value;
                  if (trySetFromCity(nextFrom)) {
                    setFromSuggestions(filterCities(nextFrom));
                    setFromActiveIdx(-1);
                    updateSuggestionPosition(fromInputRef, "from");
                  }
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
                      const nextFrom = fromSuggestions[fromActiveIdx];
                      if (trySetFromCity(nextFrom)) {
                        setFromSuggestions([]);
                      }
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
                      if (trySetFromCity(city)) {
                        setFromSuggestions([]);
                      }
                    }}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="form-group form-group-to">
            <label htmlFor="to-city">To</label>
            <button
              type="button"
              className="swap-inline-btn"
              onClick={handleSwapCities}
              title="Swap From and To cities"
              aria-label="Swap From and To cities"
            >
              <i className="fas fa-right-left"></i> Swap
            </button>
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
                  updateSuggestionPosition(toInputRef, "to");
                }}
                onChange={(e) => {
                  const nextTo = e.target.value;
                  if (trySetToCity(nextTo)) {
                    setToSuggestions(filterCities(nextTo));
                    setToActiveIdx(-1);
                    updateSuggestionPosition(toInputRef, "to");
                  }
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
                      const nextTo = toSuggestions[toActiveIdx];
                      if (trySetToCity(nextTo)) {
                        setToSuggestions([]);
                      }
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
                      if (trySetToCity(city)) {
                        setToSuggestions([]);
                      }
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
        <div
          className={`search-error ${searchError ? "active" : ""}`}
          aria-live="polite"
          role={searchError ? "alert" : "status"}
        >
          {searchError ? (
            <>
              <i className="fas fa-circle-exclamation" aria-hidden="true"></i>
              <span>{searchError}</span>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
