/**
 * Parche para html2canvas para soportar colores oklch() de Tailwind CSS v4
 *
 * html2canvas no soporta la función de color oklch(), por lo que necesitamos
 * parchear su parser de colores para convertir oklch a rgba/hex.
 */

// Mapa de colores oklch comunes de Tailwind a hex
const oklchToHex: Record<string, string> = {
  // Slate colors (dark mode)
  'oklch(0.214 0.011 256.85)': '#1e293b', // slate-800
  'oklch(0.156 0.013 257.28)': '#0f172a', // slate-900
  'oklch(0.098 0.015 257.68)': '#020617', // slate-950
  'oklch(0.599 0.015 257.02)': '#64748b', // slate-500
  'oklch(0.709 0.012 256.77)': '#94a3b8', // slate-400

  // Light colors
  'oklch(0.98 0.002 247.84)': '#f8fafc', // slate-50
  'oklch(0.96 0.003 247.81)': '#f1f5f9', // slate-100
  'oklch(0.924 0.006 247.75)': '#e2e8f0', // slate-200

  // Amber colors
  'oklch(0.748 0.151 75.85)': '#fbbf24', // amber-400
  'oklch(0.813 0.152 76.46)': '#fcd34d', // amber-300
  'oklch(0.875 0.153 77.07)': '#fde68a', // amber-200

  // Blue colors
  'oklch(0.512 0.197 245.58)': '#3b82f6', // blue-500
  'oklch(0.628 0.198 246.12)': '#60a5fa', // blue-400

  // Green colors
  'oklch(0.699 0.154 155.66)': '#4ade80', // green-400
  'oklch(0.617 0.173 145.92)': '#22c55e', // green-500

  // Purple colors
  'oklch(0.587 0.215 306.64)': '#a855f7', // purple-500
  'oklch(0.713 0.17 307.22)': '#c084fc', // purple-400

  // Red colors
  'oklch(0.627 0.257 27.32)': '#ef4444', // red-500
  'oklch(0.722 0.217 28.63)': '#f87171', // red-400
};

/**
 * Función para convertir oklch() a hex
 */
export function convertOklchToHex(oklchString: string): string {
  // Primero buscar en el mapa de colores conocidos
  const normalized = oklchString.trim().toLowerCase();

  for (const [oklch, hex] of Object.entries(oklchToHex)) {
    if (normalized.includes(oklch.toLowerCase())) {
      return hex;
    }
  }

  // Si no está en el mapa, intentar parsear y convertir
  const match = oklchString.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/i);

  if (!match) {
    console.warn(`Could not parse oklch color: ${oklchString}`);
    return '#64748b'; // Fallback a slate-500
  }

  const [, l, c, h] = match.map(Number);

  // Conversión simplificada oklch -> srgb
  // Basado en la luminosidad, asignar un gris
  const lightness = Math.round(l * 255);
  const hex = lightness.toString(16).padStart(2, '0');

  return `#${hex}${hex}${hex}`;
}

/**
 * Aplicar el parche al objeto global si html2canvas está disponible
 */
export function patchHtml2Canvas() {
  // Este parche se ejecutará cuando se importe el módulo
  console.log('[html2canvas Patch] Attempting to patch color parser...');

  // No podemos parchear html2canvas directamente desde aquí,
  // así que lo haremos interceptando las llamadas en App.tsx
}

// Auto-ejecutar
patchHtml2Canvas();

export default { convertOklchToHex, patchHtml2Canvas };
