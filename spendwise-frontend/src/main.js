import "./style.css";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="page">
    <section class="card">
      <p class="eyebrow">SpendWise</p>
      <h1>Expense Tracker Test</h1>
      <p class="description">This page loads expense data from the SpendWise backend API.</p>
      <button id="loadExpensesBtn" class="button">Load Expenses</button>
      <p id="status" class="status">Ready</p>
      <ul id="expensesList" class="expenses-list"></ul>
    </section>
  </main>
`;

const loadExpensesBtn = document.querySelector("#loadExpensesBtn");
const expensesList = document.querySelector("#expensesList");
const status = document.querySelector("#status");

async function loadExpenses() {
  status.textContent = "Loading expenses...";

  try {
    const response = await fetch(`${apiBaseUrl}/api/expenses`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const expenses = await response.json();
    expensesList.innerHTML = "";

    if (!expenses.length) {
      expensesList.innerHTML = "<li>No expenses found.</li>";
      status.textContent = "Loaded 0 expenses.";
      return;
    }

    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.textContent = `${expense.title} - $${expense.amount} (${expense.category})`;
      expensesList.appendChild(li);
    });

    status.textContent = `Loaded ${expenses.length} expense(s).`;
  } catch (error) {
    console.error("Error loading expenses:", error);
    expensesList.innerHTML = "<li>Failed to load expenses.</li>";
    status.textContent = "Request failed. Check that the backend server is running and returning expenses.";
  }
}

loadExpensesBtn.addEventListener("click", loadExpenses);
