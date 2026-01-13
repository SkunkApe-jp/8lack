import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { WallpaperConfig } from '../types';
import { hexToRgb } from '../utils/colorHelpers';

interface WallpaperCanvasProps {
  config: WallpaperConfig;
  className?: string;
}

export interface WallpaperCanvasHandle {
  download: () => void;
}

const WallpaperCanvas = forwardRef<WallpaperCanvasHandle, WallpaperCanvasProps>(({ config, className }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = config.resolution;
    
    // Set actual canvas size (for resolution)
    canvas.width = width;
    canvas.height = height;

    // 1. Background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Settings for the "Processing" style box
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Box size logic: Base it on the smaller dimension to stay proportional
    const minDim = Math.min(width, height);
    const boxSizePx = minDim * (config.boxSize / 100); 

    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = Math.max(2, minDim * 0.003); // Scale stroke with size
    ctx.strokeRect(centerX - boxSizePx / 2, centerY - boxSizePx / 2, boxSizePx, boxSizePx);

    // 3. Text rendering
    ctx.fillStyle = config.accentColor;
    
    // Scale font size based on box size
    const fontSize = boxSizePx * 0.09; 
    const lineHeight = fontSize * 1.5;
    
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    // Calculate text position: Top-left inside the box with padding
    const padding = boxSizePx * 0.1;
    const textStartX = centerX - boxSizePx / 2 + padding;
    const textStartY = centerY - boxSizePx / 2 + padding;

    let currentY = textStartY;

    // Line 1: Name
    ctx.fillText(config.colorName, textStartX, currentY);
    currentY += lineHeight;

    // Line 2: Hex
    if (config.showHex) {
      ctx.fillText(`HEX ${config.backgroundColor.replace('#', '')}`, textStartX, currentY);
      currentY += lineHeight;
    }

    // Line 3: RGB
    if (config.showRgb) {
      const rgb = hexToRgb(config.backgroundColor);
      ctx.fillText(`RGB ${rgb.r} ${rgb.g} ${rgb.b}`, textStartX, currentY);
    }
  };

  useEffect(() => {
    // Redraw whenever config changes
    draw();
    
    // Also load font to ensure it renders correctly on first pass if font loads late
    document.fonts.ready.then(() => {
        draw();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useImperativeHandle(ref, () => ({
    download: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const link = document.createElement('a');
      const cleanName = config.colorName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `monowall_${cleanName}_${config.resolution.width}x${config.resolution.height}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }));

  return (
    <div className={`relative shadow-2xl ${className}`}>
        {/* We use CSS to scale the canvas down visually while keeping internal res high */}
        <canvas 
            ref={canvasRef} 
            className="w-full h-auto block"
            style={{ 
                maxHeight: '70vh', 
                objectFit: 'contain',
                backgroundColor: '#111' // Placeholder while loading
            }}
        />
    </div>
  );
});

WallpaperCanvas.displayName = 'WallpaperCanvas';

export default WallpaperCanvas;
