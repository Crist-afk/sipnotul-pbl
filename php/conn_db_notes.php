<?php
$host = "sql312.infinityfree.com";
$user = "if0_40727609";
$pass = "MbakCris123";
$db   = "if0_40727609_sipnotul";

$conn_db_notes = mysqli_connect($host, $user, $pass, $db);

if (!$conn_db_notes) {
    die("Koneksi Database Gagal: " . mysqli_connect_error());
}
?>