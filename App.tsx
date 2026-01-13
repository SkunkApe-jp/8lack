import React, { useState, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import WallpaperCanvas, { WallpaperCanvasHandle } from './components/WallpaperCanvas';
import { WallpaperConfig, PRESET_RESOLUTIONS } from './types';
import { rgbToHex, getColorName, getContrastColor } from './utils/colorHelpers';

const App: React.FC = () => {
  const [config, setConfig] = useState<WallpaperConfig>({
    resolution: PRESET_RESOLUTIONS[0], // FHD Default
    backgroundColor: '#000000',
    accentColor: '#FFFFFF',
    colorName: 'Black',
    boxSize: 20, // 20%
    showHex: true,
    showRgb: true,
  });

  const canvasRef = useRef<WallpaperCanvasHandle>(null);

  const handleDownload = () => {
    if (canvasRef.current) {
      canvasRef.current.download();
    }
  };

  const handleRandomize = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    const hex = "#" + randomColor.padStart(6, '0');
    const contrast = getContrastColor(hex);
    
    // Random box size between 15 and 30
    const randomBox = Math.floor(Math.random() * (30 - 15 + 1) + 15);
    
    setConfig(prev => ({
        ...prev,
        backgroundColor: hex,
        accentColor: contrast,
        colorName: getColorName(hex),
        boxSize: randomBox
    }));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-hidden">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-auto z-10">
        <ControlPanel 
            config={config} 
            setConfig={setConfig} 
            onDownload={handleDownload}
            onRandomize={handleRandomize}
        />
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-neutral-900 relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
        
        {/* Background Grid Pattern for transparency/editor feel */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
                 backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', 
                 backgroundSize: '24px 24px' 
             }}>
        </div>

        <div className="relative z-0 max-w-full max-h-full shadow-2xl">
           <WallpaperCanvas 
                ref={canvasRef} 
                config={config} 
                className="max-h-[80vh] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
           />
           
           {/* Resolution Overlay Tag */}
           <div className="absolute -bottom-8 right-0 text-xs text-gray-500 font-mono">
             {config.resolution.width} x {config.resolution.height}
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;
