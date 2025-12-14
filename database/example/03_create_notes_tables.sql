-- ============================================
-- Notes Database Tables
-- ============================================

USE dbNotes;

-- Notes Data Table
CREATE TABLE IF NOT EXISTS tbNotesData (
    idNotes VARCHAR(12) PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content MEDIUMTEXT,
    meetingDate DATE NULL,
    time TIME NULL,
    location VARCHAR(30) NULL,
    decisions VARCHAR(50) NULL,
    followUp VARCHAR(50) NULL,
    followUpCompleted BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    authorNim VARCHAR(10) NOT NULL,
    isPublic BOOLEAN DEFAULT TRUE,
    INDEX idx_authorNim (authorNim),
    INDEX idx_meetingDate (meetingDate),
    INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notes Attendees Table
CREATE TABLE IF NOT EXISTS tbNotesAttendees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idNotes VARCHAR(12) NOT NULL,
    nim VARCHAR(10) NOT NULL,
    name VARCHAR(30) NOT NULL,
    FOREIGN KEY (idNotes) REFERENCES tbNotesData(idNotes) ON DELETE CASCADE,
    INDEX idx_idNotes (idNotes),
    INDEX idx_nim (nim)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Meetings Table (separate from notes)
CREATE TABLE IF NOT EXISTS tbMeetings (
    idMeeting VARCHAR(12) PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    meetingDate DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(30) NOT NULL,
    description TEXT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    authorNim VARCHAR(10) NOT NULL,
    isPublic BOOLEAN DEFAULT TRUE,
    INDEX idx_authorNim (authorNim),
    INDEX idx_meetingDate (meetingDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Meeting Participants Table
CREATE TABLE IF NOT EXISTS tbMeetingParticipants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idMeeting VARCHAR(12) NOT NULL,
    nim VARCHAR(10) NOT NULL,
    FOREIGN KEY (idMeeting) REFERENCES tbMeetings(idMeeting) ON DELETE CASCADE,
    INDEX idx_idMeeting (idMeeting),
    INDEX idx_nim (nim),
    UNIQUE KEY unique_participant (idMeeting, nim)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Show table structures
DESCRIBE tbNotesData;
DESCRIBE tbNotesAttendees;
DESCRIBE tbMeetings;
DESCRIBE tbMeetingParticipants;
