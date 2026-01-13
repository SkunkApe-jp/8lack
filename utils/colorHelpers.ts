import { RGB } from '../types';

export const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + (b)).toString(16).slice(1).toUpperCase();
};

export const getContrastColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  // YIQ equation
  const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

// A small dictionary of color names to auto-populate the title
const COLOR_NAMES: Record<string, string> = {
  '#000000': 'Black',
  '#FFFFFF': 'White',
  '#FF0000': 'Red',
  '#00FF00': 'Green',
  '#0000FF': 'Blue',
  '#FFFF00': 'Yellow',
  '#00FFFF': 'Cyan',
  '#FF00FF': 'Magenta',
  '#C0C0C0': 'Silver',
  '#808080': 'Gray',
  '#800000': 'Maroon',
  '#808000': 'Olive',
  '#008000': 'Dark Green',
  '#800080': 'Purple',
  '#008080': 'Teal',
  '#000080': 'Navy',
  '#FFA500': 'Orange',
};

// Find exact match or just return a default
export const getColorName = (hex: string): string => {
  const normalized = hex.toUpperCase();
  if (COLOR_NAMES[normalized]) return COLOR_NAMES[normalized];
  
  // If no exact match, we just return "Custom Color" or let the user decide.
  // Implementing a full "nearest color" algo is out of scope for this snippet,
  // but we can default to "Unknown" so the user is prompted to type.
  return 'Color';
};
