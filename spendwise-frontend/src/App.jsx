import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import DashboardPage from "./components/DashboardPage.jsx";
import ExpensesPage from "./components/ExpensesPage.jsx";
import IncomePage from "./components/IncomePage.jsx";
import PlaceholderPage from "./components/PlaceholderPage.jsx";


const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

function App() {
    const [activePage, setActivePage] = useState("dashboard");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("Ready");
    const [expenses, setExpenses] = useState([]);
    const [incomeSources, setIncomeSources] = useState([]);
    const [sourceName, setSourceName] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [frequency, setFrequency] = useState("weekly");
    const [payDate1, setPayDate1] = useState("");
    const [payDate2, setPayDate2] = useState("");
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
    const totalIncome = incomeSources.reduce((sum, source) => {
        return sum + Number(source.amount);
    }, 0);

    const totalExpenses = expenses.reduce((sum, expense) => {
        return sum + Number(expense.amount);
    }, 0);

    const remainingBalance = totalIncome - totalExpenses;

    const recentExpenses = [...expenses]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);
    const recentIncomeSources = [...incomeSources]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    useEffect(() => {

        async function loadDashboardData() {
            try {
                setIsLoadingDashboard(true);
                const [expensesResponse, incomeSourcesResponse] = await Promise.all([
                    fetch(`${apiBaseUrl}/api/expenses`),
                    fetch(`${apiBaseUrl}/api/income-sources`),
                ]);

                if (!expensesResponse.ok) {
                    throw new Error(`Failed to load expenses: ${expensesResponse.status}`);
                }
                if (!incomeSourcesResponse.ok) {
                    throw new Error(`Failed to load income sources: ${incomeSourcesResponse.status}`);
                }

                const expensesData = await expensesResponse.json();
                const incomeSourcesData = await incomeSourcesResponse.json();

                setExpenses(expensesData);
                setIncomeSources(incomeSourcesData);
                setStatus("Dashboard data loaded successfully.");
            } catch (error) {
                console.error("Error loading dashboard data:", error);
                setStatus("Failed to load dashboard data.");
            }
            finally {
                setIsLoadingDashboard(false);
            }
        } 
        

        loadDashboardData();
    }, []);

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

    async function handleIncomeSourceDelete(sourceId) {
        setStatus("Deleting income source...");

        try {
            const response = await fetch(`${apiBaseUrl}/api/income-sources/${sourceId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            setStatus("Income source deleted successfully.");
            await loadIncomeSources();
        } catch (error) {
            console.error("Error deleting income source:", error);
            setStatus("Failed to delete income source.");
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

    async function handleIncomeSourceSubmit(event) {
        event.preventDefault();

        const newIncomeSource = {
            source_name: sourceName,
            amount: parseFloat(incomeAmount),
            frequency,
            pay_date_1: parseInt(payDate1),
            pay_date_2: payDate2 ? parseInt(payDate2) : null,
        };

        try {
            const response = await fetch(`${apiBaseUrl}/api/income-sources`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newIncomeSource),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            setSourceName("");
            setIncomeAmount("");
            setFrequency("weekly");
            setPayDate1("");
            setPayDate2("");
            setStatus("Income source added successfully.");

            await loadIncomeSources();
        } catch (error) {
            console.error("Error adding income source:", error);
            setStatus("Failed to add income source.");
        }

    }

    return (
        <main className="page-shell">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />

            <section className="main-panel">
                {activePage === "dashboard" && (
                    <DashboardPage
                        totalIncome={totalIncome}
                        totalExpenses={totalExpenses}
                        remainingBalance={remainingBalance}
                        recentExpenses={recentExpenses}
                        recentIncomeSources={recentIncomeSources}
                        isLoadingDashboard={isLoadingDashboard}
                    />
                )}

                {activePage === "income" && (
                    <IncomePage
                        sourceName={sourceName}
                        setSourceName={setSourceName}
                        incomeAmount={incomeAmount}
                        setIncomeAmount={setIncomeAmount}
                        frequency={frequency}
                        setFrequency={setFrequency}
                        payDate1={payDate1}
                        setPayDate1={setPayDate1}
                        payDate2={payDate2}
                        setPayDate2={setPayDate2}
                        incomeSources={incomeSources}
                        loadIncomeSources={loadIncomeSources}
                        handleIncomeSourceSubmit={handleIncomeSourceSubmit}
                        handleIncomeSourceDelete={handleIncomeSourceDelete}
                    />
                )}

                {activePage === "expenses" && (
                    <ExpensesPage
                        title={title}
                        setTitle={setTitle}
                        amount={amount}
                        setAmount={setAmount}
                        category={category}
                        setCategory={setCategory}
                        expenses={expenses}
                        handleExpenseSubmit={handleExpenseSubmit}
                        loadExpenses={loadExpenses}
                        handleExpenseDelete={handleExpenseDelete}
                    />
                )}

                {activePage === "insights" && (
                    <PlaceholderPage
                        title="Insights"
                        description="This page is coming soon. It will show trends, category patterns, and budgeting insights."
                    />
                )}

                {activePage === "settings" && (
                    <PlaceholderPage
                        title="Settings"
                        description="This page is coming soon. It will hold user preferences and account options."
                    />
                )}

            </section>
        </main >
    );

}

export default App;
