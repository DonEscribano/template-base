const LOCALE = "es-ES";

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const relativeFormatter = new Intl.RelativeTimeFormat(LOCALE, {
  numeric: "auto",
});

const WEEK_DAY_NAMES: readonly string[] = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

/**
 * Formats a date as "14 de marzo de 2026".
 */
export function formatDate(date: Date | string, short = false): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return short ? shortDateFormatter.format(d) : dateFormatter.format(d);
}

/**
 * Formats a date's time portion as "14:30".
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return timeFormatter.format(d);
}

/**
 * Returns localized weekday names starting from Monday.
 */
export function getWeekDays(): readonly string[] {
  return WEEK_DAY_NAMES;
}

/**
 * Checks if a date is today in the local timezone.
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

type RelativeUnit = {
  max: number;
  divisor: number;
  unit: Intl.RelativeTimeFormatUnit;
};

const RELATIVE_UNITS: readonly RelativeUnit[] = [
  { max: 60, divisor: 1, unit: "second" },
  { max: 3600, divisor: 60, unit: "minute" },
  { max: 86400, divisor: 3600, unit: "hour" },
  { max: 2592000, divisor: 86400, unit: "day" },
  { max: 31536000, divisor: 2592000, unit: "month" },
  { max: Infinity, divisor: 31536000, unit: "year" },
];

/**
 * Formats a date relative to now: "hace 3 horas", "manana", etc.
 */
export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffSeconds = Math.round((d.getTime() - Date.now()) / 1000);
  const absDiff = Math.abs(diffSeconds);

  for (const { max, divisor, unit } of RELATIVE_UNITS) {
    if (absDiff < max) {
      const value = Math.round(diffSeconds / divisor);
      return relativeFormatter.format(value, unit);
    }
  }

  return dateFormatter.format(d);
}
