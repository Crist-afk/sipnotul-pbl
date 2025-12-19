// src/logo-loop.js
class LogoLoop {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            speed: 120,
            direction: 'left',
            logos: [],
            gap: 32,
            logoHeight: 28,
            fadeOut: true,
            pauseOnHover: true,
            ...options
        };
        
        this.track = null;
        this.animationId = null;
        this.lastTimestamp = null;
        this.offset = 0;
        this.velocity = 0;
        this.seqWidth = 0;
        this.isHovered = false;
        this.imagesLoaded = 0;
        this.totalImages = 0;
        
        this.init();
    }
    
    init() {
        this.createTrack();
        this.renderLogos();
        this.setupEventListeners();
    }
    
    createTrack() {
        this.track = document.createElement('div');
        this.track.className = 'logoloop__track';
        this.container.appendChild(this.track);
    }
    
    renderLogos() {
        if (!this.track || !this.options.logos.length) return;
        
        // Create multiple copies for seamless looping
        const copies = 3;
        
        for (let i = 0; i < copies; i++) {
            const list = document.createElement('div');
            list.className = 'logoloop__list';
            if (i > 0) {
                list.setAttribute('aria-hidden', 'true');
            }
            
            this.options.logos.forEach((logo, index) => {
                const item = document.createElement('div');
                item.className = 'logoloop__item';
                item.setAttribute('role', 'listitem');
                
                if (logo.href) {
                    const link = document.createElement('a');
                    link.href = logo.href;
                    link.className = 'logoloop__link';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.setAttribute('aria-label', logo.alt || logo.title || 'Logo partner');
                    
                    const img = document.createElement('img');
                    img.src = logo.src;
                    img.alt = logo.alt || '';
                    img.title = logo.title || '';
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    img.draggable = false;
                    
                    link.appendChild(img);
                    item.appendChild(link);
                    this.totalImages++;
                } else {
                    const img = document.createElement('img');
                    img.src = logo.src;
                    img.alt = logo.alt || '';
                    img.title = logo.title || '';
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    img.draggable = false;
                    item.appendChild(img);
                    this.totalImages++;
                }
                
                list.appendChild(item);
            });
            
            this.track.appendChild(list);
        }
        
        // Wait for images to load before starting animation
        this.waitForImages();
    }
    
    waitForImages() {
        const images = this.track.querySelectorAll('img');
        if (images.length === 0) {
            this.startAnimation();
            return;
        }
        
        images.forEach(img => {
            if (img.complete) {
                this.onImageLoad();
            } else {
                img.addEventListener('load', () => this.onImageLoad());
                img.addEventListener('error', () => this.onImageLoad()); // Continue even if image fails
            }
        });
    }
    
    onImageLoad() {
        this.imagesLoaded++;
        if (this.imagesLoaded >= this.totalImages) {
            this.calculateDimensions();
            this.startAnimation();
        }
    }
    
    calculateDimensions() {
        const firstList = this.track.querySelector('.logoloop__list');
        if (firstList) {
            this.seqWidth = firstList.offsetWidth;
            
            // Apply CSS variables
            this.container.style.setProperty('--logoloop-gap', `${this.options.gap}px`);
            this.container.style.setProperty('--logoloop-logoHeight', `${this.options.logoHeight}px`);
            
            if (this.options.fadeOutColor) {
                this.container.style.setProperty('--logoloop-fadeColor', this.options.fadeOutColor);
            }
        }
    }
    
    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        const animate = (timestamp) => {
            if (!this.lastTimestamp) {
                this.lastTimestamp = timestamp;
            }
            
            const deltaTime = Math.max(0, timestamp - this.lastTimestamp) / 1000;
            this.lastTimestamp = timestamp;
            
            // Calculate target velocity
            let targetVelocity = this.options.speed;
            if (this.options.direction === 'right') {
                targetVelocity = -this.options.speed;
            } else if (this.options.direction === 'up') {
                targetVelocity = this.options.speed;
            } else if (this.options.direction === 'down') {
                targetVelocity = -this.options.speed;
            }
            
            // Apply hover effect
            if (this.isHovered && this.options.pauseOnHover) {
                targetVelocity = 0;
            }
            
            // Smooth velocity transition
            const easingFactor = 1 - Math.exp(-deltaTime / 0.25);
            this.velocity += (targetVelocity - this.velocity) * easingFactor;
            
            // Update offset
            if (this.seqWidth > 0) {
                this.offset += this.velocity * deltaTime;
                this.offset = ((this.offset % this.seqWidth) + this.seqWidth) % this.seqWidth;
                this.track.style.transform = `translate3d(${-this.offset}px, 0, 0)`;
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    setupEventListeners() {
        if (this.options.pauseOnHover) {
            this.track.addEventListener('mouseenter', () => {
                this.isHovered = true;
            });
            
            this.track.addEventListener('mouseleave', () => {
                this.isHovered = false;
            });
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.calculateDimensions();
        });
    }
    
    updateLogos(newLogos) {
        this.options.logos = newLogos;
        this.destroy();
        this.init();
    }
    
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.destroy();
        this.init();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.track && this.track.parentNode) {
            this.track.parentNode.removeChild(this.track);
            this.track = null;
        }
        
        this.imagesLoaded = 0;
        this.totalImages = 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LogoLoop;
} else {
    window.LogoLoop = LogoLoop;
}