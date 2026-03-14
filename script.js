let users = JSON.parse(localStorage.getItem("users")) || [];

// Show signup form
   function showSignup() {
    document.querySelector(".login-card").style.display ="none";
    document.querySelector(".signup-card").style.display = "block";
   }

// Show login form
function showLogin(){
    document.querySelector(".signup-card").style.display = "none";
    document.querySelector(".login-card").style.display ="block";
} 
  
// SIGN UP
function signup(){
    let username = document.getElementById("SignupUsername").value;
    let email = document.getElementById("SignupEmail").value;
    let password = document.getElementById("SignupPassword").value;
    let confirm = document.getElementById("SignupConfirm").value;


    if (!username|| !email || !password || !confirm ){
        alert("Please fill all fields");
        return;
    }

    if(password !== confirm){
        alert("Passwords do not match");
    return;
    }

    
    if (users.some(u => u.email === email)) {
        alert("Email already registered");
        return;
    }

users.push({ username, email, password});
localStorage.setItem("users", JSON.stringify(users));

alert("signup successful");
showLogin();
}

// LOGIN
function login() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem("currentUser", user.username);
        window.location.href = "app.html";
    } else{
        alert("invalid login");
    }
}