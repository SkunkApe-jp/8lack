import React from 'react';
import { WallpaperConfig, PRESET_RESOLUTIONS, Resolution } from '../types';
import { hexToRgb, getContrastColor } from '../utils/colorHelpers';
import { Download, RefreshCw, Smartphone, Monitor, Maximize } from 'lucide-react';

interface ControlPanelProps {
  config: WallpaperConfig;
  setConfig: React.Dispatch<React.SetStateAction<WallpaperConfig>>;
  onDownload: () => void;
  onRandomize: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig, onDownload, onRandomize }) => {

  const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = PRESET_RESOLUTIONS.find(r => r.label === e.target.value);
    if (selected) {
      setConfig(prev => ({ ...prev, resolution: selected }));
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setConfig(prev => ({ 
        ...prev, 
        resolution: { ...prev.resolution, width: val, label: 'Custom' } 
    }));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setConfig(prev => ({ 
        ...prev, 
        resolution: { ...prev.resolution, height: val, label: 'Custom' } 
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setConfig(prev => ({ ...prev, backgroundColor: hex }));
  };
  
  const handleAccentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setConfig(prev => ({ ...prev, accentColor: hex }));
  };

  const handleAutoAccent = () => {
    const contrast = getContrastColor(config.backgroundColor);
    setConfig(prev => ({ ...prev, accentColor: contrast }));
  }

  const rgb = hexToRgb(config.backgroundColor);

  return (
    <div className="bg-gray-900 border-r border-gray-800 h-full flex flex-col w-full md:w-80 lg:w-96 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white tracking-tighter flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-500"></div>
          MONOWALL
        </h1>
        <p className="text-xs text-gray-500 mt-1">Generative Minimalist Wallpaper</p>
      </div>

      <div className="p-6 space-y-8 flex-1">
        
        {/* Color Section */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Base Color</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative w-full">
                <input 
                    type="color" 
                    value={config.backgroundColor}
                    onChange={handleColorChange}
                    className="w-full h-12 bg-transparent border border-gray-700 rounded cursor-pointer"
                />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="bg-gray-800 p-2 rounded text-center border border-gray-700">
                <span className="block text-gray-500 mb-1">R</span>
                {rgb.r}
            </div>
            <div className="bg-gray-800 p-2 rounded text-center border border-gray-700">
                <span className="block text-gray-500 mb-1">G</span>
                {rgb.g}
            </div>
            <div className="bg-gray-800 p-2 rounded text-center border border-gray-700">
                <span className="block text-gray-500 mb-1">B</span>
                {rgb.b}
            </div>
          </div>
        </section>

         {/* Content Section */}
         <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Content</h2>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Label Text</label>
            <input 
              type="text" 
              value={config.colorName}
              onChange={(e) => setConfig(prev => ({ ...prev, colorName: e.target.value }))}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <div>
             <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs text-gray-500">Accent Color</label>
                <button onClick={handleAutoAccent} className="text-[10px] text-blue-400 hover:text-blue-300 underline">Auto Contrast</button>
             </div>
             <div className="flex gap-2">
                <input 
                    type="color" 
                    value={config.accentColor}
                    onChange={handleAccentChange}
                    className="h-8 w-12 bg-transparent border border-gray-700 rounded p-0 cursor-pointer"
                />
                <input 
                    type="text" 
                    value={config.accentColor} 
                    onChange={handleAccentChange}
                    className="flex-1 bg-gray-950 border border-gray-700 rounded px-2 text-xs font-mono"
                />
             </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Box Scale ({config.boxSize}%)</label>
            <input 
                type="range" 
                min="10" 
                max="80" 
                value={config.boxSize} 
                onChange={(e) => setConfig(prev => ({...prev, boxSize: parseInt(e.target.value)}))}
                className="w-full accent-white"
            />
          </div>

          <div className="flex gap-4">
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={config.showHex} onChange={(e) => setConfig(prev => ({...prev, showHex: e.target.checked}))} className="accent-white" />
                <span className="text-sm text-gray-300">Show HEX</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={config.showRgb} onChange={(e) => setConfig(prev => ({...prev, showRgb: e.target.checked}))} className="accent-white" />
                <span className="text-sm text-gray-300">Show RGB</span>
             </label>
          </div>
        </section>

        {/* Resolution Section */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Dimensions</h2>
          
          <select 
            value={config.resolution.label === 'Custom' ? 'Custom' : config.resolution.label}
            onChange={handleResolutionChange}
            className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
          >
            <option value="Custom" disabled>Select Preset</option>
            {PRESET_RESOLUTIONS.map(res => (
              <option key={res.label} value={res.label}>{res.label} ({res.width}x{res.height})</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
             <div>
                <label className="block text-[10px] text-gray-600 mb-1">WIDTH</label>
                <input 
                    type="number" 
                    value={config.resolution.width}
                    onChange={handleWidthChange}
                    className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1.5 text-sm text-white font-mono"
                />
             </div>
             <div>
                <label className="block text-[10px] text-gray-600 mb-1">HEIGHT</label>
                <input 
                    type="number" 
                    value={config.resolution.height}
                    onChange={handleHeightChange}
                    className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1.5 text-sm text-white font-mono"
                />
             </div>
          </div>
        </section>

      </div>

      <div className="p-6 border-t border-gray-800 space-y-3">
        <button 
            onClick={onRandomize}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded flex items-center justify-center gap-2 transition-colors font-medium text-sm"
        >
            <RefreshCw size={16} /> Randomize Style
        </button>
        <button 
            onClick={onDownload}
            className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded flex items-center justify-center gap-2 transition-colors font-bold text-sm"
        >
            <Download size={16} /> DOWNLOAD PNG
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
