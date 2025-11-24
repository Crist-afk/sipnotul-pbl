import { getCurrentUser, updateProfile, showToast, requireAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;

    const user = getCurrentUser();

    // Populate form with user data
    document.getElementById('name').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('role').value = user.role || '';

    // Handle profile updates
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            name: form.name.value,
            email: form.email.value,
            role: form.role.value
        };

        try {
            updateProfile(data);
            showToast('Profil berhasil diperbarui', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
});
