export function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
    });
}

export function formatTime(time) {
    return time.replace(/(:\d{2}| [AP]M)$/, '');
}

export function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.className = 'toast', 3000);
}
