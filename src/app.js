import auth from './auth.js';

/* 
  Plain JS UI for SiPenotul demo.
  - Notes persisted in localStorage under key "sip_notes".
  - Minimal CRUD: create, list, delete all, search.
  - Modal used for create/edit (edit is left as a small extension point).
  - Theme toggled by adding/removing "dark" class on document.body.
  - Toast system with simple timeout.
*/

/* ---------- Utilities ---------- */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

/* ---------- Storage ---------- */
const STORAGE_KEY = 'sip_notes';
function loadNotes() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
	} catch (e) {
		console.error('Failed to parse notes', e);
		return [];
	}
}
function saveNotes(notes) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

/* ---------- Elements ---------- */
const notesGrid = qs('#notesGrid');
const newNoteBtn = qs('#newNoteBtn');
const modal = qs('#modal');
const modalTitle = qs('#modalTitle');
const modalClose = qs('#modalClose');
const modalCancel = qs('#modalCancel');
const modalBackdrop = qs('.modal-backdrop');
const noteForm = qs('#noteForm');
const noteTitleInput = qs('#noteTitle');
const noteContentInput = qs('#noteContent');
const themeToggle = qs('#themeToggle');
const searchInput = qs('#search');
const clearAllBtn = qs('#clearAll');
const toastsRoot = qs('#toasts');

let notes = loadNotes();
let editingId = null; // extension: implement edit by id

/* ---------- Rendering ---------- */
function createNoteCard(note) {
	const el = document.createElement('article');
	el.className = 'note-card';
	el.innerHTML = `
		<div>
			<div class="note-title">${escapeHtml(note.title)}</div>
			<div class="note-meta" style="font-size:0.85rem;color:var(--muted)">${new Date(note.created).toLocaleString()}</div>
		</div>
		<div class="note-content">${escapeHtml(note.content)}</div>
		<div style="display:flex;gap:0.5rem;justify-content:flex-end">
			<button class="btn" data-delete="${note.id}">Delete</button>
		</div>
	`;
	return el;
}

function renderNotes(filter = '') {
	notesGrid.innerHTML = '';
	const q = (filter || '').trim().toLowerCase();
	const filtered = notes.filter(n => {
		if (!q) return true;
		return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
	});
	if (filtered.length === 0) {
		const empty = document.createElement('div');
		empty.className = 'card';
		empty.innerHTML = '<p style="color:var(--muted)">No notes yet — click "New Note" to create one.</p>';
		notesGrid.appendChild(empty);
		return;
	}
	filtered.forEach(n => {
		const card = createNoteCard(n);
		notesGrid.appendChild(card);
	});
}

/* Simple HTML escape for content injection */
function escapeHtml(s){
	return String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/* ---------- Modal ---------- */
function openModal(mode = 'create', note = null) {
	modal.classList.add('show');
	modal.setAttribute('aria-hidden', 'false');
	if (mode === 'create') {
		modalTitle.textContent = 'New note';
		noteForm.reset();
		editingId = null;
	} else if (mode === 'edit' && note) {
		modalTitle.textContent = 'Edit note';
		noteTitleInput.value = note.title;
		noteContentInput.value = note.content;
		editingId = note.id;
	}
}
function closeModal() {
	modal.classList.remove('show');
	modal.setAttribute('aria-hidden', 'true');
	editingId = null;
}

/* Click outside or close buttons */
modalBackdrop.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);

/* ---------- Form submit ---------- */
noteForm.addEventListener('submit', e => {
	e.preventDefault();
	const title = noteTitleInput.value.trim();
	const content = noteContentInput.value.trim();
	if (!title || !content) {
		showToast('Please provide title and content', { type: 'warning' });
		return;
	}
	const now = Date.now();
	if (editingId) {
		// update (possible extension)
		notes = notes.map(n => n.id === editingId ? { ...n, title, content, updated: now } : n);
		showToast('Note updated');
	} else {
		const note = { id: 'n' + now, title, content, created: now };
		notes.unshift(note);
		showToast('Note saved');
	}
	saveNotes(notes);
	renderNotes(searchInput.value);
	closeModal();
});

