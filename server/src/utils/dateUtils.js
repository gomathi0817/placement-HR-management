/**
 * Date & Time utilities with Asia/Kolkata timezone support for GV HR Follow-Up backend.
 */

export function getTodayDateString() {
  const now = new Date();
  // Format YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateTime(dateStr, timeStr = '10:30 AM') {
  if (!dateStr) return new Date();

  let [year, month, day] = dateStr.split('-').map(Number);
  let hours = 10;
  let minutes = 30;

  if (timeStr) {
    // Parse time string e.g. "10:30 AM", "02:15 PM", "14:30"
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const ampm = match[3] ? match[3].toUpperCase() : null;

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function isDateTimeInPast(dateStr, timeStr = '10:30 AM') {
  const targetDate = parseDateTime(dateStr, timeStr);
  const now = new Date();
  return targetDate < now;
}

export function isDateInPast(dateStr) {
  const todayStr = getTodayDateString();
  return dateStr < todayStr;
}
