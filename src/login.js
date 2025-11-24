import { login, showToast } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    function showError(fieldId, message) {
        const errorEl = document.getElementById(fieldId + 'Error');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }

    function hideError(fieldId) {
        const errorEl = document.getElementById(fieldId + 'Error');
        errorEl.style.display = 'none';
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const input = e.target.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            e.target.textContent = type === 'password' ? '👁️' : '🙈';
        });
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        let isValid = true;

        // Clear previous errors
        ['email', 'password'].forEach(field => hideError(field));

        // Validate email
        if (!email) {
            showError('email', 'Email wajib diisi');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Format email tidak valid');
            isValid = false;
        }

        // Validate password
        if (!password) {
            showError('password', 'Kata sandi wajib diisi');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading
        const btn = document.getElementById('loginBtn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        btn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        try {
            console.log('Attempting login with:', { email, password, remember });
            const user = await login(email, password, remember);
            console.log('Login successful, user:', user);
            showToast(`Login berhasil! Selamat datang, ${user.name}`, 'success');
            setTimeout(() => {
                console.log('Redirecting to dashboard...');
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (err) {
            console.error('Login failed:', err);
            showToast(err.message, 'error');
        } finally {
            // Hide loading
            btn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
});
