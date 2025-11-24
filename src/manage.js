import { requireAuth, getCurrentUser, logout } from './auth.js';
import { getAllNotes, getNotesByAuthor, deleteNote } from './storage.js';

// State
let currentSort = 'newest';
let searchQuery = '';

// Update stats
function updateStats() {
    const user = getCurrentUser();
    const userNotes = getNotesByAuthor(user.id);

    const total = userNotes.length;
    const publicCount = userNotes.filter(note => note.isPublic).length;
    const privateCount = total - publicCount;

    document.getElementById('totalNotes').textContent = total;
    document.getElementById('publicNotes').textContent = publicCount;
    document.getElementById('privateNotes').textContent = privateCount;
}

// Filter and sort notes
function getFilteredNotes() {
    const user = getCurrentUser();
    let notes = getNotesByAuthor(user.id);

    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        notes = notes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            (note.location && note.location.toLowerCase().includes(query))
        );
    }

    // Apply sorting
    notes.sort((a, b) => {
        switch (currentSort) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'title':
                return a.title.localeCompare(b.title);
            case 'meeting':
                if (!a.meetingDate && !b.meetingDate) return 0;
                if (!a.meetingDate) return 1;
                if (!b.meetingDate) return -1;
                return new Date(a.meetingDate) - new Date(b.meetingDate);
            default:
                return 0;
        }
    });

    return notes;
}

// Render notes
function renderNotes() {
    const notes = getFilteredNotes();
    const container = document.getElementById('notesContainer');
    const emptyState = document.getElementById('emptyState');

    if (notes.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';

    container.innerHTML = notes.map(note => `
        <div class="note-card manage-card">
            <div class="note-header">
                <div class="note-title">${note.title}</div>
                <div class="note-badges">
                    ${note.isPublic ?
                        '<span class="badge badge-success">Publik</span>' :
                        '<span class="badge badge-secondary">Privat</span>'
                    }
                </div>
            </div>

            <div class="note-meta">
                <div class="meta-item">
                    <i class="icon">📅</i>
                    Dibuat: ${new Date(note.createdAt).toLocaleDateString('id-ID')}
                </div>
                ${note.meetingDate ? `
                    <div class="meta-item">
                        <i class="icon">📆</i>
                        Rapat: ${new Date(note.meetingDate).toLocaleDateString('id-ID')}
                        ${note.time ? `pukul ${note.time}` : ''}
                    </div>
                ` : ''}
                ${note.location ? `
                    <div class="meta-item">
                        <i class="icon">📍</i>
                        ${note.location}
                    </div>
                ` : ''}
            </div>

            <div class="note-content-preview">
                ${note.content?.substring(0, 150) || 'Tidak ada deskripsi'}...
            </div>

            <div class="note-actions">
                <button class="btn small" onclick="window.location.href='viewer.html?code=${note.id}'">
                    <i class="icon">👁️</i> Lihat
                </button>
                <button class="btn small" onclick="window.location.href='editor.html?id=${note.id}'">
                    <i class="icon">✏️</i> Edit
                </button>
                <button class="btn small danger" onclick="deleteNoteHandler('${note.id}')">
                    <i class="icon">🗑️</i> Hapus
                </button>
            </div>
        </div>
    `).join('');
}

// Delete note handler
function deleteNoteHandler(noteId) {
    if (confirm('Apakah Anda yakin ingin menghapus notulen ini? Tindakan ini tidak dapat dibatalkan.')) {
        deleteNote(noteId);
        updateStats();
        renderNotes();
        showToast('Notulen berhasil dihapus', 'success');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toasts = document.getElementById('toasts');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    toasts.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Theme toggle functionality
function applyTheme(isDark) {
    if (isDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    localStorage.setItem('sip_theme_dark', isDark ? '1' : '0');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;

    // Load saved theme
    const stored = localStorage.getItem('sip_theme_dark');
    if (stored === '1') {
        applyTheme(true);
    }

    updateStats();
    renderNotes();

    // Update user info
    const user = getCurrentUser();
    document.getElementById('userName').textContent = user.name;

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderNotes();
    });

    // Sort functionality
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderNotes();
    });

    // Event handlers
    document.getElementById('newNoteBtn').addEventListener('click', () => {
        window.location.href = 'editor.html';
    });

    document.getElementById('createFirstNoteBtn').addEventListener('click', () => {
        window.location.href = 'editor.html';
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Anda yakin ingin keluar?')) {
            logout();
        }
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark');
        applyTheme(isDark);
    });

    // User menu dropdown toggle
    document.getElementById('userMenuBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelector('.user-menu').classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            document.querySelector('.user-menu').classList.remove('open');
        }
    });
});
