import { useState } from "react";
const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

function App() {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("Ready");
    const [expenses, setExpenses] = useState([]);
    const [incomeSources, setIncomeSources] = useState([]);
    const [sourceName, setSourceName] = useState("");
    const [sourceAmount, setSourceAmount] = useState("");
    const [sourceFrequency, setSourceFrequency] = useState("monthly");
    const [payDate1, setPayDate1] = useState("");
    const [payDate2, setPayDate2] = useState("");

    async function handleExpenseSubmit(event) {
        event.preventDefault();

        const newExpense = {
            title,
            amount: parseFloat(amount),
            category,
        };

        try {
            const response = await fetch(`${apiBaseUrl}/api/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newExpense),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            setTitle("");
            setAmount("");
            setCategory("");
            setStatus("Expense added successfully.");

            await loadExpenses();
        } catch (error) {
            console.error("Error adding expense:", error);
            setStatus("Failed to add expense.");
        }
    }

    async function handleExpenseDelete(expenseId) {
        setStatus("Deleting expense...");

        try {
            const response = await fetch(`${apiBaseUrl}/api/expenses/${expenseId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            setStatus("Expense deleted successfully.");
            await loadExpenses();
        } catch (error) {
            console.error("Error deleting expense:", error);
            setStatus("Failed to delete expense.");
        }
    }

    async function loadExpenses() {
        setStatus("Loading expenses...");

        try {
            const response = await fetch(`${apiBaseUrl}/api/expenses`);

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            setExpenses(data);
            setStatus(`Loaded ${data.length} expense(s).`);
        } catch (error) {
            console.error("Error loading expenses:", error);
            setStatus("Failed to load expenses.");
        }
    }

     async function loadIncomeSources() {
        setStatus("Loading income sources...");

        try {
            const response = await fetch(`${apiBaseUrl}/api/income-sources`);

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            setIncomeSources(data);
            setStatus(`Loaded ${data.length} income source(s).`);
        } catch (error) {
            console.error("Error loading income sources:", error);
            setStatus("Failed to load income sources.");
        }
    }

    return (
        <main className="page">
            <section className="card">
                <p className="eyebrow">SpendWise</p>
                <h1>Expense Tracker</h1>
                <p className="description">
                    This page lets you create, view, and delete expenses from the SpendWise backend API.
                </p>

                <form onSubmit={handleExpenseSubmit}>
                    <label htmlFor="titleInput">Title</label>
                    <input
                        id="titleInput"
                        name="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label htmlFor="amountInput">Amount</label>
                    <input
                        id="amountInput"
                        name="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required />

                    <label htmlFor="categoryInput">Category</label>
                    <input
                        id="categoryInput"
                        name="category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required />

                    <button type="submit" className="button">
                        Add Expense
                    </button>
                </form>

                <button type="button" className="button" onClick={loadExpenses}>
                    Load Expenses
                </button>

                <button type="button" className="button" onClick={loadIncomeSources}>
                    Load Income Sources
                </button>

                <p className="status">{status}</p>

                <ul className="expenses-list">
                    {expenses.map((expense) => (
                        <li key={expense.id}>
                            {expense.title} - ${expense.amount} ({expense.category})
                            <button
                                type="button"
                                className="delete-button"
                                onClick={() => handleExpenseDelete(expense.id)}
                            >
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>
                <ul className="income-sources-list">
                    {incomeSources.map((source) => (
                        <li key={source.id}>
                            {source.source_name} - ${source.amount} ({source.frequency})
                        </li>
                    ))}
                </ul>   
            </section>
        </main>
    );
}

export default App;
