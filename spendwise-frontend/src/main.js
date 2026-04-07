import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


function App() {
  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">SpendWise</p>
        <h1>Expense Tracker Test</h1>
        <p className="description">This page loads expense data from the SpendWise backend API.</p>
        </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



// const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

// const app = document.querySelector("#app");

// app.innerHTML = `
//   
// `;

// const loadExpensesBtn = document.querySelector("#loadExpensesBtn");
// const expensesList = document.querySelector("#expensesList");
// const status = document.querySelector("#status");
// const expenseForm = document.querySelector("#expenseForm");
// const titleInput = document.querySelector("#titleInput");
// const amountInput = document.querySelector("#amountInput");
// const categoryInput = document.querySelector("#categoryInput");


// expenseForm.addEventListener("submit", handleExpenseSubmit);

// async function loadExpenses() {
//   status.textContent = "Loading expenses...";

//   try {
//     const response = await fetch(`${apiBaseUrl}/api/expenses`);

//     if (!response.ok) {
//       throw new Error(`Request failed with status ${response.status}`);
//     }

//     const expenses = await response.json();
//     expensesList.innerHTML = "";

//     if (!expenses.length) {
//       expensesList.innerHTML = "<li>No expenses found.</li>";
//       status.textContent = "Loaded 0 expenses.";
//       return;
//     }

//     expenses.forEach((expense) => {
//       const li = document.createElement("li");
//       li.textContent = `${expense.title} - $${expense.amount} (${expense.category})`;
//       expensesList.appendChild(li);
//     });

//     status.textContent = `Loaded ${expenses.length} expense(s).`;
//   } catch (error) {
//     console.error("Error loading expenses:", error);
//     expensesList.innerHTML = "<li>Failed to load expenses.</li>";
//     status.textContent = "Request failed. Check that the backend server is running and returning expenses.";
//   }
// }
// async function handleExpenseSubmit(event) {
//   event.preventDefault();

//   const newExpense = {
//     title: titleInput.value,
//     amount: amountInput.value,
//     category: categoryInput.value,
//   };

//   status.textContent = "Submitting expense...";

//   try {
//     const response = await fetch(`${apiBaseUrl}/api/expenses`, {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify(newExpense),
//     });

//     if (!response.ok) {
//       throw new Error(`Request failed with status ${response.status}`);
//     }

//     titleInput.value = "";
//     amountInput.value = "";
//     categoryInput.value = "";

//     status.textContent = "Expense added successfully!";
//     await loadExpenses();

//   } catch (error) {
//     console.error("Error submitting expense.", error);
//     status.textContent = "Failed to submit expense.";
//   }
// }


// loadExpensesBtn.addEventListener("click", loadExpenses);
// expenseForm.addEventListener("submit", handleExpenseSubmit);
