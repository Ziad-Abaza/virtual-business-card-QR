document.addEventListener('DOMContentLoaded', () => {

    const btnFollow = document.getElementById('btnFollow');
    const qrBtn = document.getElementById('qrBtn');
    const backBtn = document.getElementById('backBtn');

    // Social Buttons
    const btnInsta = document.getElementById('btnInsta');
    const btnTiktok = document.getElementById('btnTiktok');
    const btnYoutube = document.getElementById('btnYoutube');
    const btnTwitter = document.getElementById('btnTwitter');

    // --- "Follow Me" Action (Save VCard) ---
    if (btnFollow) {
        btnFollow.addEventListener('click', () => {
            // Create a dummy VCF content
            const vcardData = `BEGIN:VCARD
VERSION:3.0
FN:Alex Rivera
ORG:Lifestyle Creator
TITLE:Influencer
TEL;TYPE=WORK,VOICE:1234567890
EMAIL:alex@example.com
URL:https://instagram.com/alexstyle
END:VCARD`;
            const blob = new Blob([vcardData], { type: 'text/vcard' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'alex_rivera.vcf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // --- QR Code Action ---
    if (qrBtn) {
        qrBtn.addEventListener('click', () => {
            // Reuse existing nice layout to show a "QR Modal" or just alert for now
            // For a quick premium feel without extra HTML, we can create a dynamic overlay
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in-up';
            overlay.innerHTML = `
                <div class="bg-white p-6 rounded-3xl relative animate-bounce-in">
                    <button id="closeOverlay" class="absolute top-2 right-2 text-gray-500 hover:text-black">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                    <div class="text-center">
                        <h3 class="text-xl font-bold text-gray-800 mb-4">Scan to Follow</h3>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}" alt="QR Code" class="rounded-xl shadow-lg mx-auto">
                        <p class="mt-4 text-sm text-gray-500">Share with your friends!</p>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            // Close logic
            document.getElementById('closeOverlay').addEventListener('click', () => {
                overlay.remove();
            });
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.remove();
            });
        });
    }

    // --- Navigation & Socials ---
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Go back to gallery (assuming relative path structure)
            window.location.href = '../index.html';
        });
    }

    // --- Extra Interactivity ---
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            alert('Menu expanded (Demo Only)');
        });
    }

    // Handle dummy links
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Navigating to content... (Demo)');
        });
    });

    function openSocial(url) {
        window.open(url, '_blank');
    }

    if (btnInsta) btnInsta.addEventListener('click', () => openSocial('https://instagram.com'));
    if (btnTiktok) btnTiktok.addEventListener('click', () => openSocial('https://tiktok.com'));
    if (btnYoutube) btnYoutube.addEventListener('click', () => openSocial('https://youtube.com'));
    if (btnTwitter) btnTwitter.addEventListener('click', () => openSocial('https://twitter.com'));

});
