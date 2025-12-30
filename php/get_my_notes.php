<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

// Ambil NIM dari URL
$nim = isset($_GET['nim']) ? mysqli_real_escape_string($conn_db_notes, $_GET['nim']) : '';

if (empty($nim)) {
    echo json_encode([]);
    exit;
}

// QUERY KHUSUS UNTUK MANAGE.HTML
// Hanya tampilkan notulen yang DIBUAT oleh user (authorNim)
// Tidak termasuk notulen dimana user hanya sebagai peserta
$query = "SELECT n.*, u.name AS authorName 
          FROM tbnotes_data n 
          LEFT JOIN users u ON n.authorNim = u.nim 
          WHERE n.authorNim = '$nim' 
          ORDER BY n.createdAt DESC";

$result = mysqli_query($conn_db_notes, $query);

if (!$result) {
    // Kirim array kosong jika error
    echo json_encode([]); 
    exit;
}

$notes = [];
while ($row = mysqli_fetch_assoc($result)) {
    // Pastikan tipe data angka dikirim dengan benar
    $row['idNotes'] = (int)$row['idNotes']; 
    $notes[] = $row;
}

echo json_encode($notes);
?>