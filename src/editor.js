import { requireAuth, getCurrentUser, showToast } from './auth.js';
import { saveNote, getNoteById } from './storage.js';

let currentNote = null;
let saveTimeout = null;

// Auto-save functionality
function initAutoSave() {
    const form = document.getElementById('noteForm');
    const fields = form.querySelectorAll('input, textarea');

    fields.forEach(field => {
        field.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            updateStatus('Menyimpan...', 'pending');

            saveTimeout = setTimeout(handleSave, 1000);
        });
    });
}

function handleSave() {
    const form = document.getElementById('noteForm');
    const formData = new FormData(form);

    const noteData = {
        id: currentNote?.id,
        title: formData.get('title'),
        meetingDate: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        attendees: formData.get('attendees').split('\n').filter(Boolean),
        agenda: formData.get('agenda'),
        content: formData.get('discussion'),
        decisions: formData.get('decisions'),
        followUp: formData.get('tasks'),
        isPublic: formData.get('isPublic') === 'on',
        authorId: getCurrentUser().id,
        updatedAt: new Date().toISOString()
    };

    try {
        const saved = saveNote(noteData);
        currentNote = saved;
        updateStatus('Tersimpan', 'success');

        // Update URL if new note
        if (!currentNote?.id) {
            window.history.replaceState({}, '', `?id=${saved.id}`);
        }
    } catch (err) {
        updateStatus('Gagal menyimpan', 'error');
        showToast(err.message, 'error');
    }
}

function updateStatus(message, type) {
    const status = document.getElementById('saveStatus');
    status.innerHTML = `<span class="status-dot ${type}"></span>${message}`;
}

function populateForm(note) {
    document.getElementById('title').value = note.title || '';
    document.getElementById('date').value = note.meetingDate || '';
    document.getElementById('time').value = note.time || '';
    document.getElementById('location').value = note.location || '';
    document.getElementById('attendees').value = note.attendees?.join('\n') || '';
    document.getElementById('agenda').value = note.agenda || '';
    document.getElementById('discussion').value = note.content || '';
    document.getElementById('decisions').value = note.decisions || '';
    document.getElementById('tasks').value = note.followUp || '';
    document.getElementById('isPublic').checked = note.isPublic || false;
}

// Event handlers
document.getElementById('saveBtn').addEventListener('click', handleSave);

document.getElementById('shareBtn').addEventListener('click', () => {
    if (!currentNote?.id) return;

    const url = `${location.origin}/viewer.html?code=${currentNote.id}`;
    navigator.clipboard.writeText(url);
    showToast('Link notulen disalin ke clipboard');
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;

    // Load existing note if ID in URL
    const params = new URLSearchParams(location.search);
    const noteId = params.get('id');

    if (noteId) {
        try {
            currentNote = getNoteById(noteId);
            if (currentNote) {
                populateForm(currentNote);
                document.getElementById('editorTitle').textContent = 'Edit Notulen';
            }
        } catch (err) {
            showToast('Notulen tidak ditemukan', 'error');
            window.location.href = '/dashboard.html';
        }
    }

    initAutoSave();
});
