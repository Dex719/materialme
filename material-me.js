document.addEventListener("DOMContentLoaded", () => {
    initMaterialTabs();
    initMaterialSliders();
});

// --- TABS LOGIC ---
function initMaterialTabs() {
    const tabs = document.querySelectorAll('.mm-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const header = this.closest('.mm-tabs-header');
            if (!header) return;

            // UI Update
            header.querySelectorAll('.mm-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Content Update
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                const wrapper = header.closest('.mm-tabs-wrapper');
                if (wrapper) {
                    const contentContainer = wrapper.querySelector('.mm-tabs-content');
                    if (contentContainer) {
                        contentContainer.querySelectorAll('.tab-content-pane').forEach(pane => {
                            pane.classList.remove('active');
                        });
                        const targetPane = contentContainer.querySelector(`#${targetId}`);
                        if (targetPane) targetPane.classList.add('active');
                    }
                }
            }
        });
    });
}

// --- SLIDERS LOGIC (Single & Dual) ---
function initMaterialSliders() {
    // Helper: Calculate pixel position
    function getThumbPixelPosition(val, min, max, width) {
        const percent = (val - min) / (max - min);
        return percent * (width - 20) + 10; // 20px buffer for tooltip width
    }

    // Helper: Update Tooltip
    function updateTooltipVisual(tooltip, val, pixelPos, icon) {
        if(!tooltip) return;
        tooltip.style.left = `${pixelPos}px`;
        tooltip.innerHTML = `${val} <span style="margin-left:4px; font-size:0.8em">${icon}</span>`;
    }

    // Helper: Proximity Check
    function checkProximity(mouseX, thumbPx, tooltip) {
        if(!tooltip) return;
        if (Math.abs(mouseX - thumbPx) < 20) {
            tooltip.classList.add('visible');
        } else {
            tooltip.classList.remove('visible');
        }
    }

    // 1. SINGLE SLIDERS
    document.querySelectorAll('.mm-slider-container').forEach(container => {
        const slider = container.querySelector('.mm-slider');
        const tooltip = container.querySelector('.mm-slider-tooltip');
        if (!slider) return;

        const updateState = () => {
            const val = parseFloat(slider.value);
            const min = parseFloat(slider.min || 0);
            const max = parseFloat(slider.max || 100);
            const width = slider.offsetWidth;
            const thumbPx = getThumbPixelPosition(val, min, max, width);
            
            const percent = ((val - min) / (max - min)) * 100;
            slider.style.background = `linear-gradient(to right, var(--color-purple) ${percent}%, var(--bg-card-hover) ${percent}%)`;
            
            updateTooltipVisual(tooltip, val, thumbPx, slider.dataset.icon || '');
            return thumbPx;
        };

        // Events
        container.addEventListener('mousemove', (e) => {
            if (document.activeElement === slider) return;
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const thumbPx = updateState();
            checkProximity(mouseX, thumbPx, tooltip);
        });
        
        container.addEventListener('mouseleave', () => {
            if (document.activeElement !== slider && tooltip) tooltip.classList.remove('visible');
        });

        slider.addEventListener('input', () => {
            updateState();
            if(tooltip) tooltip.classList.add('visible');
        });
        
        slider.addEventListener('blur', () => { if(tooltip) tooltip.classList.remove('visible'); });

        // Init on load and resize
        updateState();
        window.addEventListener('resize', updateState);
    });

    // 2. DUAL SLIDERS
    document.querySelectorAll('.mm-range-slider').forEach(wrapper => {
        const sliders = wrapper.querySelectorAll('input[type="range"]');
        if(sliders.length < 2) return;

        const track = wrapper.querySelector('.mm-slider-track');
        const tooltips = wrapper.querySelectorAll('.mm-slider-tooltip');
        
        const s1 = sliders[0], s2 = sliders[1];
        const t1 = tooltips[0], t2 = tooltips[1];

        const updateDual = () => {
            let v1 = parseFloat(s1.value), v2 = parseFloat(s2.value);
            const min = parseFloat(s1.min || 0), max = parseFloat(s1.max || 100);
            const width = wrapper.offsetWidth;

            if (v1 > v2) { const t = v1; v1 = v2; v2 = t; } // Swap logic visual only

            // Track
            const p1 = ((v1 - min) / (max - min)) * 100;
            const p2 = ((v2 - min) / (max - min)) * 100;
            if(track) {
                track.style.left = p1 + "%";
                track.style.width = (p2 - p1) + "%";
            }

            const px1 = getThumbPixelPosition(parseFloat(s1.value), min, max, width);
            const px2 = getThumbPixelPosition(parseFloat(s2.value), min, max, width);
            const icon = s1.dataset.icon || '';

            updateTooltipVisual(t1, parseFloat(s1.value), px1, icon);
            updateTooltipVisual(t2, parseFloat(s2.value), px2, icon);

            return [px1, px2];
        };

        wrapper.addEventListener('mousemove', (e) => {
            if (document.activeElement === s1 || document.activeElement === s2) return;
            const rect = wrapper.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const [px1, px2] = updateDual();
            checkProximity(mouseX, px1, t1);
            checkProximity(mouseX, px2, t2);
        });

        wrapper.addEventListener('mouseleave', () => {
            if (document.activeElement !== s1 && document.activeElement !== s2) {
                if(t1) t1.classList.remove('visible');
                if(t2) t2.classList.remove('visible');
            }
        });

        [s1, s2].forEach((sl, idx) => {
            sl.addEventListener('input', () => {
                updateDual();
                if(tooltips[idx]) tooltips[idx].classList.add('visible');
            });
            sl.addEventListener('blur', () => { if(tooltips[idx]) tooltips[idx].classList.remove('visible'); });
        });

        updateDual();
        window.addEventListener('resize', updateDual);
    });
}