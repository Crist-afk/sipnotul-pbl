-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 20 Des 2025 pada 20.55
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

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
-- Struktur dari tabel `tbmeetingparticipants`
--

CREATE TABLE `tbmeetingparticipants` (
  `id` int(11) NOT NULL,
  `idMeeting` varchar(12) NOT NULL,
  `nim` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbmeetings`
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
-- Struktur dari tabel `tbnotes_attendees`
--

CREATE TABLE `tbnotes_attendees` (
  `id` int(11) NOT NULL,
  `idNotes` varchar(50) NOT NULL,
  `nim` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tbnotes_data`
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
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `nim` int(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `programStudi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tbmeetingparticipants`
--
ALTER TABLE `tbmeetingparticipants`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tbmeetings`
--
ALTER TABLE `tbmeetings`
  ADD PRIMARY KEY (`idMeeting`);

--
-- Indeks untuk tabel `tbnotes_attendees`
--
ALTER TABLE `tbnotes_attendees`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tbnotes_data`
--
ALTER TABLE `tbnotes_data`
  ADD PRIMARY KEY (`idNotes`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `tbmeetingparticipants`
--
ALTER TABLE `tbmeetingparticipants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tbnotes_attendees`
--
ALTER TABLE `tbnotes_attendees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tbnotes_data`
--
ALTER TABLE `tbnotes_data`
  MODIFY `idNotes` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
