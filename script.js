function signupUser() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !phone || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    const user = {
        name: name,
        phone: phone,
        email: email,
        password: password
    };

    localStorage.setItem("creatorsparkUser", JSON.stringify(user));

    alert("Signup successful! Please login.");

    window.location.href = "login.html";
}


function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const storedUser = localStorage.getItem("creatorsparkUser");

    if (!storedUser) {
        alert("No user found. Please sign up first.");
        return;
    }

    const user = JSON.parse(storedUser);

    if (email === user.email && password === user.password) {
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password.");
    }
}
