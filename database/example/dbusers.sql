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
-- Database: `dbusers`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbusers`
--

CREATE TABLE `tbusers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `programStudi` varchar(100) DEFAULT 'Teknik Informatika'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tbusers`
--

INSERT INTO `tbusers` (`id`, `name`, `nim`, `email`, `password`, `programStudi`) VALUES
(2101, 'Demo User', '01', 'demo@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika'),
(2105, 'Takanashi Hoshino', '2006', 'hoshinotakanashi@buruaka.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teknik Informatika'),
(2107, 'dora 123', '1234567890', 'dora@gmail.com', '$2y$10$5QclJZJQD34Mvpf7VF3lgulD2dRz4QwFgusXKO.m1thf8AtwgZSzu', 'informatika'),
(2108, 'Crist Garcia Pasaribu', '3312501041', 'crist@gmail.com', '$2y$10$UodgS2t3nSa1e18ZntSzHug/qmePTChZvqEddbYznlnQnyGQQbfKa', 'Teknik Informatika'),
(2109, 'test akun', '1234567899', '123@gmal.com', '$2y$10$dGckwzk/voqITUFk9IRqmu63pWfXqKM.WfN/LAT6uFUehj7JlinLW', 'informatika'),
(2110, 'Cahyati Lamona Sitohang', '3312501040', 'cahyati@email.com', '$2y$10$bPj.M30iwcltStvLH/JqTOZbtQYxm9iFq48AjAF4WDT7xu8BbjwiK', 'informatika'),
(2111, 'Fazri Rahman', '3312501038', 'fazri@gmail.com', '$2y$10$diptF/r/Oy2UsgdvPJZ3UekhEx/rJxPTcQZRxSbDKowdY4G5fTFnG', 'informatika');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbusers`
--
ALTER TABLE `tbusers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nim` (`nim`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbusers`
--
ALTER TABLE `tbusers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2112;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
