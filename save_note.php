<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

// Cek Method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// 1. AMBIL DATA UTAMA NOTULEN
$idNotes      = isset($_POST['idNotes']) ? $_POST['idNotes'] : '';
$title        = $_POST['title'];
$content      = $_POST['content'];
$meetingDate  = $_POST['meetingDate'];
$time         = $_POST['time'];
$location     = $_POST['location'];
$decisions    = $_POST['decisions'];
$followUp     = $_POST['followUp'];
$authorNim    = $_POST['authorNim'];
$isPublic     = isset($_POST['isPublic']) ? 1 : 0;

// 2. AMBIL DATA PESERTA (Dikirim sebagai Array JSON String dari JS)
$attendeesJson = isset($_POST['attendees']) ? $_POST['attendees'] : '[]';
$attendees     = json_decode($attendeesJson, true); // Ubah jadi Array PHP

// Mulai Transaksi (Agar jika satu gagal, semua batal)
mysqli_begin_transaction($conn_db_notes);

try {
    // A. SIMPAN/UPDATE DATA NOTULEN
    if (empty($idNotes)) {
        // --- BARU ---
        $newId = 'NOT' . strtoupper(uniqid()); 
        $idNotes = $newId; // Set ID untuk dipakai di tabel peserta

        $queryNote = "INSERT INTO tbNotesData 
                  (idNotes, title, content, meetingDate, time, location, decisions, followUp, authorNim, isPublic, createdAt) 
                  VALUES 
                  ('$newId', '$title', '$content', '$meetingDate', '$time', '$location', '$decisions', '$followUp', '$authorNim', '$isPublic', NOW())";
    } else {
        // --- UPDATE ---
        $queryNote = "UPDATE tbNotesData SET 
                  title = '$title', content = '$content', meetingDate = '$meetingDate', 
                  time = '$time', location = '$location', decisions = '$decisions', 
                  followUp = '$followUp', isPublic = '$isPublic'
                  WHERE idNotes = '$idNotes'";
    }

    if (!mysqli_query($conn_db_notes, $queryNote)) {
        throw new Exception("Gagal menyimpan data notulen: " . mysqli_error($conn_db_notes));
    }

    // B. SIMPAN PESERTA (Hapus dulu yang lama, masukkan yang baru)
    // 1. Hapus peserta lama untuk notulen ini (Reset)
    $deleteAttendees = "DELETE FROM tbNotesAttendees WHERE idNotes = '$idNotes'";
    mysqli_query($conn_db_notes, $deleteAttendees);

    // 2. Masukkan peserta baru
    if (!empty($attendees)) {
        foreach ($attendees as $person) {
            $nim  = mysqli_real_escape_string($conn_db_notes, $person['nim']);
            $name = mysqli_real_escape_string($conn_db_notes, $person['name']);
            
            $insertAttendee = "INSERT INTO tbNotesAttendees (idNotes, nim, name) VALUES ('$idNotes', '$nim', '$name')";
            if (!mysqli_query($conn_db_notes, $insertAttendee)) {
                throw new Exception("Gagal menyimpan peserta: " . mysqli_error($conn_db_notes));
            }
        }
    }

    // Jika semua lancar, COMMIT
    mysqli_commit($conn_db_notes);
    
    echo json_encode([
        'status' => 'success', 
        'message' => 'Notulen dan peserta berhasil disimpan',
        'id' => $idNotes
    ]);

} catch (Exception $e) {
    // Jika ada error, BATALKAN SEMUA
    mysqli_rollback($conn_db_notes);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>