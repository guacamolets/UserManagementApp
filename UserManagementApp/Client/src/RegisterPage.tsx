import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "./ToastContext";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { showToast } = useToastContext();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
            showToast("Register error", "error");
            return;
        }

        navigate(`/login`);
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Registration</h2>

                <div className="form-field"><label>Name</label><input value={name} onChange={e => setName(e.target.value)} /></div>
                <div className="form-field"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="form-field"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>

                <button className="auth-button" onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
}
