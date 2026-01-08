document.addEventListener('DOMContentLoaded', () => {

    // --- Neural Network Animation ---
    class NeuralNetwork {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: 0, y: 0, radius: 150 };
            this.init();
            this.animate();
            this.setupEventListeners();
        }

        init() {
            this.resize();
            this.createParticles();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createParticles() {
            const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
            this.particles = [];

            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.3,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        }

        setupEventListeners() {
            window.addEventListener('resize', () => {
                this.resize();
                this.createParticles();
            });

            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            window.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });

            // Touch support
            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    this.mouse.x = e.touches[0].clientX;
                    this.mouse.y = e.touches[0].clientY;
                }
            });

            window.addEventListener('touchend', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });
        }

        drawParticle(particle) {
            const distance = Math.hypot(particle.x - this.mouse.x, particle.y - this.mouse.y);
            const maxDistance = this.mouse.radius;

            let opacity = particle.opacity;
            let radius = particle.radius;

            if (distance < maxDistance) {
                const influence = 1 - (distance / maxDistance);
                opacity = particle.opacity + influence * 0.5;
                radius = particle.radius + influence * 2;

                // Electric glow effect
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, radius * 3
                );
                gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`);
                gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, radius * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Pulsing effect
            const pulse = Math.sin(Date.now() * 0.002 + particle.pulsePhase) * 0.3 + 1;
            radius *= pulse;

            // Main particle
            this.ctx.fillStyle = `rgba(147, 197, 253, ${Math.min(opacity, 1)})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        drawConnections() {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.3;

                        // Check if connection is near mouse for electric effect
                        const midX = (this.particles[i].x + this.particles[j].x) / 2;
                        const midY = (this.particles[i].y + this.particles[j].y) / 2;
                        const mouseDistance = Math.hypot(midX - this.mouse.x, midY - this.mouse.y);

                        if (mouseDistance < this.mouse.radius) {
                            const influence = 1 - (mouseDistance / this.mouse.radius);

                            // Electric connection effect
                            const gradient = this.ctx.createLinearGradient(
                                this.particles[i].x, this.particles[i].y,
                                this.particles[j].x, this.particles[j].y
                            );
                            gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity + influence * 0.7})`);
                            gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity + influence * 0.5})`);
                            gradient.addColorStop(1, `rgba(99, 102, 241, ${opacity + influence * 0.7})`);

                            this.ctx.strokeStyle = gradient;
                            this.ctx.lineWidth = 1 + influence * 2;
                        } else {
                            this.ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
                            this.ctx.lineWidth = 1;
                        }

                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }

                // Mouse connections
                const mouseDistance = Math.hypot(this.particles[i].x - this.mouse.x, this.particles[i].y - this.mouse.y);
                if (mouseDistance < this.mouse.radius) {
                    const opacity = (1 - mouseDistance / this.mouse.radius) * 0.8;

                    // Electric mouse connection
                    const gradient = this.ctx.createLinearGradient(
                        this.particles[i].x, this.particles[i].y,
                        this.mouse.x, this.mouse.y
                    );
                    gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity * 0.3})`);
                    gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity * 0.6})`);
                    gradient.addColorStop(1, `rgba(236, 72, 153, ${opacity})`);

                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }

        updateParticles() {
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

                // Mouse repulsion/attraction
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.hypot(dx, dy);

                if (distance < this.mouse.radius && distance > 0) {
                    const force = (1 - distance / this.mouse.radius) * 0.03;
                    particle.vx += (dx / distance) * force;
                    particle.vy += (dy / distance) * force;

                    // Limit velocity
                    const maxSpeed = 2;
                    const speed = Math.hypot(particle.vx, particle.vy);
                    if (speed > maxSpeed) {
                        particle.vx = (particle.vx / speed) * maxSpeed;
                        particle.vy = (particle.vy / speed) * maxSpeed;
                    }
                }

                // Damping
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // Living motion: prevent particles from stopping entirely
                if (Math.abs(particle.vx) < 0.1) particle.vx += (Math.random() - 0.5) * 0.02;
                if (Math.abs(particle.vy) < 0.1) particle.vy += (Math.random() - 0.5) * 0.02;
            });
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.updateParticles();
            this.drawConnections();
            this.particles.forEach(particle => this.drawParticle(particle));

            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize neural network
    const neuralCanvas = document.getElementById('neuralCanvas');
    const neuralNetwork = new NeuralNetwork(neuralCanvas);

    // --- Elements ---
    const qrBtn = document.getElementById('qrBtn');
    const qrModal = document.getElementById('qrModal');
    const closeModal = document.getElementById('closeModal');
    const downloadQrBtn = document.getElementById('downloadQrBtn');
    const toast = document.getElementById('toast');
    const saveContactBtn = document.getElementById('saveContactBtn');
    const shareBtn = document.getElementById('shareBtn');

    // --- Configuration ---
    const cardData = {
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
        email: "hello@johndoe.com",
        website: "https://johndoe.com",
        org: "Tech Innovations Inc.",
        title: "Creative Developer",
        address: "New York, NY"
    };

    const currentUrl = window.location.href;

    // --- 3D Tilt Effect ---
    VanillaTilt.init(document.querySelector(".card-container"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        gyroscope: true,
    });

    // --- QR Code Generation ---
    const qrCode = new QRCodeStyling({
        width: 200,
        height: 200,
        type: "svg",
        data: currentUrl,
        image: "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.symbol.svg",
        dotsOptions: { color: "#6366f1", type: "rounded" },
        backgroundOptions: { color: "#ffffff" },
        imageOptions: { crossOrigin: "anonymous", margin: 10 },
        cornersSquareOptions: { type: "extra-rounded", color: "#4f46e5" },
        cornersDotOptions: { color: "#4f46e5" }
    });

    qrCode.append(document.getElementById("qr-code-container"));

    // --- Interactions ---
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function copyToClipboard(text, label) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${label} copied to clipboard!`);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    // Attach Copy Listeners to Contact Items
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Prevent default navigation if it's a copy-able item (optional strategy, 
            // but for better UX on phone/email, we might want to LET it open 
            // BUT also copy. For now, let's just intercept if user holds or clicks specifically.)

            // Actually, let's keep default behavior (open app) but add a long-press or separate copy button?
            // "Premium" usually implies "Smart". 
            // Let's add a small 'click' handler that doesn't prevent default but toasts.
            // On desktop, clicking email opens mailto. On mobile, same.

            // Enhancement: Copy content if it's not a link, or if we explicitly want to.
            // Let's just create a specific behavior:
            // If the user clicks the TEXT part, copy. If they click the icon/arrow, go.
            // For now, let's just leave the links as links. 
            // IMPROVEMENT: Add a "Copy" button specifically? 
            // Or just intercept the click, copy, then allow default?

            // Simplest Premium enhancement:
            // Add a class 'copy-trigger' to specific elements if requested. 
            // For now, I'll stick to the Requested "Download and Tilt" as priority.
            // I'll leave the links as standard to not break "Call" functionality.
        });
    });

    // --- Modal Logic ---
    function openModal() {
        qrModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function removeModal() {
        qrModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    qrBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', removeModal);
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) removeModal();
    });

    // --- Download QR ---
    downloadQrBtn.addEventListener('click', () => {
        qrCode.download({ name: "my-business-card-qr", extension: "png" });
    });

    // --- vCard Generation (Save Contact) ---
    saveContactBtn.addEventListener('click', () => {
        const vCardData = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `N:${cardData.lastName};${cardData.firstName};;;`,
            `FN:${cardData.firstName} ${cardData.lastName}`,
            `ORG:${cardData.org}`,
            `TITLE:${cardData.title}`,
            `TEL;type=CELL:${cardData.phone}`,
            `EMAIL;type=WORK:${cardData.email}`,
            `URL:${cardData.website}`,
            `ADR;type=WORK:;;${cardData.address};;;;`,
            'END:VCARD'
        ].join('\n');

        const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${cardData.firstName}_${cardData.lastName}.vcf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Contact file downloaded!");
    });

    // --- Share Functionality ---
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${cardData.firstName} ${cardData.lastName} - Business Card`,
                    text: `Check out ${cardData.firstName}'s digital business card`,
                    url: currentUrl
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(currentUrl).then(() => {
                showToast("Link copied to clipboard!");
            });
        }
    });

    // --- Animation Entry ---
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.animation = `slideUp 0.5s ease forwards ${0.3 + (index * 0.1)}s`;
    });
});
