import { getNoteById, getUserById } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (!code) {
        showError('Kode notulen tidak valid');
        return;
    }

    try {
        const note = getNoteById(code);
        if (!note || (!note.isPublic && !getCurrentUser())) {
            throw new Error('Notulen tidak ditemukan atau private');
        }
        renderNote(note);
    } catch (err) {
        showError(err.message);
    }
});

function renderNote(note) {
    const author = getUserById(note.authorId);
    const authorName = author ? author.name : note.author || 'Tidak diketahui';
    const authorRole = author ? author.role : '';

    const content = document.getElementById('noteContent');
    content.innerHTML = `
        <div class="note-header">
            <h1>${note.title}</h1>
            <div class="note-meta">
                <span>Tanggal: ${formatDate(note.meetingDate)}</span>
                <span>Tempat: ${note.location || 'TBD'}</span>
            </div>
        </div>

        <div class="note-section">
            <h2>Agenda</h2>
            <p>${note.agenda || 'Tidak ada agenda'}</p>
        </div>

        <div class="note-section">
            <h2>Hasil Pembahasan</h2>
            <p>${note.content || 'Tidak ada pembahasan'}</p>
        </div>

        ${note.decisions ? `
        <div class="note-section">
            <h2>Keputusan</h2>
            <p>${note.decisions}</p>
        </div>
        ` : ''}

        ${note.followUp ? `
        <div class="note-section">
            <h2>Tindak Lanjut</h2>
            <p>${note.followUp}</p>
        </div>
        ` : ''}

        <div class="note-footer">
            <small>Dibuat oleh ${authorName} pada ${formatDate(note.createdAt)}</small>
        </div>
    `;
}

function showError(message) {
    const content = document.getElementById('noteContent');
    content.innerHTML = `
        <div class="error-message">
            <h2>Oops!</h2>
            <p>${message}</p>
            <a href="/" class="btn">Kembali ke Beranda</a>
        </div>
    `;
}

function formatDate(date) {
    if (!date) return 'Tidak diketahui';
    return new Date(date).toLocaleDateString('id-ID', {
        dateStyle: 'long'
    });
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('sipenotul_auth') || sessionStorage.getItem('sipenotul_auth'));
    } catch {
        return null;
    }
}
