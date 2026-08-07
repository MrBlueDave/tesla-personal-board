/**
 * LIVE DIGITAL CLOCK & DATE MODULE
 */

let clockInterval = null;

export function startLiveClock(onTick) {
  function update() {
    const now = new Date();
    
    // Time format HH:MM
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    // Date format e.g. "MARTEDÌ, 4 AGOSTO"
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const dateString = now.toLocaleDateString('it-IT', options).toUpperCase();

    if (onTick) {
      onTick({
        hours,
        minutes,
        seconds,
        timeString,
        dateString
      });
    }
  }

  update();
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(update, 1000);
}
