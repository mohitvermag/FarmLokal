import { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "./Register.css";


export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const res = registerUser(username, password);
        if (res.success) {
            alert(res.message);
            navigate("/login");
        } else {
            setMessage(res.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {message && <p style={{ color: "red" }}>{message}</p>}
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Username"
                    value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
