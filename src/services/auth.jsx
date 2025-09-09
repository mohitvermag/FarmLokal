
export function registerUser(username, password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find(u => u.username === username);

    if (userExists) {
        return { success: false, message: "User already exists!" };
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true, message: "Registration successful!" };
}

// Login user
export function loginUser(username, password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
}

// Logout user
export function logoutUser() {
    localStorage.removeItem("loggedInUser");
}

// Get current logged in user
export function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}
