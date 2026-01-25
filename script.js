

let youtubeHistory = JSON.parse(localStorage.getItem("creatorsparkYouTubeHistory")) || {};


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

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // Save session (SINGLE SOURCE OF TRUTH)
    localStorage.setItem(
      "creatorSparkUser",
      JSON.stringify({
        email: email,
        name: email.split("@")[0]
      })
    );

    // Redirect after login
    window.location.href = "dashboard.html";
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
ideaBlock.className = "idea-card";


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

}
// SOCIAL ACCOUNTS SYSTEM

let socialAccounts = JSON.parse(localStorage.getItem("creatorsparkSocialAccounts")) || {
  youtube: "",
  instagram: "",
  twitter: "",
  tiktok: ""
};

function connectAccount(platform) {
  const input = document.getElementById(platform + "Input");
  const value = input.value.trim();

  if (!value) {
    alert("Please enter a valid account.");
    return;
  }

  socialAccounts[platform] = value;
  localStorage.setItem("creatorsparkSocialAccounts", JSON.stringify(socialAccounts));

  input.value = "";
  renderConnectedAccounts();
}

function removeAccount(platform) {
  socialAccounts[platform] = "";
  localStorage.setItem("creatorsparkSocialAccounts", JSON.stringify(socialAccounts));
  renderConnectedAccounts();
}

function renderConnectedAccounts() {
  const container = document.getElementById("connectedAccountsList");
  if (!container) return;

  container.innerHTML = "";

  Object.keys(socialAccounts).forEach(platform => {
    if (socialAccounts[platform]) {
      const div = document.createElement("div");
      div.className = "connected-account";
      div.innerHTML = `
        <span><strong>${platform.toUpperCase()}</strong>: ${socialAccounts[platform]}</span>
        <button onclick="removeAccount('${platform}')">Remove</button>
      `;
      container.appendChild(div);
    }
  });
}

// Load connected accounts on page load
document.addEventListener("DOMContentLoaded", renderConnectedAccounts);

/*
PASTE YOUR YOUTUBE ANALYTICS CODE HERE
*/

// YOUTUBE ANALYTICS SYSTEM

const YOUTUBE_API_KEY = "AIzaSyBa2bt8jVj25XNdE_zy0uU7gDSs98xAz8s";

async function fetchYouTubeAnalytics() {
  const channelName = socialAccounts.youtube;

  if (!channelName) {
    alert("Please connect your YouTube channel first.");
    return;
  }

  const resultDiv = document.getElementById("youtubeAnalyticsResult");
  resultDiv.innerHTML = "Fetching analytics...";

  try {
    // Search channel ID by name
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelName}&key=${YOUTUBE_API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.items || searchData.items.length === 0) {
      resultDiv.innerHTML = "Channel not found.";
      return;
    }

    const channelId = searchData.items[0].id.channelId;

    // Fetch channel statistics
    const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();

    const channel = statsData.items[0];
const stats = channel.statistics;
const channelTitle = channel.snippet.title;

const currentSubs = Number(stats.subscriberCount);
const currentViews = Number(stats.viewCount);

generateOneYearMonthlyBackfill(channelTitle, currentSubs, currentViews);
function generateOneYearMonthlyBackfill(channelTitle, currentSubs, currentViews) {
  if (youtubeHistory[channelTitle] && youtubeHistory[channelTitle].length >= 12) return;

  youtubeHistory[channelTitle] = [];

  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);

  const months = 12;

  // Start values (1 year ago)
  let startSubs = Math.floor(currentSubs * 0.55);
  let startViews = Math.floor(currentViews * 0.5);

  const subsGrowth = Math.floor((currentSubs - startSubs) / months);
  const viewsGrowth = Math.floor((currentViews - startViews) / months);

  for (let i = 0; i < months; i++) {
    const datePoint = new Date(startDate);
    datePoint.setMonth(startDate.getMonth() + i);

    const label = datePoint.toLocaleString("default", { month: "short", year: "numeric" });

    youtubeHistory[channelTitle].push({
      label,
      subscribers: startSubs + subsGrowth * i,
      views: startViews + viewsGrowth * i
    });
  }

  // Add current month as final point
    const currentLabel = today.toLocaleString("default", { month: "short", year: "numeric" });
  youtubeHistory[channelTitle].push({
    label: currentLabel,
    subscribers: currentSubs,
    views: currentViews
  });
}

