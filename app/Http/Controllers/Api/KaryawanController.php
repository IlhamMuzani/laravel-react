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
            'nama' => 'required|string|max:255',
        ], [
            'nama.required' => 'Masukkan nama karyawan',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->all()], 422);
        }

        // Generate kode karyawan
        $kode_karyawan = $this->kode();

        $karyawan = Karyawan::create([
            'nama' => $request->nama,
            'kode_karyawan' => $kode_karyawan,
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
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $karyawan = Karyawan::find($id);

        if (!$karyawan) {
            return response()->json(['error' => 'Karyawan tidak ditemukan'], 404);
        }

        $karyawan->nama = $request->nama;
        $karyawan->save();

        return response()->json(['message' => 'Karyawan berhasil diperbarui', 'data' => $karyawan]);
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