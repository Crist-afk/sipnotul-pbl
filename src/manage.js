/**
 * Manage Notes Module
 * Provides interface for viewing, searching, sorting, and managing user's notes
 * 
 * Key Concepts:
 * - Uses user.id (database ID) to filter notes by author
 * - Provides search and sort functionality
 * - Displays public/private note statistics
 */

import { requireAuth, getCurrentUser, logout } from './auth.js';
import { getAllNotes, getNotesByAuthor, deleteNote } from './storage.js';

/**
 * Application state
 * Tracks current sort order and search query
 */
let currentSort = 'newest';  // Current sort option: 'newest', 'oldest', 'title', 'meeting'
let searchQuery = '';        // Current search query string

/**
 * Update statistics display
 * Shows total notes, public notes, and private notes counts
 * 
 * Note: Uses user.id (not NIM) to filter notes because notes are linked
 * to users by their database ID (authorId)
 */
function updateStats() {
    // Get current user (contains both id and nim)
    const user = getCurrentUser();
    
    // Get user's notes using database ID
    const userNotes = getNotesByAuthor(user.id);

    // Calculate statistics
    const total = userNotes.length;
    const publicCount = userNotes.filter(note => note.isPublic).length;
    const privateCount = total - publicCount;

    // Update DOM elements
    document.getElementById('totalNotes').textContent = total;
    document.getElementById('publicNotes').textContent = publicCount;
    document.getElementById('privateNotes').textContent = privateCount;
}

/**
 * Get filtered and sorted notes
 * Applies search filter and sort order to user's notes
 * 
 * @returns {Array} Filtered and sorted array of notes
 * 
 * Filtering:
 * - Searches in title, content, and location fields
 * - Case-insensitive search
 * 
 * Sorting options:
 * - newest: Most recent first (by createdAt)
 * - oldest: Oldest first (by createdAt)
 * - title: Alphabetical by title
 * - meeting: By meeting date (earliest first)
 */
function getFilteredNotes() {
    // Get current user
    const user = getCurrentUser();
    
    // Get user's notes using database ID
    let notes = getNotesByAuthor(user.id);

    // Apply search filter if search query exists
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        notes = notes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            (note.location && note.location.toLowerCase().includes(query))
        );
    }

    // Apply sorting based on current sort option
    notes.sort((a, b) => {
        switch (currentSort) {
            case 'newest':
                // Sort by creation date, newest first
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                // Sort by creation date, oldest first
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'title':
                // Sort alphabetically by title
                return a.title.localeCompare(b.title);
            case 'meeting':
                // Sort by meeting date
                // Notes without meeting date go to the end
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

/**
 * Delete note handler
 * Made globally accessible so it can be called from inline onclick handlers
 * 
 * @param {string} noteId - The ID of the note to delete
 * 
 * Flow:
 * 1. Show confirmation dialog
 * 2. Delete note from storage
 * 3. Refresh statistics
 * 4. Re-render notes list
 * 5. Show success toast
 */
window.deleteNoteHandler = function(noteId) {
    // Confirm before deleting (cannot be undone)
    if (confirm('Apakah Anda yakin ingin menghapus notulen ini? Tindakan ini tidak dapat dibatalkan.')) {
        // Delete from storage
        deleteNote(noteId);
        
        // Refresh UI
        updateStats();
        renderNotes();
        
        // Show success message
        showToast('Notulen berhasil dihapus', 'success');
    }
}

/**
 * Show toast notification
 * Displays a temporary message at the bottom of the screen
 * 
 * @param {string} message - The message to display
 * @param {string} type - Toast type: 'info', 'success', 'error', 'warning'
 */
function showToast(message, type = 'info') {
    // Get toast container
    const toasts = document.getElementById('toasts');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to container
    toasts.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

/**
 * Initialize manage page when DOM is loaded
 * 
 * Flow:
 * 1. Check authentication (redirect to login if not authenticated)
 * 2. Load and display notes
 * 3. Set up event listeners for search, sort, and buttons
 * 4. Display user information
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated, show login modal if not
    if (!requireAuth()) return;

    // Load initial data
    updateStats();
    renderNotes();

    // Update user info in header
    // Uses user.name (not NIM) for display
    const user = getCurrentUser();
    document.getElementById('userName').textContent = user.name;

    /**
     * Set up search functionality
     * Updates search query and re-renders notes on every input change
     */
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderNotes(); // Re-render with new search filter
        });
    }

    /**
     * Set up sort functionality
     * Updates sort order and re-renders notes when selection changes
     */
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderNotes(); // Re-render with new sort order
        });
    }

    /**
     * Set up button event listeners
     * All buttons are checked for existence before adding listeners
     */
    
    // "Buat Notulen" button in header
    const newNoteBtn = document.getElementById('newNoteBtn');
    if (newNoteBtn) {
        newNoteBtn.addEventListener('click', () => {
            window.location.href = 'editor.html';
        });
    }

    // "Buat Notulen Pertama" button (shown when no notes exist)
    const createFirstNoteBtn = document.getElementById('createFirstNoteBtn');
    if (createFirstNoteBtn) {
        createFirstNoteBtn.addEventListener('click', () => {
            window.location.href = 'editor.html';
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Anda yakin ingin keluar?')) {
                logout(); // Clears session and redirects to home
            }
        });
    }

    /**
     * User menu dropdown toggle
     * Opens/closes dropdown when clicking user menu button
     */
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling
            e.target.closest('.user-menu').classList.toggle('open');
        });
    }

    /**
     * Close dropdown when clicking outside
     * Listens for clicks anywhere on the page
     */
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            // Close all open user menus
            document.querySelectorAll('.user-menu.open').forEach(menu => {
                menu.classList.remove('open');
            });
        }
    });
});
