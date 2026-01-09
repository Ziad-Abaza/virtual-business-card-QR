document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const btnHeaderShare = document.getElementById('btnHeaderShare');
    const qrWidget = document.getElementById('qrWidget');

    const btnEmail = document.getElementById('btnEmail');
    const btnLinkedin = document.getElementById('btnLinkedin');
    const btnBook = document.getElementById('btnBook');

    // --- Actions ---

    // 1. Share Header
    if (btnHeaderShare) {
        btnHeaderShare.addEventListener('click', async () => {
            if (navigator.share) {
                try { await navigator.share({ title: 'Marcus V. Sterling', url: window.location.href }); } catch (e) { }
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard');
            }
        });
    }

    // 2. Main QR Widget (Modal)
    if (qrWidget) {
        qrWidget.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/90 backdrop-blur-sm animate-fade-in-up';
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`;

            overlay.innerHTML = `
                <div class="bg-white dark:bg-[#1a2632] p-8 rounded-2xl shadow-2xl relative max-w-[280px] w-full flex flex-col items-center">
                    <button id="closeOverlay" class="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Scan to Connect</h3>
                    <p class="text-xs text-slate-500 mb-4">Save directly to contacts</p>
                    <img src="${qrUrl}" alt="QR" class="w-48 h-48 rounded-lg border border-slate-100 dark:border-white/10 mb-4">
                    <div class="flex gap-2 w-full">
                        <button id="btnDlVcf" class="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg">Save VCF</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            document.getElementById('closeOverlay').addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() });

            document.getElementById('btnDlVcf').addEventListener('click', () => {
                const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Marcus V. Sterling
ORG:Global Consulting Group
TITLE:Senior Corporate Strategist
TEL;TYPE=WORK:+15558924022
URL:${window.location.href}
END:VCARD`;
                const blob = new Blob([vcard], { type: 'text/vcard' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'marcus_sterling.vcf';
                a.click();
            });
        });
    }

    // 3. Action Buttons
    if (btnEmail) btnEmail.addEventListener('click', () => window.location.href = 'mailto:marcus@globalconsulting.com');
    if (btnLinkedin) btnLinkedin.addEventListener('click', () => window.open('https://linkedin.com', '_blank'));
    if (btnBook) btnBook.addEventListener('click', () => alert('Opening Scheduling Tool...'));

});
