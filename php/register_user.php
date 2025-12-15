<?php
header('Content-Type: application/json');
// Tampilkan semua error PHP untuk debugging (hapus baris ini saat production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'conn_db_users.php';

// 1. Cek Koneksi Database Dulu
if (!$conn_db_users) {
    echo json_encode(['status' => 'error', 'message' => 'Koneksi Database Gagal: ' . mysqli_connect_error()]);
    exit;
}

// 2. Ambil Data (Support JSON & Form Data)
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

// Prioritas ambil dari $_POST, jika tidak ada baru dari JSON
$name = isset($_POST['name']) ? $_POST['name'] : (isset($input['name']) ? $input['name'] : '');
$nim = isset($_POST['nim']) ? $_POST['nim'] : (isset($input['nim']) ? $input['nim'] : '');
$email = isset($_POST['email']) ? $_POST['email'] : (isset($input['email']) ? $input['email'] : '');
$programStudi = isset($_POST['programStudi']) ? $_POST['programStudi'] : (isset($input['programStudi']) ? $input['programStudi'] : '');
$password = isset($_POST['password']) ? $_POST['password'] : (isset($input['password']) ? $input['password'] : '');

// 3. Validasi Input Kosong
if (empty($name) || empty($nim) || empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap. Cek Inputan.']);
    exit;
}

// 4. Cek Duplikasi NIM/Email
$checkQuery = "SELECT id FROM tbusers WHERE nim = '$nim' OR email = '$email'";
$checkResult = mysqli_query($conn_db_users, $checkQuery);

if (!$checkResult) {
    echo json_encode(['status' => 'error', 'message' => 'Error Cek Duplikasi: ' . mysqli_error($conn_db_users)]);
    exit;
}

if (mysqli_num_rows($checkResult) > 0) {
    echo json_encode(['status' => 'error', 'message' => 'NIM atau Email sudah terdaftar!']);
    exit;
}

// 5. Insert ke Database (Tanpa Enkripsi sesuai request)
// PERHATIKAN: Pastikan nama kolom (kiri) SAMA PERSIS dengan di phpMyAdmin
// Contoh: name, nim, email, programStudi, password
$query = "INSERT INTO tbusers (name, nim, email, programStudi, password) 
          VALUES ('$name', '$nim', '$email', '$programStudi', '$password')";

if (mysqli_query($conn_db_users, $query)) {
    $newId = mysqli_insert_id($conn_db_users);
    echo json_encode([
        'status' => 'success',
        'message' => 'Registrasi berhasil!',
        'user' => [
            'id' => $newId,
            'name' => $name,
            'nim' => $nim,
            'prodi' => $programStudi
        ]
    ]);
} else {
    // Ini akan memberitahu Anda error spesifiknya (misal salah nama kolom)
    echo json_encode(['status' => 'error', 'message' => 'Gagal Insert: ' . mysqli_error($conn_db_users)]);
}
?>