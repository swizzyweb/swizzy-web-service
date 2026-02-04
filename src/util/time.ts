// AI slop
export function getIsoTimeQuick(): string {
  const nowMs = Date.now();
  const hourMs = 3600_000;
  const roundedMs = Math.floor(nowMs / hourMs) * hourMs;

  // Convert to UTC components manually
  const t = new Date(roundedMs);
  const y = t.getUTCFullYear();
  const m = t.getUTCMonth() + 1;
  const d = t.getUTCDate();
  const h = t.getUTCHours();

  const formatted = `${y}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")} ${h.toString().padStart(2, "0")}:00 UTC`;
  return formatted;
}

export function getIsoTime(): string {
  // Get current UTC time
  const now = new Date();

  // Round down to the nearest hour
  const rounded = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(), // keep hour
      0, // zero minutes
      0, // zero seconds
      0, // zero milliseconds
    ),
  );

  // Convert to readable string
  const readable = rounded.toISOString(); // e.g. "2026-02-03T22:00:00.000Z"
  return readable;
}
