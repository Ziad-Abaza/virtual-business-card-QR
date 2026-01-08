document.addEventListener('DOMContentLoaded', () => {

    // --- Core Interaction Elements ---
    const qrBtn = document.getElementById('qrBtn');
    const qrModal = document.getElementById('qrModal');
    const closeModal = document.getElementById('closeModal');
    const bentoItems = document.querySelectorAll('.bento-item');
    const customizer = document.getElementById('customizer');
    const togglePanel = document.getElementById('togglePanel');
    const toast = document.getElementById('toast');

    // --- Premium Spotlight Effect ---
    // This follows the mouse within each card for a luxury glow
    bentoItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--x', `${x}px`);
            item.style.setProperty('--y', `${y}px`);
        });
    });

    // --- Intersection Observer for Staggered Load ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    bentoItems.forEach(item => observer.observe(item));

    // --- 3D Tilt initialization ---
    if (window.VanillaTilt) {
        VanillaTilt.init(bentoItems, {
            max: 4,
            speed: 800,
            glare: true,
            "max-glare": 0.1,
            perspective: 2000,
            scale: 1.01
        });
    }

    // --- Dynamic Section Toggles ---
    const sectionTogglesContainer = document.getElementById('sectionToggles');
    const togglableSections = Array.from(bentoItems)
        .filter(item => item.getAttribute('data-section') !== 'hero')
        .map(item => ({
            id: item.getAttribute('data-section'),
            name: item.querySelector('h3, h2')?.textContent || item.getAttribute('data-section')
        }));

    togglableSections.forEach(sec => {
        const toggleRow = document.createElement('div');
        toggleRow.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.85rem; color: #8b949e;";
        toggleRow.innerHTML = `
            <span>${sec.name.substring(0, 15)}</span>
            <input type="checkbox" checked data-target="${sec.id}" style="accent-color: var(--primary);">
        `;
        sectionTogglesContainer.appendChild(toggleRow);

        toggleRow.querySelector('input').addEventListener('change', (e) => {
            const targetEl = document.querySelector(`[data-section="${sec.id}"]`);
            if (targetEl) {
                targetEl.style.display = e.target.checked ? 'flex' : 'none';
                showToast(`${sec.id} visibility updated`);
            }
        });
    });

    // --- Customizer Panel Logic ---
    togglePanel.addEventListener('click', () => {
        customizer.classList.toggle('active');
        togglePanel.querySelector('i').classList.toggle('ri-settings-line');
        togglePanel.querySelector('i').classList.toggle('ri-close-line');
    });

    // --- Theme Switcher ---
    document.querySelectorAll('[data-theme]').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.body.setAttribute('data-theme', theme);
            showToast(`Profile shifted to ${theme.split('-')[1]}`);
            generateQR(getComputedStyle(document.body).getPropertyValue('--primary').trim());
        });
    });

    // --- QR Ecosystem ---
    let qrEngine;
    function generateQR(dotColor = "#818cf8") {
        const container = document.getElementById("qr-code-container");
        container.innerHTML = "";
        qrEngine = new QRCodeStyling({
            width: 260,
            height: 260,
            data: window.location.href,
            dotsOptions: { color: dotColor, type: "dots" },
            backgroundOptions: { color: "#ffffff" },
            cornersSquareOptions: { type: "extra-rounded", color: dotColor },
            imageOptions: { crossOrigin: "anonymous", margin: 10 }
        });
        qrEngine.append(container);
    }
    generateQR();

    // --- Modal Control ---
    function openModal() { qrModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function removeModal() { qrModal.classList.remove('active'); document.body.style.overflow = ''; }

    qrBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', removeModal);
    qrModal.addEventListener('click', (e) => { if (e.target === qrModal) removeModal(); });

    // --- Download & Share ---
    document.getElementById('downloadQrBtn').addEventListener('click', () => {
        qrEngine.download({ name: "nexus-identity-qr", extension: "png" });
    });

    document.getElementById('shareBtn').addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Nexus Dynamics', url: window.location.href });
            } catch (err) { }
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast("Identity Link Copied");
        }
    });

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
});
