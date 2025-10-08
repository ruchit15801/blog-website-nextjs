export function logoutAndRedirect() {
    if (typeof window === "undefined") return;

    try {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
        window.dispatchEvent(new Event("storage"));

    } catch (err) {
        console.error("Error clearing data during logout:", err);
    } finally {
        window.location.replace("/auth");
    }
}

