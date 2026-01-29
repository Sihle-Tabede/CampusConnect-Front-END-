/* ============================
   MOCK / FRONTEND-ONLY LOGIC
   ============================ */

// Utility helpers
function showMessage(message, type = "error") {
  const messageDiv = document.getElementById("message");
  if (!messageDiv) return;

  messageDiv.innerHTML = `<div class="${type}">${message}</div>`;
  setTimeout(() => (messageDiv.innerHTML = ""), 3000);
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

/* ============================
   MOCK REGISTRATION
   ============================ */

function handleRegister(event) {
  event.preventDefault();

  const userType = document.getElementById("userType").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const identifier =
    userType === "student"
      ? document.getElementById("studentNumber").value
      : document.getElementById("staffNumber").value;

  const newUser = {
    id: Date.now(),
    userType,
    firstName,
    lastName,
    email,
    identifier,
    password // demo only
  };

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  showMessage("Account created successfully!", "success");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
}

/* ============================
   MOCK LOGIN
   ============================ */

function handleLogin(event) {
  event.preventDefault();

  const userType = document.getElementById("userType").value;
  const identifier = document.getElementById("identifier").value;

  const mockUser = {
    id: Date.now(),
    userType,
    identifier,
    firstName: "Demo",
    lastName: userType === "student" ? "Student" : "Staff",
    email: "demo@tut4life.ac.za"
  };

  setCurrentUser(mockUser);

  showMessage("Login successful!", "success");

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
}

/* ============================
   LOGOUT
   ============================ */

function logout() {
  clearCurrentUser();
  window.location.href = "index.html";
}

/* ============================
   ANNOUNCEMENTS
   ============================ */

function loadAnnouncements() {
  const announcements = [
    {
      id: 1,
      title: "Semester Tests",
      content: "Semester tests begin next week. Check your timetable.",
      date: "2026-03-10"
    },
    {
      id: 2,
      title: "Career Expo",
      content: "Annual Career Expo at Pretoria Campus.",
      date: "2026-03-15"
    }
  ];

  const container = document.getElementById("announcements");
  if (!container) return;

  container.innerHTML = "";

  announcements.forEach(a => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>📢 ${a.title}</strong>
      <p>${a.content}</p>
      <small>${a.date}</small>
    `;
    container.appendChild(div);
  });
}

/* ============================
   PAGE GUARD
   ============================ */

function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href = "login.html";
  }
}

/* ============================
   SERVICE REQUEST SUBMISSION
   ============================ */

function submitRequest() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showMessage("You must be logged in to submit a request");
    return;
  }

  // IDs EXACTLY as in dashboard.html
  const requestType = document.getElementById("supportType").value;
  const requestDetails = document.getElementById("supportDetails").value;

  if (!requestType || !requestDetails.trim()) {
    showMessage("Please complete all fields");
    return;
  }

  const newRequest = {
    id: Date.now(),
    userId: currentUser.id,
    userName: `${currentUser.firstName} ${currentUser.lastName}`,
    type: requestType,
    details: requestDetails,
    status: "Pending",
    timestamp: new Date().toISOString()
  };

  const requests = JSON.parse(localStorage.getItem("requests") || "[]");
  requests.push(newRequest);
  localStorage.setItem("requests", JSON.stringify(requests));

  showMessage("Service request submitted successfully!", "success");

  // Reset form
  document.getElementById("supportType").value = "";
  document.getElementById("supportDetails").value = "";

  // Reload dashboard list
  if (typeof loadRequests === "function") {
    loadRequests();
  }
}

/* ============================
   LOAD USER REQUESTS (STUDENT)
   ============================ */

function loadRequests() {
  const container = document.getElementById("requests");
  if (!container) return;

  const currentUser = getCurrentUser();
  const requests = JSON.parse(localStorage.getItem("requests") || "[]")
    .filter(r => r.userId === currentUser.id);

  container.innerHTML = "";

  if (requests.length === 0) {
    container.innerHTML = "<p>No service requests yet.</p>";
    return;
  }

  requests.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${r.type}</strong>
      <p>${r.details}</p>
      <small>Status: <b>${r.status}</b></small>
    `;
    container.appendChild(div);
  });
}
