export function money(n: number, currency = "USD"): string {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(v);
}

export function num(n: number, digits = 2): string {
  const v = Number.isFinite(n) ? n : 0;
  return v.toFixed(digits);
}
