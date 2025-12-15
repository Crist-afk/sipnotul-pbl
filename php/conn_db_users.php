<?php
$host = "localhost";
$user = "root";
$pass = ""; // Kosongkan jika pakai XAMPP default
$db   = "dbusers"; // Pastikan nama database sesuai gambar Anda (dbusers)

$conn_db_users = mysqli_connect($host, $user, $pass, $db);

if (!$conn_db_users) {
    die("Koneksi Gagal: " . mysqli_connect_error());
}
?>