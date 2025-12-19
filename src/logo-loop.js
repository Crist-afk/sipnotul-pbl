/**
 * Logo Loop Component untuk SIPNOTUL
 * File terpisah untuk animasi logo carousel
 */

// Data logo teknologi
const logos = [
    { 
        src: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/html5.svg', 
        alt: 'HTML5', 
        name: 'html5', 
        link: 'https://developer.mozilla.org/en-US/docs/Web/HTML' 
    },
    { 
        src: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/css3.svg', 
        alt: 'CSS3', 
        name: 'css3', 
        link: 'https://developer.mozilla.org/en-US/docs/Web/CSS' 
    },
    { 
        src: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg', 
        alt: 'JavaScript', 
        name: 'javascript', 
        link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' 
    },
    { 
        src: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/php.svg', 
        alt: 'PHP', 
        name: 'php', 
        link: 'https://www.php.net/' 
    },
    { 
        src: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mysql.svg', 
        alt: 'MySQL', 
        name: 'mysql', 
        link: 'https://www.mysql.com/' 
    },
    { 
        src: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/git.svg', 
        alt: 'Git', 
        name: 'git', 
        link: 'https://git-scm.com/' 
    },
    { 
        src: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg', 
        alt: 'GitHub', 
        name: 'github', 
        link: 'https://github.com/Crist-afk/sipnotul-pbl.git' 
    },
    { 
        src: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bootstrap.svg', 
        alt: 'Bootstrap', 
        name: 'bootstrap', 
        link: 'https://getbootstrap.com/' 
    }
];

/**
 * Inisialisasi logo loop carousel
 */
function initLogoLoop() {
    const track = document.getElementById('logoTrack');
    if (!track) {
        console.error('Logo track tidak ditemukan');
        return;
    }
    
    // Create logo HTML dengan link yang bisa diklik
    const logosHTML = logos.map(logo => `
        <a href="${logo.link}" target="_blank" rel="noopener noreferrer" 
           class="logo-item" data-logo="${logo.name}" title="${logo.alt}">
            <img src="${logo.src}" alt="${logo.alt}">
        </a>
    `).join('');
    
    // Duplikat untuk seamless loop
    track.innerHTML = logosHTML + logosHTML;
    console.log('✅ Logo carousel berhasil diinisialisasi');
}

/**
 * Export fungsi untuk digunakan di file lain
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initLogoLoop, logos };
} else {
    // Untuk penggunaan langsung di browser
    window.initLogoLoop = initLogoLoop;
    window.logoLoopData = logos;
}