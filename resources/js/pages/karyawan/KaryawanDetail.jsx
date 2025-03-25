import { QRCodeCanvas } from "qrcode.react";

const KaryawanDetail = ({ showModal, setShowModal, karyawan }) => {
    return (
        <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1">
            <div className="modal-dialog modal-xl">
                <div className="modal-content shadow-lg rounded-4">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">Detail Karyawan</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>

                    <div className="modal-body p-4">
                        <div className="row">
                            {/* QR Code Section */}
                            <div className="col-md-4 d-flex justify-content-center align-items-center">
                                <div className="text-center">
                                    <QRCodeCanvas value={karyawan.qrcode_karyawan} size={150} className="mb-3" />
                                    <p className="text-muted">Kode QR Karyawan</p>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="col-md-8">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Kode Karyawan:</h6>
                                        <p className="text-secondary">{karyawan?.kode_karyawan || "Tidak ada"}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Nama Lengkap:</h6>
                                        <p className="text-secondary">{karyawan?.nama_lengkap || "Tidak ada"}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Departemen:</h6>
                                        <p className="text-secondary">{karyawan?.departemen?.nama || "Tidak ada"}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">No KTP:</h6>
                                        <p className="text-secondary">{karyawan?.no_ktp || "Tidak ada"}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">No SIM:</h6>
                                        <p className="text-secondary">{karyawan?.no_sim || "Tidak ada"}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Tanggal Lahir:</h6>
                                        <p className="text-secondary">{karyawan?.tanggal_lahir || "Tidak ada"}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Tanggal Gabung:</h6>
                                        <p className="text-secondary">{karyawan?.tanggal_gabung || "Tidak ada"}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">No Telp:</h6>
                                        <p className="text-secondary">{karyawan?.telp || "Tidak ada"}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Email:</h6>
                                        <p className="text-secondary">{karyawan?.gmail || "Tidak ada"}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Alamat:</h6>
                                        <p className="text-secondary">{karyawan?.alamat || "Tidak ada"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KaryawanDetail;
