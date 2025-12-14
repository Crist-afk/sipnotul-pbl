import { requireAuth, getCurrentUser, showToast } from './auth.js';
// Hapus import storage.js karena kita beralih ke Database Server
// import { saveNote, getNoteById } from './storage.js'; 

let currentNoteId = null;
let saveTimeout = null;

// ==========================================
// 1. AUTO-SAVE FUNCTIONALITY
// ==========================================
function initAutoSave() {
    const form = document.getElementById('noteForm');
    const fields = form.querySelectorAll('input, textarea');

    fields.forEach(field => {
        field.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            updateStatus('Mengetik...', 'pending');

            // Tunggu 1.5 detik setelah berhenti mengetik baru simpan (Debounce)
            saveTimeout = setTimeout(handleSave, 1500); 
        });
    });
}

// ==========================================
// 2. SAVE LOGIC (Ke PHP)
// ==========================================
async function handleSave() {
    const user = getCurrentUser();
    const form = document.getElementById('noteForm');
    const formData = new FormData(form);

    // Tambahkan data user yang sedang login
    formData.append('authorNim', user.nim || user.id); // Pastikan auth.js menyimpan NIM/ID

    // Jika kita sedang mengedit (bukan buat baru), pastikan ID terkirim
    if (currentNoteId) {
        formData.set('idNotes', currentNoteId);
    }

    updateStatus('Menyimpan ke Database...', 'pending');

    try {
        // Kirim ke Backend PHP
        const response = await fetch('save_note.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            updateStatus('Tersimpan', 'success');
            
            // Jika ini notulen baru, server akan mengembalikan ID baru
            if (!currentNoteId && result.id) {
                currentNoteId = result.id;
                document.getElementById('idNotes').value = result.id; // Update hidden input
                
                // Ubah URL tanpa reload halaman
                const newUrl = `${window.location.pathname}?id=${result.id}`;
                window.history.replaceState({ path: newUrl }, '', newUrl);
                
                document.getElementById('editorTitle').textContent = 'Edit Notulen';
            }
        } else {
            throw new Error(result.message);
        }

    } catch (err) {
        console.error(err);
        updateStatus('Gagal menyimpan', 'error');
        showToast('Gagal menyimpan: ' + err.message, 'error');
    }
}

// ==========================================
// 3. UI HELPERS
// ==========================================
function updateStatus(message, type) {
    const status = document.getElementById('saveStatus');
    // Simple color coding based on type
    let color = '#6b7280'; // gray
    if (type === 'success') color = '#10b981'; // green
    if (type === 'error') color = '#ef4444'; // red
    
    status.innerHTML = `<span class="status-dot" style="background:${color}; display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:5px;"></span>${message}`;
}

function populateForm(note) {
    // Sesuaikan nama field dengan nama kolom di Database MySQL (tbNotesData)
    document.getElementById('title').value = note.title || '';
    document.getElementById('date').value = note.meetingDate || '';
    document.getElementById('time').value = note.time || '';
    document.getElementById('location').value = note.location || '';
    
    // Untuk attendees, karena di database mungkin belum ada relasi logic di PHP fetch, 
    // kita handle standar dulu. Jika nanti pakai tabel terpisah, logic ini perlu update.
    // Saat ini diasumsikan text biasa atau kosong.
    document.getElementById('attendees').value = ''; 

    document.getElementById('discussion').value = note.content || ''; // Perhatikan kolom 'content'
    document.getElementById('decisions').value = note.decisions || '';
    document.getElementById('tasks').value = note.followUp || '';
    
    // Checkbox logic
    document.getElementById('isPublic').checked = (note.isPublic == 1);
    
    // Set hidden ID
    document.getElementById('idNotes').value = note.idNotes;
    currentNoteId = note.idNotes;
}

// ==========================================
// 4. LOAD DATA (Dari PHP)
// ==========================================
async function loadNoteData(id) {
    try {
        updateStatus('Memuat data...', 'pending');
        const response = await fetch(`get_note_detail.php?id=${id}`);
        const result = await response.json();

        if (result.status === 'success') {
            populateForm(result.data);
            document.getElementById('editorTitle').textContent = 'Edit Notulen';
            updateStatus('Siap diedit', 'success');
        } else {
            showToast('Notulen tidak ditemukan', 'error');
            setTimeout(() => window.location.href = 'dashboard.html', 2000);
        }
    } catch (err) {
        console.error(err);
        showToast('Gagal memuat data', 'error');
    }
}

// ==========================================
// 5. EVENT LISTENERS & INIT
// ==========================================

// Tombol Simpan Manual
document.getElementById('saveBtn').addEventListener('click', handleSave);

// Tombol Share
document.getElementById('shareBtn').addEventListener('click', () => {
    if (!currentNoteId) {
        showToast('Simpan notulen terlebih dahulu sebelum membagikan', 'warning');
        return;
    }
    const url = `${location.origin}/viewer.html?code=${currentNoteId}`;
    navigator.clipboard.writeText(url);
    showToast('Link notulen disalin ke clipboard', 'success');
});

// Saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cek Login
    if (!requireAuth()) return;

    // 2. Cek apakah Mode Edit (ada ID di URL)
    const params = new URLSearchParams(location.search);
    const noteId = params.get('id');

    if (noteId) {
        currentNoteId = noteId;
        loadNoteData(noteId);
    }

    // 3. Aktifkan Auto Save
    initAutoSave();
});