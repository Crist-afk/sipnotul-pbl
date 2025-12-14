<?php
include 'conn_db_notes.php';

// Ambil data dari form
$idNotes = $_POST['idNotes'];
$title = $_POST['title'];
$content = $_POST['content'];
// ... (ambil variabel lain) ...

// PERBAIKAN: Gunakan nama tabel yang sesuai gambar (tbnotesdata)
// Pastikan nama kolom (title, content, dll) sama persis dengan di database
$query = "UPDATE tbnotesdata SET 
          title = '$title', 
          content = '$content',
          meetingDate = '$meetingDate',
          time = '$time',
          location = '$location'
          WHERE idNotes = '$idNotes'";

$result = mysqli_query($conn_db_notes, $query);

if($result) {
    header("Location: manage.html"); // Kembalikan ke halaman manage
} else {
    echo "Error: " . mysqli_error($conn_db_notes);
}
?>