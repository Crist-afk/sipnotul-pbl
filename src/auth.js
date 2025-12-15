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
 * PERBAIKAN: Menggunakan URLSearchParams agar terbaca $_POST di PHP
 */
export async function login(nim, password, remember = false) {
    console.log('[AUTH] Attempting login for:', nim);

    try {
        // PERBAIKAN: Gunakan format Form Data, bukan JSON
        const formData = new URLSearchParams();
        formData.append('nim', nim);
        formData.append('password', password);

        const response = await fetch('php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData // Kirim sebagai Form Data
        });

        const result = await response.json();

        if (result.status === 'success') {
            console.log('[AUTH] Login successful:', result.user.name);

            const storage = remember ? localStorage : sessionStorage;
            storage.setItem(AUTH_KEY, JSON.stringify(result.user));

            return result.user;
        } else {
            console.error('[AUTH] Login failed:', result.message);
            throw new Error(result.message);
        }

    } catch (error) {
        console.error('[AUTH] System Error:', error);
        throw error;
    }
}

/**
 * Register new user (Connects to Database)
 * PERBAIKAN: Menggunakan URLSearchParams agar terbaca $_POST di PHP
 */
export async function register(userData) {
    console.log('[AUTH] Registering user:', userData.nim);

    try {
        // PERBAIKAN: Konversi Object ke Form Data
        const formData = new URLSearchParams();
        for (const key in userData) {
            formData.append(key, userData[key]);
        }

        const response = await fetch('php/register_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData // Kirim sebagai Form Data
        });

        const result = await response.json();

        if (result.status === 'success') {
            console.log('[AUTH] Registration successful');
            
            // Auto-login setelah daftar
            if (result.user) {
                localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
            }
            
            return result.user || result;
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
 */
export function getCurrentUser() {
    try {
        const data = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('[AUTH] Error getting current user:', e);
        return null;
    }
}

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * Logout current user
 */
export function logout() {
    console.log('[AUTH] Logging out');
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
}

/**
 * Require authentication (for protected pages)
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
 */
export function showToast(message, type = 'info') {
    const container = document.getElementById('toasts');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style manual untuk memastikan toast terlihat jika CSS belum load
    toast.style.padding = '12px 20px';
    toast.style.marginTop = '10px';
    toast.style.borderRadius = '5px';
    toast.style.color = '#fff';
    toast.style.fontFamily = "'Orbitron', sans-serif";
    toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.opacity = '0';

    if(type === 'success') {
        toast.style.background = '#001a33';
        toast.style.border = '1px solid #00f3ff';
        toast.style.boxShadow = '0 0 10px #00f3ff';
    } else if (type === 'error') {
        toast.style.background = '#001a33';
        toast.style.border = '1px solid #ff0055';
        toast.style.boxShadow = '0 0 10px #ff0055';
    } else {
        toast.style.background = '#333';
    }
    
    container.appendChild(toast);
    
    // Animasi Fade In
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });
    
    // Animasi Fade Out
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export default { login, logout, getCurrentUser, isLoggedIn, requireAuth, register, showToast };     