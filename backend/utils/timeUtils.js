/**
 * Returns expected working hours for a given date
 * Rules:
 * - Sunday: 0 hours (off)
 * - Saturday: 4 hours (half day)
 * - Monday–Friday: 8.5 hours
 */
function getExpectedHours(date) {
  const day = new Date(date).getDay();

  if (day === 0) return 0;   // Sunday
  if (day === 6) return 4;   // Saturday
  return 8.5;               // Monday–Friday
}

/**
 * Calculates worked hours based on in-time and out-time
 * If either is missing, returns 0
 */
function normalizeTime(time) {
  // Case 1: ExcelJS gives Date object
  if (time instanceof Date) {
    return {
      hours: time.getHours(),
      minutes: time.getMinutes()
    };
  }

  // Case 2: ExcelJS gives string "HH:MM"
  if (typeof time === "string") {
    const [h, m] = time.split(":").map(Number);
    return { hours: h, minutes: m };
  }

  // Case 3: Excel gives numeric time (fraction of day)
  if (typeof time === "number") {
    const totalMinutes = Math.round(time * 24 * 60);
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  }

  return null;
}

function calculateWorkedHours(inTime, outTime) {
  if (!inTime || !outTime) return 0;

  const inT = normalizeTime(inTime);
  const outT = normalizeTime(outTime);

  if (!inT || !outT) return 0;

  let inMinutes = inT.hours * 60 + inT.minutes;
  let outMinutes = outT.hours * 60 + outT.minutes;

  //  Handle overnight shifts (out time next day)
  if (outMinutes < inMinutes) {
    outMinutes += 24 * 60;
  }

  return (outMinutes - inMinutes) / 60;
}

module.exports = {
  getExpectedHours,
  calculateWorkedHours
};
