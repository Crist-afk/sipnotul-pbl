/**
 * ============================================
 * STORAGE MODULE
 * ============================================
 * Handles note storage and retrieval using localStorage
 */

// Storage key for notes
const NOTES_KEY = 'sipenotul_notes';

// Demo notes for initial data
const DEMO_NOTES = [
    {
        id: 'NOTDEMO1',
        title: 'Rapat Koordinasi Tim Development',
        content: 'Diskusi mengenai progress pengembangan aplikasi SIPENOTUL. Tim melaporkan bahwa fitur authentication sudah selesai diimplementasi.',
        meetingDate: '2024-11-15',
        time: '14:00',
        location: 'GU 702',
        attendees: ['Demo User', 'John Doe'],
        decisions: 'Implementasi authentication selesai',
        followUp: 'Review progress minggu depan',
        followUpCompleted: false,
        createdAt: '2024-11-10T10:00:00.000Z',
        authorId: 2101,
        isPublic: true
    },
    {
        id: 'NOTDEMO2',
        title: 'Evaluasi Proyek PBL',
        content: 'Evaluasi akhir proyek PBL Gacor. Tim berhasil menyelesaikan semua requirement yang diminta.',
        meetingDate: '2024-11-12',
        time: '10:00',
        location: 'GU 706',
        attendees: ['Crist Garcia', 'Cahyati Lamona'],
        decisions: 'Proyek selesai sesuai deadline',
        followUp: 'Persiapan presentasi',
        followUpCompleted: true,
        createdAt: '2024-11-08T08:30:00.000Z',
        authorId: 2102,
        isPublic: false
    }
];

/**
 * Initialize storage with demo notes if empty
 */
function initStorage() {
    if (!localStorage.getItem(NOTES_KEY)) {
        console.log('[STORAGE] Initializing with demo notes');
        localStorage.setItem(NOTES_KEY, JSON.stringify(DEMO_NOTES));
    }
}

/**
 * Get all notes
 * @returns {array} Array of all notes
 */
export function getAllNotes() {
    initStorage();
    try {
        return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
    } catch (e) {
        console.error('[STORAGE] Error reading notes:', e);
        return [];
    }
}

/**
 * Get notes by author ID
 * @param {number} authorId - Author's database ID
 * @returns {array} Array of notes by this author
 */
export function getNotesByAuthor(authorId) {
    return getAllNotes().filter(note => note.authorId === authorId);
}

/**
 * Get single note by ID
 * @param {string} id - Note ID
 * @returns {object|null} Note object or null
 */
export function getNoteById(id) {
    return getAllNotes().find(note => note.id === id) || null;
}

/**
 * Save note (create or update)
 * @param {object} note - Note object
 * @returns {object} Saved note
 */
export function saveNote(note) {
    const notes = getAllNotes();
    const now = new Date().toISOString();
    
    if (!note.id) {
        // Create new note
        note.id = 'NOT' + Date.now();
        note.createdAt = now;
        notes.unshift(note); // Add to beginning
        console.log('[STORAGE] Created new note:', note.id);
    } else {
        // Update existing note
        const index = notes.findIndex(n => n.id === note.id);
        if (index >= 0) {
            note.updatedAt = now;
            notes[index] = { ...notes[index], ...note };
            console.log('[STORAGE] Updated note:', note.id);
        }
    }
    
    // Save to localStorage
    try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
        console.error('[STORAGE] Error saving note:', e);
        throw new Error('Gagal menyimpan notulen');
    }
    
    return note;
}

/**
 * Delete note by ID
 * @param {string} id - Note ID
 * @returns {boolean} True if deleted
 */
export function deleteNote(id) {
    const notes = getAllNotes();
    const filtered = notes.filter(note => note.id !== id);
    
    try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
        console.log('[STORAGE] Deleted note:', id);
        return true;
    } catch (e) {
        console.error('[STORAGE] Error deleting note:', e);
        return false;
    }
}

/**
 * Get user by ID (for display purposes)
 * @param {number} id - User database ID
 * @returns {object|null} User object or null
 */
export function getUserById(id) {
    const DEMO_USERS = [
        { id: 2101, name: 'Demo User' },
        { id: 2102, name: 'Crist Garcia Pasaribu' },
        { id: 2103, name: 'Cahyati Lamona Sitohang' },
        { id: 2104, name: 'Fazri Rahman' },
        { id: 2105, name: 'Takanashi Hoshino' }
    ];
    return DEMO_USERS.find(user => user.id === id) || null;
}

// Export all functions
export default { getAllNotes, getNotesByAuthor, getNoteById, saveNote, deleteNote, getUserById };
