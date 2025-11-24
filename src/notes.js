const NOTES_KEY = 'sipenotul_notes';

export function generateNoteId() {
    return 'NOT' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

export function getAllNotes() {
    try {
        return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
    } catch {
        return [];
    }
}

export function saveNote(note) {
    const notes = getAllNotes();
    const now = new Date().toISOString();
    
    if (!note.id) {
        note.id = generateNoteId();
        note.createdAt = now;
        notes.unshift(note);
    } else {
        const index = notes.findIndex(n => n.id === note.id);
        if (index >= 0) {
            note.updatedAt = now;
            notes[index] = { ...notes[index], ...note };
        }
    }
    
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return note;
}

export function getNoteByCode(code) {
    const notes = getAllNotes();
    const note = notes.find(n => n.id === code.toUpperCase());
    if (!note || (!note.isPublic && !getCurrentUser())) {
        throw new Error('Notulen tidak ditemukan atau private');
    }
    return note;
}
