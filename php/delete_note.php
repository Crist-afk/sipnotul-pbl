<?php
// php/delete_note.php

// 1. Header & Konfigurasi
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'conn_db_notes.php';

// Cek apakah file logger ada sebelum di-include untuk mencegah error fatal
if (file_exists('security_logger.php')) {
    include 'security_logger.php';
}

// 2. Ambil Data JSON
$data = json_decode(file_get_contents("php://input"), true);

// PERBAIKAN UTAMA DI SINI:
// JavaScript mengirim 'nim', jadi di sini kita cek 'nim', bukan 'deleterNim'
if (empty($data['id']) || empty($data['nim'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID dan NIM penghapus wajib diisi']);
    exit;
}

$idNotes = $data['id'];
$userNim = $data['nim']; // Ubah variabel penampung agar konsisten

// ==========================================
// VALIDASI KEPEMILIKAN (Prepared Statement)
// ==========================================

// Gunakan Prepared Statement untuk keamanan
$ownerCheckQuery = "SELECT authorNim FROM tbnotes_data WHERE idNotes = ?";
$stmt = $conn_db_notes->prepare($ownerCheckQuery);
$stmt->bind_param("s", $idNotes); // 's' asumsi ID berupa string/varchar, ganti 'i' jika integer
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Notulen tidak ditemukan']);
    exit;
}

$ownerData = $result->fetch_assoc();

// Verifikasi kepemilikan
if ($ownerData['authorNim'] !== $userNim) {
    // Log unauthorized attempt jika fungsi tersedia
    if (function_exists('logUnauthorizedAccess')) {
        logUnauthorizedAccess('DELETE', $userNim, $idNotes, $ownerData['authorNim']);
    }
    
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Anda tidak memiliki izin untuk menghapus notulen ini']);
    exit;
} else {
    // Log success auth jika fungsi tersedia
    if (function_exists('logSecuritySuccess')) {
        logSecuritySuccess('DELETE_AUTHORIZED', $userNim, $idNotes);
    }
}

$stmt->close(); // Tutup statement pengecekan

// ==========================================
// HAPUS NOTULEN & DATA TERKAIT
// ==========================================

mysqli_begin_transaction($conn_db_notes);

try {
    // 1. Hapus Peserta (Prepared Statement)
    $deleteAttendeesQuery = "DELETE FROM tbnotes_attendees WHERE idNotes = ?";
    $stmt1 = $conn_db_notes->prepare($deleteAttendeesQuery);
    $stmt1->bind_param("s", $idNotes);
    
    if (!$stmt1->execute()) {
        throw new Exception("Gagal menghapus data peserta: " . $stmt1->error);
    }
    $stmt1->close();
    
    // 2. Hapus Notulen Utama (Prepared Statement)
    $deleteNoteQuery = "DELETE FROM tbnotes_data WHERE idNotes = ?";
    $stmt2 = $conn_db_notes->prepare($deleteNoteQuery);
    $stmt2->bind_param("s", $idNotes);
    
    if (!$stmt2->execute()) {
        throw new Exception("Gagal menghapus notulen: " . $stmt2->error);
    }
    $stmt2->close();
    
    // Commit Transaksi
    mysqli_commit($conn_db_notes);
    
    if (function_exists('logSecuritySuccess')) {
        logSecuritySuccess('DELETE_COMPLETED', $userNim, $idNotes);
    }
    
    echo json_encode(['status' => 'success', 'message' => 'Notulen berhasil dihapus']);
    
} catch (Exception $e) {
    mysqli_rollback($conn_db_notes);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>