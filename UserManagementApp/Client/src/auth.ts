export function getToken() {
    return localStorage.getItem("token");
}

export function setToken(token: string) {
    localStorage.setItem("token", token);
}

export function logout() {
    localStorage.removeItem("token");
}
