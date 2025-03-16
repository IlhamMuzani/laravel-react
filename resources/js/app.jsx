import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Departemen from "./pages/Departemen.jsx";
import Karyawan from "./pages/Karyawan.jsx"; // ✅ Tambahkan import Karyawan
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("lastPath", location.pathname); // ✅ Simpan path terakhir
    }, [location]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const lastPath = localStorage.getItem("lastPath") || "/dashboard"; // ✅ Ambil path terakhir sebelum refresh

        if (token && userData) {
            setUser(JSON.parse(userData));
            navigate(lastPath); // ✅ Kembali ke halaman terakhir setelah login
        }
    }, []);

    const handleLogin = (userData) => {
        localStorage.setItem("token", "your_token_here");
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        navigate(localStorage.getItem("lastPath") || "/dashboard"); // ✅ Kembali ke halaman terakhir setelah login
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("lastPath"); // ✅ Hapus path terakhir saat logout
        setUser(null);
        navigate("/");
    };

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={user ? <Dashboard onLogout={handleLogout} user={user} /> : <Navigate to="/" />}>
                <Route index element={<h2>Selamat Datang di Dashboard</h2>} />
                <Route path="departemen" element={<Departemen />} />
                <Route path="karyawan" element={<Karyawan />} /> {/* ✅ Tambahkan route Karyawan */}
            </Route>
        </Routes>
    );
}

const root = document.getElementById("app");
if (root) {
    ReactDOM.createRoot(root).render(
        <Router basename="/backend-app">
            <App />
        </Router>
    );
}
