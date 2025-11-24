document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    function showToast(message, type = 'error') {
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

    function validatePassword(password) {
        return password.length >= 8;
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

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        let isValid = true;

        // Clear previous errors
        ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'terms'].forEach(field => hideError(field));

        // Validate first name
        if (!firstName) {
            showError('firstName', 'Nama depan wajib diisi');
            isValid = false;
        }

        // Validate last name
        if (!lastName) {
            showError('lastName', 'Nama belakang wajib diisi');
            isValid = false;
        }

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
        } else if (!validatePassword(password)) {
            showError('password', 'Kata sandi minimal 8 karakter');
            isValid = false;
        }

        // Validate confirm password
        if (!confirmPassword) {
            showError('confirmPassword', 'Konfirmasi kata sandi wajib diisi');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'Kata sandi tidak cocok');
            isValid = false;
        }

        // Validate terms
        if (!terms) {
            showError('terms', 'Anda harus menyetujui syarat & ketentuan');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading
        const btn = document.getElementById('registerBtn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        btn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        try {
            // For demo, simulate registration
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store user data (in real app, this would be API call)
            const userData = {
                id: Date.now(),
                name: `${firstName} ${lastName}`,
                email: email,
                token: `demo-${Date.now()}`
            };
            localStorage.setItem('sipenotul_auth', JSON.stringify(userData));

            showToast('Registrasi berhasil! Mengalihkan...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (err) {
            showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
        } finally {
            // Hide loading
            btn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
});
