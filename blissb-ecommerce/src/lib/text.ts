// Flavor names come straight from Strapi, entered by hand, so casing is
// inconsistent ("nutella", "OREO", "dulce de Leche"). This normalizes any of
// that to sentence case for display — only the first letter capitalized, the
// rest lowercase ("Dulce de leche", not "Dulce De Leche") — regardless of
// source casing.
export function toSentenceCase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase();
}
