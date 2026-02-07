import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "./auth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            alert("Login error");
            return;
        }

        const data = await res.json();
        setToken(data.token);
        navigate("/users");
    }

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>

            <div><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>

            <button>Log in</button>
        </form>
    );
}
