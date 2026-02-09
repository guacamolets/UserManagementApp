import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, setUserId } from "../auth";
import { useToastContext } from "../components/toast/ToastContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { showToast } = useToastContext();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            showToast("Login error", "error");
            return;
        }

        const data = await res.json();
        setToken(data.token);
        setUserId(data.id.toString());

        window.dispatchEvent(new Event("storage"));
        navigate(`/users`);
    }

    return (
        <div className="page">
            <div className="auth-card">
                <h2>Login</h2>

                <div className="form-field"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="form-field"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>

                <button className="auth-button" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}
