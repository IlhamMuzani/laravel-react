import { useState } from "react";
import axios from "axios";

export default function Register() {
    const [kodeUser, setKodeUser] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await axios.post("https://javabakery.web.id/api/register", {
                kode_user: kodeUser,
                name: name,
                password: password
            });

            setMessage(response.data.message);
        } catch (err) {
            setMessage("Registrasi gagal! Periksa kembali input Anda.");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Kode User" value={kodeUser} onChange={(e) => setKodeUser(e.target.value)} required />
                <input type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
