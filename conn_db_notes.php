<?php
// Konfigurasi Database
$servername = "localhost";
$username = "root";     // Default XAMPP
$password = "";         // Default XAMPP (biasanya kosong)
$database = "dbNotes";  // Sesuai dengan file SQL yang kamu import sebelumnya

// Membuat koneksi
$conn_db_notes = mysqli_connect($servername, $username, $password, $database);

// Cek koneksi
if (!$conn_db_notes) {
    // Jika gagal, matikan proses dan tampilkan error
    die("Koneksi Database Gagal: " . mysqli_connect_error());
}

// Opsional: Set timezone agar waktu CreatedAt sesuai waktu Indonesia Barat
date_default_timezone_set('Asia/Jakarta');
?>