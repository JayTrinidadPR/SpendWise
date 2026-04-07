import "./style.css";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="page">
    <section class="card">
      <p class="eyebrow">SpendWise</p>
      <h1>Expense Tracker Test</h1>
      <p class="description">This page loads expense data from the SpendWise backend API.</p>

      <form id="expenseForm">
      <label for="titleInput">Title:</label>
      <input id="titleInput" name="title" type="text" required/>

      <lable for"amountInput">Amount:</label>
      <input id="amountInput" name="amount" type"number" step="0.01" required/>

      <label for ="categoryInput">Category:<label>
      <input id="categoryInput" name="category" type="text" required/>

      <button type="submit" class="button">Add Expense</button>
      </form>

      <button id="loadExpensesBtn" class="button">Load Expenses</button>
      <p id="status" class="status">Ready</p>
      <ul id="expensesList" class="expenses-list"></ul>
    </section>
  </main>
`;

const loadExpensesBtn = document.querySelector("#loadExpensesBtn");
const expensesList = document.querySelector("#expensesList");
const status = document.querySelector("#status");
const expenseForm = document.querySelector("#expenseForm");
const titleInput = document.querySelector("#titleInput");
const amountInput = document.querySelector("#amountInput");
const categoryInput = document.querySelector("#categoryInput");


expenseForm.addEventListener("submit", handleExpenseSubmit);

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
function handleExpenseSubmit(event) {
  event.preventDefault();
console.log("Form submitted");
  const newExpense = {
    title: titleInput.value,
    amount: amountInput.value,
    category: categoryInput.value,
  };

  console.log(newExpense);
  status.textContent = "Submitting expense...";
}


loadExpensesBtn.addEventListener("click", loadExpenses);
expenseForm.addEventListener("submit", handleExpenseSubmit);
