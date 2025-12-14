<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

// Ambil kode dari URL (misal: ?code=1234)
$code = isset($_GET['code']) ? mysqli_real_escape_string($conn_db_notes, $_GET['code']) : '';

if (empty($code)) {
    echo json_encode(['status' => 'error', 'message' => 'Masukkan kode akses']);
    exit;
}

// QUERY PENCARIAN
// Kita cari apakah input cocok dengan 'accessCode' (4 digit) ATAU 'idNotes' (ID Panjang)
$query = "SELECT idNotes FROM tbnotesdata WHERE accessCode = '$code' OR idNotes = '$code' LIMIT 1";

$result = mysqli_query($conn_db_notes, $query);

if ($result && mysqli_num_rows($result) > 0) {
    // KETEMU! Ambil ID Notulen aslinya
    $row = mysqli_fetch_assoc($result);
    echo json_encode([
        'status' => 'success', 
        'idNotes' => $row['idNotes'] // Kirim ID asli ke Javascript
    ]);
} else {
    // TIDAK KETEMU
    echo json_encode([
        'status' => 'error', 
        'message' => 'Notulen tidak ditemukan. Periksa kembali kode akses Anda.'
    ]);
}
?>