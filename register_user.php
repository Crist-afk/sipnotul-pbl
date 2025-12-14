<?php
// register_user.php
header('Content-Type: application/json');
include 'conn_db_users.php';

// Cek method request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Ambil data dari input JSON atau POST Form
// Kita support kedua cara agar fleksibel
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

// Jika input dari JSON (via fetch body json), pakai $input. Jika FormData, pakai $_POST
$name = isset($input['name']) ? $input['name'] : $_POST['name'];
$nim = isset($input['nim']) ? $input['nim'] : $_POST['nim'];
$email = isset($input['email']) ? $input['email'] : $_POST['email'];
$programStudi = isset($input['programStudi']) ? $input['programStudi'] : $_POST['programStudi'];
$passwordRaw = isset($input['password']) ? $input['password'] : $_POST['password'];

// Validasi sederhana
if (empty($name) || empty($nim) || empty($email) || empty($passwordRaw)) {
    echo json_encode(['status' => 'error', 'message' => 'Semua data wajib diisi']);
    exit;
}

// 1. Cek apakah NIM atau Email sudah ada?
$checkQuery = "SELECT id FROM tbUsers WHERE nim = '$nim' OR email = '$email'";
$checkResult = mysqli_query($conn_db_users, $checkQuery);

if (mysqli_num_rows($checkResult) > 0) {
    echo json_encode(['status' => 'error', 'message' => 'NIM atau Email sudah terdaftar!']);
    exit;
}

// 2. Hash Password (WAJIB untuk keamanan)
// Password asli diubah jadi kode acak agar aman dari hacker
$hashedPassword = password_hash($passwordRaw, PASSWORD_DEFAULT);

// 3. Masukkan ke Database
$query = "INSERT INTO tbUsers (name, nim, email, password, programStudi) 
          VALUES ('$name', '$nim', '$email', '$hashedPassword', '$programStudi')";

if (mysqli_query($conn_db_users, $query)) {
    // Ambil ID user yang baru dibuat
    $newId = mysqli_insert_id($conn_db_users);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Registrasi berhasil!',
        'user' => [
            'id' => $newId,
            'name' => $name,
            'nim' => $nim,
            'email' => $email
        ]
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Database Error: ' . mysqli_error($conn_db_users)]);
}
?>