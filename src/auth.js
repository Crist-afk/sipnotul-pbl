/**
 * ============================================
 * AUTHENTICATION MODULE (DATABASE VERSION)
 * ============================================
 * Handles user login, logout, and session management
 * connecting to PHP Backend.
 */

// Storage key for user session
const AUTH_KEY = 'sipenotul_auth';

/**
 * Login function (Connects to Database)
 * @param {string} nim - Student ID number
 * @param {string} password - User password
 * @param {boolean} remember - Whether to remember the user
 * @returns {object} User session object
 */
export async function login(nim, password, remember = false) {
    console.log('[AUTH] Attempting login for:', nim);

    try {
        // 1. Kirim data ke PHP
        const response = await fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nim, password })
        });

        // 2. Baca balasan dari PHP
        const result = await response.json();

        // 3. Cek status
        if (result.status === 'success') {
            console.log('[AUTH] Login successful:', result.user.name);

            // Simpan data user ke browser (Session/Local Storage)
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem(AUTH_KEY, JSON.stringify(result.user));

            return result.user;
        } else {
            // Jika password salah atau user tidak ditemukan
            console.error('[AUTH] Login failed:', result.message);
            throw new Error(result.message);
        }

    } catch (error) {
        console.error('[AUTH] System Error:', error);
        throw error; // Lempar error agar bisa ditangkap index.html
    }
}

/**
 * Register new user (Connects to Database)
 * @param {object} userData - User registration data
 * @returns {object} User session object
 */
export async function register(userData) {
    console.log('[AUTH] Registering user:', userData.nim);

    try {
        const response = await fetch('register_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.status === 'success') {
            console.log('[AUTH] Registration successful');
            
            // Auto-login setelah daftar (Simpan ke LocalStorage)
            localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
            
            return result.user;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('[AUTH] Register Error:', error);
        throw error;
    }
}

/**
 * Get current logged-in user
 * @returns {object|null} User session or null
 */
export function getCurrentUser() {
    try {
        // Cek LocalStorage (jika "Ingat Saya") atau SessionStorage (jika tidak)
        const data = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('[AUTH] Error getting current user:', e);
        return null;
    }
}

/**
 * Check if user is logged in
 * @returns {boolean} True if logged in
 */
export function isLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * Logout current user
 * Clears session and redirects to home
 */
export function logout() {
    console.log('[AUTH] Logging out');
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
}

/**
 * Require authentication (for protected pages)
 * Redirects to home if not logged in
 * @returns {boolean} True if authenticated
 */
export function requireAuth() {
    if (!isLoggedIn()) {
        console.log('[AUTH] Not authenticated, redirecting to home');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info'
 */
export function showToast(message, type = 'info') {
    const container = document.getElementById('toasts');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.opacity = '0';
    
    container.appendChild(toast);
    
    // Animasi Fade In
    setTimeout(() => toast.style.opacity = '1', 10);
    
    // Animasi Fade Out
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export default object for compatibility
export default { login, logout, getCurrentUser, isLoggedIn, requireAuth, register, showToast };