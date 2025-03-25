import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSort, FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import TambahKaryawan from "./TambahKaryawan"; // Import the new component
import KaryawanDetail from "./KaryawanDetail"; // Import the detail component

export default function Karyawan() {
    const [karyawanList, setKaryawanList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [alertMessage, setAlertMessage] = useState("");

    // State modal
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false); // State for detail modal
    const [formData, setFormData] = useState({ id: null, departemen_id: "", nama_lengkap: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedKaryawan, setSelectedKaryawan] = useState(null); // State for selected karyawan

    // State sorting
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    useEffect(() => {
        const fetchKaryawan = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/karyawan`);
                setKaryawanList(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchKaryawan();
    }, []);

    const filteredData = karyawanList.filter((karyawan) =>
        karyawan.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const showAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(""), 3000); // Alert disappears after 3 seconds
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
                    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/karyawan/${id}`);
                    if (response.status === 200) {
                        setKaryawanList((prev) => prev.filter((karyawan) => karyawan.id !== id));
                        showAlert("Karyawan berhasil dihapus!");
                    }
                } catch (error) {
                    Swal.fire("Error!", "Terjadi kesalahan saat menghapus data.", "error");
                    console.error("Error:", error);
                }
            }
        });
    };

    const openModal = (karyawan = null) => {
        if (karyawan) {
            setFormData({
                id: karyawan.id,
                nama_lengkap: karyawan.nama_lengkap,
                nama_kecil: karyawan.nama_kecil,
                gender: karyawan.gender,
                departemen_id: karyawan.departemen_id,
                no_ktp: karyawan.no_ktp,
                no_sim: karyawan.no_sim,
                tanggal_lahir: karyawan.tanggal_lahir,
                tanggal_gabung: karyawan.tanggal_gabung,
                telp: karyawan.telp,
                gmail: karyawan.gmail,
                alamat: karyawan.alamat,
                atas_nama: karyawan.atas_nama,
                norek: karyawan.norek,
                nama_bank: karyawan.nama_bank,
                gambar: null, // For the uploaded KTP image
                ft_sim: null, // For the uploaded SIM image
                gambar_preview: null, // For the KTP image preview
                ft_sim_preview: null, // For the SIM image preview
            });
            setIsEditing(true);
        } else {
            setFormData({ id: null, nama_lengkap: "", departemen_id: "" });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    // In the render method
    {
        showModal && (
            <TambahKaryawan
                showModal={showModal}
                setShowModal={setShowModal}
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                karyawanList={karyawanList}
                setKaryawanList={setKaryawanList}
                showAlert={showAlert}
            />
        )
    }

    const openDetailModal = (karyawan) => {
        setSelectedKaryawan(karyawan);
        setShowDetailModal(true);
    };

    // Sorting function
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
            <div className="d-flex justify-content-between align-items-center header-judul">
                <h2 className="title-judul">Daftar Karyawan</h2>
                <button className="btn btn-primary btn-tambah" onClick={() => openModal()}>
                    <FaPlus /> Tambah
                </button>
            </div>

            <hr />

            {/* Input Pencarian */}
            <input
                type="text"
                className="form-control search-input mb-3"
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
                <div className="table-responsive">
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
                                <th>QrCode</th>
                                <th>Opsi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((karyawan, index) => (
                                <tr key={karyawan.id}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{karyawan.kode_karyawan}</td>
                                    <td>{karyawan.nama_lengkap}</td>
                                    <td><QRCodeCanvas value={karyawan.qrcode_karyawan} size={50} /></td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                                            <button className="btn btn-warning btn-sm" onClick={() => openModal(karyawan)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(karyawan.id)}>
                                                <FaTrash />
                                            </button>
                                            <button className="btn btn-info btn-sm" onClick={() => openDetailModal(karyawan)}>
                                                <FaEye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-3 pagination-container">
                    {/* Previous Button */}
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft />
                    </button>

                    {/* Page Numbers */}
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

                    {/* Next Button */}
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
                <TambahKaryawan
                    showModal={showModal}
                    setShowModal={setShowModal}
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    karyawanList={karyawanList}
                    setKaryawanList={setKaryawanList}
                    showAlert={showAlert}
                />
            )}

            {/* MODAL DETAIL */}
            {showDetailModal && selectedKaryawan && (
                <KaryawanDetail
                    showModal={showDetailModal}
                    setShowModal={setShowDetailModal}
                    karyawan={selectedKaryawan}
                />
            )}

            {showModal && <div className="modal-backdrop fade show"></div>}
            {showDetailModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
}