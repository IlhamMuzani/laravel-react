<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departemen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class DepartemenController extends Controller
{
    public function index()
    {
        $departemen = Departemen::all();
        return response()->json($departemen);
    }


    public function add(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
        ], [
            'nama.required' => 'Masukkan nama departemen',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->all()], 422);
        }

        // Generate kode departemen
        $kode_departemen = $this->kode();

        $departemen = Departemen::create([
            'nama' => $request->nama,
            'kode_departemen' => $kode_departemen,
            'qrcode_departemen' => 'https://javaline.id/departemen/' . $kode_departemen,
            'tanggal_awal' => Carbon::now('Asia/Jakarta'),
        ]);

        return response()->json([
            'message' => 'Berhasil menambahkan departemen',
            'data' => $departemen
        ], 201);
    }

    public function edit($id)
    {
        $departemen = Departemen::find($id);

        if (!$departemen) {
            return response()->json(['error' => 'Departemen tidak ditemukan'], 404);
        }

        return response()->json(['data' => $departemen]);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $departemen = Departemen::find($id);

        if (!$departemen) {
            return response()->json(['error' => 'Departemen tidak ditemukan'], 404);
        }

        $departemen->nama = $request->nama;
        $departemen->save();

        return response()->json(['message' => 'Departemen berhasil diperbarui', 'data' => $departemen]);
    }


    public function delete($id)
    {
        // Cari data departemen berdasarkan ID
        $departemen = Departemen::find($id);

        // Jika data tidak ditemukan, kembalikan response error
        if (!$departemen) {
            return response()->json([
                'status' => false,
                'message' => 'Departemen tidak ditemukan'
            ], 404);
        }

        // Hapus data departemen
        $departemen->delete();

        // Beri response sukses
        return response()->json([
            'status' => true,
            'message' => 'Departemen berhasil dihapus'
        ], 200);
    }


    public function kode()
    {
        $lastBarang = Departemen::latest()->first();
        if (!$lastBarang) {
            $num = 1;
        } else {
            $lastCode = $lastBarang->kode_departemen;
            $num = (int) substr($lastCode, strlen('DT')) + 1;
        }
        $formattedNum = sprintf("%06s", $num);
        $prefix = 'DT';
        $newCode = $prefix . $formattedNum;
        return $newCode;
    }
}
