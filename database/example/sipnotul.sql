-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 21, 2025 at 01:09 PM
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
-- Database: `sipnotul`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbmeetingparticipants`
--

CREATE TABLE `tbmeetingparticipants` (
  `id` int(11) NOT NULL,
  `idMeeting` varchar(12) NOT NULL,
  `nim` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbmeetings`
--

CREATE TABLE `tbmeetings` (
  `idMeeting` int(12) NOT NULL,
  `title` varchar(50) NOT NULL,
  `meetingDate` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(30) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `authorNim` varchar(10) NOT NULL,
  `isPublic` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbnotes_attendees`
--

CREATE TABLE `tbnotes_attendees` (
  `id` int(11) NOT NULL,
  `idNotes` varchar(50) NOT NULL,
  `nim` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbnotes_data`
--

CREATE TABLE `tbnotes_data` (
  `idNotes` int(50) NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `programStudi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `nim`, `email`, `password`, `programStudi`) VALUES
(3, 'Crist Garcia Pasaribu', '3312501041', 'cristgarciapasaribu@gmail.com', 'crist123', 'Teknik Informatika'),
(4, 'Akbar Zamroni', '3312501033', 'mas.akbarzamroni@gmail.com', 'akbar123', 'Teknik Informatika'),
(5, 'Aprillia Bunga Lestari', '3312501032', 'aprilliabunga21@gmail.com', 'bunga123', 'Teknik Informatika'),
(6, 'Bryan Abisai Immanuel Sitorus', '3312501058', 'brystr18@gmail.com', 'bryan123', 'Teknik Informatika'),
(7, 'Cahyati Lamona Sitohang', '3312501040', 'cahyatisitohang@gmail.com', 'cahya123', 'Teknik Informatika'),
(8, 'Damar Widi Nugroho Nugroho', '3312501050', 'damarwidhinugroho@gmail.com', 'damar123', 'Teknik Informatika'),
(9, 'Dias Ferdian', '3312501055', 'df7617575@gmail.com', 'dias12345', 'Teknik Informatika'),
(10, 'Dimas Cakra Surya Ananta', '3312501049', 'nemocat09@gmail.com', 'dimas123', 'Teknik Informatika'),
(11, 'Fathur Alfitrah Dermawan', '3312501047', 'alfitrahfathur@gmail.com', 'fathur123', 'Teknik Informatika'),
(12, 'Fazri Rahman', '3312501038', 'rahmanfazri62@gmail.com', 'fazri123', 'Teknik Informatika'),
(13, 'Fenni Patrik Simanjuntak', '3312501037', 'feyndora17@gmail.com', 'fenni123', 'Teknik Informatika'),
(14, 'Haikal Mubaroq Zafia', '3312501035', 'haikalmubaroq025@gmail.com', 'haikal123', 'Teknik Informatika'),
(15, 'M Nurramadhan Irsya', '3312501054', 'mnurramadhanirsya@gmail.com', 'adhan123', 'Teknik Informatika'),
(16, 'M. Luthfi Causart Azavi', '3312501052', 'luthfi110607@gmail.com', 'lutfi123', 'Teknik Informatika'),
(17, 'Michael Sando Turnip', '3312501042', 'michaelmarvin385@gmail.com', 'michael123', 'Teknik Informatika'),
(18, 'Muhammad Faturrahman', '3312501043', 'faturrahman290607@gmail.com', 'empatur123', 'Teknik Informatika'),
(19, 'Muhammad Ivan Febrian', '3312501044', 'ivanfebrian2007@gmail.com', 'ivan12345', 'Teknik Informatika'),
(20, 'Muradika Laksamana Putra', '3312501059', 'dikag0861@gmail.com', 'dika1234', 'Teknik Informatika'),
(21, 'Nur Iliyanie', '3312501045', 'nuriliyanie7@gmail.com', 'lily1234', 'Teknik Informatika'),
(22, 'Rangga Surya Saputra', '3312501036', 'ranggasurya0711@gmail.com', 'rangga123', 'Teknik Informatika'),
(23, 'Reifandra Kinadi', '3312501048', 'reifandra6@gmail.com', 'reifandra', 'Teknik Informatika'),
(24, 'Robi Yahya Harahap', '3312501034', 'robiyahyaharahap1@gmail.com', 'robi1234', 'Teknik Informatika'),
(25, 'Shofiyyah Binti Tholib Uwaini', '3312501031', 'shofiyyah.239@gmail.com', 'shofy123', 'Teknik Informatika'),
(26, 'Siti Halimah Chania', '3312501057', 'sitichania237@gmail.com', 'siti1234', 'Teknik Informatika'),
(27, 'Yohanes Armando Hubin', '3312501053', 'yohanesarmando2007@gmail.com', 'yohanes123', 'Teknik Informatika'),
(28, 'Zahrah Athirah Badiah', '3312501060', 'zahrah.athirah2605@gmail.com', 'zahra123', 'Teknik Informatika'),
(29, 'Zaid Hasbiya Abrar', '3312501046', 'zaidhasbiyaabrar@gmail.com', 'zaid1234', 'Teknik Informatika');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbmeetingparticipants`
--
ALTER TABLE `tbmeetingparticipants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbmeetings`
--
ALTER TABLE `tbmeetings`
  ADD PRIMARY KEY (`idMeeting`);

--
-- Indexes for table `tbnotes_attendees`
--
ALTER TABLE `tbnotes_attendees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbnotes_data`
--
ALTER TABLE `tbnotes_data`
  ADD PRIMARY KEY (`idNotes`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbmeetingparticipants`
--
ALTER TABLE `tbmeetingparticipants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbnotes_attendees`
--
ALTER TABLE `tbnotes_attendees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbnotes_data`
--
ALTER TABLE `tbnotes_data`
  MODIFY `idNotes` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
