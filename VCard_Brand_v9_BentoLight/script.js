document.addEventListener('DOMContentLoaded', () => {

    const btnShare = document.getElementById('btnShare');
    const qrImage = document.getElementById('qrImage');

    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            if (navigator.share) {
                try { await navigator.share({ title: 'Alex Sterling - Enterprise Pro', url: window.location.href }); } catch (err) { }
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Profile URL Copied!');
            }
        });
    }

    if (qrImage) {
        // regenerate Qr
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.href)}&color=312e81&bgcolor=f8fafc`;
        qrImage.src = url;
    }

    // --- Navigation Simulation ---
    const navIds = ['navDash', 'navContact', 'navLeaderboard', 'navContacts'];
    const navEls = navIds.map(id => document.getElementById(id));

    function setActive(id) {
        navEls.forEach(el => {
            if (!el) return;
            const icon = el.firstElementChild;
            if (el.id === id) {
                el.classList.remove('text-slate-400');
                el.classList.add('text-primary');
                if (icon) icon.classList.add('fill-1');
            } else {
                el.classList.add('text-slate-400');
                el.classList.remove('text-primary');
                if (icon) icon.classList.remove('fill-1');
            }
        });
    }

    navEls.forEach(el => {
        if (el) el.addEventListener('click', () => setActive(el.id));
    });

    const btnMainAdd = document.getElementById('btnMainAdd');
    if (btnMainAdd) {
        btnMainAdd.addEventListener('click', () => {
            alert('Add Widget / Action (Demo)');
        });
    }

    document.getElementById('btnEdit').addEventListener('click', () => alert('Edit Mode'));
    document.getElementById('btnNotif').addEventListener('click', () => alert('Zero New Notifications'));
    document.getElementById('btnSettings').addEventListener('click', () => alert('Settings Panel'));

});
