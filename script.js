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

function handleContentTypeChange() {
    const contentType = document.getElementById("contentType").value;
    const otherBox = document.getElementById("otherContentBox");

    if (contentType === "other") {
        otherBox.style.display = "block";
    } else {
        otherBox.style.display = "none";
    }
}

function selectAllAudience() {
    const checkboxes = document.getElementsByClassName("audience");
    const selectAll = document.getElementById("selectAll").checked;

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = selectAll;
    }
}

function generateIdeas() {
    const contentTypeSelect = document.getElementById("contentType").value;
    const otherContentInput = document.getElementById("otherContentInput").value;
    const pastTitles = document.getElementById("pastTitles").value;
    const outputArea = document.getElementById("outputArea");

    // Determine final content type
    let contentType = contentTypeSelect;
    if (contentTypeSelect === "other") {
        contentType = otherContentInput || "General";
    }

    // Get selected audiences
    const audienceCheckboxes = document.getElementsByClassName("audience");
    let selectedAudiences = [];

    for (let i = 0; i < audienceCheckboxes.length; i++) {
        if (audienceCheckboxes[i].checked) {
            selectedAudiences.push(audienceCheckboxes[i].value);
        }
    }

    if (!contentType || selectedAudiences.length === 0 || !pastTitles) {
        alert("Please fill all required fields.");
        return;
    }

    // Clear previous output
    outputArea.innerHTML = "";

    // Generate ideas (rule-based)
    const ideas = [
        `Why most people struggle with ${contentType}`,
        `Mistakes beginners make in ${contentType}`,
        `What no one tells you about ${contentType}`,
        `How I would start ${contentType} again in 2024`,
        `${contentType} lessons I learned the hard way`
    ];

    const aiEnabled = document.getElementById("aiAssist").checked;

ideas.forEach((idea, index) => {
    let refinedIdea = idea;

    if (aiEnabled) {
        refinedIdea = simulateAIRefinement(
            idea,
            contentType,
            selectedAudiences
        );
    }

    const ideaBlock = document.createElement("div");

    ideaBlock.innerHTML = `
        <h3>Idea ${index + 1}: ${refinedIdea}</h3>
        <p><strong>Reasoning:</strong> This idea is relevant for 
        ${selectedAudiences.join(", ")} as it focuses on practical
        insights and relatable challenges.</p>
        <p><strong>Human Note:</strong> AI suggestions are used only
        for ideation support. Final content decisions should be
        made by the creator based on context and trends.</p>
        <hr>
    `;

    outputArea.appendChild(ideaBlock);
});

    function simulateAIRefinement(idea, contentType, audiences) {
    return `AI-assisted angle: ${idea} (tailored for ${audiences.join(
        ", "
    )})`;
}



