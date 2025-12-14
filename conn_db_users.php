<?php
// conn_db_users.php
$servername = "localhost";
$username = "root";
$password = "";
$database = "dbUsers"; // Pastikan nama database sesuai SQL Anda

$conn_db_users = mysqli_connect($servername, $username, $password, $database);

if (!$conn_db_users) {
    die("Koneksi Gagal: " . mysqli_connect_error());
}
?>