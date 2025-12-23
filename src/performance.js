/**
 * Performance Optimization Module for SIPNOTUL
 * Handles caching, DOM optimization, and lazy loading
 */

// Cache for user permissions and note data
const cache = {
    userPermissions: new Map(),
    noteData: new Map(),
    userInfo: null,
    cacheTimeout: 5 * 60 * 1000 // 5 minutes
};

/**
 * Cache user ownership status for notes
 */
export function cacheUserOwnership(noteId, isOwner) {
    const timestamp = Date.now();
    cache.userPermissions.set(noteId, {
        isOwner,
        timestamp
    });
}

/**
 * Get cached ownership status
 */
export function getCachedOwnership(noteId) {
    const cached = cache.userPermissions.get(noteId);
    if (!cached) return null;
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp > cache.cacheTimeout) {
        cache.userPermissions.delete(noteId);
        return null;
    }
    
    return cached.isOwner;
}

/**
 * Cache note data to reduce API calls
 */
export function cacheNoteData(noteId, noteData) {
    const timestamp = Date.now();
    cache.noteData.set(noteId, {
        data: noteData,
        timestamp
    });
}

/**
 * Get cached note data
 */
export function getCachedNoteData(noteId) {
    const cached = cache.noteData.get(noteId);
    if (!cached) return null;
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp > cache.cacheTimeout) {
        cache.noteData.delete(noteId);
        return null;
    }
    
    return cached.data;
}

/**
 * Optimized DOM manipulation for showing/hiding controls
 */
export class DOMOptimizer {
    constructor() {
        this.pendingUpdates = new Map();
        this.updateScheduled = false;
    }
    
    /**
     * Batch DOM updates to reduce reflows
     */
    scheduleUpdate(element, updates) {
        this.pendingUpdates.set(element, updates);
        
        if (!this.updateScheduled) {
            this.updateScheduled = true;
            requestAnimationFrame(() => this.flushUpdates());
        }
    }
    
    /**
     * Apply all pending DOM updates
     */
    flushUpdates() {
        this.pendingUpdates.forEach((updates, element) => {
            if (updates.style) {
                Object.assign(element.style, updates.style);
            }
            if (updates.attributes) {
                Object.entries(updates.attributes).forEach(([key, value]) => {
                    element.setAttribute(key, value);
                });
            }
            if (updates.classes) {
                if (updates.classes.add) {
                    element.classList.add(...updates.classes.add);
                }
                if (updates.classes.remove) {
                    element.classList.remove(...updates.classes.remove);
                }
            }
        });
        
        this.pendingUpdates.clear();
        this.updateScheduled = false;
    }
    
    /**
     * Optimized way to show/hide elements
     */
    toggleVisibility(element, show) {
        this.scheduleUpdate(element, {
            style: {
                display: show ? '' : 'none',
                opacity: show ? '1' : '0'
            }
        });
    }
    
    /**
     * Optimized way to update element content
     */
    updateContent(element, content) {
        // Use textContent for security and performance
        if (typeof content === 'string' && !content.includes('<')) {
            element.textContent = content;
        } else {
            element.innerHTML = content;
        }
    }
}

/**
 * Lazy loading for edit controls
 */
export class LazyControlLoader {
    constructor() {
        this.loadedControls = new Set();
        this.observer = null;
        this.initIntersectionObserver();
    }
    
    /**
     * Initialize intersection observer for lazy loading
     */
    initIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadControlsForElement(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });
        }
    }
    
    /**
     * Register element for lazy loading
     */
    registerElement(element, noteId, isOwner) {
        if (this.observer) {
            element.dataset.noteId = noteId;
            element.dataset.isOwner = isOwner;
            this.observer.observe(element);
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadControlsForElement(element, noteId, isOwner);
        }
    }
    
    /**
     * Load controls when element becomes visible
     */
    loadControlsForElement(element, noteId = null, isOwner = null) {
        const id = noteId || element.dataset.noteId;
        const owner = isOwner !== null ? isOwner : element.dataset.isOwner === 'true';
        
        if (this.loadedControls.has(id)) return;
        
        if (owner) {
            this.createEditControls(element, id);
        }
        
        this.loadedControls.add(id);
        
        if (this.observer) {
            this.observer.unobserve(element);
        }
    }
    
    /**
     * Create edit controls for note owners
     */
    createEditControls(element, noteId) {
        const controlsContainer = element.querySelector('.note-controls');
        if (!controlsContainer) return;
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-secondary btn-sm';
        editBtn.innerHTML = '✏️ Edit';
        editBtn.onclick = () => window.location.href = `editor.html?id=${noteId}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => window.handleDeleteNote && window.handleDeleteNote(noteId);
        
        controlsContainer.appendChild(editBtn);
        controlsContainer.appendChild(deleteBtn);
    }
}

/**
 * Debounce function for performance optimization
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Memory management - clear old cache entries
 */
export function cleanupCache() {
    const now = Date.now();
    
    // Clean permissions cache
    for (const [key, value] of cache.userPermissions.entries()) {
        if (now - value.timestamp > cache.cacheTimeout) {
            cache.userPermissions.delete(key);
        }
    }
    
    // Clean note data cache
    for (const [key, value] of cache.noteData.entries()) {
        if (now - value.timestamp > cache.cacheTimeout) {
            cache.noteData.delete(key);
        }
    }
}

// Initialize global instances
export const domOptimizer = new DOMOptimizer();
export const lazyLoader = new LazyControlLoader();

// Cleanup cache every 10 minutes
setInterval(cleanupCache, 10 * 60 * 1000);

export default {
    cacheUserOwnership,
    getCachedOwnership,
    cacheNoteData,
    getCachedNoteData,
    DOMOptimizer,
    LazyControlLoader,
    domOptimizer,
    lazyLoader,
    debounce,
    throttle,
    cleanupCache
};