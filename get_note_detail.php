<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

if (!isset($_GET['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID tidak ditemukan']);
    exit;
}

$id = mysqli_real_escape_string($conn_db_notes, $_GET['id']);

$query = "SELECT * FROM tbNotesData WHERE idNotes = '$id'";
$result = mysqli_query($conn_db_notes, $query);

if ($row = mysqli_fetch_assoc($result)) {
    echo json_encode(['status' => 'success', 'data' => $row]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Notulen tidak ditemukan']);
}
?>