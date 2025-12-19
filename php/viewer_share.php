<?php
session_start();
include 'tes_koneksi.php';

$id = $_GET['id'];

$q = mysqli_query($conn, "SELECT * FROM notulensi WHERE id_notulen='$id'");
$data = mysqli_fetch_assoc($q);

if ($data['akses'] == 'privat' && !isset($_SESSION['user_id'])) {
    header("Location: login.php?redirect=view.php?id=$id");
    exit;
}
?>

<h2><?= $data['judul'] ?></h2>
<p><?= $data['isi'] ?></p>
