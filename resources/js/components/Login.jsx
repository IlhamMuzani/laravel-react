import { useState } from "react";
import axios from "axios";
import "../../css/styles.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
    const [kodeUser, setKodeUser] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/dashboard"; // ✅ Redirect ke halaman sebelum login

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
                kode_user: kodeUser,
                password: password
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user)); // ✅ Simpan user ke localStorage
            onLogin(response.data.user);
            navigate(redirectTo); // ✅ Redirect ke halaman sebelum login atau dashboard
        } catch (err) {
            setError("Kode User atau Password salah!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Kode User</label>
                        <input 
                            type="text" 
                            value={kodeUser}
                            onChange={(e) => setKodeUser(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group password-group">
                        <label>Password</label>
                        <div className="password-container">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "👁‍🗨" : "👁"}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? <div className="spinner"></div> : "Login"}
                    </button>
                </form>
                <p>Belum punya akun? <Link to="/register">Daftar</Link></p>
            </div>
        </div>
    );
}
