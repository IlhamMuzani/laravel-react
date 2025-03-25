<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class KaryawanController extends Controller
{
    public function index()
    {
        $karyawan = Karyawan::all();
        return response()->json($karyawan);
    }


    public function add(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:255',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'ft_sim' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ], [
            'nama_lengkap.required' => 'Masukkan nama lengkap karyawan',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->all()], 422);
        }

        // Generate kode karyawan
        $kode_karyawan = $this->kode();

        // Proses upload gambar profil
        $namaGambar = null;
        if ($request->hasFile('gambar')) {
            $gambar = str_replace(' ', '', $request->file('gambar')->getClientOriginalName());
            $namaGambar = 'karyawan/' . date('mYdHs') . rand(1, 10) . '_' . $gambar;
            $request->file('gambar')->storeAs('public/uploads/', $namaGambar);
        }

        // Proses upload foto SIM
        $namaGambar2 = null;
        if ($request->hasFile('ft_sim')) {
            $ftSim = str_replace(' ', '', $request->file('ft_sim')->getClientOriginalName());
            $namaGambar2 = 'ft_sim/' . date('mYdHs') . rand(1, 10) . '_' . $ftSim;
            $request->file('ft_sim')->storeAs('public/uploads/', $namaGambar2);
        }

        // Simpan data karyawan
        $karyawan = Karyawan::create([
            'departemen_id' => $request->departemen_id,
            'nama_lengkap' => $request->nama_lengkap,
            'nama_kecil' => $request->nama_kecil,
            'gender' => $request->gender,
            'no_ktp' => $request->no_ktp,
            'no_sim' => $request->no_sim,
            'tanggal_lahir' => $request->tanggal_lahir,
            'tanggal_gabung' => $request->tanggal_gabung,
            'telp' => $request->telp,
            'gmail' => $request->gmail,
            'alamat' => $request->alamat,
            'kode_karyawan' => $kode_karyawan,
            'gambar' => $namaGambar,
            'ft_sim' => $namaGambar2,
            'nama_bank' => $request->nama_bank,
            'atas_nama' => $request->atas_nama,
            'norek' => $request->norek,
            'qrcode_karyawan' => 'https://javaline.id/karyawan/' . $kode_karyawan,
            'tanggal_awal' => Carbon::now('Asia/Jakarta'),
        ]);

        return response()->json([
            'message' => 'Berhasil menambahkan karyawan',
            'data' => $karyawan
        ], 201);
    }


    public function edit($id)
    {
        $karyawan = Karyawan::find($id);

        if (!$karyawan) {
            return response()->json(['error' => 'Karyawan tidak ditemukan'], 404);
        }

        return response()->json(['data' => $karyawan]);
    }


    public function update(Request $request, $id)
    {
        // Validasi data input
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'ft_sim' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ], [
            'nama_lengkap.required' => 'Masukkan nama lengkap karyawan',
        ]);

        // Cari data karyawan
        $karyawan = Karyawan::find($id);

        if (!$karyawan) {
            return response()->json(['error' => 'Karyawan tidak ditemukan'], 404);
        }

        // Upload Gambar jika ada
        if ($request->hasFile('gambar')) {
            $gambar = $request->file('gambar');
            $namaGambar = time() . '_' . $gambar->getClientOriginalName();
            $gambar->move(public_path('uploads/karyawan'), $namaGambar);
            $karyawan->gambar = $namaGambar;
        }

        // Upload Foto SIM jika ada
        if ($request->hasFile('ft_sim')) {
            $ftSim = $request->file('ft_sim');
            $namaGambar2 = time() . '_' . $ftSim->getClientOriginalName();
            $ftSim->move(public_path('uploads/karyawan'), $namaGambar2);
            $karyawan->ft_sim = $namaGambar2;
        }

        // Update data karyawan
        $karyawan->update([
            'departemen_id' => $request->departemen_id,
            'nama_lengkap' => $request->nama_lengkap,
            'nama_kecil' => $request->nama_kecil,
            'gender' => $request->gender,
            'no_ktp' => $request->no_ktp,
            'no_sim' => $request->no_sim,
            'tanggal_lahir' => $request->tanggal_lahir,
            'tanggal_gabung' => $request->tanggal_gabung,
            'telp' => $request->telp,
            'gmail' => $request->gmail,
            'alamat' => $request->alamat,
            'nama_bank' => $request->nama_bank,
            'atas_nama' => $request->atas_nama,
            'norek' => $request->norek,
        ]);

        return response()->json(['message' => 'Karyawan berhasil diperbarui', 'data' => $karyawan]);
    }


    public function show($id)
    {
        $karyawan = Karyawan::with('departemen')
            ->select(
                'id',
                'kode_karyawan',
                'nama_lengkap',
                'nama_kecil',
                'no_ktp',
                'no_sim',
                'gmail',
                'alamat',
                'tanggal_lahir',
                'tanggal_gabung',
                'telp',
                'departemen_id',
                'qrcode_karyawan',
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
            )
            ->find($id);

        if (!$karyawan) {
            return response()->json(['error' => 'Karyawan tidak ditemukan'], 404);
        }

        return response()->json(['data' => $karyawan], 200);
    }

    public function delete($id)
    {
        // Cari data karyawan berdasarkan ID
        $karyawan = Karyawan::find($id);

        // Jika data tidak ditemukan, kembalikan response error
        if (!$karyawan) {
            return response()->json([
                'status' => false,
                'message' => 'Karyawan tidak ditemukan'
            ], 404);
        }

        // Hapus data karyawan
        $karyawan->delete();

        // Beri response sukses
        return response()->json([
            'status' => true,
            'message' => 'Karyawan berhasil dihapus'
        ], 200);
    }


    public function kode()
    {
        $lastBarang = Karyawan::latest()->first();
        if (!$lastBarang) {
            $num = 1;
        } else {
            $lastCode = $lastBarang->kode_karyawan;
            $num = (int) substr($lastCode, strlen('AA')) + 1;
        }
        $formattedNum = sprintf("%06s", $num);
        $prefix = 'AA';
        $newCode = $prefix . $formattedNum;
        return $newCode;
    }
}
