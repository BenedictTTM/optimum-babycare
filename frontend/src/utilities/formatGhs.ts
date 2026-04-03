/**
 * Formats a number value to Ghanaian Cedi currency format
 * @param value - The numeric value to format
 * @returns Formatted currency string
 */
export function formatGhs(value?: number | null): string {
  if (value == null) return "GH₵ 0.00";
  // Intl with GHS may render different symbols depending on environment — keep GH₵ prefix
  return `GH₵ ${Number(value).toFixed(2)}`;
}

/**
 * Calculates discount percentage between original and discounted price
 * @param originalPrice - The original price
 * @param discountedPrice - The discounted price
 * @returns Discount percentage as a whole number
 */
export function calculateDiscountPercent(originalPrice?: number | null, discountedPrice?: number | null): number {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}