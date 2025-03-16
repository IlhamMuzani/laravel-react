<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;

class Karyawan extends Model
{
    use HasFactory;
    protected $fillable = [
        'kode_karyawan',
        'departemen_id',
        'post_id',
        'qrcode_karyawan',
        'no_ktp',
        'no_sim',
        'nama_lengkap',
        'nama_kecil',
        'gender',
        'tanggal_lahir',
        'tanggal_gabung',
        'tanggal_keluar',
        'telp',
        'jabatan',
        'alamat',
        'alamat2',
        'alamat3',
        'gmail',
        'gambar',
        'ft_ktp',
        'ft_sim',
        'ft_kk',
        'ft_kk_penjamin',
        'ft_skck',
        'ft_surat_pernyataan',
        'ft_terbaru',
        'ft_rumah',
        'ft_penjamin',
        'latitude',
        'longitude',
        'pembayaran',
        'gaji',
        'tabungan',
        'kasbon',
        'deposit',
        'bayar_kasbon',
        'bpjs',
        'potongan_ke',
        'potongan_backup',
        'kasbon_backup',
        'nama_bank',
        'atas_nama',
        'norek',
        'status',
        'tanggal_awal',
        'tanggal_akhir',
    ];


    use SoftDeletes;
    protected $dates = ['deleted_at'];

    public static function getId()
    {
        return $getId = DB::table('karyawans')->orderBy('id', 'DESC')->take(1)->get();
    }

    public function departemen()
    {
        return $this->belongsTo(Departemen::class);
    }

    public function user()
    {
        return $this->hasMany(User::class);
    }

    public function karyawan()
    {
        return $this->hasMany(Karyawan::class);
    }

}