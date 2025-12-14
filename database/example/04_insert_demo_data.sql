-- ============================================
-- Demo Data for SIPNOTUL
-- ============================================

-- Insert Demo Users
USE dbUsers;

INSERT INTO tbUsers (id, name, nim, email, password, programStudi) VALUES
(2101, 'Demo User', '01', 'demo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika'),
(2102, 'Crist Garcia Pasaribu', '3312501041', 'crist@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika'),
(2103, 'Cahyati Lamona Sitohang', '3312501040', 'cahyati@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika'),
(2104, 'Fazri Rahman', '3312501038', 'fazri@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika'),
(2105, 'Takanashi Hoshino', '2006', 'hoshinotakanashi@buruaka.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Note: Password is hashed version of 'Admin123' or respective passwords
-- You should hash passwords using PHP password_hash() function

-- Insert Demo Notes
USE dbNotes;

INSERT INTO tbNotesData (idNotes, title, content, meetingDate, time, location, decisions, followUp, followUpCompleted, createdAt, authorNim, isPublic) VALUES
('NOTDEMO1', 'Rapat Koordinasi Tim Development', 'Diskusi mengenai progress pengembangan aplikasi SIPNOTUL. Tim melaporkan bahwa fitur authentication sudah selesai diimplementasi.', '2024-11-15', '14:00:00', 'GU 702', 'Implementasi authentication selesai', 'Review progress minggu depan', FALSE, '2024-11-10 10:00:00', '01', TRUE),
('NOTDEMO2', 'Evaluasi Proyek PBL', 'Evaluasi akhir proyek PBL Gacor. Tim berhasil menyelesaikan semua requirement yang diminta.', '2024-11-12', '10:00:00', 'GU 706', 'Proyek selesai sesuai deadline', 'Persiapan presentasi', TRUE, '2024-11-08 08:30:00', '3312501041', FALSE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Insert Demo Attendees
INSERT INTO tbNotesAttendees (idNotes, nim, name) VALUES
('NOTDEMO1', '01', 'Demo User'),
('NOTDEMO1', '3312501041', 'Crist Garcia Pasaribu'),
('NOTDEMO2', '3312501041', 'Crist Garcia Pasaribu'),
('NOTDEMO2', '3312501040', 'Cahyati Lamona Sitohang');

-- Show inserted data
SELECT * FROM dbUsers.tbUsers;
SELECT * FROM dbNotes.tbNotesData;
SELECT * FROM dbNotes.tbNotesAttendees;
