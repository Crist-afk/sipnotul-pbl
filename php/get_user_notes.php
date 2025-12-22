<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

// Ambil NIM dari URL
$nim = isset($_GET['nim']) ? mysqli_real_escape_string($conn_db_notes, $_GET['nim']) : '';

if (empty($nim)) {
    echo json_encode([]);
    exit;
}

// QUERY UTAMA
// Logika: Tampilkan notulen jika saya PEMBUATNYA (authorNim)
// ATAU jika saya terdaftar sebagai PESERTA (tbnotes_attendees.nim)
$query = "SELECT DISTINCT n.*, u.name AS authorName 
          FROM tbnotes_data n 
          LEFT JOIN users u ON n.authorNim = u.nim 
          LEFT JOIN tbnotes_attendees a ON n.idNotes = a.idNotes 
          WHERE n.authorNim = '$nim' OR a.nim = '$nim' 
          ORDER BY n.createdAt DESC";

$result = mysqli_query($conn_db_notes, $query);

if (!$result) {
    // Kirim array kosong jika error agar dashboard tidak blank
    echo json_encode([]); 
    exit;
}

$notes = [];
while ($row = mysqli_fetch_assoc($result)) {
    // Fix kecil: pastikan tipe data angka dikirim dengan benar (opsional)
    $row['idNotes'] = (int)$row['idNotes']; 
    $notes[] = $row;
}

echo json_encode($notes);
?>