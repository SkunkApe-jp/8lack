document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const elements = {
        canvas: document.getElementById('wallpaperCanvas'),
        // Controls
        backgroundColor: document.getElementById('backgroundColor'),
        hexOverlay: document.getElementById('hexOverlay'),
        rgbR: document.getElementById('rgbR'),
        rgbG: document.getElementById('rgbG'),
        rgbB: document.getElementById('rgbB'),
        colorName: document.getElementById('colorName'),
        accentColor: document.getElementById('accentColor'),
        accentColorHex: document.getElementById('accentColorHex'),
        autoAccentBtn: document.getElementById('autoAccentBtn'),
        boxSize: document.getElementById('boxSize'),
        boxScaleLabel: document.getElementById('boxScaleLabel'),
        boxScaleVal: document.getElementById('boxScaleVal'),
        showHex: document.getElementById('showHex'),
        showRgb: document.getElementById('showRgb'),
        resolutionPreset: document.getElementById('resolutionPreset'),
        widthInput: document.getElementById('widthInput'),
        heightInput: document.getElementById('heightInput'),
        // Buttons
        randomizeBtn: document.getElementById('randomizeBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
    };

    // --- Constants ---
    const PRESET_RESOLUTIONS = [
        { label: 'Full HD (1080p)', width: 1920, height: 1080 },
        { label: 'QHD (1440p)', width: 2560, height: 1440 },
        { label: '4K UHD', width: 3840, height: 2160 },
        { label: 'Ultrawide', width: 3440, height: 1440 },
        { label: 'Mobile (Portrait)', width: 1080, height: 1920 },
        { label: 'Square (Social)', width: 1080, height: 1080 },
    ];

    // --- State ---
    let config = {
        resolution: { width: 1920, height: 1080 },
        backgroundColor: '#000000',
        accentColor: '#FFFFFF',
        colorName: 'Black',
        boxSize: 20,
        showHex: true,
        showRgb: true,
    };

    // --- Color Helpers ---
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
    };
    const getContrastColor = (hex) => {
        const rgb = hexToRgb(hex);
        const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
        return yiq >= 128 ? '#000000' : '#FFFFFF';
    };
    // Comprehensive named color palette for nearest-match lookup
    const NAMED_COLORS = [
        { name: 'Black',        r: 0,   g: 0,   b: 0   },
        { name: 'White',        r: 255, g: 255, b: 255 },
        { name: 'Red',          r: 255, g: 0,   b: 0   },
        { name: 'Lime',         r: 0,   g: 255, b: 0   },
        { name: 'Blue',         r: 0,   g: 0,   b: 255 },
        { name: 'Yellow',       r: 255, g: 255, b: 0   },
        { name: 'Cyan',         r: 0,   g: 255, b: 255 },
        { name: 'Magenta',      r: 255, g: 0,   b: 255 },
        { name: 'Silver',       r: 192, g: 192, b: 192 },
        { name: 'Gray',         r: 128, g: 128, b: 128 },
        { name: 'Maroon',       r: 128, g: 0,   b: 0   },
        { name: 'Olive',        r: 128, g: 128, b: 0   },
        { name: 'Green',        r: 0,   g: 128, b: 0   },
        { name: 'Purple',       r: 128, g: 0,   b: 128 },
        { name: 'Teal',         r: 0,   g: 128, b: 128 },
        { name: 'Navy',         r: 0,   g: 0,   b: 128 },
        { name: 'Orange',       r: 255, g: 165, b: 0   },
        { name: 'Coral',        r: 255, g: 127, b: 80  },
        { name: 'Salmon',       r: 250, g: 128, b: 114 },
        { name: 'Tomato',       r: 255, g: 99,  b: 71  },
        { name: 'Crimson',      r: 220, g: 20,  b: 60  },
        { name: 'Pink',         r: 255, g: 192, b: 203 },
        { name: 'Hot Pink',     r: 255, g: 105, b: 180 },
        { name: 'Deep Pink',    r: 255, g: 20,  b: 147 },
        { name: 'Violet',       r: 238, g: 130, b: 238 },
        { name: 'Orchid',       r: 218, g: 112, b: 214 },
        { name: 'Plum',         r: 221, g: 160, b: 221 },
        { name: 'Indigo',       r: 75,  g: 0,   b: 130 },
        { name: 'Lavender',     r: 230, g: 230, b: 250 },
        { name: 'Periwinkle',   r: 204, g: 204, b: 255 },
        { name: 'Royal Blue',   r: 65,  g: 105, b: 225 },
        { name: 'Sky Blue',     r: 135, g: 206, b: 235 },
        { name: 'Steel Blue',   r: 70,  g: 130, b: 180 },
        { name: 'Dodger Blue',  r: 30,  g: 144, b: 255 },
        { name: 'Turquoise',    r: 64,  g: 224, b: 208 },
        { name: 'Aquamarine',   r: 127, g: 255, b: 212 },
        { name: 'Mint',         r: 152, g: 255, b: 152 },
        { name: 'Spring Green', r: 0,   g: 255, b: 127 },
        { name: 'Chartreuse',   r: 127, g: 255, b: 0   },
        { name: 'Yellow Green', r: 154, g: 205, b: 50  },
        { name: 'Khaki',        r: 240, g: 230, b: 140 },
        { name: 'Gold',         r: 255, g: 215, b: 0   },
        { name: 'Goldenrod',    r: 218, g: 165, b: 32  },
        { name: 'Tan',          r: 210, g: 180, b: 140 },
        { name: 'Sienna',       r: 160, g: 82,  b: 45  },
        { name: 'Brown',        r: 165, g: 42,  b: 42  },
        { name: 'Chocolate',    r: 210, g: 105, b: 30  },
        { name: 'Sandy Brown',  r: 244, g: 164, b: 96  },
        { name: 'Peach',        r: 255, g: 218, b: 185 },
        { name: 'Linen',        r: 250, g: 240, b: 230 },
        { name: 'Ivory',        r: 255, g: 255, b: 240 },
        { name: 'Beige',        r: 245, g: 245, b: 220 },
        { name: 'Cream',        r: 255, g: 253, b: 208 },
        { name: 'Snow',         r: 255, g: 250, b: 250 },
        { name: 'Charcoal',     r: 54,  g: 69,  b: 79  },
        { name: 'Slate Gray',   r: 112, g: 128, b: 144 },
        { name: 'Dim Gray',     r: 105, g: 105, b: 105 },
        { name: 'Smoke',        r: 150, g: 150, b: 150 },
    ];
    const getColorName = (hex) => {
        const { r, g, b } = hexToRgb(hex);
        let bestName = NAMED_COLORS[0].name;
        let bestDist = Infinity;
        for (const c of NAMED_COLORS) {
            const dr = r - c.r, dg = g - c.g, db = b - c.b;
            const dist = dr*dr + dg*dg + db*db;
            if (dist < bestDist) { bestDist = dist; bestName = c.name; }
        }
        return bestName;
    };

    // --- Drawing Logic ---
    const drawCanvas = () => {
        const canvas = elements.canvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = config.resolution;
        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const minDim = Math.min(width, height);
        const boxSizePx = minDim * (config.boxSize / 100);

        ctx.strokeStyle = config.accentColor;
        ctx.lineWidth = Math.max(2, minDim * 0.003);
        ctx.strokeRect(centerX - boxSizePx / 2, centerY - boxSizePx / 2, boxSizePx, boxSizePx);

        ctx.fillStyle = config.accentColor;
        const fontSize = boxSizePx * 0.09;
        const lineHeight = fontSize * 1.5;
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';

        const padding = boxSizePx * 0.1;
        const textStartX = centerX - boxSizePx / 2 + padding;
        const textStartY = centerY - boxSizePx / 2 + padding;
        let currentY = textStartY;

        ctx.fillText(config.colorName, textStartX, currentY);
        currentY += lineHeight;
        if (config.showHex) {
            ctx.fillText(`HEX ${config.backgroundColor.replace('#', '')}`, textStartX, currentY);
            currentY += lineHeight;
        }
        if (config.showRgb) {
            const rgb = hexToRgb(config.backgroundColor);
            ctx.fillText(`RGB ${rgb.r} ${rgb.g} ${rgb.b}`, textStartX, currentY);
        }
    };

    // --- Update Functions ---
    const updateUI = () => {
        // Update RGB display
        const rgb = hexToRgb(config.backgroundColor);
        elements.rgbR.textContent = rgb.r;
        elements.rgbG.textContent = rgb.g;
        elements.rgbB.textContent = rgb.b;
        // Update hex overlay
        if (elements.hexOverlay) elements.hexOverlay.textContent = config.backgroundColor.toUpperCase();
        // Update scale display
        if (elements.boxScaleVal) elements.boxScaleVal.textContent = `${config.boxSize}%`;
        if (elements.boxScaleLabel) elements.boxScaleLabel.textContent = `Box Scale (${config.boxSize}%)`;
        // Update hex input for accent
        elements.accentColorHex.value = config.accentColor;
        // Redraw canvas
        drawCanvas();
    };

    // --- Event Listeners ---
    elements.backgroundColor.addEventListener('input', (e) => {
        config.backgroundColor = e.target.value;
        config.colorName = getColorName(config.backgroundColor);
        elements.colorName.value = config.colorName;
        updateUI();
    });

    elements.colorName.addEventListener('input', (e) => {
        config.colorName = e.target.value;
        drawCanvas();
    });

    elements.accentColor.addEventListener('input', (e) => {
        config.accentColor = e.target.value;
        updateUI();
    });
    elements.accentColorHex.addEventListener('input', (e) => {
        config.accentColor = e.target.value;
        elements.accentColor.value = e.target.value; // sync the color picker
        drawCanvas();
    });

    elements.autoAccentBtn.addEventListener('click', () => {
        config.accentColor = getContrastColor(config.backgroundColor);
        elements.accentColor.value = config.accentColor;
        updateUI();
    });

    elements.boxSize.addEventListener('input', (e) => {
        config.boxSize = parseInt(e.target.value);
        updateUI();
    });

    elements.showHex.addEventListener('change', (e) => {
        config.showHex = e.target.checked;
        drawCanvas();
    });

    elements.showRgb.addEventListener('change', (e) => {
        config.showRgb = e.target.checked;
        drawCanvas();
    });

    elements.resolutionPreset.addEventListener('change', (e) => {
        const selected = PRESET_RESOLUTIONS.find(r => r.label === e.target.value);
        if (selected) {
            config.resolution = { ...selected };
            elements.widthInput.value = selected.width;
            elements.heightInput.value = selected.height;
            drawCanvas();
        }
    });

    elements.widthInput.addEventListener('input', (e) => {
        config.resolution.width = parseInt(e.target.value) || 0;
        elements.resolutionPreset.value = "Custom"; // Indicate it's a custom size
        drawCanvas();
    });

    elements.heightInput.addEventListener('input', (e) => {
        config.resolution.height = parseInt(e.target.value) || 0;
        elements.resolutionPreset.value = "Custom";
        drawCanvas();
    });

    elements.downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        const cleanName = config.colorName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `monowall_${cleanName}_${config.resolution.width}x${config.resolution.height}.png`;
        link.href = elements.canvas.toDataURL('image/png');
        link.click();
    });

    elements.randomizeBtn.addEventListener('click', () => {
        // Generate a random vibrant color
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        config.backgroundColor = randomColor;
        elements.backgroundColor.value = randomColor;

        config.colorName = getColorName(randomColor);
        elements.colorName.value = config.colorName;

        config.accentColor = getContrastColor(randomColor);
        elements.accentColor.value = config.accentColor;

        config.boxSize = Math.floor(Math.random() * (60 - 20 + 1) + 20);
        elements.boxSize.value = config.boxSize;

        updateUI();
    });

    // --- Initialization ---
    const init = () => {
        // Populate presets
        PRESET_RESOLUTIONS.forEach(res => {
            const option = document.createElement('option');
            option.value = res.label;
            option.textContent = `${res.label} (${res.width}x${res.height})`;
            elements.resolutionPreset.appendChild(option);
        });
        const customOption = document.createElement('option');
        customOption.value = "Custom";
        customOption.textContent = "Custom Dimensions";
        customOption.disabled = true;
        elements.resolutionPreset.appendChild(customOption);

        elements.resolutionPreset.value = PRESET_RESOLUTIONS[0].label;

        // Initial Draw
        updateUI();
         // Ensure font is loaded before final draw
        document.fonts.ready.then(() => {
            drawCanvas();
        });
    };

    init();
});
