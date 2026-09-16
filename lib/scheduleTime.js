// Ordinamento orari che attraversano la mezzanotte (es. 23:00-00:00,
// 00:00-01:00, 02:00-03:00 vanno dopo 20:00-21:00, non prima).
export const DAY_START_THRESHOLD_MINUTES = 6 * 60; // 06:00

export function getSortableMinutes(timeRange) {
  if (!timeRange || typeof timeRange !== "string") return 0;

  const startTime = timeRange.split("-")[0]?.trim();
  if (!startTime) return 0;

  const [hoursStr, minutesStr] = startTime.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;

  let totalMinutes = hours * 60 + minutes;
  if (totalMinutes < DAY_START_THRESHOLD_MINUTES) {
    totalMinutes += 24 * 60;
  }

  return totalMinutes;
}

export function sortTasksByTime(tasks) {
  return [...tasks]
    .map((task, originalIndex) => ({ task, originalIndex }))
    .sort((a, b) => {
      const diff = getSortableMinutes(a.task.time) - getSortableMinutes(b.task.time);
      if (diff !== 0) return diff;
      return a.originalIndex - b.originalIndex;
    })
    .map(({ task }) => task);
}
