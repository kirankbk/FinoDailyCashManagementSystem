// ===============================================
// DHANADAI ENTERPRISES
// Daily Cash Management System
// login.js
// ===============================================

const USERS_KEY = "systemUsers";
const LOGIN_USER_KEY = "loggedUser";

// ===============================================
// Default Users
// ===============================================

function createDefaultUsers() {

    let users = JSON.parse(localStorage.getItem(USERS_KEY));

    if (users && users.length > 0) return;

    users = [

        {
            id: 1,
            username: "admin",
            password: "admin123",
            name: "Administrator",
            role: "ADMIN",
            active: true
        },

        {
            id: 2,
            username: "bank",
            password: "bank123",
            name: "Banking User",
            role: "BANKING",
            active: true
        },

        {
            id: 3,
            username: "csc",
            password: "csc123",
            name: "CSC User",
            role: "CSC",
            active: true
        }

    ];

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}

// ===============================================
// Show Date & Time
// ===============================================

function loadDateTime() {

    setInterval(function () {

        const now = new Date();

        const date = now.toLocaleDateString("mr-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        const time = now.toLocaleTimeString("mr-IN");

        document.getElementById("currentDateTime").innerHTML =
            "📅 " + date + "<br>🕒 " + time;

    }, 1000);

}

// ===============================================
// Error Message
// ===============================================

function showError(message) {

    const error = document.getElementById("loginError");

    error.style.display = "block";

    error.innerHTML = message;

}

// ===============================================
// Clear Error
// ===============================================

function clearError() {

    document.getElementById("loginError").style.display = "none";

}

// ===============================================
// Login
// ===============================================

document
.getElementById("loginForm")
.addEventListener("submit", function (e) {
debugger
    e.preventDefault();

    clearError();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const role =
        document.getElementById("role").value;

    if (username === "") {

        showError("Please enter Username.");

        return;

    }

    if (password === "") {

        showError("Please enter Password.");

        return;

    }

    const users =
        JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    const user = users.find(function (u) {

        return u.username === username &&
            u.password === password &&
            u.role === role &&
            u.active;

    });

    if (!user) {

        showError("Invalid Username, Password or Role.");

        return;

    }

    localStorage.setItem(
        LOGIN_USER_KEY,
        JSON.stringify(user)
    );

    // Remember Me

    if (document.getElementById("remember").checked) {

        localStorage.setItem(
            "rememberUsername",
            username
        );

    } else {

        localStorage.removeItem(
            "rememberUsername"
        );

    }
if(user.password=='admin123' || user.password=='bank123'){
    // Redirect

    window.location.href = "bankTran.html";
}
if(user.password=='csc123'){
    // Redirect

    window.location.href = "cscmahaonline.html";
}

});

// ===============================================
// Remember Username
// ===============================================

function loadRememberUser() {

    const remember =
        localStorage.getItem("rememberUsername");

    if (remember) {

        document.getElementById("username").value =
            remember;

        document.getElementById("remember").checked = true;

    }

}

// ===============================================
// Already Logged In
// ===============================================

function checkLogin() {

    // const user =
        // JSON.parse(localStorage.getItem(LOGIN_USER_KEY));

    // if (user) {

        // window.location.href = "index.html";

    // }

}

// ===============================================

createDefaultUsers();

loadRememberUser();

loadDateTime();

checkLogin();

