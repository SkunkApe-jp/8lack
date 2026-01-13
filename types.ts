export interface Resolution {
  width: number;
  height: number;
  label: string;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface WallpaperConfig {
  resolution: Resolution;
  backgroundColor: string; // Hex
  accentColor: string; // Hex (for the box and text)
  colorName: string;
  boxSize: number; // Percentage of height 0-100? Or pixel value scaler.
  showHex: boolean;
  showRgb: boolean;
}

export const PRESET_RESOLUTIONS: Resolution[] = [
  { label: 'Full HD (1080p)', width: 1920, height: 1080 },
  { label: 'QHD (1440p)', width: 2560, height: 1440 },
  { label: '4K UHD', width: 3840, height: 2160 },
  { label: 'Ultrawide', width: 3440, height: 1440 },
  { label: 'Mobile (Portrait)', width: 1080, height: 1920 },
  { label: 'Square (Social)', width: 1080, height: 1080 },
];
