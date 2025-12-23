<?php
$servername = "localhost";
$username = "root";
$password = ""; 
$database = "sipnotul"; // Pastikan sesuai nama DB di gambar (sipnotul)

$conn_db_notes = mysqli_connect($servername, $username, $password, $database);

if (!$conn_db_notes) {
    die("Koneksi Database Gagal: " . mysqli_connect_error());
}
?>