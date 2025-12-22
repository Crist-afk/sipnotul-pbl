<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

// Debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Ambil Data
$idNotes      = isset($_POST['idNotes']) ? $_POST['idNotes'] : '';
$title        = mysqli_real_escape_string($conn_db_notes, $_POST['title']);
$content      = mysqli_real_escape_string($conn_db_notes, $_POST['content']);
$meetingDate  = $_POST['meetingDate'];
$time         = $_POST['time'];
$location     = mysqli_real_escape_string($conn_db_notes, $_POST['location']);
$decisions    = mysqli_real_escape_string($conn_db_notes, $_POST['decisions']);
$followUp     = mysqli_real_escape_string($conn_db_notes, $_POST['followUp']);
$authorNim    = $_POST['authorNim'];
$isPublic     = isset($_POST['isPublic']) ? 1 : 0;
$attendeesJson = isset($_POST['attendees']) ? $_POST['attendees'] : '[]';
$attendees     = json_decode($attendeesJson, true);

// ==========================================
// LOGIKA UPLOAD FILE
// ==========================================
$attachmentPath = null;
$uploadDir = '../uploads/'; // Folder fisik (mundur satu folder dari php/)

// Cek apakah ada file yang diupload dan tidak error
if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['attachment']['tmp_name'];
    $fileName    = $_FILES['attachment']['name'];
    $fileSize    = $_FILES['attachment']['size'];
    $fileType    = $_FILES['attachment']['type'];
    
    // Validasi Ekstensi (Opsional tapi disarankan)
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));
    $allowedfileExtensions = array('jpg', 'gif', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip');
    
    if (in_array($fileExtension, $allowedfileExtensions)) {
        // Buat nama unik: time_namafileasli
        $newFileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "_", $fileName);
        $dest_path = $uploadDir . $newFileName;

        if(move_uploaded_file($fileTmpPath, $dest_path)) {
            // Path yang disimpan di database (tanpa ../)
            $attachmentPath = 'uploads/' . $newFileName;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal memindahkan file ke folder uploads. Pastikan folder "uploads" ada dan memiliki izin tulis.']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Tipe file tidak diizinkan: ' . $fileExtension]);
        exit;
    }
}

mysqli_begin_transaction($conn_db_notes);

try {
    // 1. SIMPAN DATA NOTULEN
    if (empty($idNotes)) {
        // --- MODE INSERT (BARU) ---
        $accessCode = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT); 
        
        // Default attachment NULL jika tidak ada file
        $dbAttachment = $attachmentPath ? "'$attachmentPath'" : "NULL";

        $queryNote = "INSERT INTO tbnotes_data 
                  (title, content, meetingDate, time, location, decisions, followUp, authorNim, isPublic, accessCode, attachment, createdAt) 
                  VALUES 
                  ('$title', '$content', '$meetingDate', '$time', '$location', '$decisions', '$followUp', '$authorNim', '$isPublic', '$accessCode', $dbAttachment, NOW())";
        
        if (!mysqli_query($conn_db_notes, $queryNote)) {
            throw new Exception("Gagal Insert: " . mysqli_error($conn_db_notes));
        }

        $idNotes = mysqli_insert_id($conn_db_notes);

    } else {
        // --- MODE UPDATE (EDIT) ---
        
        // Logika Update File:
        // Jika user upload file baru ($attachmentPath ada), kita update kolom attachment.
        // Jika user TIDAK upload file (file kosong), kita JANGAN ubah kolom attachment (pakai file lama).
        
        $sqlAttachmentPart = "";
        if ($attachmentPath) {
            $sqlAttachmentPart = ", attachment = '$attachmentPath'";
            
            // Opsional: Hapus file lama fisik jika mau hemat storage (perlu query select dulu)
        }

        $queryNote = "UPDATE tbnotes_data SET 
                  title = '$title', content = '$content', meetingDate = '$meetingDate', 
                  time = '$time', location = '$location', decisions = '$decisions', 
                  followUp = '$followUp', isPublic = '$isPublic'
                  $sqlAttachmentPart
                  WHERE idNotes = '$idNotes'";

        if (!mysqli_query($conn_db_notes, $queryNote)) {
            throw new Exception("Gagal Update: " . mysqli_error($conn_db_notes));
        }
    }

    // 2. SIMPAN DATA PESERTA (Sama seperti sebelumnya)
    $deleteAttendees = "DELETE FROM tbnotes_attendees WHERE idNotes = '$idNotes'";
    mysqli_query($conn_db_notes, $deleteAttendees);

    if (!empty($attendees)) {
        foreach ($attendees as $person) {
            $inputName = mysqli_real_escape_string($conn_db_notes, $person['name']);
            $inputNim  = (isset($person['nim']) && $person['nim'] != '-') ? $person['nim'] : '';
            
            $finalNim = $inputNim;
            
            if (empty($finalNim) || $finalNim == '-') {
                $queryCheckUser = "SELECT nim FROM users WHERE name LIKE '%$inputName%' LIMIT 1";
                $resultUser = mysqli_query($conn_db_notes, $queryCheckUser);
                
                if ($resultUser && mysqli_num_rows($resultUser) > 0) {
                    $userData = mysqli_fetch_assoc($resultUser);
                    $finalNim = $userData['nim'];
                } else {
                    $finalNim = '-'; 
                }
            }

            $insertAttendee = "INSERT INTO tbnotes_attendees (idNotes, nim, name) VALUES ('$idNotes', '$finalNim', '$inputName')";
            mysqli_query($conn_db_notes, $insertAttendee);
        }
    }

    mysqli_commit($conn_db_notes);
    
    // Ambil accessCode
    if (isset($accessCode)) {
        $code = $accessCode;
    } else {
        $qCode = mysqli_query($conn_db_notes, "SELECT accessCode FROM tbnotes_data WHERE idNotes='$idNotes'");
        $dCode = mysqli_fetch_assoc($qCode);
        $code = $dCode['accessCode'];
    }

    echo json_encode([
        'status' => 'success', 
        'message' => 'Berhasil disimpan', 
        'id' => $idNotes,
        'accessCode' => $code
    ]);

} catch (Exception $e) {
    mysqli_rollback($conn_db_notes);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>