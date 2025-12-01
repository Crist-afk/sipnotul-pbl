/**
 * Dashboard Module
 * Displays user's notes, statistics, and upcoming meetings
 * 
 * Key Concepts:
 * - Uses user.id (database ID) to filter notes by author
 * - Displays user.name for greeting
 * - Shows statistics and recent activity
 */

import { requireAuth, getCurrentUser, logout } from './auth.js';
import { getAllNotes, getNotesByAuthor, deleteNote } from './storage.js';

/**
 * Update dashboard statistics
 * Calculates and displays:
 * - Total notes created by user
 * - Notes created this week
 * - Pending tasks/follow-ups
 * 
 * Note: Uses user.id (not NIM) to filter notes because notes are linked
 * to users by their database ID (authorId)
 */
function updateDashboard() {
    // Get current logged-in user (contains both id and nim)
    const user = getCurrentUser();
    
    // Get all notes from storage
    const allNotes = getAllNotes();
    
    // Filter notes by author using database ID (not NIM)
    // Notes are stored with authorId which matches user.id
    const userNotes = getNotesByAuthor(user.id);
    
    // Calculate week start date for "this week" filter
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));

    // Calculate statistics
    const stats = {
        total: userNotes.length,
        thisWeek: userNotes.filter(note => new Date(note.createdAt) >= weekStart).length,
        pendingTasks: userNotes.filter(note => note.followUp && !note.followUpCompleted).length
    };

    // Update DOM elements with calculated stats
    document.getElementById('totalNotes').textContent = stats.total;
    document.getElementById('weeklyMeetings').textContent = stats.thisWeek;
    document.getElementById('pendingTasks').textContent = stats.pendingTasks;
}

/**
 * Render upcoming meetings section
 * Shows next 5 meetings that haven't occurred yet
 * Sorted by meeting date (earliest first)
 */
function renderUpcomingMeetings() {
    // Get all notes (meetings) from storage
    const notes = getAllNotes();
    
    // Filter for future meetings and sort by date
    const upcoming = notes
        .filter(note => note.meetingDate && new Date(note.meetingDate) > new Date())
        .sort((a, b) => new Date(a.meetingDate) - new Date(b.meetingDate))
        .slice(0, 5); // Show only next 5 meetings

    // Get container element
    const container = document.getElementById('upcomingMeetings');
    
    // Generate HTML for each meeting
    container.innerHTML = upcoming.map(note => `
        <div class="meeting-item">
            <div class="meeting-date">
                <div class="meeting-day">${new Date(note.meetingDate).getDate()}</div>
                <div class="meeting-month">${new Date(note.meetingDate).toLocaleString('id', {month: 'short'})}</div>
            </div>
            <div class="meeting-info">
                <h4>${note.title}</h4>
                <div class="meeting-time">${note.time || 'TBD'} - ${note.location || 'TBD'}</div>
            </div>
        </div>
    `).join('') || '<p class="text-muted">Tidak ada rapat mendatang</p>';
}

/**
 * Render recent notes section
 * Shows user's most recent notes (up to 6 by default)
 * 
 * @param {boolean} showAll - If true, show all notes; if false, show only 6
 * 
 * Note: Filters notes by user.id (database ID) because notes are linked
 * to users via authorId field
 */
function renderRecentNotes(showAll = false) {
    // Get current user (contains id and nim)
    const user = getCurrentUser();
    
    // Get all notes
    const allNotes = getAllNotes();
    
    // Filter notes by author using database ID
    const userNotes = getNotesByAuthor(user.id);
    
    // Limit to 6 notes unless showAll is true
    const notes = showAll ? userNotes : userNotes.slice(0, 6);
    
    // Get container element
    const container = document.getElementById('recentNotes');

    // Generate HTML for each note card
    container.innerHTML = notes.map(note => `
        <div class="note-card">
            <div>
                <div class="note-title">${note.title}</div>
                <div class="note-meta" style="font-size:0.85rem;color:var(--text-muted)">${new Date(note.createdAt).toLocaleString()}</div>
            </div>
            <div class="note-content">${note.content?.substring(0, 100) || ''}...</div>
            <div style="display:flex;gap:0.5rem;justify-content:flex-end;margin-top:0.5rem">
                <button class="btn small" onclick="window.location.href='viewer.html?code=${note.id}'">Lihat</button>
                <button class="btn small" onclick="window.location.href='editor.html?id=${note.id}'">Edit</button>
                <button class="btn small danger" onclick="deleteNoteHandler('${note.id}')">Hapus</button>
            </div>
        </div>
    `).join('') || '<p class="text-muted">Belum ada notulen</p>';
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
 * 3. Refresh dashboard statistics
 * 4. Re-render notes and meetings lists
 */
window.deleteNoteHandler = function(noteId) {
    // Confirm before deleting
    if (confirm('Apakah Anda yakin ingin menghapus notulen ini?')) {
        // Delete from storage
        deleteNote(noteId);
        
        // Refresh all dashboard sections
        updateDashboard();
        renderRecentNotes();
        renderUpcomingMeetings();
    }
}

/**
 * Initialize dashboard when DOM is loaded
 * 
 * Flow:
 * 1. Check authentication (redirect to login if not authenticated)
 * 2. Load and display dashboard data
 * 3. Set up event listeners for buttons
 * 4. Display user information
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated, show login modal if not
    if (!requireAuth()) return;

    // Load dashboard data
    updateDashboard();
    renderUpcomingMeetings();
    renderRecentNotes();

    // Update user info in header
    // Uses user.name (not NIM) for display
    const user = getCurrentUser();
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userFullName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role;

    /**
     * Set up event listeners for buttons
     * All buttons are checked for existence before adding listeners
     * to prevent errors if elements don't exist
     */
    
    // "Buat Notulen" button in header
    const newNoteBtn = document.getElementById('newNoteBtn');
    if (newNoteBtn) {
        newNoteBtn.addEventListener('click', () => {
            window.location.href = 'editor.html';
        });
    }

    // "Buat Notulen Baru" button in quick actions
    const newNoteBtn2 = document.getElementById('newNoteBtn2');
    if (newNoteBtn2) {
        newNoteBtn2.addEventListener('click', () => {
            window.location.href = 'editor.html';
        });
    }

    // "Lihat Semua Notulen" button
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            window.location.href = 'manage.html';
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
