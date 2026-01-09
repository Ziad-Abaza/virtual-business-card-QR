document.addEventListener('DOMContentLoaded', () => {

    // --- Tabs ---
    const tabs = ['tabEditor', 'tabPreview', 'tabAnalytics'];
    const tabEls = tabs.map(id => document.getElementById(id));

    function setActiveTab(id) {
        tabEls.forEach(tab => {
            if (!tab) return;
            if (tab.id === id) {
                tab.classList.remove('border-transparent', 'text-slate-500');
                tab.classList.add('border-primary', 'text-white');
            } else {
                tab.classList.add('border-transparent', 'text-slate-500');
                tab.classList.remove('border-primary', 'text-white');
            }
        });
    }

    tabEls.forEach(tab => {
        if (tab) tab.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveTab(tab.id);
            // In a real app, this would swap content. For now, we simulate.
        });
    });

    // --- QR Modal ---
    const btnQrTile = document.getElementById('btnQrTile');
    if (btnQrTile) {
        btnQrTile.addEventListener('click', showQrModal);
    }

    function showQrModal() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/80 backdrop-blur-md animate-fade-in-up';
        const link = window.location.href;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}&color=10b981&bgcolor=050510`;

        overlay.innerHTML = `
            <div class="bg-[#050510] border border-white/10 p-6 rounded-3xl shadow-2xl relative flex flex-col items-center">
                <button id="closeOverlay" class="absolute top-4 right-4 text-white/50 hover:text-white"><span class="material-symbols-outlined">close</span></button>
                <div class="h-12 w-12 rounded-full bg-accent-emerald/20 flex items-center justify-center mb-4"><span class="material-symbols-outlined text-accent-emerald">qr_code_2</span></div>
                <h3 class="text-white font-bold text-lg mb-1">Enterprise Access</h3>
                <img src="${qrUrl}" class="w-48 h-48 my-4 rounded-xl border border-white/5">
                <button id="btnCopy" class="w-full bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 py-2 rounded-xl text-sm font-bold">Copy Link</button>
            </div>
         `;
        document.body.appendChild(overlay);

        document.getElementById('closeOverlay').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove() });
        document.getElementById('btnCopy').addEventListener('click', () => {
            navigator.clipboard.writeText(link);
            alert('Copied to clipboard');
        });
    }

    // --- Other interaction ---
    const btnFlip = document.getElementById('btnFlip');
    if (btnFlip) {
        btnFlip.addEventListener('click', () => {
            // Simulate flip animation or just alert
            const card = document.querySelector('.glass-card');
            if (card) {
                card.style.transform = 'rotateY(180deg)';
                card.style.transition = 'transform 0.6s';
                setTimeout(() => card.style.transform = 'rotateY(0deg)', 1000);
            }
        });
    }

    const btnPublish = document.getElementById('btnPublish');
    if (btnPublish) {
        btnPublish.addEventListener('click', () => {
            btnPublish.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Publishing...';
            setTimeout(() => {
                btnPublish.innerHTML = '<span>Published Successfully</span><span class="material-symbols-outlined">check</span>';
                btnPublish.classList.add('bg-accent-emerald', 'text-white');
                btnPublish.classList.remove('bg-primary');
            }, 1000);
        });
    }

});
