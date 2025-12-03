/**
 * SIMPLE LOGIN HANDLER - Rebuilt from scratch
 * Handles login form submission on index.html
 */

console.log('Login.js loaded');

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up login handler');
    
    // Get the login form
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.log('Login form not found');
        return;
    }
    
    console.log('Login form found, attaching submit handler');
    
    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        
        // Get form values
        const nimInput = document.getElementById('nim');
        const passwordInput = document.getElementById('password');
        const rememberInput = document.getElementById('remember');
        
        const nim = nimInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberInput.checked;
        
        console.log('Login attempt:', { nim, remember });
        
        // Simple validation
        if (!nim) {
            alert('Mohon masukkan NIM');
            return;
        }
        
        if (!password) {
            alert('Mohon masukkan password');
            return;
        }
        
        // Show loading
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        try {
            // Import login function
            const { login } = await import('./auth.js');
            
            // Attempt login
            const user = await login(nim, password, remember);
            
            console.log('Login successful:', user);
            
            // Show success message
            alert(`Login berhasil! Selamat datang, ${user.name}`);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message || 'Login gagal. Periksa NIM dan password Anda.');
            
            // Restore button
            loginBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
    
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePassword.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                togglePassword.textContent = '👁️';
            }
        });
    }
});
