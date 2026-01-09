document.addEventListener('DOMContentLoaded', () => {

    const navItems = ['navDashboard', 'navCard', 'navAnalytics', 'navTeam'];
    const navEls = navItems.map(id => document.getElementById(id));

    function setActive(id) {
        navEls.forEach(el => {
            if (!el) return;
            if (el.id === id) {
                el.classList.remove('text-[#9292c9]');
                el.classList.add('text-primary');
            } else {
                el.classList.add('text-[#9292c9]');
                el.classList.remove('text-primary');
            }
        });
    }

    navEls.forEach(el => {
        if (el) el.addEventListener('click', () => setActive(el.id));
    });

    const btnMainAction = document.getElementById('btnMainAction');
    if (btnMainAction) {
        btnMainAction.addEventListener('click', () => {
            alert('New Action Item Triggered');
        });
    }

    const btnGateway = document.getElementById('btnGateway');
    if (btnGateway) {
        btnGateway.addEventListener('click', () => {
            // Create dark overlay
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in-up';
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}&color=6366f1&bgcolor=000000`;

            overlay.innerHTML = `
                <div class="relative bg-black border border-indigo-glow/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.2)]">
                    <button id="closeOverlay" class="absolute top-4 right-4 text-white/50 hover:text-white">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                    <h2 class="text-white text-xl font-bold mb-4 text-center">Obsidian Gateway</h2>
                    <img src="${qrUrl}" class="w-56 h-56 rounded-xl border border-white/10 mb-6">
                    <button id="btnShare" class="w-full bg-indigo-glow text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition-colors">
                        Share Access Key
                    </button>
                </div>
             `;
            document.body.appendChild(overlay);

            document.getElementById('closeOverlay').addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove() });

            document.getElementById('btnShare').addEventListener('click', async () => {
                if (navigator.share) {
                    try { await navigator.share({ title: 'Obsidian Access', url: window.location.href }); } catch (e) { }
                } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Access Key Copied');
                }
            });
        });
    }

});
