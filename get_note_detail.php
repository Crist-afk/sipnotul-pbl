<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

// 1. Cek ID
if (!isset($_GET['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID tidak ditemukan']);
    exit;
}

$id = mysqli_real_escape_string($conn_db_notes, $_GET['id']);

// 2. QUERY UTAMA (PERBAIKAN NAMA DATABASE)
// Perhatikan: "LEFT JOIN dbusers.tbusers"
// Artinya: Ambil data notulen, lalu nyebrang ke database 'dbusers' ambil tabel 'tbusers'
$query = "SELECT n.*, u.name AS authorName 
          FROM tbnotesdata n 
          LEFT JOIN dbusers.tbusers u ON n.authorNim = u.nim 
          WHERE n.idNotes = '$id'";

$result = mysqli_query($conn_db_notes, $query);

// Cek jika query gagal (untuk debugging)
if (!$result) {
    echo json_encode(['status' => 'error', 'message' => 'Query Error: ' . mysqli_error($conn_db_notes)]);
    exit;
}

$noteData = mysqli_fetch_assoc($result);

if ($noteData) {
    // 3. QUERY AMBIL DATA PESERTA (tbnotesattendees)
    // Pastikan nama tabel huruf kecil sesuai gambar
    $queryAttendees = "SELECT nim, name FROM tbnotesattendees WHERE idNotes = '$id'";
    $resAttendees = mysqli_query($conn_db_notes, $queryAttendees);
    
    $attendeesList = [];
    if ($resAttendees) {
        while($row = mysqli_fetch_assoc($resAttendees)) {
            $attendeesList[] = $row;
        }
    }

    // Gabungkan data
    $noteData['attendeesList'] = $attendeesList;

    echo json_encode(['status' => 'success', 'data' => $noteData]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Notulen tidak ditemukan']);
}
?>