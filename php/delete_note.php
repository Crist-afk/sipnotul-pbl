<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'])) {
    $id = mysqli_real_escape_string($conn_db_notes, $data['id']);
    
    // PERBAIKAN: Nama tabel disesuaikan dengan SQL Dump (tbnotes_data)
    $query = "DELETE FROM tbnotes_data WHERE idNotes = '$id'";
    
    if (mysqli_query($conn_db_notes, $query)) {
        echo json_encode(['status' => 'success']);
    } else {
        // Jika query gagal, PHP akan mengirimkan pesan error MySQL yang spesifik
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn_db_notes)]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID tidak ditemukan']);
}
?>