export const BUS_DATA = [
  { id: 1, name: "Green Line", from: "Dhaka", to: "Jessore", departure: "08:00 AM", arrival: "12:30 PM", price: 1200, seats: 45, seatLayout: "2x2", amenities: ["wifi", "ac", "charging"] },
  { id: 2, name: "Shohagh Paribahan", from: "Dhaka", to: "Jessore", departure: "09:30 AM", arrival: "02:00 PM", price: 1000, seats: 60, seatLayout: "2x2", amenities: ["ac", "charging"] },
  { id: 3, name: "ENA Express", from: "Dhaka", to: "Jessore", departure: "11:00 AM", arrival: "03:30 PM", price: 900, seats: 50, seatLayout: "2x2", amenities: ["ac"] },
  { id: 4, name: "Hanif Enterprise", from: "Dhaka", to: "Jessore", departure: "02:00 PM", arrival: "06:30 PM", price: 1100, seats: 55, seatLayout: "2x2", amenities: ["wifi", "ac", "charging", "water"] },
  { id: 5, name: "Soudia Transport", from: "Dhaka", to: "Jessore", departure: "04:00 PM", arrival: "08:15 PM", price: 1050, seats: 48, seatLayout: "2x2", amenities: ["wifi", "ac"] },
  { id: 6, name: "BD Express", from: "Dhaka", to: "Sylhet", departure: "07:00 AM", arrival: "12:00 PM", price: 1500, seats: 40, seatLayout: "1x2", amenities: ["wifi", "ac", "charging"] },
  { id: 7, name: "Hill Transport", from: "Dhaka", to: "Sylhet", departure: "10:00 AM", arrival: "03:00 PM", price: 1400, seats: 50, seatLayout: "2x2", amenities: ["ac", "water"] },
  { id: 8, name: "Transtar", from: "Dhaka", to: "Chittagong", departure: "08:30 AM", arrival: "01:00 PM", price: 1100, seats: 55, seatLayout: "2x2", amenities: ["wifi", "ac", "charging"] },
  { id: 9, name: "Sohag Express", from: "Dhaka", to: "Chittagong", departure: "11:00 AM", arrival: "04:00 PM", price: 950, seats: 65, seatLayout: "2x2", amenities: ["ac"] },
  { id: 10, name: "Ocean Travels", from: "Dhaka", to: "Khulna", departure: "09:00 AM", arrival: "02:00 PM", price: 1300, seats: 45, seatLayout: "2x2", amenities: ["wifi", "ac", "charging", "water"] },
  { id: 11, name: "Royal Coach", from: "Dhaka", to: "Rajshahi", departure: "06:00 AM", arrival: "11:00 AM", price: 1250, seats: 50, seatLayout: "2x2", amenities: ["ac", "charging"] },
  { id: 12, name: "Star Travels", from: "Dhaka", to: "Bogra", departure: "07:30 AM", arrival: "11:30 AM", price: 900, seats: 60, seatLayout: "2x2", amenities: ["ac"] },
  { id: 13, name: "Metro Transport", from: "Dhaka", to: "Mymensingh", departure: "08:00 AM", arrival: "10:30 AM", price: 700, seats: 55, seatLayout: "2x2", amenities: ["wifi", "ac"] },
  { id: 14, name: "Comfort Bus", from: "Chittagong", to: "Sylhet", departure: "06:00 AM", arrival: "02:00 PM", price: 1600, seats: 40, seatLayout: "1x2", amenities: ["wifi", "ac", "charging"] },
  { id: 15, name: "Coastal Travels", from: "Chittagong", to: "Jessore", departure: "07:00 AM", arrival: "03:00 PM", price: 1800, seats: 45, seatLayout: "2x2", amenities: ["ac", "water"] },
  { id: 16, name: "Khulna Connect", from: "Khulna", to: "Jessore", departure: "08:00 AM", arrival: "11:00 AM", price: 700, seats: 50, seatLayout: "2x2", amenities: ["ac"] },
  { id: 17, name: "North Express", from: "Rajshahi", to: "Bogra", departure: "09:00 AM", arrival: "12:00 PM", price: 600, seats: 55, seatLayout: "2x2", amenities: ["ac", "charging"] },
  { id: 18, name: "Rangpur Link", from: "Dhaka", to: "Rangpur", departure: "06:00 AM", arrival: "10:00 AM", price: 1100, seats: 60, seatLayout: "2x2", amenities: ["wifi", "ac"] },
  { id: 19, name: "Barisal Direct", from: "Dhaka", to: "Barisal", departure: "08:00 AM", arrival: "01:00 PM", price: 1400, seats: 50, seatLayout: "2x2", amenities: ["ac", "charging", "water"] },
  { id: 20, name: "Comilla Express", from: "Dhaka", to: "Comilla", departure: "07:00 AM", arrival: "11:00 AM", price: 950, seats: 65, seatLayout: "2x2", amenities: ["ac"] }
];

export const AMENITY_LABELS = {
  wifi: { icon: "fa-wifi", label: "WiFi" },
  ac: { icon: "fa-snowflake", label: "AC" },
  charging: { icon: "fa-plug", label: "Charging" },
  water: { icon: "fa-tint", label: "Water" }
};

export const MAX_SEAT_SELECTION = 4;

export const SEAT_LAYOUTS = {
  "2x2": { label: "2+2", left: ["A", "B"], right: ["C", "D"] },
  "1x2": { label: "1+2", left: ["A"], right: ["B", "C"] }
};

export const EMPTY_PASSENGER = { name: "", phone: "", email: "" };
export const BD_PHONE_PATTERN = /^(?:\+?88)?01[3-9]\d{8}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
