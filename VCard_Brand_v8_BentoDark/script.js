document.addEventListener('DOMContentLoaded', () => {

    // --- Share Main Utility ---
    const btnShareMain = document.getElementById('btnShareMain');
    const qrImage = document.getElementById('qrImage');

    if (btnShareMain) {
        btnShareMain.addEventListener('click', async () => {
            if (navigator.share) {
                try { await navigator.share({ title: 'Alex Sterling - Enterprise Pro', url: window.location.href }); } catch (err) { }
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Profile Link Copied');
            }
        });
    }

    if (qrImage) {
        // regenerate Qr on the fly to match current URL
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.href)}&color=000000&bgcolor=FFFFFF`;
        qrImage.src = url;
    }

    // --- Navigation Simulation ---
    // IDs: navDash, navCard, navAnalytics, navTeam
    const navIds = ['navDash', 'navCard', 'navAnalytics', 'navTeam'];
    const navEls = navIds.map(id => document.getElementById(id));

    function setActive(id) {
        navEls.forEach(el => {
            if (!el) return;
            // Assuming first child is span with icon
            const icon = el.firstElementChild;
            if (el.id === id) {
                el.classList.remove('text-[#9292c9]');
                el.classList.add('text-primary');
                if (icon) icon.classList.add('fill-1');
            } else {
                el.classList.add('text-[#9292c9]');
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

    const btnCustomize = document.getElementById('btnCustomize');
    if (btnCustomize) {
        btnCustomize.addEventListener('click', () => {
            alert('Entering Customization Mode...');
        });
    }

});
