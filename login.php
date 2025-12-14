<?php
header('Content-Type: application/json');
include 'conn_db_users.php'; // Menggunakan koneksi DB Users yang sudah dibuat

// Terima input JSON
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

$nim = isset($input['nim']) ? $input['nim'] : '';
$password = isset($input['password']) ? $input['password'] : '';

if (empty($nim) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'NIM dan Password wajib diisi']);
    exit;
}

// 1. Cari user berdasarkan NIM
$query = "SELECT * FROM tbUsers WHERE nim = '$nim' LIMIT 1";
$result = mysqli_query($conn_db_users, $query);

if ($row = mysqli_fetch_assoc($result)) {
    // 2. Verifikasi Password (Hash vs Input)
    if (password_verify($password, $row['password'])) {
        // Password Benar!
        
        // Buat data session yang aman (jangan kirim balik password hash)
        $userData = [
            'id' => $row['id'],
            'nim' => $row['nim'],
            'name' => $row['name'],
            'email' => $row['email'],
            'programStudi' => $row['programStudi']
        ];
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Login berhasil',
            'user' => $userData
        ]);
    } else {
        // Password Salah
        echo json_encode(['status' => 'error', 'message' => 'Password salah']);
    }
} else {
    // NIM Tidak Ditemukan
    echo json_encode(['status' => 'error', 'message' => 'NIM tidak terdaftar']);
}
?>