document.addEventListener("DOMContentLoaded", () => {
    
    // 1. THEME TOGGLE
    const themeToggleButton = document.getElementById("theme-toggle");
    const body = document.body;
    if (themeToggleButton) {
        themeToggleButton.addEventListener("click", () => {
            body.classList.toggle("light-theme");
            localStorage.setItem("theme", body.classList.contains("light-theme") ? "light" : "dark");
        });
    }

    // 2. SIDEBAR
    const burgerMenuButton = document.querySelector(".burger-menu");
    const sidebar = document.getElementById("sidebar");
    const closeSidebarButton = document.getElementById("sidebar-close-btn");
    const overlay = document.getElementById("overlay");

    if (burgerMenuButton && sidebar && overlay) {
        const toggleSidebar = (open) => {
            sidebar.classList.toggle("active", open);
            overlay.classList.toggle("active", open);
            document.body.style.overflow = open ? 'hidden' : '';
        };
        burgerMenuButton.addEventListener("click", () => toggleSidebar(true));
        if (closeSidebarButton) closeSidebarButton.addEventListener("click", () => toggleSidebar(false));
        overlay.addEventListener("click", () => toggleSidebar(false));
    }

    // 3. PREVIEW / CODE TABS
    const createCheckSvg = () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16"); svg.setAttribute("height", "16"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none");
        svg.innerHTML = '<path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
        return svg;
    };

    document.querySelectorAll(".component-showcase").forEach(showcase => {
        const pills = showcase.querySelectorAll(".pills-nav .pill");
        const panels = showcase.querySelectorAll(".tab-panel");

        pills.forEach(pill => {
            pill.addEventListener("click", (e) => {
                e.preventDefault();
                if (pill.classList.contains("active")) return;

                const targetId = pill.dataset.tab;
                const targetPanel = showcase.querySelector(`#${targetId}`);
                if (!targetPanel) return;

                pills.forEach(p => p.classList.remove("active"));
                pill.classList.add("active");

                const oldSvg = showcase.querySelector(".pills-nav svg");
                if (oldSvg) oldSvg.remove();
                if (targetId.includes('preview')) pill.prepend(createCheckSvg());

                panels.forEach(p => p.classList.remove("active"));
                targetPanel.classList.add("active");
                
                // Resize event for sliders inside newly shown tabs
                window.dispatchEvent(new Event('resize'));
            });
        });
    });

    // 4. INSTALLATION PAGE TABS
    const prereqPill = document.getElementById("prereq-pill");
    const installPill = document.getElementById("install-pill");
    if (prereqPill && installPill) {
        const update = () => {
            document.getElementById("prerequisites-content").style.display = prereqPill.classList.contains('active') ? 'block' : 'none';
            document.getElementById("installation-content").style.display = installPill.classList.contains('active') ? 'block' : 'none';
        };
        [prereqPill, installPill].forEach(p => p.addEventListener('click', (e) => {
            e.preventDefault();
            if(p.classList.contains('active')) return;
            [prereqPill, installPill].forEach(x => {
                x.classList.remove('active'); 
                const s = x.querySelector('svg'); if(s) s.remove();
            });
            p.classList.add('active');
            p.prepend(createCheckSvg());
            update();
        }));
        update();
    }
});