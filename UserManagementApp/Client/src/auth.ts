export function getToken() {
    return localStorage.getItem("token");
}

export function getUserId() {
    return localStorage.getItem("userId");
}

export function setUserId(id: string) {
    localStorage.setItem("userId", id);
}

export function setToken(token: string) {
    localStorage.setItem("token", token);
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
}
