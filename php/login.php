<?php
header('Content-Type: application/json');
include 'conn_db_users.php'; // Koneksi database

// 1. MENERIMA INPUT (Support $_POST dan JSON)
// Kita cek $_POST dulu (dari auth.js yang baru), kalau kosong baru cek JSON
$nim = isset($_POST['nim']) ? $_POST['nim'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($nim) && empty($password)) {
    // Fallback: Coba baca JSON raw (jika pakai cara lama)
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);
    $nim = isset($input['nim']) ? $input['nim'] : '';
    $password = isset($input['password']) ? $input['password'] : '';
}

// Validasi
if (empty($nim) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'NIM dan Password wajib diisi']);
    exit;
}

// 2. CARI USER DI DATABASE
$query = "SELECT * FROM tbUsers WHERE nim = '$nim' LIMIT 1";
$result = mysqli_query($conn_db_users, $query);

if ($row = mysqli_fetch_assoc($result)) {
    
    // 3. VERIFIKASI PASSWORD (PLAIN TEXT / TANPA ENKRIPSI)
    // Ubah: if (password_verify($password, $row['password'])) { ... }
    // Menjadi perbandingan langsung:
    if ($password === $row['password']) {
        
        // Password Benar!
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