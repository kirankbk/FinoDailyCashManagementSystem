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

// document
// .getElementById("loginForm")
// .addEventListener("submit", function (e) {
// debugger
    // e.preventDefault();

    // clearError();

    // const username =
        // document.getElementById("username").value.trim();

    // const password =
        // document.getElementById("password").value.trim();

    // const role =
        // document.getElementById("role").value;

    // if (username === "") {

        // showError("Please enter Username.");

        // return;

    // }

    // if (password === "") {

        // showError("Please enter Password.");

        // return;

    // }

    // const users =
        // JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    // const user = users.find(function (u) {

        // return u.username === username &&
            // u.password === password &&
            // u.role === role &&
            // u.active;

    // });

    // if (!user) {

        // showError("Invalid Username, Password or Role.");

        // return;

    // }

    // localStorage.setItem(
        // LOGIN_USER_KEY,
        // JSON.stringify(user)
    // );

    // // Remember Me

    // if (document.getElementById("remember").checked) {

        // localStorage.setItem(
            // "rememberUsername",
            // username
        // );

    // } else {

        // localStorage.removeItem(
            // "rememberUsername"
        // );

    // }
// if(user.password=='admin123' || user.password=='bank123'){
    // // Redirect

    // window.location.href = "bankTran.html";
// }
// if(user.password=='csc123'){
    // // Redirect

    // window.location.href = "cscmahaonline.html";
// }

// });

document.getElementById("loginForm").addEventListener("submit",function(e){

    e.preventDefault();

    clearError();

    const username=document.getElementById("username").value.trim();

    const password=document.getElementById("password").value.trim();

    const role=document.getElementById("role").value;

    // Username Validation

    if(username===""){

        showError("Please enter your Username.");

        document.getElementById("username").focus();

        return;

    }

    // Password Validation

    if(password===""){

        showError("Please enter your Password.");

        document.getElementById("password").focus();

        return;

    }

    const users=JSON.parse(localStorage.getItem("systemUsers"))||[];

    // Find user by username only
    const user=users.find(u=>u.username===username);

    if(!user){

        showError("Username does not exist.");

        return;

    }

    // Password check
    if(user.password!==password){

        showError("Incorrect password.");

        return;

    }

    // Role check
    if(user.role!==role){

        let roleName="";

        switch(user.role){

            case "ADMIN":

                roleName="Administrator";

                break;

            case "BANKING":

                roleName="Banking User";

                break;

            case "CSC":

                roleName="CSC User";

                break;

        }

        showError("You are registered as '"+roleName+"'. Please select the correct login role.");

        return;

    }

    // Active check

    if(!user.active){

        showError("Your account has been disabled. Contact Administrator.");

        return;

    }

    localStorage.setItem("loggedUser",JSON.stringify(user));

    showSuccess("Login successful. Redirecting...");

  setTimeout(function(){

        // window.location.href="index.html";
		 if(user.password=='admin123' || user.password=='bank123')
		 {
  
           window.location.href = "bankTran.html";
        }
     if(user.password=='csc123'){
          window.location.href = "cscmahaonline.html";
      }


    },1000);

});
function showError(message){

    const error=document.getElementById("loginError");

    error.className="login-error";

    error.innerHTML=`<i class="fa fa-circle-exclamation"></i> ${message}`;

    error.style.display="block";

}

function showSuccess(message){

    const error=document.getElementById("loginError");

    error.className="login-error login-success";

    error.innerHTML=`<i class="fa fa-circle-check"></i> ${message}`;

    error.style.display="block";

}

function clearError(){

    document.getElementById("loginError").style.display="none";

}
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

