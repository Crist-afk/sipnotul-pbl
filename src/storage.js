const NOTES_KEY = 'sipenotul_notes';
const USERS_KEY = 'sipenotul_users';

// Demo notes for testing
const DEMO_NOTES = [
    {
        id: 'NOTDEMO1',
        title: 'Rapat Koordinasi Tim Development',
        content: 'Diskusi mengenai progress pengembangan aplikasi SIPENOTUL. Tim melaporkan bahwa fitur authentication sudah selesai diimplementasi. Selanjutnya akan fokus pada pengembangan fitur notulen otomatis.',
        meetingDate: '2024-10-25',
        time: '14:00',
        location: 'GU 702',
        attendees: ['Demo User', 'John Doe', 'Jane Smith'],
        decisions: ['Implementasi authentication selesai', 'Fokus pada fitur notulen otomatis'],
        followUp: 'Review progress minggu depan',
        followUpCompleted: false,
        createdAt: '2024-10-20T10:00:00.000Z',
        authorId: 2101,
        isPublic: true
    },
    {
        id: 'NOTDEMO2',
        title: 'Evaluasi Proyek PBL Gacor',
        content: 'Evaluasi akhir proyek PBL Gacor. Tim berhasil menyelesaikan semua requirement yang diminta. Aplikasi sudah berjalan dengan baik di localhost.',
        meetingDate: '2024-10-22',
        time: '10:00',
        location: 'GU 706',
        attendees: ['Crist Garcia Pasaribu', 'Cahyati Lamona Sitohang'],
        decisions: ['Proyek selesai sesuai deadline', 'Presentasi final minggu depan'],
        followUp: 'Persiapan presentasi',
        followUpCompleted: true,
        createdAt: '2024-10-15T08:30:00.000Z',
        authorId: 2102,
        isPublic: false
    },
    {
        id: 'NOTDEMO3',
        title: 'Planning Sprint Baru',
        content: 'Perencanaan sprint baru untuk pengembangan fitur-fitur tambahan. Prioritas utama adalah meningkatkan user experience dan menambahkan fitur export notulen.',
        meetingDate: '2024-10-28',
        time: '09:00',
        location: 'Gedung Technopreneur Lantai 2',
        attendees: ['Fazri Rahman', 'Crist Garcia Pasaribu'],
        decisions: ['Prioritas UX improvement', 'Tambah fitur export PDF'],
        followUp: 'Kickoff sprint hari Senin',
        followUpCompleted: false,
        createdAt: '2024-10-18T14:20:00.000Z',
        authorId: 2104,
        isPublic: true
    },
    {
        id: 'NOTDEMO4',
        title: 'Review Design System',
        content: 'Review dan finalisasi design system untuk aplikasi. Semua komponen sudah konsisten dan mengikuti prinsip design yang baik.',
        meetingDate: '2024-10-20',
        time: '13:00',
        location: 'RTF',
        attendees: ['Fazri Rahman', 'Cahyati Lamona Sitohang'],
        decisions: ['Design system final', 'Implementasi di seluruh aplikasi'],
        followUp: 'Training tim development',
        followUpCompleted: true,
        createdAt: '2024-10-12T11:15:00.000Z',
        authorId: 2103,
        isPublic: true
    },
    {
        id: 'NOTDEMO5',
        title: 'Demo Aplikasi SIPENOTUL',
        content: 'Demo aplikasi SIPENOTUL kepada stakeholder. Menampilkan fitur-fitur utama seperti pembuatan notulen, manajemen rapat, dan dashboard analytics.',
        meetingDate: '2024-10-30',
        time: '15:00',
        location: 'Auditorium',
        attendees: ['User', 'Demo User', 'John Doe'],
        decisions: ['Demo berhasil', 'Feedback positif dari stakeholder'],
        followUp: 'Implementasi feedback',
        followUpCompleted: false,
        createdAt: '2024-10-25T16:45:00.000Z',
        authorId: 2101,
        isPublic: false
    },
    {
        id: 'NOTDEMO6',
        title: 'Maintenance Server',
        content: 'Jadwal maintenance server untuk update security dan performance improvement. Aplikasi akan offline selama 2 jam.',
        meetingDate: '2024-11-01',
        time: '22:00',
        location: 'GU 502',
        attendees: ['Fazri Rahman'],
        decisions: ['Maintenance dijadwalkan malam hari', 'Backup data lengkap'],
        followUp: 'Test aplikasi setelah maintenance',
        followUpCompleted: false,
        createdAt: '2024-10-22T09:10:00.000Z',
        authorId: 2104,
        isPublic: true
    }
];

export function generateId(prefix = 'NOT') {
    return `${prefix}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

export function saveNote(note) {
    const notes = getAllNotes();
    const now = new Date().toISOString();

    if (!note.id) {
        note.id = generateId();
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

export function getAllNotes() {
    try {
        const stored = localStorage.getItem(NOTES_KEY);
        if (stored) {
            return JSON.parse(stored);
        } else {
            // Initialize with demo notes if none exist
            localStorage.setItem(NOTES_KEY, JSON.stringify(DEMO_NOTES));
            return DEMO_NOTES;
        }
    } catch {
        return DEMO_NOTES;
    }
}

export function getNoteById(id) {
    return getAllNotes().find(note => note.id === id);
}

export function getNotesByAuthor(authorId) {
    return getAllNotes().filter(note => note.authorId === authorId);
}

export function deleteNote(id) {
    const notes = getAllNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    localStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));
    return true;
}

export function getUserById(id) {
    // For demo, get user from DEMO_USERS in auth.js
    // Since we can't import from auth.js due to circular dependency, we'll hardcode for now
    const DEMO_USERS = [
        { id: 2101, name: 'Demo User', email: 'demo@email.com', role: 'admin' },
        { id: 2102, name: 'Crist Garcia Pasaribu', email: 'crist@email.com', role: 'user' },
        { id: 2103, name: 'Cahyati Lamona Sitohang', email: 'cahyati@email.com', role: 'user' },
        { id: 2104, name: 'Fazri Rahman', email: 'fazri@email.com', role: 'moderator' },
        { id: 2105, name: 'Takanashi Hoshino', email: 'hoshinotakanashi@buruaka.com', role: 'admin' }
    ];
    return DEMO_USERS.find(user => user.id === id);
}
