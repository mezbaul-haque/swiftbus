import { BD_PHONE_PATTERN, EMAIL_PATTERN, SEAT_LAYOUTS } from "../data/constants";

export function formatDateISO(date) {
  return date.toISOString().split("T")[0];
}

function generatePNR() {
  const timePart = Date.now().toString(36).slice(-5).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SB-${timePart}${randomPart}`;
}

export function getUniquePNR(existingBookings) {
  const existing = new Set(existingBookings.map((b) => b?.pnr).filter(Boolean));
  for (let i = 0; i < 10; i += 1) {
    const pnr = generatePNR();
    if (!existing.has(pnr)) return pnr;
  }
  return `SB-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
}

export function normalizePhone(value) {
  return value.replace(/[\s-]/g, "").trim();
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value);
}

export function isValidBdPhone(value) {
  return BD_PHONE_PATTERN.test(value);
}

function sortSeats(seats) {
  return [...seats].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

export function hasDuplicateBooking(existingBooking, candidate) {
  if (!existingBooking) return false;
  if (existingBooking.busId !== candidate.busId) return false;
  if ((existingBooking.date || "") !== (candidate.date || "")) return false;
  if (normalizePhone(existingBooking.passenger?.phone || "") !== candidate.phone) return false;
  const existingSeats = sortSeats(Array.isArray(existingBooking.seats) ? existingBooking.seats : []);
  const candidateSeats = sortSeats(candidate.seats);
  if (existingSeats.length !== candidateSeats.length) return false;
  return existingSeats.every((seat, idx) => seat === candidateSeats[idx]);
}

export function getSeatLayout(bus) {
  return SEAT_LAYOUTS[bus?.seatLayout] || SEAT_LAYOUTS["2x2"];
}

export function getSeatRows(totalSeats, layout) {
  const rows = [];
  let count = 0;
  let rowNo = 1;

  while (count < totalSeats) {
    const left = layout.left.map((col) => {
      if (count >= totalSeats) return null;
      count += 1;
      return `${rowNo}${col}`;
    });
    const right = layout.right.map((col) => {
      if (count >= totalSeats) return null;
      count += 1;
      return `${rowNo}${col}`;
    });
    rows.push({ left, right });
    rowNo += 1;
  }

  return rows;
}
