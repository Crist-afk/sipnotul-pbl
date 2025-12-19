/**
 * Animated Scroll Component untuk SIPNOTUL
 * File terpisah untuk animasi scroll fitur
 */

// Data fitur SIPNOTUL (telah dihapus "Notifikasi & Pengingat")
const features = [
    {
        icon: "📝",
        title: "Pencatatan Notulen Real-time",
        description: "Catat hasil rapat secara langsung dengan editor yang responsif dan otomatis tersimpan."
    },
    {
        icon: "🔗",
        title: "Bagikan dengan Kode Unik",
        description: "Setiap notulen memiliki kode 4-digit yang dapat dibagikan kepada peserta rapat."
    },
    {
        icon: "👥",
        title: "Kolaborasi Tim",
        description: "Bekerja sama dengan tim dalam satu notulen secara bersamaan."
    },
    {
        icon: "📊",
        title: "Analisis Rapat",
        description: "Dapatkan insight dari setiap rapat dengan statistik dan ringkasan otomatis."
    },
    {
        icon: "📱",
        title: "Responsif di Semua Device",
        description: "Akses SIPNOTUL dari komputer, tablet, atau smartphone Anda."
    },
    {
        icon: "📁",
        title: "Arsip Otomatis",
        description: "Notulen otomatis diarsipkan dan dapat dicari berdasarkan tanggal, topik, atau peserta."
    },
    {
        icon: "📈",
        title: "Dashboard Interaktif",
        description: "Pantau semua aktivitas rapat dalam satu dashboard yang informatif."
    },
    {
        icon: "🎯",
        title: "Template yang Dapat Disesuaikan",
        description: "Gunakan template yang sudah ada atau buat template notulen Anda sendiri."
    },
    {
        icon: "🔍",
        title: "Pencarian Cerdas",
        description: "Temukan notulen dengan cepat menggunakan fitur pencarian yang powerful."
    }
];

/**
 * Inisialisasi animated scroll component
 */
function initAnimatedScroll() {
    const container = document.getElementById('featuresScrollContainer');
    if (!container) {
        console.error('Container animated scroll tidak ditemukan');
        return;
    }

    // Create scroll list structure
    container.innerHTML = `
        <div class="scroll-progress-container">
            <div class="scroll-progress-bar" id="scrollProgressBar"></div>
        </div>
        <div class="scroll-list" id="featuresList"></div>
        <div class="top-gradient" id="topGradient"></div>
        <div class="bottom-gradient" id="bottomGradient"></div>
    `;

    const list = document.getElementById('featuresList');
    const progressBar = document.getElementById('scrollProgressBar');
    const topGradient = document.getElementById('topGradient');
    const bottomGradient = document.getElementById('bottomGradient');

    // Populate features (sekarang hanya 9 fitur)
    features.forEach((feature, index) => {
        const item = document.createElement('div');
        item.className = 'animated-feature-item';
        item.innerHTML = `
            <div class="feature-item-inner" data-index="${index}">
                <div class="feature-header">
                    <div class="feature-icon">${feature.icon}</div>
                    <h3 class="feature-title">${feature.title}</h3>
                </div>
                <p class="feature-description">${feature.description}</p>
            </div>
        `;
        list.appendChild(item);
    });

    // Handle scroll events
    let scrollTimeout;
    list.addEventListener('scroll', () => {
        // Update progress bar
        const scrollTop = list.scrollTop;
        const scrollHeight = list.scrollHeight - list.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;

        // Update gradients
        const topOpacity = Math.min(scrollTop / 30, 1);
        const bottomDistance = scrollHeight - scrollTop;
        const bottomOpacity = scrollHeight <= 0 ? 0 : Math.min(bottomDistance / 30, 1);
        
        topGradient.style.opacity = topOpacity;
        bottomGradient.style.opacity = bottomOpacity;

        // Add scroll effect class
        list.classList.add('scrolling');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            list.classList.remove('scrolling');
        }, 150);
    });

    // Handle item clicks
    list.addEventListener('click', (e) => {
        const itemInner = e.target.closest('.feature-item-inner');
        if (itemInner) {
            // Remove previous selection
            document.querySelectorAll('.feature-item-inner').forEach(el => {
                el.classList.remove('selected');
            });
            // Add selection to clicked item
            itemInner.classList.add('selected');
            
            // Scroll to center the selected item
            const index = parseInt(itemInner.dataset.index);
            const item = itemInner.parentElement;
            const itemTop = item.offsetTop;
            const itemHeight = item.offsetHeight;
            const containerHeight = list.clientHeight;
            
            list.scrollTo({
                top: itemTop - (containerHeight / 2) + (itemHeight / 2),
                behavior: 'smooth'
            });
        }
    });

    // Add hover effects
    list.addEventListener('mouseover', (e) => {
        const itemInner = e.target.closest('.feature-item-inner');
        if (itemInner) {
            itemInner.style.transform = 'translateY(-4px) scale(1.02)';
        }
    });

    list.addEventListener('mouseout', (e) => {
        const itemInner = e.target.closest('.feature-item-inner');
        if (itemInner && !itemInner.classList.contains('selected')) {
            itemInner.style.transform = '';
        }
    });

    // Initialize with first item selected
    setTimeout(() => {
        const firstItem = list.querySelector('.feature-item-inner');
        if (firstItem) {
            firstItem.classList.add('selected');
        }
    }, 100);
}

/**
 * Export fungsi untuk digunakan di file lain
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initAnimatedScroll, features };
} else {
    // Untuk penggunaan langsung di browser
    window.initAnimatedScroll = initAnimatedScroll;
    window.animatedScrollFeatures = features;
}