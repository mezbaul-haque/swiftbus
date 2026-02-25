export default function CalendarPicker({
  calendarOpen,
  calendarRef,
  calendarPos,
  calendarDate,
  setCalendarDate,
  monthNames,
  calendarCells,
  setSelectedDate,
  setSearchError,
  setCalendarOpen
}) {
  return (
    <div
      className={`calendar-picker ${calendarOpen ? "active" : ""}`}
      id="calendar-picker"
      ref={calendarRef}
      style={{ top: `${calendarPos.top}px`, left: `${calendarPos.left}px` }}
    >
      <div className="calendar-header">
        <button type="button" onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="calendar-month-year">
          <span id="month-year">{monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}</span>
        </div>
        <button type="button" onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}>
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
                setSearchError("");
                setCalendarOpen(false);
              }}
            >
              {cell.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
