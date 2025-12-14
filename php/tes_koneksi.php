<?php
// tes_koneksi.php
$conn = mysqli_connect("localhost", "root", "", "dbUsers");

if ($conn) {
    echo "<h1>✅ Koneksi Sukses!</h1>";
} else {
    echo "<h1>❌ Koneksi Gagal</h1>";
    echo mysqli_connect_error();
}
?>