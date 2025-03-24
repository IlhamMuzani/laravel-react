import React, { useState, useEffect, useRef } from "react";
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
    const timeoutRef = useRef(null); // Gunakan useRef untuk menjaga nilai timeout

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

    useEffect(() => {
        if (user) {
            // console.log("User logged in. Setting up event listeners.");
            resetTimer();
            window.addEventListener("mousemove", resetTimer);
            window.addEventListener("keydown", resetTimer);
        }
        return () => {
            // console.log("Cleaning up event listeners.");
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
        };
    }, [user]);

    useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const expiresAt = localStorage.getItem("expiresAt");

    if (token && userData && expiresAt) {
        if (Date.now() > parseInt(expiresAt)) {
            handleLogout();
        } else {
            setUser(JSON.parse(userData));
            navigate(localStorage.getItem("lastPath") || "/dashboard");
        }
    }
}, []);


    // console.log("User state:", user);


   const handleLogin = (userData) => {
    const expirationTime = Date.now() + 2 * 60 * 60 * 1000; // 2 jam ke depan
    localStorage.setItem("token", "your_token_here");
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("expiresAt", expirationTime);
    setUser(userData);
    navigate(localStorage.getItem("lastPath") || "/dashboard");
};


    const handleLogout = () => {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("lastPath");
        setUser(null);
        navigate("/");
    };

    const resetTimer = () => {
        // console.log("Reset timer called");
        // if (timeoutRef.current) {
        //     console.log("Clearing previous timeout");
        //     clearTimeout(timeoutRef.current);
        // }
        timeoutRef.current = setTimeout(() => {
            console.log("Timeout reached. Logging out...");
            handleLogout();
        }, 2 * 60 * 60 * 1000); // 2 jam = 2 * 60 menit * 60 detik * 1000 ms

    };


    useEffect(() => {
        if (user) {
            resetTimer();
            window.addEventListener("mousemove", resetTimer);
            window.addEventListener("keydown", resetTimer);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
        };
    }, [user]);

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={user ? <Dashboard onLogout={handleLogout} user={user} /> : <Navigate to="/" />}>
                <Route index element={<h2>Selamat Datang di Dashboard, {user?.karyawan?.nama_lengkap || 'User'}</h2>} />
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
