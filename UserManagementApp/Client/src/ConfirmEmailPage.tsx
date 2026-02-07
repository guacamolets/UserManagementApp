import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
                    setStatus("fetch error");
                }
            })
            .catch(() => setStatus("fetch error"));
    }, [location.search, navigate]);

    return (
        <div>
            {status === "loading" && <p>Confirm email…</p>}
            {status === "success" && <p>Email confirmed</p>}
            {status === "fetch error" && <p>Fetch error</p>}
            {status === "token error" && <p>Token error</p>}
        </div>
    );
}
