/**
 * Social Media Navigation Component untuk SIPNOTUL
 * Komponen PillNav khusus untuk link sosial media
 */

// Data sosial media tim
const socialMediaItems = [
    {
        label: "Crist Garcia Pasaribu",
        href: "https://www.instagram.com/chytilmn_?igsh=NXFqaHI3Nzk5ZnY1",
        ariaLabel: "Instagram Cahyati Lamona Sitohang",
        icon: "📷"
    },
    {
        label: "Cahyati Lamona Sitohang",
        href: "https://www.instagram.com/crist._.0?igsh=eWt6amoxMmp2NmY",
        ariaLabel: "Instagram Crist Garcia Pasaribu",
        icon: "📱"
    },
    {
        label: "Fazri Rahman",
        href: "https://www.instagram.com/crist._.0?igsh=eWt6amoxMmp2NmY",
        ariaLabel: "Instagram Crist Garcia Pasaribu",
        icon: "📷"
    }
];

/**
 * Inisialisasi social media navigation component
 */
function initSocialNav() {
    const socialContainer = document.getElementById('socialNavContainer');
    if (!socialContainer) {
        console.error('Social nav container tidak ditemukan');
        return;
    }

    // Create social nav structure
    socialContainer.innerHTML = `
        <div class="social-nav-container">
            <nav class="social-nav" aria-label="Social Media">
                <div class="social-nav-items">
                    <ul class="social-list" role="menubar">
                        ${socialMediaItems.map((item, i) => `
                            <li key="${item.href || `social-${i}`}" role="none">
                                <a
                                    role="menuitem"
                                    href="${item.href}"
                                    class="social-pill"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="${item.ariaLabel}"
                                    data-index="${i}"
                                >
                                    <span class="social-icon">${item.icon}</span>
                                    <span class="social-label">${item.label}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </nav>
        </div>
    `;

    // Add hover effects
    const pills = socialContainer.querySelectorAll('.social-pill');
    pills.forEach(pill => {
        pill.addEventListener('mouseenter', function() {
            const index = this.getAttribute('data-index');
            handlePillEnter(index);
        });
        
        pill.addEventListener('mouseleave', function() {
            const index = this.getAttribute('data-index');
            handlePillLeave(index);
        });
    });

    // Animation setup
    setupPillAnimations();
}

/**
 * Setup animations for social media pills
 */
function setupPillAnimations() {
    // Inisialisasi animasi dasar
    const pills = document.querySelectorAll('.social-pill');
    
    pills.forEach((pill, i) => {
        // Setup initial state
        const label = pill.querySelector('.social-label');
        const icon = pill.querySelector('.social-icon');
        
        if (label) {
            label.style.transition = 'all 0.3s ease';
        }
        if (icon) {
            icon.style.transition = 'all 0.3s ease';
        }
    });
}

/**
 * Handle pill hover enter
 */
function handlePillEnter(index) {
    const pill = document.querySelector(`.social-pill[data-index="${index}"]`);
    if (!pill) return;
    
    const label = pill.querySelector('.social-label');
    const icon = pill.querySelector('.social-icon');
    
    // Animasi hover
    if (label) {
        label.style.transform = 'translateY(-2px)';
        label.style.opacity = '0.9';
    }
    if (icon) {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
    }
    
    pill.style.transform = 'translateY(-2px)';
    pill.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
}

/**
 * Handle pill hover leave
 */
function handlePillLeave(index) {
    const pill = document.querySelector(`.social-pill[data-index="${index}"]`);
    if (!pill) return;
    
    const label = pill.querySelector('.social-label');
    const icon = pill.querySelector('.social-icon');
    
    // Reset animasi
    if (label) {
        label.style.transform = 'translateY(0)';
        label.style.opacity = '1';
    }
    if (icon) {
        icon.style.transform = 'scale(1) rotate(0)';
    }
    
    pill.style.transform = 'translateY(0)';
    pill.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
}

/**
 * Export fungsi untuk digunakan di file lain
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initSocialNav, socialMediaItems };
} else {
    // Untuk penggunaan langsung di browser
    window.initSocialNav = initSocialNav;
    window.socialMediaData = socialMediaItems;
}