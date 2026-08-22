/**
 * Currency Formatter Utility
 * Uses ₹ (INR) for ALL locations (both inside and outside India) across the entire website.
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  _country?: string | null
): string {
  const numericAmount = Number(amount) || 0;
  return `₹${numericAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function getCurrencySymbol(_country?: string | null): string {
  return "₹";
}

export function getCurrencyCode(_country?: string | null): string {
  return "INR";
}
