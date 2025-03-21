import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSort, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Karyawan() {
    const [karyawanList, setKaryawanList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [alertMessage, setAlertMessage] = useState("");

    // State modal
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, nama_lengkap: "" });
    const [isEditing, setIsEditing] = useState(false);

    // State sorting
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/karyawan`)
            .then((response) => response.json())
            .then((data) => {
                setKaryawanList(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const filteredData = karyawanList.filter((kary) => 
        kary.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    // Handle perubahan input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 3000); // Alert menghilang setelah 3 detik
};


    // Handle submit (Create / Update)
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

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama_lengkap: formData.nama_lengkap }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Gagal menyimpan data");

        if (isEditing) {
            setKaryawanList((prev) =>
                prev.map((kary) => (kary.id === formData.id ? { ...kary, nama_lengkap: formData.nama_lengkap } : kary))
            );
            showAlert("Karyawan berhasil diperbarui!");
        } else {
            setKaryawanList((prev) => [...prev, result.data]);
            showAlert("Karyawan berhasil ditambahkan!");
        }

        setShowModal(false);
        setFormData({ id: null, nama_lengkap: "" });
    } catch (error) {
        console.error("Error:", error);
    }
};

const handleDelete = async (id) => {
    Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data karyawan ini akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/karyawan/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Gagal menghapus karyawan");

                setKaryawanList((prev) => {
                    const updatedList = prev.filter((kary) => kary.id !== id);
                    const newTotalPages = Math.ceil(updatedList.length / itemsPerPage);

                    if ((currentPage > newTotalPages && newTotalPages > 0) || updatedList.length === 0) {
                        setCurrentPage(1);
                    }

                    return updatedList;
                });

                Swal.fire({
                    title: "Dihapus!",
                    text: "Data karyawan telah dihapus.",
                    icon: "success",
                    timer: 1000, // Auto close dalam 2 detik
                    showConfirmButton: false // Hilangkan tombol OK
                });
            } catch (error) {
                Swal.fire("Error!", "Terjadi kesalahan saat menghapus data.", "error");
                console.error("Error:", error);
            }
        }
    });
};


    const openModal = (karyawan = null) => {
        if (karyawan) {
            setFormData({ id: karyawan.id, nama_lengkap: karyawan.nama_lengkap });
            setIsEditing(true);
        } else {
            setFormData({ id: null, nama_lengkap: "" });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    // Fungsi sorting
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedList = [...karyawanList].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setKaryawanList(sortedList);
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Daftar Karyawan</h2>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <FaPlus /> Tambah Data
                </button>
            </div>
            <hr />

            {/* Input Pencarian */}
            <input
                type="text"
                className="form-control w-25 mb-3"
                placeholder="Cari karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {alertMessage && (
                <div className="alert alert-success">{alertMessage}</div>
            )}

            {/* Tabel Data */}
            {loading ? (
                    <div className="text-center my-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Memuat data, harap tunggu...</p>
                    </div>
                ) : (
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                                No <FaSort />
                            </th>
                            <th onClick={() => handleSort("kode_karyawan")} style={{ cursor: "pointer" }}>
                                Kode Karyawan <FaSort />
                            </th>
                            <th onClick={() => handleSort("nama_lengkap")} style={{ cursor: "pointer" }}>
                                Nama Karyawan <FaSort />
                            </th>
                            <th>Opsi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((kary, index) => (
                                <tr key={kary.id}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{kary.kode_karyawan}</td>
                                    <td>{kary.nama_lengkap}</td>
                                    <td className="text-center">
                                        <button className="btn btn-warning btn-sm me-1" onClick={() => openModal(kary)}>
                                            <FaEdit />
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(kary.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
        {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-3">
        {/* Tombol Sebelumnya */}
        <button
            className="btn btn-outline-primary me-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
        >
            <FaChevronLeft />
        </button>

        {/* Tombol Halaman */}
        {currentPage > 3 && (
            <>
                <button className="btn btn-outline-primary me-1" onClick={() => setCurrentPage(1)}>1</button>
                {currentPage > 4 && <span className="me-1">...</span>}
            </>
        )}

        {[...Array(totalPages)]
            .map((_, index) => index + 1)
            .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
            .map((page) => (
                <button
                    key={page}
                    className={`btn me-1 ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </button>
            ))}

        {currentPage < totalPages - 2 && (
            <>
                {currentPage < totalPages - 3 && <span className="me-1">...</span>}
                <button className="btn btn-outline-primary me-1" onClick={() => setCurrentPage(totalPages)}>
        {totalPages}
            </button>
        </>
        )}

        {/* Tombol Berikutnya */}
        <button
            className="btn btn-outline-primary ms-2"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
        >
            <FaChevronRight />
        </button>
    </div>
)}

            {/* MODAL FORM */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? "Edit Karyawan" : "Tambah Karyawan"}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Nama Karyawan</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nama_lengkap"
                                        value={formData.nama_lengkap}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Batal
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    {isEditing ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
}
