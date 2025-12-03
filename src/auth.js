/**
 * ============================================
 * AUTHENTICATION MODULE
 * ============================================
 * Handles user login, logout, and session management
 * 
 * Key Concepts:
 * - NIM: Student ID used for login (e.g., "01", "3312501041")
 * - ID: Database identifier for internal use (e.g., 2101, 2102)
 */

// Storage key for user session
const AUTH_KEY = 'sipenotul_auth';

// Demo users for testing (in production, this would come from a database)
const DEMO_USERS = [
    { 
        id: 2101, 
        name: 'Demo User', 
        nim: '01', 
        email: 'demo@email.com', 
        programStudi: 'Teknik Informatika', 
        password: 'Admin123'
    },
    { 
        id: 2102, 
        name: 'Crist Garcia Pasaribu', 
        nim: '3312501041', 
        email: 'crist@email.com', 
        programStudi: 'Teknik Informatika', 
        password: 'Crist123'
    },
    { 
        id: 2103, 
        name: 'Cahyati Lamona Sitohang', 
        nim: '3312501040', 
        email: 'cahyati@email.com', 
        programStudi: 'Teknik Informatika', 
        password: 'Cahyati123'
    },
    { 
        id: 2104, 
        name: 'Fazri Rahman', 
        nim: '3312501038', 
        email: 'fazri@email.com', 
        programStudi: 'Teknik Informatika', 
        password: 'Fazri123'
    },
    { 
        id: 2105, 
        name: 'Takanashi Hoshino', 
        nim: '2006', 
        email: 'hoshinotakanashi@buruaka.com', 
        programStudi: 'Teknik Informatika', 
        password: 'Admin123'
    }
];

/**
 * Login function
 * @param {string} nim - Student ID number
 * @param {string} password - User password
 * @param {boolean} remember - Whether to remember the user
 * @returns {object} User session object
 */
export function login(nim, password, remember = false) {
    console.log('='.repeat(50));
    console.log('[AUTH] Login attempt');
    console.log('[AUTH] Input NIM:', nim, '| Type:', typeof nim);
    console.log('[AUTH] Input Password:', password);
    
    // Convert nim to string to ensure proper comparison
    const nimStr = String(nim).trim();
    console.log('[AUTH] Converted NIM to string:', nimStr);
    
    // Find user by NIM and password
    console.log('[AUTH] Searching in DEMO_USERS...');
    let user = DEMO_USERS.find(u => {
        const match = String(u.nim) === nimStr && u.password === password;
        console.log(`[AUTH] User: ${u.name} | NIM: "${u.nim}" === "${nimStr}"? ${String(u.nim) === nimStr} | Password match? ${u.password === password} | Overall: ${match}`);
        return match;
    });
    
    // If not found in demo users, check registered users
    if (!user) {
        try {
            const registered = JSON.parse(localStorage.getItem('sipenotul_registered_users') || '[]');
            user = registered.find(u => String(u.nim) === nimStr && u.password === password);
        } catch (e) {
            console.error('[AUTH] Error reading registered users:', e);
        }
    }
    
    // If user not found, throw error
    if (!user) {
        console.log('[AUTH] Login failed: Invalid credentials for NIM:', nimStr);
        throw new Error('NIM atau password salah');
    }
    
    // Create session object (without password for security)
    const session = {
        id: user.id,
        nim: user.nim,
        name: user.name,
        email: user.email,
        programStudi: user.programStudi,
        token: 'token-' + Date.now()
    };
    
    // Save to localStorage or sessionStorage based on "remember me"
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(AUTH_KEY, JSON.stringify(session));
    
    console.log('[AUTH] Login successful:', session.name);
    return session;
}

/**
 * Get current logged-in user
 * @returns {object|null} User session or null
 */
export function getCurrentUser() {
    try {
        // Check both localStorage and sessionStorage
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
 * Register new user
 * @param {object} userData - User registration data
 * @returns {object} User session object
 */
export function register(userData) {
    console.log('[AUTH] Registering new user:', userData.nim);
    
    // Create new user object
    const newUser = {
        id: Date.now(), // Generate unique ID
        name: userData.name,
        nim: userData.nim,
        email: userData.email,
        programStudi: userData.programStudi,
        password: userData.password
    };
    
    // Save to registered users list
    try {
        const registered = JSON.parse(localStorage.getItem('sipenotul_registered_users') || '[]');
        registered.push(newUser);
        localStorage.setItem('sipenotul_registered_users', JSON.stringify(registered));
    } catch (e) {
        console.error('[AUTH] Error saving registered user:', e);
        throw new Error('Gagal menyimpan data pengguna');
    }
    
    // Auto-login the new user
    const session = {
        id: newUser.id,
        nim: newUser.nim,
        name: newUser.name,
        email: newUser.email,
        programStudi: newUser.programStudi,
        token: 'token-' + Date.now()
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    console.log('[AUTH] Registration successful:', session.name);
    return session;
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info'
 */
export function showToast(message, type = 'info') {
    const container = document.getElementById('toasts');
    if (!container) {
        console.warn('[AUTH] Toast container not found');
        return;
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.opacity = '0';
    
    container.appendChild(toast);
    
    // Fade in
    setTimeout(() => toast.style.opacity = '1', 10);
    
    // Fade out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export all functions
export default { login, logout, getCurrentUser, isLoggedIn, requireAuth, register, showToast };
