<?php
session_start();
$conn=new mysqli("localhost","root","","sipnotul");

if(!isset($_SESSION['user_id'])) exit;

$kode=$_POST['kode'];
$isi=$_POST['isi'];
$user=$_SESSION['user_id'];

$cek=$conn->query("
  SELECT * FROM notulensi n
  JOIN notulensi_anggota a ON n.id=a.notulensi_id
  WHERE n.kode_share='$kode' AND a.user_id=$user AND a.role='editor'
");

if($cek->num_rows==0) exit;

$conn->query("UPDATE notulensi SET isi='$isi' WHERE kode_share='$kode'");