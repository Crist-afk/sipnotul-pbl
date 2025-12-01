document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return; // Skip if register form doesn't exist on this page

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
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    function hideError(fieldId) {
        const errorEl = document.getElementById(fieldId + 'Error');
        if (errorEl) {
            errorEl.style.display = 'none';
        }
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

        const firstNameEl = document.getElementById('firstName');
        const lastNameEl = document.getElementById('lastName');
        const nimEl = document.getElementById('nimReg');
        const emailEl = document.getElementById('email');
        const programStudiEl = document.getElementById('programStudi');
        const passwordEl = document.getElementById('passwordReg');
        const confirmPasswordEl = document.getElementById('confirmPassword');

        const firstName = firstNameEl ? firstNameEl.value.trim() : '';
        const lastName = lastNameEl ? lastNameEl.value.trim() : '';
        const nim = nimEl ? nimEl.value.trim() : '';
        const email = emailEl ? emailEl.value.trim() : '';
        const programStudi = programStudiEl ? programStudiEl.value.trim() : '';
        const password = passwordEl ? passwordEl.value : '';
        const confirmPassword = confirmPasswordEl ? confirmPasswordEl.value : '';
        const accountType = document.querySelector('input[name="accountType"]:checked') || null;

        let isValid = true;

        // Clear previous errors
        ['firstName', 'lastName', 'nimReg', 'email', 'programStudi', 'passwordReg', 'confirmPassword', 'accountType'].forEach(field => hideError(field));

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

        // Validate NIM
        if (!nim) {
            showError('nim', 'NIM wajib diisi');
            isValid = false;
        } else if (!/^\d+$/.test(nim)) {
            showError('nim', 'NIM harus berupa angka');
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

        // Validate program studi
        if (!programStudi) {
            showError('programStudi', 'Program studi wajib diisi');
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

        // Validate account type
        if (!accountType) {
            showError('accountType', 'Tipe akun wajib dipilih');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading
        const btn = document.getElementById('registerBtn');
        if (btn) {
            const btnText = btn.querySelector('.btn-text');
            const btnLoading = btn.querySelector('.btn-loading');
            btn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline';
        }

        try {
            // Import register function and call it
            const { register } = await import('./auth.js');
            const userData = {
                name: `${firstName} ${lastName}`,
                nim: nim,
                email: email,
                programStudi: programStudi,
                role: accountType.value,
                password: password
            };
            const user = await register(userData);

            showToast('Registrasi berhasil! Mengalihkan...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (err) {
            console.error('Registration error:', err);
            showToast(err.message || 'Terjadi kesalahan. Silakan coba lagi.', 'error');
        } finally {
            // Hide loading
            if (btn) {
                const btnText = btn.querySelector('.btn-text');
                const btnLoading = btn.querySelector('.btn-loading');
                btn.disabled = false;
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
            }
        }
    });
});
