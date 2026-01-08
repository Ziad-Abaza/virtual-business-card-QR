document.addEventListener('DOMContentLoaded', () => {
    // 0. Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // 1. Image Path Replacement (Images are now in assets/)
    // Relative paths in HTML (assets/profile.png) will handle this automatically.


    // 2. Initial GSAP Animations
    // Set initial visibility first
    gsap.set('.tile', { opacity: 1, y: 0 });
    gsap.set('.status-chip', { opacity: 1, x: 0 });
    gsap.set('.nav-actions .icon-btn', { opacity: 1, x: 0 });

    // Then animate from hidden to visible for smooth entrance
    gsap.from('.tile', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.2,
        onStart: () => {
            gsap.set('.tile', { opacity: 1 });
        }
    });

    gsap.from('.status-chip', {
        duration: 1,
        x: -50,
        opacity: 0,
        ease: 'power4.out',
        onStart: () => {
            gsap.set('.status-chip', { opacity: 1 });
        }
    });

    gsap.from('.nav-actions .icon-btn', {
        duration: 1,
        x: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power4.out',
        onStart: () => {
            gsap.set('.nav-actions .icon-btn', { opacity: 1 });
        }
    });

    // 3. Stats Counter Animation
    const stats = document.querySelectorAll('.stat-val');
    stats.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const countObj = { val: 0 };

        gsap.to(countObj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            delay: 0.5,
            onUpdate: () => {
                stat.innerText = countObj.val.toFixed(target % 1 === 0 ? 0 : 1);
            }
        });
    });

    // 4. QR Code Generation
    const qrCode = new QRCodeStyling({
        width: 250,
        height: 250,
        type: "svg",
        data: window.location.href,
        dotsOptions: {
            color: "#FF3CAC",
            type: "extra-rounded"
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 5
        },
        cornersSquareOptions: {
            type: "extra-rounded",
            color: "#784BA0"
        }
    });

    const qrContainer = document.getElementById("qrContainer");
    if (qrContainer) {
        qrCode.append(qrContainer);
    }

    // 5. Modal Logic
    const qrTrigger = document.getElementById('qrTrigger');
    const qrModal = document.getElementById('qrModal');
    const closeBtn = document.querySelector('.close-btn');

    qrTrigger.addEventListener('click', () => {
        qrModal.classList.add('active');
        gsap.from('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(1.7)'
        });
    });

    closeBtn.addEventListener('click', () => {
        qrModal.classList.remove('active');
    });

    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) qrModal.classList.remove('active');
    });

    // 6. Share Functionality
    const shareTrigger = document.getElementById('shareTrigger');
    shareTrigger.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Kai Storm | Digital Creator',
                    text: 'Check out Kai Storm\'s official digital card!',
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            alert('Sharing is not supported on this browser. URL copied to clipboard.');
            navigator.clipboard.writeText(window.location.href);
        }
    });

    // 7. Interactive Animations (Advanced)

    // Cursor Follower & Mouse Tracking
    const cursor = document.querySelector('.cursor-follower');
    const bentoGrid = document.querySelector('.bento-grid');

    document.addEventListener('mousemove', (e) => {
        // Move cursor follower
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.6,
            ease: 'power2.out'
        });

        // Parallax background blobs
        gsap.to('.blob-1', { x: e.clientX * 0.05, y: e.clientY * 0.05, duration: 1 });
        gsap.to('.blob-2', { x: -e.clientX * 0.03, y: -e.clientY * 0.03, duration: 1 });
        gsap.to('.blob-3', { x: e.clientX * 0.02, y: -e.clientY * 0.04, duration: 1 });
    });

    // 3D Tile Tilt & Spotlight Effect
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener('mousemove', (e) => {
            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate tilt
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            // Set spotlight position
            tile.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            tile.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

            gsap.to(tile, {
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        tile.addEventListener('mouseleave', () => {
            gsap.to(tile, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        tile.addEventListener('mousedown', () => {
            gsap.to(tile, { scale: 0.95, duration: 0.1 });
        });

        tile.addEventListener('mouseup', () => {
            gsap.to(tile, { scale: 1.02, duration: 0.2 });
        });
    });

    // Magnetic Buttons
    const magnets = document.querySelectorAll('.icon-btn, .main-fab, .status-chip');
    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(magnet, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
});
