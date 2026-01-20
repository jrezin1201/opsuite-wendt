/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a delta (change) value
 */
export function formatDelta(current: number, previous: number): { text: string; isPositive: boolean } | null {
  if (previous === 0 && current === 0) return null;

  const delta = current - previous;
  if (Math.abs(delta) < 0.01) return null;

  const isPositive = delta > 0;
  const text = `${isPositive ? '▲' : '▼'} ${formatCurrency(Math.abs(delta))}`;

  return { text, isPositive };
}
