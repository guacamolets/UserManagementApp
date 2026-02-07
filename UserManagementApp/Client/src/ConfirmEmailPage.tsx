import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import { apiFetch } from "./api";

export default function ConfirmEmailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState("pending");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
            setStatus("token error");
            return;
        }

        fetch(`/api/auth/confirm?token=${token}`, {
            method: "GET",
        })
            .then(res => {
                if (res.ok) {
                    setStatus("success");
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    alert(`/api/auth/confirm?token=${token}`);
                    setStatus("1 error");
                }
            })
            .catch(() => setStatus("2 error"));
    }, [location.search, navigate]);

    return (
        <div>
            {status === "loading" && <p>Confirm email…</p>}
            {status === "success" && <p>Email confirmed</p>}
            {status === "1 error" && <p>1 error</p>}
            {status === "2 error" && <p>2 error</p>}
            {status === "token error" && <p>Token error</p>}
        </div>
    );
}