/* ---------- Delegated delete ---------- */
notesGrid.addEventListener('click', (e) => {
	const del = e.target.closest('[data-delete]');
	if (del) {
		const id = del.getAttribute('data-delete');
		notes = notes.filter(n => n.id !== id);
		saveNotes(notes);
		renderNotes(searchInput.value);
		showToast('Note deleted');
	}
});

/* ---------- New note ---------- */
newNoteBtn.addEventListener('click', () => openModal('create'));

/* ---------- Search ---------- */
searchInput.addEventListener('input', (e) => {
	renderNotes(e.target.value);
});

/* ---------- Clear all ---------- */
clearAllBtn.addEventListener('click', () => {
	if (!confirm('Remove all notes? This cannot be undone in this demo.')) return;
	notes = [];
	saveNotes(notes);
	renderNotes();
	showToast('All notes cleared', { type: 'danger' });
});

/* ---------- Theme toggle ---------- */
function applyTheme(isDark) {
	if (isDark) document.body.classList.add('dark');
	else document.body.classList.remove('dark');
	localStorage.setItem('sip_theme_dark', isDark ? '1' : '0');
}
themeToggle.addEventListener('click', () => {
	const isDark = !document.body.classList.contains('dark');
	applyTheme(isDark);
	showToast(isDark ? 'Dark theme' : 'Light theme');
});

/* Load theme on start */
(function(){
	const stored = localStorage.getItem('sip_theme_dark');
	if (stored === null) {
		// default: light
		applyTheme(false);
	} else {
		applyTheme(stored === '1');
	}
})();

/* ---------- Accordion behavior ---------- */
qsa('.accordion-toggle').forEach(btn => {
	btn.addEventListener('click', () => {
		const panel = btn.nextElementSibling;
		if (!panel) return;
		const open = panel.style.display === 'block';
		qsa('.accordion-panel').forEach(p => p.style.display = 'none');
		panel.style.display = open ? 'none' : 'block';
	});
});

/* ---------- Toasts ---------- */
function showToast(message, opts = {}) {
	const t = document.createElement('div');
	t.className = 'toast';
	t.textContent = message;
	toastsRoot.appendChild(t);
	const timeout = opts.timeout ?? 3500;
	setTimeout(() => {
		t.style.opacity = '0';
		t.style.transition = 'opacity 260ms ease';
		setTimeout(() => t.remove(), 300);
	}, timeout);
}

/* ---------- Small accessibility helper: close modal with ESC ---------- */
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		if (modal.classList.contains('show')) closeModal();
	}
});

/* ---------- Dashboard stats ---------- */
function updateStats() {
    const stats = {
        totalNotes: notes.length,
        weeklyMeetings: notes.filter(n => {
            const date = new Date(n.meetingDate);
            const now = new Date();
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            return date >= weekStart;
        }).length,
        pendingTasks: notes.filter(n => n.followUp && !n.followUpCompleted).length
    };

    Object.entries(stats).forEach(([id, value]) => {
        document.getElementById(id).textContent = value;
    });
}

/* ---------- User info ---------- */
function updateUserInfo() {
    const user = auth.getUser();
    if (user) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userFullName').textContent = user.name;
        document.getElementById('userRole').textContent = user.role;
    }
}

/* ---------- Navigation ---------- */
document.querySelectorAll('.nav-item').forEach(nav => {
    nav.addEventListener('click', (e) => {
        e.preventDefault();
        const target = nav.getAttribute('href').slice(1);
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        document.getElementById(target)?.classList.remove('hidden');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        nav.classList.add('active');
    });
});

/* ---------- Logout ---------- */
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Anda yakin ingin keluar?')) {
        auth.logout();
    }
});

/* ---------- Initial load ---------- */
updateUserInfo();
updateStats();
renderNotes();

/* ---------- Export small API for dev console debugging ---------- */
/* window.SiPenotul = { notes, renderNotes, loadNotes, saveNotes }; */
/* Uncomment lines above during development to access state in console */
