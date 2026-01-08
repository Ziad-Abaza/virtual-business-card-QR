document.addEventListener('DOMContentLoaded', () => {
    const shareBtn = document.getElementById('share-btn');
    const saveBtn = document.getElementById('save-vcard');

    // Share functionality
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Ziad A. - UI/UX Designer',
                    text: 'Check out Ziad\'s virtual business card and portfolio!',
                    url: window.location.href
                });
                console.log('Successful share');
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            // Fallback: Copy to clipboard
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                const originalContent = shareBtn.innerHTML;
                shareBtn.innerHTML = '<i class="fa-solid fa-check"></i> Link Copied';
                shareBtn.style.background = '#10b981';

                setTimeout(() => {
                    shareBtn.innerHTML = originalContent;
                    shareBtn.style.background = 'rgba(255, 255, 255, 0.05)';
                }, 2000);
            });
        }
    });

    // Save Contact simulation
    saveBtn.addEventListener('click', () => {
        const originalContent = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing...';

        setTimeout(() => {
            saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Contact File Ready';
            saveBtn.style.background = '#10b981';
            saveBtn.style.color = 'white';

            // In a real app, this would trigger a .vcf file download
            alert('VCF Contact Card generation would happen here in a full implementation.');

            setTimeout(() => {
                saveBtn.innerHTML = originalContent;
                saveBtn.style.background = 'white';
                saveBtn.style.color = '#0a0a0b';
            }, 3000);
        }, 1500);
    });

    // Background animation: slight movement of blobs and lottie bg on mouse move
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.015;

        const blob1 = document.querySelector('.blob-1');
        const blob2 = document.querySelector('.blob-2');
        const animatedBg = document.querySelector('.animated-bg');

        if (blob1) blob1.style.transform = `translate(${moveX}px, ${moveY}px)`;
        if (blob2) blob2.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        if (animatedBg) animatedBg.style.transform = `translate(calc(-50% + ${moveX * 2}px), calc(-50% + ${moveY * 2}px))`;
    });

    // Magnetic effect for social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mousemove', (e) => {
            const rect = icon.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            icon.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transform = `translate(0, 0)`;
        });
    });

    // Tilt effect for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
        });
    });

    // Add scroll reveal for section elements
    const sections = document.querySelectorAll('section, footer');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(section);
    });
});
