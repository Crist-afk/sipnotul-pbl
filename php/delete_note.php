<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';
include 'security_logger.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['deleterNim'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID dan NIM penghapus wajib diisi']);
    exit;
}

$id = mysqli_real_escape_string($conn_db_notes, $data['id']);
$deleterNim = mysqli_real_escape_string($conn_db_notes, $data['deleterNim']);

// ==========================================
// VALIDASI KEPEMILIKAN SEBELUM MENGHAPUS
// ==========================================

// 1. Cek apakah notulen ada dan ambil data pemilik
$ownerCheckQuery = "SELECT authorNim FROM tbnotes_data WHERE idNotes = '$id'";
$ownerResult = mysqli_query($conn_db_notes, $ownerCheckQuery);

if (!$ownerResult || mysqli_num_rows($ownerResult) == 0) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Notulen tidak ditemukan']);
    exit;
}

$ownerData = mysqli_fetch_assoc($ownerResult);

// 2. Verifikasi kepemilikan
if ($ownerData['authorNim'] !== $deleterNim) {
    // Enhanced security logging
    logUnauthorizedAccess('DELETE', $deleterNim, $id, $ownerData['authorNim']);
    
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Anda tidak memiliki izin untuk menghapus notulen ini']);
    exit;
} else {
    // Log successful authorization
    logSecuritySuccess('DELETE_AUTHORIZED', $deleterNim, $id);
}

// ==========================================
// HAPUS NOTULEN DAN DATA TERKAIT
// ==========================================

mysqli_begin_transaction($conn_db_notes);

try {
    // Hapus data peserta terlebih dahulu
    $deleteAttendeesQuery = "DELETE FROM tbnotes_attendees WHERE idNotes = '$id'";
    if (!mysqli_query($conn_db_notes, $deleteAttendeesQuery)) {
        throw new Exception("Gagal menghapus data peserta: " . mysqli_error($conn_db_notes));
    }
    
    // Hapus notulen utama
    $deleteNoteQuery = "DELETE FROM tbnotes_data WHERE idNotes = '$id'";
    if (!mysqli_query($conn_db_notes, $deleteNoteQuery)) {
        throw new Exception("Gagal menghapus notulen: " . mysqli_error($conn_db_notes));
    }
    
    mysqli_commit($conn_db_notes);
    
    // Log successful deletion
    logSecuritySuccess('DELETE_COMPLETED', $deleterNim, $id);
    
    echo json_encode(['status' => 'success', 'message' => 'Notulen berhasil dihapus']);
    
} catch (Exception $e) {
    mysqli_rollback($conn_db_notes);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>