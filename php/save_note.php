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
        // --- MODE BARU (INSERT) ---
        $newId = 'NOT' . strtoupper(uniqid()); 
        $idNotes = $newId;

        // === FITUR PRNG 4 DIGIT ===
        // Menghasilkan angka acak 0000 sampai 9999
        $accessCode = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT); 

        $queryNote = "INSERT INTO tbnotes_data 
                  (idNotes, title, content, meetingDate, time, location, decisions, followUp, authorNim, isPublic, accessCode, createdAt) 
                  VALUES 
                  ('$newId', '$title', '$content', '$meetingDate', '$time', '$location', '$decisions', '$followUp', '$authorNim', '$isPublic', '$accessCode', NOW())";
    } else {
        // --- MODE EDIT (UPDATE) ---
        // Kita TIDAK mengupdate accessCode agar kodenya tetap sama selamanya
        $queryNote = "UPDATE tbnotes_data SET 
                  title = '$title', content = '$content', meetingDate = '$meetingDate', 
                  time = '$time', location = '$location', decisions = '$decisions', 
                  followUp = '$followUp', isPublic = '$isPublic'
                  WHERE idNotes = '$idNotes'";
    }

    if (!mysqli_query($conn_db_notes, $queryNote)) {
        throw new Exception("Gagal menyimpan notulen: " . mysqli_error($conn_db_notes));
    }

    // 2. SIMPAN DATA PESERTA (Sama seperti sebelumnya)
    $deleteAttendees = "DELETE FROM tbnotes_attendees WHERE idNotes = '$idNotes'";
    mysqli_query($conn_db_notes, $deleteAttendees);

    if (!empty($attendees)) {
        foreach ($attendees as $person) {
            $inputNim  = mysqli_real_escape_string($conn_db_notes, $person['nim']);
            $inputName = mysqli_real_escape_string($conn_db_notes, $person['name']);
            
            // Logika Auto-Link NIM
            $finalNim = $inputNim;
            if ($inputNim == '-' || empty($inputNim)) {
                $queryCheckUser = "SELECT nim FROM sipnotul.users WHERE name LIKE '$inputName' LIMIT 1";
                $resultUser = mysqli_query($conn_db_notes, $queryCheckUser);
                if ($resultUser && mysqli_num_rows($resultUser) > 0) {
                    $userData = mysqli_fetch_assoc($resultUser);
                    $finalNim = $userData['nim'];
                }
            }

            $insertAttendee = "INSERT INTO tbnotes_attendees (idNotes, nim, name) VALUES ('$idNotes', '$finalNim', '$inputName')";
            if (!mysqli_query($conn_db_notes, $insertAttendee)) {
                throw new Exception("Gagal menyimpan peserta: " . mysqli_error($conn_db_notes));
            }
        }
    }

    mysqli_commit($conn_db_notes);
    
    // Kembalikan juga accessCode ke frontend agar bisa langsung ditampilkan
    // Jika mode edit, kita harus fetch accessCode lama (opsional), tapi message sukses sudah cukup
    echo json_encode([
        'status' => 'success', 
        'message' => 'Berhasil disimpan', 
        'id' => $idNotes,
        'accessCode' => isset($accessCode) ? $accessCode : null
    ]);

} catch (Exception $e) {
    mysqli_rollback($conn_db_notes);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>