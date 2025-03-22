import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Departemen from "./pages/Departemen.jsx";
import Karyawan from "./pages/Karyawan.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "JavaLine";
        localStorage.setItem("lastPath", location.pathname);
    }, [location]);


    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const lastPath = localStorage.getItem("lastPath") || "/dashboard";

        if (token && userData) {
            setUser(JSON.parse(userData));
            navigate(lastPath);
        }
    }, []);

    const handleLogin = (userData) => {
        localStorage.setItem("token", "your_token_here");
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        navigate(localStorage.getItem("lastPath") || "/dashboard");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("lastPath");
        setUser(null);
        navigate("/");
    };

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={user ? <Dashboard onLogout={handleLogout} user={user} /> : <Navigate to="/" />}>
            <Route index element={<h2>Selamat Datang di Dashboard, {user?.karyawan?.nama_lengkap || 'User'}</h2>
} />
                <Route path="departemen" element={<Departemen />} />
                <Route path="karyawan" element={<Karyawan />} />
            </Route>
        </Routes>
    );
}

const basename = import.meta.env.VITE_BASENAME || "/";

const root = document.getElementById("App");
if (root) {
    ReactDOM.createRoot(root).render(
        <Router basename={basename}>
            <App />
        </Router>
    );
}
