import "./style.css";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="page">
    <section class="card">
      <p class="eyebrow">SpendWise</p>
      <h1>Frontend Test</h1>
      <p class="description">This frontend is calling the deployed backend API.</p>
      <button id="loadUsersBtn" class="button">Load Users</button>
      <p id="status" class="status">Ready</p>
      <ul id="usersList" class="users-list"></ul>
    </section>
  </main>
`;

const loadUsersBtn = document.querySelector("#loadUsersBtn");
const usersList = document.querySelector("#usersList");
const status = document.querySelector("#status");

async function loadUsers() {
  status.textContent = "Loading users...";

  try {
    const response = await fetch(`${apiBaseUrl}/api/users`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const users = await response.json();
    usersList.innerHTML = "";

    if (!users.length) {
      usersList.innerHTML = "<li>No users found.</li>";
      status.textContent = "Loaded 0 users.";
      return;
    }

    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = `${user.username} (${user.email})`;
      usersList.appendChild(li);
    });

    status.textContent = `Loaded ${users.length} user(s).`;
  } catch (error) {
    console.error("Error loading users:", error);
    usersList.innerHTML = "<li>Failed to load users.</li>";
    status.textContent = "Request failed. Check the API URL and CORS settings.";
  }
}

loadUsersBtn.addEventListener("click", loadUsers);
