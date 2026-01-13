document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const elements = {
        canvas: document.getElementById('wallpaperCanvas'),
        // Controls
        backgroundColor: document.getElementById('backgroundColor'),
        rgbR: document.getElementById('rgbR'),
        rgbG: document.getElementById('rgbG'),
        rgbB: document.getElementById('rgbB'),
        colorName: document.getElementById('colorName'),
        accentColor: document.getElementById('accentColor'),
        accentColorHex: document.getElementById('accentColorHex'),
        autoAccentBtn: document.getElementById('autoAccentBtn'),
        boxSize: document.getElementById('boxSize'),
        boxScaleLabel: document.getElementById('boxScaleLabel'),
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
    const COLOR_NAMES = { '#000000': 'Black', '#FFFFFF': 'White', '#FF0000': 'Red', '#00FF00': 'Green', '#0000FF': 'Blue' };
    const getColorName = (hex) => COLOR_NAMES[hex.toUpperCase()] || 'Color';

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
        // Update scale label
        elements.boxScaleLabel.textContent = `Box Scale (${config.boxSize}%)`;
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
