<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

// Cek parameter NIM
if (!isset($_GET['nim'])) {
    echo json_encode([]);
    exit;
}

$nim = mysqli_real_escape_string($conn_db_notes, $_GET['nim']);

// === QUERY BARU (LOGIKA GABUNGAN) ===
// 1. Ambil data notulen (n.*)
// 2. Gabungkan dengan tabel peserta (a) berdasarkan idNotes
// 3. Syarat: Entah dia PEMBUATNYA (n.authorNim) ATAU dia PESERTANYA (a.nim)
// 4. DISTINCT agar jika dia ada di dua tabel, notulen tidak muncul ganda

$query = "SELECT DISTINCT n.* FROM tbnotes_data n 
          LEFT JOIN tbnotes_attendees a ON n.idNotes = a.idNotes 
          WHERE n.authorNim = '$nim' OR a.nim = '$nim' 
          ORDER BY n.createdAt DESC";

$result = mysqli_query($conn_db_notes, $query);

// Cek error query
if (!$result) {
    // Jika error, kirim array kosong atau pesan debug
    // echo mysqli_error($conn_db_notes); 
    echo json_encode([]); 
    exit;
}

$notes = [];
while ($row = mysqli_fetch_assoc($result)) {
    $notes[] = $row;
}

echo json_encode($notes);
?>