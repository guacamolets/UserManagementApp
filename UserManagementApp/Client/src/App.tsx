import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";
import { getToken, logout } from "./auth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage";
import NavigationBar from "./components/bars/NavigationBar";
import './App.css'

function PrivateRoute({ children }: { children: JSX.Element }) {
    return getToken() ? children : <Navigate to="/login" />;
}

export default function App() {
    const [isAuth, setIsAuth] = useState<boolean>(!!getToken());

    function handleLogout() {
        logout();
        setIsAuth(false);
    }

    useEffect(() => {
        const onStorage = () => {setIsAuth(!!getToken())};
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    return (
        <BrowserRouter>
            <NavigationBar isAuth={isAuth} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={
                    isAuth
                        ? <Navigate to="/users" replace />
                        : <Navigate to="/login" replace />
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/confirm" element={<ConfirmEmailPage />} />
                <Route path="/users"element={<PrivateRoute><UserPage /></PrivateRoute>}/>
            </Routes>
        </BrowserRouter>
    );
}