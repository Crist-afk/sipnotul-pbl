// Simple auth helper untuk demo
const AUTH_KEY = 'sipenotul_auth';
const API_URL = 'http://localhost:3000/api'; // Replace with real API URL

// Demo users for testing
const DEMO_USERS = [
    {
        id: 2101,
        name: 'Demo User',
        email: 'demo@email.com',
        password: 'Admin123',
        role: 'admin'
    },
    {
        id: 2102,
        name: 'Crist Garcia Pasaribu',
        email: 'crist@email.com',
        password: 'Crist123',
        role: 'user'
    },
    {
        id: 2103,
        name: 'Cahyati Lamona Sitohang',
        email: 'cahyati@email.com',
        password: 'Cahyati123',
        role: 'user'
    },
    {
        id: 2104,
        name: 'Fazri Rahman',
        email: 'fazri@email.com',
        password: 'Fazri123',
        role: 'moderator'
    },
    {
        id: 2105,
        name: 'Takanashi Hoshino',
        email: 'hoshinotakanashi@buruaka.com',
        password: 'Admin123',
        role: 'admin'
    }
];

export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    const container = document.getElementById('toasts');
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export async function login(email, password, remember = false) {
    // For demo, replace with real API call
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (user) {
        const { password: _, ...userData } = user; // Remove password from stored data
        const userWithToken = { ...userData, token: `demo-${Date.now()}` };
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(AUTH_KEY, JSON.stringify(userWithToken));
        return userWithToken;
    }
    throw new Error('Email atau password salah');
}

export function logout() {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    location.href = '/login.html';
}

export function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY));
    } catch {
        return null;
    }
}

export function isLoggedIn() {
    return !!getCurrentUser();
}

export function requireAuth() {
    if (!getCurrentUser()) {
        location.href = '/login.html';
        return false;
    }
    return true;
}

export function updateProfile(data) {
    const user = getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const updatedUser = { ...user, ...data };
    const storage = localStorage.getItem(AUTH_KEY) ? localStorage : sessionStorage;
    storage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
    return updatedUser;
}

// Check auth on protected pages
if (!(window.location.pathname.includes('login.html') ||
      window.location.pathname.includes('register.html') ||
      window.location.pathname.includes('viewer.html') ||
      window.location.pathname.includes('index.html') ||
      window.location.pathname === '/')) {
    // Only require auth if not already logged in
    if (!isLoggedIn()) {
        requireAuth();
    }
}

export async function checkAuthStatus() {
    return getCurrentUser();
}

// Debug: Log current auth status
console.log('Auth check:', {
    pathname: window.location.pathname,
    isLoggedIn: isLoggedIn(),
    currentUser: getCurrentUser()
});

export default { login, logout, getCurrentUser, isLoggedIn, requireAuth, updateProfile, showToast };
