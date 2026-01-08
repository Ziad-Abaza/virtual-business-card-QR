const templates = [
    {
        id: 'brand-v1',
        title: 'Premium Brand Identity',
        category: 'brand',
        path: './VCard_Brand_v1_Premium/index.html',
        image: './gallery_assets/VCard_Brand_v1_Premium.png',
        desc: 'A sophisticated design tailored for established brands looking to make a strong corporate statement.',
        tags: ['Corporate', 'Minimal', 'Dark']
    },
    {
        id: 'brand-v2',
        title: 'Luxury Brand Showcase',
        category: 'brand',
        path: './VCard_Brand_v2_Premium/index.html',
        image: './gallery_assets/VCard_Brand_v2_Premium.png',
        desc: 'Elevate your brand presence with this luxury template featuring golden accents and smooth transitions.',
        tags: ['Luxury', 'Premium', 'Gold']
    },
    {
        id: 'personal-v1',
        title: 'Modern Personal Profile',
        category: 'personal',
        path: './VCard_Personal_v1_Premium/index.html',
        image: './gallery_assets/VCard_Personal_v1_Premium.png',
        desc: 'Perfect for professionals. Clean layout highlighting your skills, resume, and contact details.',
        tags: ['Professional', 'Clean', 'Resume']
    },
    {
        id: 'personal-v2',
        title: 'Creative Individual',
        category: 'personal',
        path: './VCard_Personal_v2_Premium/index.html',
        image: './gallery_assets/VCard_Personal_v2_Premium.png',
        desc: 'Stand out with a creative personal card that focuses on your unique personality and bio.',
        tags: ['Creative', 'Bold', 'Profile']
    },
    {
        id: 'portfolio-v1',
        title: 'Freelancer Portfolio',
        category: 'portfolio',
        path: './VCard_Portfolio_v1_Freelancer/index.html',
        image: './gallery_assets/VCard_Portfolio_v1_Freelancer.png',
        desc: 'Showcase your work effectively. Grid layouts, lightbox support, and project details for freelancers.',
        tags: ['Freelance', 'Gallery', 'Work']
    },
    {
        id: 'social-v1',
        title: 'Influencer Connect',
        category: 'social',
        path: './VCard_Social_v1_Influencer/index.html',
        image: './gallery_assets/VCard_Social_v1_Influencer.png',
        desc: 'Designed for social media stars. Linktree style with advanced visuals and social feed integration.',
        tags: ['Social', 'Links', 'Mobile-First']
    }
];

// Helper to generate gradients based on id/category (Fallback)
function getGradient(category) {
    const gradients = {
        'brand': 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
        'personal': 'linear-gradient(135deg, #be185d, #ec4899)',
        'portfolio': 'linear-gradient(135deg, #0f766e, #14b8a6)',
        'social': 'linear-gradient(135deg, #7e22ce, #a855f7)'
    };
    return gradients[category] || 'linear-gradient(135deg, #333, #555)';
}

// State
let currentIndex = 0;

// DOM Elements
const galleryTrack = document.getElementById('galleryTrack');
const templateDetails = document.getElementById('templateDetails');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const gridContainer = document.getElementById('templatesGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

// Initialize
function init() {
    render3DGallery();
    renderGrid('all');
    updateGallery();
    initCursor();
}

// 3D Gallery Renderer
function render3DGallery() {
    galleryTrack.innerHTML = '';
    templates.forEach((template, index) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        // We set background to a fallback gradient, then overlay the image
        card.style.background = getGradient(template.category);

        card.innerHTML = `
            <div class="card-image" style="background-image: url('${template.image}');">
                <div class="card-overlay"></div>
            </div>
            <div class="card-info">
                <h3>${template.title}</h3>
                <span>${template.category}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            if (index === currentIndex) {
                // Open link
                window.location.href = template.path;
            } else {
                currentIndex = index;
                updateGallery();
            }
        });

        galleryTrack.appendChild(card);
    });
}

function getIcon(category) {
    switch (category) {
        case 'brand': return 'building';
        case 'personal': return 'user';
        case 'portfolio': return 'layer-group';
        case 'social': return 'hashtag';
        default: return 'code';
    }
}

// Update 3D Positions
function updateGallery() {
    const cards = document.querySelectorAll('.gallery-card');

    cards.forEach((card, index) => {
        const offset = index - currentIndex;

        if (offset === 0) {
            // Center
            card.style.transform = `translateX(0) translateZ(0) rotateY(0deg)`;
            card.style.zIndex = 10;
            card.style.opacity = 1;
            card.classList.add('active');
        } else if (offset > 0) {
            // Right
            card.style.transform = `translateX(${offset * 60}px) translateZ(-${offset * 100}px) rotateY(-${10 * offset}deg)`;
            card.style.zIndex = 10 - offset;
            card.style.opacity = 0.6 - (offset * 0.1);
            card.classList.remove('active');
        } else {
            // Left (offset is negative)
            card.style.transform = `translateX(${offset * 60}px) translateZ(${offset * 100}px) rotateY(${-10 * offset}deg)`;
            card.style.zIndex = 10 + offset;
            card.style.opacity = 0.6 + (offset * 0.1);
            card.classList.remove('active');
        }
    });

    // Update Details
    const currentTemplate = templates[currentIndex];
    templateDetails.innerHTML = `
        <h3>${currentTemplate.title}</h3>
        <p style="max-width: 500px; margin: 10px auto; color: #aaa;">${currentTemplate.desc}</p>
        <a href="${currentTemplate.path}" class="cta-btn" style="display: inline-block; margin-top: 15px;">View Live Demo</a>
    `;
    templateDetails.classList.add('visible');
}

// Navigation
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateGallery();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < templates.length - 1) {
        currentIndex++;
        updateGallery();
    }
});

// Grid & Filtering
function renderGrid(filter) {
    gridContainer.innerHTML = '';

    const filteredEvents = filter === 'all'
        ? templates
        : templates.filter(t => t.category === filter);

    filteredEvents.forEach(template => {
        const item = document.createElement('div');
        item.className = 'grid-item';

        item.innerHTML = `
            <div class="grid-image" style="background-image: url('${template.image}');">
                <div class="card-overlay" style="opacity: 0.2;"></div>
            </div>
            <div class="grid-content">
                <h3>${template.title}</h3>
                <p>${template.desc}</p>
                <div style="margin-bottom: 15px;">
                    ${template.tags.map(tag => `<span style="font-size: 0.7rem; background: rgba(255,255,255,0.1); padding: 3px 8px; border-radius: 10px; margin-right: 5px;">${tag}</span>`).join('')}
                </div>
                <a href="${template.path}" class="view-btn">View Template <i class="fas fa-arrow-right"></i></a>
            </div>
        `;

        gridContainer.appendChild(item);
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        renderGrid(filter);
    });
});

// Cursor Effect
function initCursor() {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add some lag to outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .gallery-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
}
// Run
init();
