import React, { useState, useEffect } from "react";
import axios from "axios";

const TambahKaryawan = ({ showModal, setShowModal, formData, setFormData, isEditing, setIsEditing, karyawanList, setKaryawanList, showAlert }) => {
    const [departemenList, setDepartemenList] = useState([]);

    useEffect(() => {
        const fetchDepartemen = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/departemen`);
                setDepartemenList(response.data);
            } catch (error) {
                console.error("Gagal memuat data departemen", error);
            }
        };

        fetchDepartemen();
    }, []);

    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                [name]: file,
                [`${name}_preview`]: URL.createObjectURL(file), // Preview image
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const handleSubmit = async () => {
        if (!formData.nama_lengkap) {
            alert("Nama Karyawan tidak boleh kosong!");
            return;
        }

        try {
            const url = isEditing
                ? `${import.meta.env.VITE_API_URL}/api/karyawan/${formData.id}`
                : `${import.meta.env.VITE_API_URL}/api/karyawan/add`;

            const method = isEditing ? "PUT" : "POST";

            // Create a FormData object
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            const response = await fetch(url, {
                method,
                body: formDataToSend, // Send FormData instead of JSON
            });

            // Check if the response is OK
            if (!response.ok) {
                const errorText = await response.text(); // Get the response text
                throw new Error(`Error: ${response.status} - ${errorText}`); // Throw an error with the response text
            }

            const result = await response.json(); // Parse the JSON response

            if (isEditing) {
                setKaryawanList((prev) =>
                    prev.map((dept) => (dept.id === formData.id ? { ...dept, ...formData } : dept))
                );
                showAlert("Karyawan berhasil diperbarui!");
            } else {
                setKaryawanList((prev) => [...prev, result.data]);
                showAlert("Karyawan berhasil ditambahkan!");
            }

            setShowModal(false);
            setFormData({ id: null, nama_lengkap: "", departemen_id: "" });
        } catch (error) {
            console.error("Error:", error);
            alert(error.message); // Show the error message to the user
        }
    };
    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEditing ? "Edit Karyawan" : "Tambah Karyawan"}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row">
                                    {/* Departemen */}
                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">Departemen</label>
                                        <select
                                            className="form-select"
                                            name="departemen_id"
                                            value={formData.departemen_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">Pilih Departemen</option>
                                            {departemenList.map((dept) => (
                                                <option key={dept.id} value={dept.id}>{dept.nama}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Nama Lengkap */}
                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">Nama Lengkap</label>
                                        <input type="text" className="form-control" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} />
                                    </div>

                                    {/* Nama Panggilan */}
                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">Nama Panggilan</label>
                                        <input type="text" className="form-control" name="nama_kecil" value={formData.nama_kecil} onChange={handleChange} />
                                    </div>

                                    {/* Gender */}
                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">Gender</label>
                                        <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                                            <option value="">Pilih Gender</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>

                                    {/* No KTP dan No SIM */}
                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">No KTP</label>
                                        <input type="text" className="form-control" name="no_ktp" value={formData.no_ktp} onChange={handleChange} />
                                    </div>

                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">No SIM</label>
                                        <input type="text" className="form-control" name="no_sim" value={formData.no_sim} onChange={handleChange} />
                                    </div>

                                    {/* Tgl Lahir dan Tgl Gabung */}
                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">Tgl Lahir</label>
                                        <input type="date" className="form-control" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} />
                                    </div>

                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">Tgl Gabung</label>
                                        <input type="date" className="form-control" name="tanggal_gabung" value={formData.tanggal_gabung} onChange={handleChange} />
                                    </div>

                                    {/* No Telp dan Email */}
                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">No Telp</label>
                                        <input type="text" className="form-control" name="telp" value={formData.telp} onChange={handleChange} />
                                    </div>

                                    <div className="col-12 col-md-12 mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="text" className="form-control" name="gmail" value={formData.gmail} onChange={handleChange} />
                                    </div>

                                    {/* Alamat */}
                                    <div className="col-12 mb-3">
                                        <label className="form-label">Alamat</label>
                                        <textarea className="form-control" name="alamat" value={formData.alamat} onChange={handleChange} rows="4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container p-4">
                            <div className="card shadow-sm p-4">
                                <h4 className="mb-4">Unggah Foto KTP dan SIM</h4>

                                <div className="row row-cols-1 row-cols-md-2 g-4">

                                    {/* Foto KTP */}
                                    <div className="col">
                                        <label className="form-label">Foto KTP</label>
                                        <input
                                            type="file"
                                            className="form-control mb-2"
                                            name="gambar"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                        {formData.gambar_preview ? (
                                            <div className="position-relative">
                                                <img
                                                    src={formData.gambar_preview}
                                                    alt="Preview KTP"
                                                    className="img-fluid rounded shadow-sm"
                                                    style={{ maxWidth: '100%', height: '200px', objectFit: 'cover' }}
                                                />
                                                <button
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                                    onClick={() => setFormData({ ...formData, gambar_preview: null })}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-muted">Belum ada gambar yang dipilih</p>
                                        )}
                                    </div>

                                    {/* Foto SIM */}
                                    <div className="col">
                                        <label className="form-label">Foto SIM</label>
                                        <input
                                            type="file"
                                            className="form-control mb-2"
                                            name="ft_sim"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                        {formData.ft_sim_preview ? (
                                            <div className="position-relative">
                                                <img
                                                    src={formData.ft_sim_preview}
                                                    alt="Preview SIM"
                                                    className="img-fluid rounded shadow-sm"
                                                    style={{ maxWidth: '100%', height: '200px', objectFit: 'cover' }}
                                                />
                                                <button
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                                    onClick={() => setFormData({ ...formData, ft_sim_preview: null })}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-muted">Belum ada gambar yang dipilih</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Card Data Bank */}
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    {/* Atas Nama */}
                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">Atas Nama</label>
                                        <input type="text" className="form-control" name="atas_nama" value={formData.atas_nama} onChange={handleChange} />
                                    </div>

                                    {/* No Rekening */}
                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">No Rekening</label>
                                        <input type="text" className="form-control" name="norek" value={formData.norek} onChange={handleChange} />
                                    </div>

                                    {/* Nama Bank */}
                                    <div className="col-12 col-md-4 mb-3">
                                        <label className="form-label">Nama Bank</label>
                                        <select
                                            className="form-control"
                                            id="nama_bank"
                                            name="nama_bank"
                                            value={formData.nama_bank}
                                            onChange={handleChange}
                                        >
                                            <option value="">- Pilih -</option>
                                            <option value="BRI">BRI</option>
                                            <option value="MANDIRI">MANDIRI</option>
                                            <option value="BNI">BNI</option>
                                            <option value="BTN">BTN</option>
                                            <option value="DANAMON">DANAMON</option>
                                            <option value="BCA">BCA</option>
                                            <option value="PERMATA">PERMATA</option>
                                            <option value="PAN">PAN</option>
                                            <option value="CIMB NIAGA">CIMB NIAGA</option>
                                            <option value="UOB">UOB</option>
                                            <option value="ARTHA GRAHA">ARTHA GRAHA</option>
                                            <option value="BUMI ARTHA">BUMI ARTHA</option>
                                            <option value="MEGA">MEGA</option>
                                            <option value="SYARIAH">SYARIAH</option>
                                            <option value="MEGA SYARIAH">MEGA SYARIAH</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                        <button className="btn btn-primary" onClick={handleSubmit}>{isEditing ? "Update" : "Simpan"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TambahKaryawan;