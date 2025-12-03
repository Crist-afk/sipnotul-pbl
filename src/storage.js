/**
 * ============================================
 * STORAGE MODULE
 * ============================================
 * Handles note storage and retrieval using localStorage
 */

// Storage keys
const NOTES_KEY = 'sipenotul_notes';
const MEETINGS_KEY = 'sipenotul_meetings';

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
 * Get all meetings
 * @returns {array} Array of all meetings
 */
export function getAllMeetings() {
    try {
        return JSON.parse(localStorage.getItem(MEETINGS_KEY) || '[]');
    } catch (e) {
        console.error('[STORAGE] Error reading meetings:', e);
        return [];
    }
}

/**
 * Get meetings for a specific user (either created by them or they're invited to)
 * @param {number} userId - User's database ID
 * @returns {array} Array of meetings
 */
export function getMeetingsForUser(userId) {
    const allMeetings = getAllMeetings();
    return allMeetings.filter(meeting => 
        meeting.authorId === userId || // Created by user
        meeting.isPublic || // Public meeting
        (meeting.invitedUsers && meeting.invitedUsers.includes(userId)) // Invited to meeting
    );
}

/**
 * Save meeting (create or update)
 * @param {object} meeting - Meeting object
 * @returns {object} Saved meeting
 */
export function saveMeeting(meeting) {
    const meetings = getAllMeetings();
    const now = new Date().toISOString();
    
    if (!meeting.id) {
        // Create new meeting
        meeting.id = 'MTG' + Date.now();
        meeting.createdAt = now;
        meeting.type = 'meeting'; // Mark as meeting
        meetings.unshift(meeting);
        console.log('[STORAGE] Created new meeting:', meeting.id);
    } else {
        // Update existing meeting
        const index = meetings.findIndex(m => m.id === meeting.id);
        if (index >= 0) {
            meeting.updatedAt = now;
            meetings[index] = { ...meetings[index], ...meeting };
            console.log('[STORAGE] Updated meeting:', meeting.id);
        }
    }
    
    // Save to localStorage
    try {
        localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
    } catch (e) {
        console.error('[STORAGE] Error saving meeting:', e);
        throw new Error('Gagal menyimpan rapat');
    }
    
    return meeting;
}

/**
 * Delete meeting by ID
 * @param {string} id - Meeting ID
 * @returns {boolean} True if deleted
 */
export function deleteMeeting(id) {
    const meetings = getAllMeetings();
    const filtered = meetings.filter(meeting => meeting.id !== id);
    
    try {
        localStorage.setItem(MEETINGS_KEY, JSON.stringify(filtered));
        console.log('[STORAGE] Deleted meeting:', id);
        return true;
    } catch (e) {
        console.error('[STORAGE] Error deleting meeting:', e);
        return false;
    }
}

/**
 * Get all users (for participant selection)
 * @returns {array} Array of all users
 */
export function getAllUsers() {
    const DEMO_USERS = [
        { id: 2101, name: 'Demo User', nim: '01' },
        { id: 2102, name: 'Crist Garcia Pasaribu', nim: '3312501041' },
        { id: 2103, name: 'Cahyati Lamona Sitohang', nim: '3312501040' },
        { id: 2104, name: 'Fazri Rahman', nim: '3312501038' },
        { id: 2105, name: 'Takanashi Hoshino', nim: '2006' }
    ];
    
    // Add registered users
    try {
        const registered = JSON.parse(localStorage.getItem('sipenotul_registered_users') || '[]');
        return [...DEMO_USERS, ...registered];
    } catch (e) {
        return DEMO_USERS;
    }
}

/**
 * Get user by ID (for display purposes)
 * @param {number} id - User database ID
 * @returns {object|null} User object or null
 */
export function getUserById(id) {
    const allUsers = getAllUsers();
    return allUsers.find(user => user.id === id) || null;
}

// Export all functions
export default { 
    getAllNotes, getNotesByAuthor, getNoteById, saveNote, deleteNote, 
    getAllMeetings, getMeetingsForUser, saveMeeting, deleteMeeting,
    getAllUsers, getUserById 
};
