document.addEventListener('DOMContentLoaded', () => {
    // 1. QR Code Setup
    const qrToggle = document.getElementById('qrToggle');
    const qrModal = document.getElementById('qrModal');
    const closeModal = document.querySelector('.close-modal');
    const qrContainer = document.getElementById('qrContainer');

    const qrCode = new QRCodeStyling({
        width: 280,
        height: 280,
        type: "svg",
        data: window.location.href,
        dotsOptions: {
            color: "#050505",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 10
        }
    });

    qrCode.append(qrContainer);

    qrToggle.addEventListener('click', () => {
        qrModal.classList.add('active');
        gsap.from('.modal-pane', { scale: 0.9, duration: 0.5, ease: "elastic.out(1, 0.8)" });
    });

    closeModal.addEventListener('click', () => {
        qrModal.classList.remove('active');
    });

    // 2. Interactive Artifacts (Glow follow)
    const artifacts = document.querySelectorAll('.artifact');

    artifacts.forEach(artifact => {
        const glow = artifact.querySelector('.artifact-glow');

        artifact.addEventListener('mousemove', (e) => {
            const rect = artifact.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(glow, {
                x: x - glow.offsetWidth / 2,
                y: y - glow.offsetHeight / 2,
                duration: 0.2
            });
        });
    });

    // 3. Glitch Effect Logic
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                glitchText.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                setTimeout(() => { glitchText.style.transform = 'none'; }, 50);
            }
        }, 100);
    }

    // 5. Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    let themeIndex = 0;
    const themes = [
        { primary: '#5271FF', shadow: 'rgba(82, 113, 255, 0.3)' },
        { primary: '#FF3B3B', shadow: 'rgba(255, 59, 59, 0.3)' },
        { primary: '#00F5D4', shadow: 'rgba(0, 245, 212, 0.3)' },
        { primary: '#FFD60A', shadow: 'rgba(255, 214, 10, 0.3)' }
    ];

    themeToggle.addEventListener('click', () => {
        themeIndex = (themeIndex + 1) % themes.length;
        const theme = themes[themeIndex];
        document.documentElement.style.setProperty('--primary', theme.primary);
        document.documentElement.style.setProperty('--primary-glow', theme.shadow);
        showToast(`Syncing Frequency: ${theme.primary}`);
    });

    // 6. Particle System (Interactive Nodes & Lines)
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;
    const connectionDistance = 180;
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;
                this.x -= directionX * force * 2;
                this.y -= directionY * force * 2;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
            ctx.fill();
        }
    }

    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${hexToRgb(primaryColor)}, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function hexToRgb(hex) {
        if (!hex.startsWith('#')) return '82, 113, 255'; // Fallback
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', initParticles);
    initParticles();
    animateParticles();

    // 7. Toast System
    function showToast(message) {
        let toast = document.querySelector('.custom-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'custom-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.display = 'block';

        gsap.fromTo(toast,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );

        setTimeout(() => {
            gsap.to(toast, { y: 20, opacity: 0, duration: 0.5, onComplete: () => toast.style.display = 'none' });
        }, 2000);
    }

    // CSS for JS-driven elements
    const style = document.createElement('style');
    style.textContent = `
        .custom-toast {
            position: fixed;
            bottom: 110px;
            right: 40px;
            background: var(--primary);
            color: #000;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 1000;
            display: none;
            box-shadow: 0 10px 30px var(--primary-glow);
        }
    `;
    document.head.appendChild(style);
});
