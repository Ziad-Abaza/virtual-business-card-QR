document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const qrWidget = document.getElementById('qrWidget');
    const btnSaveContact = document.getElementById('btnSaveContact');

    const btnCall = document.getElementById('btnCall');
    const btnEmail = document.getElementById('btnEmail');
    const btnConnect = document.getElementById('btnConnect');
    const btnVisit = document.getElementById('btnVisit');

    // --- Save Contact (VCard Download) ---
    if (btnSaveContact) {
        btnSaveContact.addEventListener('click', () => {
            const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:Alexander Pierce
N:Pierce;Alexander;;;
ORG:Global Corp
TITLE:Senior Director of Operations
TEL;TYPE=WORK,VOICE:+15550199
EMAIL:alex.pierce@globalcorp.com
URL:https://globalcorp.com
END:VCARD`;

            const blob = new Blob([vcardContent], { type: 'text/vcard' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'alexander_pierce.vcf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // --- QR Modal (Scan to Connect) ---
    if (qrWidget) {
        qrWidget.addEventListener('click', () => {
            // Elegant Glassmorphism Modal
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in-up';
            overlay.innerHTML = `
                <div class="relative bg-[#1c1c27]/90 p-8 rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(19,19,236,0.2)] max-w-sm w-full mx-4 text-center animate-slide-up">
                    <button id="closeOverlay" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                        <span class="material-symbols-outlined text-sm">close</span>
                    </button>
                    
                    <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
                        <span class="material-symbols-outlined">qr_code_scanner</span>
                    </div>
                    
                    <h3 class="text-white text-xl font-bold mb-2">Connect Instantly</h3>
                    <p class="text-white/60 text-sm mb-6">Scan this code to save contact details securely.</p>
                    
                    <div class="bg-white p-4 rounded-2xl inline-block shadow-lg">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(window.location.href)}" alt="QR Code" class="w-48 h-48 mix-blend-multiply">
                    </div>

                     <button id="btnShareModal" class="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-sm">share</span>
                        Share Profile
                    </button>
                </div>
            `;
            document.body.appendChild(overlay);

            // Modal Interactions
            document.getElementById('closeOverlay').addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.remove();
            });

            document.getElementById('btnShareModal').addEventListener('click', async () => {
                if (navigator.share) {
                    try { await navigator.share({ title: 'Alexander Pierce - Global Corp', url: window.location.href }); } catch (err) { }
                } else {
                    alert('URL copied to clipboard!');
                    navigator.clipboard.writeText(window.location.href);
                }
            });
        });
    }

    // --- Action Bar ---
    if (btnCall) btnCall.addEventListener('click', () => window.location.href = 'tel:+15550199');
    if (btnEmail) btnEmail.addEventListener('click', () => window.location.href = 'mailto:alex.pierce@globalcorp.com');
    if (btnConnect) btnConnect.addEventListener('click', () => window.open('https://linkedin.com', '_blank'));
    if (btnVisit) btnVisit.addEventListener('click', () => window.open('https://google.com', '_blank'));

    // --- Header Share Button ---
    const btnHeaderShare = document.getElementById('btnHeaderShare');
    if (btnHeaderShare) {
        btnHeaderShare.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({ title: 'David Miller - Corporate Identity', url: window.location.href });
                } catch (e) { }
            } else {
                alert('URL copied to clipboard');
                navigator.clipboard.writeText(window.location.href);
            }
        });
    }

});
