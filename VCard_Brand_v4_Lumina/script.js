document.addEventListener('DOMContentLoaded', () => {

    const btnShareCard = document.getElementById('btnShareCard');
    const navScan = document.getElementById('navScan');

    // Nav Items
    const navDashboard = document.getElementById('navDashboard');
    const navNetwork = document.getElementById('navNetwork');
    const navMessages = document.getElementById('navMessages');
    const navProfile = document.getElementById('navProfile');

    // --- Share/Scan Actions ---
    function showShareModal() {
        // Create a sleek, darker modal for this theme
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 z-[200] flex items-center justify-center bg-midnight/90 backdrop-blur-lg animate-fade-in-up';

        // QR Code API (using green/white to match theme)
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.href)}&color=13ec6d&bgcolor=050a07`;

        overlay.innerHTML = `
            <div class="relative bg-[#0a0f0c] p-1 rounded-[2rem] shadow-2xl animate-fade-in-up transform scale-90 border border-white/5">
                <div class="bg-gradient-to-b from-white/5 to-transparent p-6 rounded-[1.8rem] flex flex-col items-center gap-6 max-w-xs">
                    
                    <button id="closeOverlay" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                        <span class="material-symbols-outlined text-sm">close</span>
                    </button>

                    <div class="text-center mt-2">
                        <p class="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Secure Connect</p>
                        <h3 class="text-xl font-bold text-white">Lumina Identity</h3>
                    </div>
                    
                    <div class="p-2 bg-white/5 rounded-2xl border border-white/5 relative group">
                        <div class="absolute -inset-1 bg-gradient-to-br from-primary/30 to-indigo-500/30 blur opacity-40 group-hover:opacity-75 transition-opacity duration-700"></div>
                        <img src="${qrUrl}" alt="QR Code" class="w-48 h-48 rounded-xl relative z-10">
                    </div>

                    <p class="text-xs text-center text-white/40 leading-relaxed px-4">
                        Scan with any verified device to establish a direct networking protocol.
                    </p>

                    <button id="btnCopyLink" class="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-midnight transition-colors">
                        Copy Link
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('closeOverlay').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        document.getElementById('btnCopyLink').addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link Copied to Clipboard');
        });
    }

    if (btnShareCard) btnShareCard.addEventListener('click', showShareModal);
    if (navScan) navScan.addEventListener('click', showShareModal);

    // --- Navigation Simulation ---
    function setActiveNav(activeBtn) {
        [navDashboard, navNetwork, navMessages, navProfile].forEach(btn => {
            if (!btn) return;
            const icon = btn.querySelector('.material-symbols-outlined');
            const text = btn.querySelector('span:last-child');

            if (btn === activeBtn) {
                btn.classList.remove('text-white/50');
                btn.classList.add('text-primary');
                if (icon) icon.style.fontVariationSettings = "'FILL' 1";
            } else {
                btn.classList.add('text-white/50');
                btn.classList.remove('text-primary');
                // clear fill if possible, or reset styles
                if (icon) icon.style.fontVariationSettings = "'FILL' 0";
            }
        });
    }

    if (navDashboard) navDashboard.addEventListener('click', () => { setActiveNav(navDashboard); });
    if (navNetwork) navNetwork.addEventListener('click', () => { setActiveNav(navNetwork); });
    if (navMessages) navMessages.addEventListener('click', () => { setActiveNav(navMessages); });
    if (navProfile) navProfile.addEventListener('click', () => { setActiveNav(navProfile); });

});
