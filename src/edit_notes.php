<?php
// include database connection file
include 'conn_db_notes.php';
    $idNotes = $_POST['idNotes'];
    $title = $_POST['title'];
    $content = $_POST['content'];
    $meetingDate = $_POST['meetingDate'];
    $time = $_POST['time'];
    $location = $_POST['location'];
    $decisions = $_POST['decisions'];
    $followUp = $_POST['followUp'];
    $followUpCompleted = $_POST['followUpCompleted'];
    $createdAt = $_POST['createdAt'];
    $authorId = $_POST['authorId'];
    $isPublic = $_POST['isPublic'];
    $result = mysqli_query($conn_db_notes, "UPDATE mahasiswa SET nama= '$nama', jurusan= '$jurusan',
        angkatan= '$angkatan' WHERE nim= '$nim'");
    // Redirect to homepage to display updated user in list
    header("Location: mahasiswa.php");
?>