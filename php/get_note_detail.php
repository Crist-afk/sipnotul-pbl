<<<<<<< HEAD
<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

if (!isset($_GET['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID tidak ditemukan']);
    exit;
}

$id = mysqli_real_escape_string($conn_db_notes, $_GET['id']);

// Ambil Detail Notulen
// Perhatikan: LEFT JOIN ke tabel users (karena dalam satu database sipnotul)
$query = "SELECT n.*, u.name AS authorName 
          FROM tbnotes_data n 
          LEFT JOIN users u ON n.authorNim = u.nim 
          WHERE n.idNotes = '$id'";

$result = mysqli_query($conn_db_notes, $query);
$noteData = mysqli_fetch_assoc($result);

if ($noteData) {
    // Ambil Data Peserta
    $queryAttendees = "SELECT nim, name FROM tbnotes_attendees WHERE idNotes = '$id'";
    $resAttendees = mysqli_query($conn_db_notes, $queryAttendees);
    
    $attendeesList = [];
    if ($resAttendees) {
        while($row = mysqli_fetch_assoc($resAttendees)) {
            $attendeesList[] = $row;
        }
    }

    $noteData['attendeesList'] = $attendeesList;

    echo json_encode(['status' => 'success', 'data' => $noteData]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Notulen tidak ditemukan']);
}
?>
=======
<?php
header('Content-Type: application/json');
include 'conn_db_notes.php';

// 1. Cek ID/Code
if (!isset($_GET['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID tidak ditemukan']);
    exit;
}

$id = mysqli_real_escape_string($conn_db_notes, $_GET['id']);

/**
 * 2. QUERY UTAMA
 * Perbaikan: 
 * - Nama tabel: tbnotes_data (bukan tbnotesdata)
 * - JOIN ke tabel: users (bukan dbusers.tbusers)
 * - idNotes adalah Primary Key
 */
$query = "SELECT n.*, u.name AS authorName 
          FROM tbnotes_data n 
          LEFT JOIN users u ON n.authorNim = u.nim 
          WHERE n.idNotes = '$id' OR n.accessCode = '$id'";

$result = mysqli_query($conn_db_notes, $query);

if (!$result) {
    echo json_encode(['status' => 'error', 'message' => 'Query Error: ' . mysqli_error($conn_db_notes)]);
    exit;
}

$noteData = mysqli_fetch_assoc($result);

if ($noteData) {
    /**
     * 3. QUERY AMBIL DATA PESERTA
     * Nama tabel: tbnotes_attendees (bukan tbnotesattendees)
     */
    $idNotesActual = $noteData['idNotes'];
    $queryAttendees = "SELECT nim, name FROM tbnotes_attendees WHERE idNotes = '$idNotesActual'";
    $resAttendees = mysqli_query($conn_db_notes, $queryAttendees);
    
    $attendeesList = [];
    if ($resAttendees) {
        while($row = mysqli_fetch_assoc($resAttendees)) {
            $attendeesList[] = $row;
        }
    }

    // Gabungkan data
    $noteData['attendeesList'] = $attendeesList;

    echo json_encode(['status' => 'success', 'data' => $noteData]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Notulen tidak ditemukan']);
}
>>>>>>> 304aec8ff8cd0d3c211d11ca51e452ab67c45122
