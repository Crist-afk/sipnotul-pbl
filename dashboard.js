import { requireAuth, getCurrentUser, logout } from './auth.js';
import { getAllNotes, getNotesByAuthor, deleteNote } from './storage.js';

// Update dashboard stats
function updateDashboard() {
    const user = getCurrentUser();
    const allNotes = getAllNotes();
    const userNotes = getNotesByAuthor(user.id);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));

    const stats = {
        total: userNotes.length,
        thisWeek: userNotes.filter(note => new Date(note.createdAt) >= weekStart).length,
        pendingTasks: userNotes.filter(note => note.followUp && !note.followUpCompleted).length
    };

    document.getElementById('totalNotes').textContent = stats.total;
    document.getElementById('weeklyMeetings').textContent = stats.thisWeek;
    document.getElementById('pendingTasks').textContent = stats.pendingTasks;
}

// Render upcoming meetings
function renderUpcomingMeetings() {
    const notes = getAllNotes();
    const upcoming = notes.filter(note => note.meetingDate && new Date(note.meetingDate) > new Date())
                        .sort((a, b) => new Date(a.meetingDate) - new Date(b.meetingDate))
                        .slice(0, 5);

    const container = document.getElementById('upcomingMeetings');
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

// Render recent notes
function renderRecentNotes(showAll = false) {
    const user = getCurrentUser();
    const allNotes = getAllNotes();
    const userNotes = getNotesByAuthor(user.id);
    const notes = showAll ? userNotes : userNotes.slice(0, 6);
    const container = document.getElementById('recentNotes');

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

// Delete note handler
function deleteNoteHandler(noteId) {
    if (confirm('Apakah Anda yakin ingin menghapus notulen ini?')) {
        deleteNote(noteId);
        updateDashboard();
        renderRecentNotes();
        renderUpcomingMeetings();
    }
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

    updateDashboard();
    renderUpcomingMeetings();
    renderRecentNotes();

    // Update user info
    const user = getCurrentUser();
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userFullName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role;

    // Event handlers - moved inside DOMContentLoaded after auth check
    document.getElementById('newNoteBtn').addEventListener('click', () => {
        console.log('New note button clicked');
        window.location.href = 'editor.html';
    });

    document.getElementById('newNoteBtn2').addEventListener('click', () => {
        console.log('New note button 2 clicked');
        window.location.href = 'editor.html';
    });

    document.getElementById('viewAllBtn').addEventListener('click', () => {
        // Navigate to manage page to show all notes
        window.location.href = 'manage.html';
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
