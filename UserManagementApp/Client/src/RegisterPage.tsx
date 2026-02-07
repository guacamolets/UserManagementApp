import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
            alert("Register error");
            return;
        }

        navigate(`/login`);
    }

    return (
        <form onSubmit={handleRegister}>
            <h2>Registration</h2>

            <div><label>Name</label><input value={name} onChange={e => setName(e.target.value)} /></div>
            <div><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>

            <button>Register</button>
        </form>
    );
}
