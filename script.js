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
