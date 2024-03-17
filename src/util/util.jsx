export function getItemContainingName(name) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes(name)) {
            return localStorage.getItem(key);
        }
    }
    return null;
}

export function getToken() {
    const token = getItemContainingName("accessToken");
    return token;
}

export function clearStorage() {
    const guideStorage = localStorage.getItem("guide-storage");

    localStorage.clear();
    sessionStorage.clear();

    if (guideStorage) {
        localStorage.setItem("guide-storage", guideStorage);
    }
}


