document.addEventListener('DOMContentLoaded', () => {

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
