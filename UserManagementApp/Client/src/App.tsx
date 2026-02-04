import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { type JSX } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import UserPage from "./UserPage";
import { getToken } from "./auth";
import './App.css'

function PrivateRoute({ children }: { children: JSX.Element }) {
    return getToken() ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/users"element={<PrivateRoute><UserPage /></PrivateRoute>}/>
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}