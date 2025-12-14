<?php
// Izinkan akses dari browser (CORS) & Set tipe respon JSON
header('Content-Type: application/json');

// Koneksi Database
include 'conn_db_notes.php';

// Cek apakah request method adalah POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// 1. Ambil data dari FORM HTML (FormData)
$idNotes      = isset($_POST['idNotes']) ? $_POST['idNotes'] : '';
$title        = $_POST['title'];
$content      = $_POST['content'];
$meetingDate  = $_POST['meetingDate'];
$time         = $_POST['time'];
$location     = $_POST['location'];
$decisions    = $_POST['decisions'];
$followUp     = $_POST['followUp'];
$authorNim    = $_POST['authorNim']; // Diambil dari Javascript user login
$isPublic     = isset($_POST['isPublic']) ? 1 : 0; // Checkbox logic

// 2. Logika: INSERT (Baru) atau UPDATE (Edit)
if (empty($idNotes)) {
    // --- MODE BUAT BARU ---
    
    // Generate ID Unik, misal: NOT6578a...
    $newId = 'NOT' . strtoupper(uniqid()); 

    $query = "INSERT INTO tbNotesData 
              (idNotes, title, content, meetingDate, time, location, decisions, followUp, authorNim, isPublic, createdAt) 
              VALUES 
              ('$newId', '$title', '$content', '$meetingDate', '$time', '$location', '$decisions', '$followUp', '$authorNim', '$isPublic', NOW())";
    
    $action = "dibuat";

} else {
    // --- MODE UPDATE ---
    
    $query = "UPDATE tbNotesData SET 
              title = '$title',
              content = '$content',
              meetingDate = '$meetingDate',
              time = '$time',
              location = '$location',
              decisions = '$decisions',
              followUp = '$followUp',
              isPublic = '$isPublic'
              WHERE idNotes = '$idNotes'";
              
    $action = "diperbarui";
}

// 3. Eksekusi Query
if (mysqli_query($conn_db_notes, $query)) {
    echo json_encode([
        'status' => 'success', 
        'message' => "Notulen berhasil $action",
        'id' => empty($idNotes) ? $newId : $idNotes
    ]);
} else {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Database Error: ' . mysqli_error($conn_db_notes)
    ]);
}
?>