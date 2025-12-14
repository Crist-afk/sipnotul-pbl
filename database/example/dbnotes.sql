-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 14, 2025 at 04:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbnotes`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbmeetingparticipants`
--

CREATE TABLE `tbmeetingparticipants` (
  `id` int(11) NOT NULL,
  `idMeeting` varchar(12) NOT NULL,
  `nim` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbmeetings`
--

CREATE TABLE `tbmeetings` (
  `idMeeting` varchar(12) NOT NULL,
  `title` varchar(50) NOT NULL,
  `meetingDate` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(30) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `authorNim` varchar(10) NOT NULL,
  `isPublic` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbnotesattendees`
--

CREATE TABLE `tbnotesattendees` (
  `id` int(11) NOT NULL,
  `idNotes` varchar(50) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbnotesattendees`
--

INSERT INTO `tbnotesattendees` (`id`, `idNotes`, `nim`, `name`) VALUES
(1, 'NOTDEMO1', '01', 'Demo User'),
(2, 'NOTDEMO1', '3312501041', 'Crist Garcia Pasaribu'),
(3, 'NOTDEMO2', '3312501041', 'Crist Garcia Pasaribu'),
(4, 'NOTDEMO2', '3312501040', 'Cahyati Lamona Sitohang'),
(5, 'NOT693ECC1A059F3', '-', 'dora 123'),
(6, 'NOT693EC386019FE', '-', '3312501041'),
(9, 'NOT693ED01B48174', '3312501041', 'Crist Garcia Pasaribu'),
(10, 'NOT693ED01B48174', '3312501038', 'Fazri Rahman'),
(11, 'NOT693EDB073F2DE', '3312501040', 'Cahyati Lamona Sitohang'),
(13, 'NOT693EDD6F339FB', '3312501038', 'Fazri Rahman');

-- --------------------------------------------------------

--
-- Table structure for table `tbnotesdata`
--

CREATE TABLE `tbnotesdata` (
  `idNotes` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `meetingDate` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `decisions` text DEFAULT NULL,
  `followUp` text DEFAULT NULL,
  `followUpCompleted` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `authorNim` varchar(20) DEFAULT NULL,
  `isPublic` tinyint(1) DEFAULT 0,
  `accessCode` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbnotesdata`
--

INSERT INTO `tbnotesdata` (`idNotes`, `title`, `content`, `meetingDate`, `time`, `location`, `decisions`, `followUp`, `followUpCompleted`, `createdAt`, `authorNim`, `isPublic`, `accessCode`) VALUES
('NOT693EC386019FE', 'tes1', 'MBG 1,2 triliun per hari ', '2025-12-14', '21:01:00', 'Tekno', 'wow\r\n', 'lanjutkan 1', 0, '2025-12-14 21:02:46', '1234567890', 1, NULL),
('NOT693ED01B48174', 'test 12331312131221', 'iya iya', '2025-12-14', '21:55:00', 'Tekno', '1233', '123231', 0, '2025-12-14 21:56:27', '1234567899', 1, NULL),
('NOT693EDB073F2DE', 'test PRNG', '123', '2025-12-14', '22:42:00', 'tekno', '123', '123', 0, '2025-12-14 22:43:03', '3312501041', 0, '9106'),
('NOT693EDD6F339FB', 'tes PRNG #2', '123', '2025-12-14', '22:52:00', 'tekno', '123', '123', 0, '2025-12-14 22:53:19', '3312501041', 0, '2297'),
('NOTDEMO1', 'Rapat Koordinasi Tim Development', 'Diskusi mengenai progress pengembangan aplikasi SIPNOTUL. Tim melaporkan bahwa fitur authentication sudah selesai diimplementasi.', '2024-11-15', '14:00:00', 'GU 702', 'Implementasi authentication selesai', 'Review progress minggu depan', 0, '2024-11-10 10:00:00', '01', 1, NULL),
('NOTDEMO2', 'Evaluasi Proyek PBL', 'Evaluasi akhir proyek PBL Gacor. Tim berhasil menyelesaikan semua requirement yang diminta.', '2024-11-12', '10:00:00', 'GU 706', 'Proyek selesai sesuai deadline', 'Persiapan presentasi', 1, '2024-11-08 08:30:00', '3312501041', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbmeetingparticipants`
--
ALTER TABLE `tbmeetingparticipants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_participant` (`idMeeting`,`nim`),
  ADD KEY `idx_idMeeting` (`idMeeting`),
  ADD KEY `idx_nim` (`nim`);

--
-- Indexes for table `tbmeetings`
--
ALTER TABLE `tbmeetings`
  ADD PRIMARY KEY (`idMeeting`),
  ADD KEY `idx_authorNim` (`authorNim`),
  ADD KEY `idx_meetingDate` (`meetingDate`);

--
-- Indexes for table `tbnotesattendees`
--
ALTER TABLE `tbnotesattendees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notes` (`idNotes`);

--
-- Indexes for table `tbnotesdata`
--
ALTER TABLE `tbnotesdata`
  ADD PRIMARY KEY (`idNotes`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbmeetingparticipants`
--
ALTER TABLE `tbmeetingparticipants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbnotesattendees`
--
ALTER TABLE `tbnotesattendees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbmeetingparticipants`
--
ALTER TABLE `tbmeetingparticipants`
  ADD CONSTRAINT `tbmeetingparticipants_ibfk_1` FOREIGN KEY (`idMeeting`) REFERENCES `tbmeetings` (`idMeeting`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
