<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Ambil Data
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
$attendeesJson = isset($_POST['attendees']) ? $_POST['attendees'] : '[]';
$attendees     = json_decode($attendeesJson, true);

mysqli_begin_transaction($conn_db_notes);

try {
    // 1. SIMPAN DATA NOTULEN
    if (empty($idNotes)) {
        $newId = 'NOT' . strtoupper(uniqid()); 
        $idNotes = $newId;

        $queryNote = "INSERT INTO tbnotesdata 
                  (idNotes, title, content, meetingDate, time, location, decisions, followUp, authorNim, isPublic, createdAt) 
                  VALUES 
                  ('$newId', '$title', '$content', '$meetingDate', '$time', '$location', '$decisions', '$followUp', '$authorNim', '$isPublic', NOW())";
    } else {
        $queryNote = "UPDATE tbnotesdata SET 
                  title = '$title', content = '$content', meetingDate = '$meetingDate', 
                  time = '$time', location = '$location', decisions = '$decisions', 
                  followUp = '$followUp', isPublic = '$isPublic'
                  WHERE idNotes = '$idNotes'";
    }

    if (!mysqli_query($conn_db_notes, $queryNote)) {
        throw new Exception("Gagal menyimpan notulen: " . mysqli_error($conn_db_notes));
    }

    // 2. SIMPAN DATA PESERTA
    // Hapus peserta lama dulu (Reset)
    $deleteAttendees = "DELETE FROM tbnotesattendees WHERE idNotes = '$idNotes'";
    mysqli_query($conn_db_notes, $deleteAttendees);

    if (!empty($attendees)) {
        foreach ($attendees as $person) {
            $inputNim  = mysqli_real_escape_string($conn_db_notes, $person['nim']);
            $inputName = mysqli_real_escape_string($conn_db_notes, $person['name']);
            
            // ========================================================
            // [LOGIKA BARU] PENCARIAN NIM OTOMATIS (AUTO-LINK)
            // ========================================================
            $finalNim = $inputNim;

            // Jika NIM yang dikirim kosong atau tanda strip ('-')
            if ($inputNim == '-' || empty($inputNim)) {
                // Cek ke database user (dbusers.tbusers) berdasarkan Nama
                $queryCheckUser = "SELECT nim FROM dbusers.tbusers WHERE name LIKE '$inputName' LIMIT 1";
                $resultUser = mysqli_query($conn_db_notes, $queryCheckUser);
                
                // Jika ketemu, update $finalNim dengan NIM asli dari database
                if ($resultUser && mysqli_num_rows($resultUser) > 0) {
                    $userData = mysqli_fetch_assoc($resultUser);
                    $finalNim = $userData['nim'];
                }
            }
            // ========================================================

            // Insert ke database menggunakan $finalNim (NIM Asli atau tetap strip)
            $insertAttendee = "INSERT INTO tbnotesattendees (idNotes, nim, name) VALUES ('$idNotes', '$finalNim', '$inputName')";
            
            if (!mysqli_query($conn_db_notes, $insertAttendee)) {
                throw new Exception("Gagal menyimpan peserta: " . mysqli_error($conn_db_notes));
            }
        }
    }

    mysqli_commit($conn_db_notes);
    echo json_encode(['status' => 'success', 'message' => 'Berhasil disimpan', 'id' => $idNotes]);

} catch (Exception $e) {
    mysqli_rollback($conn_db_notes);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>