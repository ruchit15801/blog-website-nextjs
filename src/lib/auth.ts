export function logoutAndRedirect() {
    try {
        if (typeof window !== "undefined") {
            const keysToRemove = [
                "token",
                "refreshToken",
                "userProfile",
                "role",
                "categories",
            ];
            keysToRemove.forEach((k) => localStorage.removeItem(k));
            window.dispatchEvent(new Event("storage"));
        }
    } catch {
        // ignore
    } finally {
        if (typeof window !== "undefined") {
            window.location.replace("/auth");
        }
    }
}


