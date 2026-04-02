/**
 * Calcula slots disponibles para una fecha y servicio.
 * Usa la misma lógica que la función SQL get_available_slots,
 * pero en TypeScript para uso client-side.
 */

interface Schedule {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

interface Reservation {
  start_time: string;
  end_time: string;
}

interface ScheduleException {
  date: string;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
}

const SLOT_INTERVAL_MINUTES = 30;

export function calculateAvailableSlots(
  date: string,
  durationMinutes: number,
  schedule: Schedule[],
  exceptions: ScheduleException[],
  existingReservations: Reservation[]
): string[] {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();

  // Check exceptions first
  const exception = exceptions.find((e) => e.date === date);
  if (exception?.is_closed) return [];

  const openTime = exception?.open_time ?? schedule.find((s) => s.day_of_week === dayOfWeek)?.open_time;
  const closeTime = exception?.close_time ?? schedule.find((s) => s.day_of_week === dayOfWeek)?.close_time;
  const isClosed = schedule.find((s) => s.day_of_week === dayOfWeek)?.is_closed;

  if (isClosed || !openTime || !closeTime) return [];

  const openMinutes = timeToMinutes(openTime);
  const closeMinutes = timeToMinutes(closeTime);

  const slots: string[] = [];

  for (let m = openMinutes; m + durationMinutes <= closeMinutes; m += SLOT_INTERVAL_MINUTES) {
    const slotStart = minutesToTime(m);
    const slotEnd = minutesToTime(m + durationMinutes);

    const hasConflict = existingReservations.some((res) => {
      const resStart = timeToMinutes(res.start_time);
      const resEnd = timeToMinutes(res.end_time);
      return m < resEnd && m + durationMinutes > resStart;
    });

    if (!hasConflict) {
      slots.push(slotStart);
    }
  }

  return slots;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