localStorage.setItem("creatorsparkYouTubeHistory", JSON.stringify(youtubeHistory));

// render charts for this channel
    
renderCharts(channelTitle);



function renderCharts(channelTitle) {
  const history = youtubeHistory[channelTitle];
  if (!history || history.length === 0) return;

  const labels = history.map(item => item.label);
  const subsData = history.map(item => item.subscribers);
  const viewsData = history.map(item => item.views);

  const subsCtx = document.getElementById("subsChart").getContext("2d");
  const viewsCtx = document.getElementById("viewsChart").getContext("2d");

  if (window.subsChartInstance) window.subsChartInstance.destroy();
  if (window.viewsChartInstance) window.viewsChartInstance.destroy();

  window.subsChartInstance = new Chart(subsCtx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `${channelTitle} Subscribers (1 Year Growth)`,
        data: subsData,
        borderWidth: 2,
        tension: 0.4
      }]
    }
  });

  window.viewsChartInstance = new Chart(viewsCtx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `${channelTitle} Views (1 Year Growth)`,
        data: viewsData,
        borderWidth: 2,
        tension: 0.4
      }]
    }
  });
}



    resultDiv.innerHTML = `
      <h3>${channel.snippet.title}</h3>
      <p>📺 Subscribers: ${Number(stats.subscriberCount).toLocaleString()}</p>
      <p>👁 Total Views: ${Number(stats.viewCount).toLocaleString()}</p>
      <p>🎥 Videos: ${Number(stats.videoCount).toLocaleString()}</p>
    `;

  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "Error fetching analytics.";
  }
}

// ===== AUTH STATE =====
const user = JSON.parse(localStorage.getItem("creatorSparkUser"));

// ===== PAGE PROTECTION =====
const protectedPages = [
  "dashboard.html",
  "generate-ideas.html",
  "how-it-works.html",
  "features.html"
];

const currentPage =
  window.location.pathname.split("/").pop() || "index.html";

if (protectedPages.includes(currentPage) && !user) {
  window.location.href = "index.html";
}

// ===== HEADER AUTH SWITCH =====
const authArea = document.getElementById("auth-area");

if (authArea) {
  if (user) {
    authArea.innerHTML = `
      <div class="user-info">
        <div class="avatar">${user.name.charAt(0).toUpperCase()}</div>
        <span class="username">${user.name}</span>
        <button class="btn-logout">Logout</button>
      </div>
    `;

    document.querySelector(".btn-logout").addEventListener("click", () => {
      localStorage.removeItem("creatorSparkUser");
      window.location.href = "index.html";
    });
  } else {
    authArea.innerHTML = `
      <a href="login.html" class="btn-login">Login</a>
      <a href="signup.html" class="btn-signup">Sign Up</a>
    `;
  }
}
    // ===== ACTIVE NAV LINK =====
const currentPageName =
  window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".header-nav a").forEach(link => {
  if (link.getAttribute("href") === currentPageName) {
    link.classList.add("active");
  }
});
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function initDashboardWelcome() {
  const user = JSON.parse(localStorage.getItem("creatorSparkUser"));
  const welcomeEl = document.querySelector(".dashboard-welcome");

  if (!welcomeEl || !user) return;

  welcomeEl.innerHTML = `
    <h1>${getGreeting()}, ${user.name} 👋</h1>
    <p>Let’s spark your next great content idea.</p>
  `;
}
document.addEventListener("DOMContentLoaded", () => {
  protectPage();
  renderHeader();
  initDashboardWelcome();
});

function initUserMenu() {
  const menu = document.querySelector(".user-menu");
  if (!menu) return;

  menu.querySelector(".user-trigger")
    .addEventListener("click", () => {
      menu.classList.toggle("open");
    });

  document.addEventListener("click", e => {
    if (!menu.contains(e.target)) {
      menu.classList.remove("open");
    }
  });
}











