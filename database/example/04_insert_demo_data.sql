-- ============================================
-- 1. SETUP DATABASE & TABEL PENGGUNA (dbUsers)
-- ============================================

CREATE DATABASE IF NOT EXISTS dbUsers;
USE dbUsers;

-- Hapus tabel lama jika ada biar fresh (opsional)
DROP TABLE IF EXISTS tbUsers;

-- Buat Tabel Users
CREATE TABLE tbUsers (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    nim VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    programStudi VARCHAR(100) DEFAULT 'Teknik Informatika',
    PRIMARY KEY (id),
    UNIQUE KEY unique_nim (nim),
    UNIQUE KEY unique_email (email)
);

-- Masukkan Data Users
INSERT INTO tbUsers (id, name, nim, email, password, programStudi) VALUES
(2101, 'Demo User', '01', 'demo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika'),
(2102, 'Crist Garcia Pasaribu', '3312501041', 'crist@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika'),
(2103, 'Cahyati Lamona Sitohang', '3312501040', 'cahyati@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika'),
(2104, 'Fazri Rahman', '3312501038', 'fazri@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika'),
(2105, 'Takanashi Hoshino', '2006', 'hoshinotakanashi@buruaka.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika')
ON DUPLICATE KEY UPDATE name=VALUES(name);


-- ============================================
-- 2. SETUP DATABASE & TABEL NOTULEN (dbNotes)
-- ============================================

CREATE DATABASE IF NOT EXISTS dbNotes;
USE dbNotes;

-- Hapus tabel lama jika ada
DROP TABLE IF EXISTS tbNotesAttendees;
DROP TABLE IF EXISTS tbNotesData;

-- Buat Tabel Data Notulen
CREATE TABLE tbNotesData (
    idNotes VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    meetingDate DATE,
    time TIME,
    location VARCHAR(100),
    decisions TEXT,
    followUp TEXT,
    followUpCompleted BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    authorNim VARCHAR(20),
    isPublic BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (idNotes)
);

-- Buat Tabel Peserta Hadir (Relasi)
CREATE TABLE tbNotesAttendees (
    id INT(11) NOT NULL AUTO_INCREMENT,
    idNotes VARCHAR(50) NOT NULL,
    nim VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    PRIMARY KEY (id),
    KEY idx_notes (idNotes)
);

-- Masukkan Data Notulen
INSERT INTO tbNotesData (idNotes, title, content, meetingDate, time, location, decisions, followUp, followUpCompleted, createdAt, authorNim, isPublic) VALUES
('NOTDEMO1', 'Rapat Koordinasi Tim Development', 'Diskusi mengenai progress pengembangan aplikasi SIPNOTUL. Tim melaporkan bahwa fitur authentication sudah selesai diimplementasi.', '2024-11-15', '14:00:00', 'GU 702', 'Implementasi authentication selesai', 'Review progress minggu depan', FALSE, '2024-11-10 10:00:00', '01', TRUE),
('NOTDEMO2', 'Evaluasi Proyek PBL', 'Evaluasi akhir proyek PBL Gacor. Tim berhasil menyelesaikan semua requirement yang diminta.', '2024-11-12', '10:00:00', 'GU 706', 'Proyek selesai sesuai deadline', 'Persiapan presentasi', TRUE, '2024-11-08 08:30:00', '3312501041', FALSE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Masukkan Data Peserta
INSERT INTO tbNotesAttendees (idNotes, nim, name) VALUES
('NOTDEMO1', '01', 'Demo User'),
('NOTDEMO1', '3312501041', 'Crist Garcia Pasaribu'),
('NOTDEMO2', '3312501041', 'Crist Garcia Pasaribu'),
('NOTDEMO2', '3312501040', 'Cahyati Lamona Sitohang');