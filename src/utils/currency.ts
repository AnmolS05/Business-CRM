/**
 * Utility functions for Indian Rupee (INR) currency formatting
 * supporting Lakhs (L) and Crores (Cr) compact display formats.
 */

/**
 * Formats a raw number as a standard Indian Rupee currency string.
 *
 * @param {number} value Numeric monetary value in ₹.
 * @returns {string} Formatted currency string (e.g. ₹25,00,000).
 */
export function formatINR(value: number): string {
  if (isNaN(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a monetary value into compact Indian Lakhs (L) and Crores (Cr) format.
 *
 * @param {number} value Numeric monetary value in ₹.
 * @returns {string} Compact formatted string (e.g., ₹25 Lakhs, ₹1.5 Cr).
 */
export function formatLakhsCrores(value: number): string {
  if (isNaN(value) || value === 0) return '₹0';
  const absVal = Math.abs(value);
  
  if (absVal >= 10000000) {
    // 1 Crore = 1,00,00,000 (10 Million)
    const cr = (value / 10000000).toFixed(2).replace(/\.00$/, '');
    return `₹${cr} Cr`;
  } else if (absVal >= 100000) {
    // 1 Lakh = 1,00,000 (100 Thousand)
    const lakh = (value / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹${lakh} Lakhs`;
  } else if (absVal >= 1000) {
    const k = (value / 1000).toFixed(1).replace(/\.0$/, '');
    return `₹${k}K`;
  }
  
  return formatINR(value);
}

/**
 * Formats a monetary value with both full standard format and compact Lakhs/Crores notation.
 *
 * @param {number} value Numeric monetary value in ₹.
 * @returns {string} Combined format string (e.g. ₹25,00,000 (₹25 Lakhs)).
 */
export function formatIndianFullWithCompact(value: number): string {
  const full = formatINR(value);
  if (Math.abs(value) >= 100000) {
    const compact = formatLakhsCrores(value);
    return `${full} (${compact})`;
  }
  return full;
}
