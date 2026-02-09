import { Link, useLocation, useNavigate } from "react-router-dom";

interface Props {
    isAuth: boolean;
    onLogout: () => void;
}

export default function NavigationBar({ isAuth, onLogout }: Props) {
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === "/confirm") {
        return null;
    }

    function logout() {
        onLogout();
        navigate("/login");
    }

    return (
        <nav className="nav">
            <div className="nav-actions">
                {!isAuth && (
                    <>
                        <Link to="/login" className="nav-item">Login</Link>
                        <Link to="/register" className="nav-item">Register</Link>
                    </>
                )}

                {isAuth && (
                    <>
                        <Link to="/users" className="nav-item">Users</Link>
                        <button className="nav-item" onClick={logout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}