

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
      const channelCreatedAt = channel.snippet.publishedAt;


      // Save history snapshot
const snapshot = {
  date: new Date().toLocaleDateString(),
  subscribers: Number(stats.subscriberCount),
  views: Number(stats.viewCount),
  videos: Number(stats.videoCount)
};

// Create history array for this channel if not exists
if (!youtubeHistory[channelTitle]) {
  youtubeHistory[channelTitle] = [];
}

// Save snapshot for this channel only
youtubeHistory[channelTitle].push(snapshot);

localStorage.setItem("creatorsparkYouTubeHistory", JSON.stringify(youtubeHistory));

// Render charts for this channel
renderCharts(channelTitle);



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


function renderCharts(channelTitle) {
  if (!youtubeHistory[channelTitle] || youtubeHistory[channelTitle].length === 0) return;

  const history = youtubeHistory[channelTitle];


  const labels = youtubeHistory.map(item => item.date);
  const subsData = youtubeHistory.map(item => item.subscribers);
  const viewsData = youtubeHistory.map(item => item.views);

  const subsCtx = document.getElementById("subsChart").getContext("2d");
  const viewsCtx = document.getElementById("viewsChart").getContext("2d");

  if (window.subsChartInstance) window.subsChartInstance.destroy();
  if (window.viewsChartInstance) window.viewsChartInstance.destroy();

  window.subsChartInstance = new Chart(subsCtx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Subscribers Growth",
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
        label: "Views Growth",
        data: viewsData,
        borderWidth: 2,
        tension: 0.4
      }]
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  renderConnectedAccounts();
  renderCharts();
});
function generateDemoHistory(currentSubs, currentViews) {
  if (youtubeHistory.length > 1) return; // already has history

  const today = new Date();

  for (let i = 6; i >= 1; i--) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);

    const subs = currentSubs - Math.floor(Math.random() * 3000000);
    const views = currentViews - Math.floor(Math.random() * 500000000);

    youtubeHistory.push({
      date: pastDate.toLocaleDateString(),
      subscribers: subs,
      views: views,
      videos: 0
    });
  }
}
const currentSubs = Number(stats.subscriberCount);
const currentViews = Number(stats.viewCount);
generateOneYearBackfill(channelTitle, currentSubs, currentViews, channelCreatedAt);
youtubeHistory[channelTitle].push({
  date: new Date().toLocaleDateString(),
  subscribers: currentSubs,
  views: currentViews,
  videos: Number(stats.videoCount)
});

localStorage.setItem("creatorsparkYouTubeHistory", JSON.stringify(youtubeHistory));
renderCharts(channelTitle);


// Generate demo past history
generateDemoHistory(currentSubs, currentViews);

// Save today's snapshot
youtubeHistory.push({
  date: new Date().toLocaleDateString(),
  subscribers: currentSubs,
  views: currentViews,
  videos: Number(stats.videoCount)
});

localStorage.setItem("creatorsparkYouTubeHistory", JSON.stringify(youtubeHistory));
// charts load only after fetching analytics
function generateOneYearBackfill(channelTitle, currentSubs, currentViews, channelCreatedAt) {
  // If history already exists, do not overwrite
  if (youtubeHistory[channelTitle] && youtubeHistory[channelTitle].length > 10) return;

  youtubeHistory[channelTitle] = [];

  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 1);

  const months = 12;

  // Estimate starting values (12 months ago)
  let startSubs = Math.floor(currentSubs * 0.6);
  let startViews = Math.floor(currentViews * 0.55);

  const subsGrowth = Math.floor((currentSubs - startSubs) / months);
  const viewsGrowth = Math.floor((currentViews - startViews) / months);

  for (let i = 0; i <= months; i++) {
    const pointDate = new Date(startDate);
    pointDate.setMonth(startDate.getMonth() + i);

    youtubeHistory[channelTitle].push({
      date: pointDate.toLocaleDateString(),
      subscribers: startSubs + subsGrowth * i,
      views: startViews + viewsGrowth * i,
      videos: 0
    });
  }
}








