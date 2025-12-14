<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

// Ambil NIM/ID user dari parameter URL
if (!isset($_GET['nim'])) {
    echo json_encode([]);
    exit;
}

$nim = mysqli_real_escape_string($conn_db_notes, $_GET['nim']);

// Ambil semua notulen milik user ini, urutkan dari yang terbaru
$query = "SELECT * FROM tbNotesData WHERE authorNim = '$nim' ORDER BY createdAt DESC";
$result = mysqli_query($conn_db_notes, $query);

$notes = [];
while ($row = mysqli_fetch_assoc($result)) {
    $notes[] = $row;
}

echo json_encode($notes);
?>