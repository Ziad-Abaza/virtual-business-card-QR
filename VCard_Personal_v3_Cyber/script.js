document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const btnScan = document.getElementById('btnScan');
    const qrWidget = document.getElementById('qrWidget');
    const btnDashboard = document.getElementById('btnDashboard');
    const btnStyle = document.getElementById('btnStyle');
    const btnHub = document.getElementById('btnHub');
    const btnSettings = document.getElementById('btnSettings');

    // --- QR Scan Logic ---
    function showScanModal() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in-up';
        overlay.innerHTML = `
            <div class="relative bg-black/50 border border-primary/20 p-8 rounded-2xl max-w-sm w-full mx-4 text-center shadow-[0_0_50px_rgba(19,236,91,0.1)]">
                <button id="closeOverlay" class="absolute top-4 right-4 text-primary/50 hover:text-primary transition-colors">
                    <span class="material-icons">close</span>
                </button>
                
                <h3 class="text-primary font-bold text-xl mb-6 tracking-widest uppercase">Identity Link</h3>
                
                <div class="relative inline-block group">
                     <div class="absolute -inset-1 bg-gradient-to-tr from-primary/50 to-transparent blur opacity-50"></div>
                     <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.href)}&color=13ec5b&bgcolor=080c09" alt="QR Code" class="w-56 h-56 rounded-lg relative z-10 border border-primary/30 p-2 bg-background-dark">
                </div>

                <p class="mt-6 text-xs text-white/40 tracking-tight">SCAN TO DECRYPT CONTACT DATA</p>
                
                <button id="btnShareModal" class="w-full mt-6 py-3 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-colors">
                    Share Access Key
                </button>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('closeOverlay').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        document.getElementById('btnShareModal').addEventListener('click', async () => {
            if (navigator.share) {
                try { await navigator.share({ title: 'Alexander Roland - Neural Card', url: window.location.href }); } catch (err) { }
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Access Key Copied to Clipboard");
            }
        });
    }

    if (btnScan) btnScan.addEventListener('click', showScanModal);
    if (qrWidget) qrWidget.addEventListener('click', showScanModal);

    // --- Dashboard Actions (Simulated) ---
    function toggleActive(btn) {
        // Remove active class from others
        [btnDashboard, btnStyle, btnHub, btnSettings].forEach(b => {
            if (b) b.querySelector('span').classList.remove('text-primary');
            if (b) b.querySelector('span').classList.add('text-white/60');
        });
        // Add to current
        if (btn) btn.querySelector('span').classList.remove('text-white/60');
        if (btn) btn.querySelector('span').classList.add('text-primary');
    }

    if (btnDashboard) btnDashboard.addEventListener('click', () => { toggleActive(btnDashboard); });
    if (btnStyle) btnStyle.addEventListener('click', () => { toggleActive(btnStyle); alert('Style Protocol: LOCKED'); });
    if (btnHub) btnHub.addEventListener('click', () => { toggleActive(btnHub); });
    if (btnSettings) btnSettings.addEventListener('click', () => { toggleActive(btnSettings); alert('Settings: ACCESS DENIED'); });

    // --- Header Actions ---
    const btnAccount = document.getElementById('btnAccount');
    if (btnAccount) {
        btnAccount.addEventListener('click', () => {
            alert('User Profile: Encrypted. Please scan VCard to decrypt.');
        });
    }

});
