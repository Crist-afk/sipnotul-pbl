<?php
session_start();
include 'tes_koneksi.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$id_notulen = $_POST['id_notulen'];
$status = $_POST['status'];
$id_user = $_SESSION['user_id'];

mysqli_query($conn, "INSERT INTO kehadiran VALUES(null,'$id_notulen','$id_user','$status')");
header("Location: view.php?id=$id_notulen");
