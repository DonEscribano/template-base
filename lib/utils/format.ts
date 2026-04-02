const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Converts an amount in cents to a formatted EUR price string.
 * Example: 1599 -> "15,99 EUR"
 */
export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}

/**
 * Formats a Spanish phone number for display.
 * Adds country code if missing, groups digits for readability.
 *
 * Examples:
 *   "612345678"    -> "+34 612 345 678"
 *   "+34612345678" -> "+34 612 345 678"
 *   "34612345678"  -> "+34 612 345 678"
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  let national: string;
  if (digits.startsWith("34") && digits.length >= 11) {
    national = digits.slice(2);
  } else {
    national = digits;
  }

  if (national.length === 9) {
    const part1 = national.slice(0, 3);
    const part2 = national.slice(3, 6);
    const part3 = national.slice(6, 9);
    return `+34 ${part1} ${part2} ${part3}`;
  }

  // Fallback: return with prefix if not 9-digit Spanish number
  if (phone.startsWith("+")) {
    return phone;
  }
  return `+${digits}`;
}
