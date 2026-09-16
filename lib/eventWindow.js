// Finestra di check-in dell'evento: conta anche chi entra dopo mezzanotte come
// appartenente al giorno evento precedente (stessa logica "orario notturno" di
// app/schedule/person/[name]/page.js). EVENT_DATE va impostata sia in .env.local
// (dev) sia nelle Environment Variables del progetto Vercel (prod) — .env.local
// non viene mai deployato.
const NIGHT_CUTOFF_HOUR = 6; // 06:00 del giorno dopo

function parseEventDate() {
  const raw = process.env.EVENT_DATE; // "YYYY-MM-DD"
  if (!raw) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!match) return null;
  const [, y, m, d] = match;
  return { y: Number(y), m: Number(m), d: Number(d) };
}

export function isWithinEventWindow(now = new Date()) {
  const eventDate = parseEventDate();
  if (!eventDate) {
    console.warn("EVENT_DATE non impostata: check-in registrato senza filtro data.");
    return true;
  }
  const { y, m, d } = eventDate;
  const start = new Date(y, m - 1, d, 0, 0, 0);
  const end = new Date(y, m - 1, d + 1, NIGHT_CUTOFF_HOUR, 0, 0);
  return now >= start && now < end;
}

export function getEventDateLabel() {
  const eventDate = parseEventDate();
  if (!eventDate) return new Date().toLocaleDateString("it-IT");
  const { y, m, d } = eventDate;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}
