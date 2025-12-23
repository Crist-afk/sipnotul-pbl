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
 * Show toast notification with enhanced styling
 */
export function showToast(message, type = 'info') {
    const container = document.getElementById('toasts');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Enhanced styling for better visibility
    toast.style.cssText = `
        padding: 12px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateX(100%);
        max-width: 400px;
        word-wrap: break-word;
        z-index: 1000;
        position: relative;
    `;

    // Type-specific styling
    switch(type) {
        case 'success':
            toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'error':
            toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        case 'warning':
            toast.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            break;
        case 'info':
        default:
            toast.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
            break;
    }
    
    container.appendChild(toast);
    
    // Slide in animation
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Handle API errors with user-friendly messages
 */
export function handleApiError(error, response = null) {
    console.error('[API Error]', error);
    
    let message = 'Terjadi kesalahan sistem';
    
    if (response) {
        switch(response.status) {
            case 400:
                message = 'Data yang dikirim tidak valid';
                break;
            case 401:
                message = 'Sesi Anda telah berakhir. Silakan login kembali';
                logout();
                return;
            case 403:
                message = 'Anda tidak memiliki izin untuk melakukan tindakan ini';
                break;
            case 404:
                message = 'Data yang dicari tidak ditemukan';
                break;
            case 500:
                message = 'Terjadi kesalahan server. Coba lagi nanti';
                break;
            default:
                if (error.message) {
                    message = error.message;
                }
        }
    } else if (error.message) {
        if (error.message.includes('Failed to fetch')) {
            message = 'Koneksi terputus. Periksa internet Anda';
        } else {
            message = error.message;
        }
    }
    
    showToast(message, 'error');
}

/**
 * Show access denied message
 */
export function showAccessDenied(action = 'melakukan tindakan ini') {
    showToast(`❌ Anda tidak memiliki izin untuk ${action}`, 'error');
}

/**
 * Show validation error
 */
export function showValidationError(field, message) {
    showToast(`❌ ${field}: ${message}`, 'warning');
}

/**
 * Show success message for common actions
 */
export function showSuccessMessage(action) {
    const messages = {
        'save': '✅ Data berhasil disimpan',
        'delete': '✅ Data berhasil dihapus',
        'update': '✅ Data berhasil diperbarui',
        'create': '✅ Data berhasil dibuat'
    };
    
    showToast(messages[action] || `✅ ${action} berhasil`, 'success');
}

export default { 
    login, 
    logout, 
    getCurrentUser, 
    isLoggedIn, 
    requireAuth, 
    register, 
    showToast, 
    handleApiError, 
    showAccessDenied, 
    showValidationError, 
    showSuccessMessage 
};     