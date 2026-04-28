import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import DashboardPage from "./components/DashboardPage.jsx";
import ExpensesPage from "./components/ExpensesPage.jsx";
import IncomePage from "./components/IncomePage.jsx";
import InsightsPage from "./components/InsightsPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import LandingPage from "./components/LandingPage.jsx";


const TOKEN_STORAGE_KEY = "spendwise_auth_token";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

function App() {
    const [activePage, setActivePage] = useState("dashboard");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("Ready");
    const [currentUser, setCurrentUser] = useState(null);
    const [authToken, setAuthToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || "");
    const [authMode, setAuthMode] = useState("landing");
    const [expenses, setExpenses] = useState([]);
    const [incomeSources, setIncomeSources] = useState([]);
    const [sourceName, setSourceName] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [frequency, setFrequency] = useState("weekly");
    const [payDate1, setPayDate1] = useState("");
    const [payDate2, setPayDate2] = useState("");
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editingIncomeSourceId, setEditingIncomeSourceId] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSavingExpenses, setIsSavingExpenses] = useState(false);
    const [isSavingIncome, setIsSavingIncome] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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

    const expenseCategoryBreakdown = Object.entries(
        expenses.reduce((totals, expense) => {
            const categoryName = expense.category?.trim() || "Uncategorized";
            const amountValue = Number(expense.amount);

            totals[categoryName] = (totals[categoryName] || 0) + amountValue;
            return totals;
        }, {})
    )
        .sort((a, b) => b[1] - a[1]);

    const topExpenseCategory = expenseCategoryBreakdown[0] || null;

    const totalExpenseCount = expenses.length;

    const averageExpenseAmount =
        expenses.length === 0 ? 0 : totalExpenses / expenses.length;

    const savingsRate =
        totalIncome === 0 ? 0 : ((totalIncome - totalExpenses) / totalIncome) * 100;

    function getAuthorizationHeader(tokenOverride = authToken) {
        const token = tokenOverride || localStorage.getItem(TOKEN_STORAGE_KEY);

        if (!token) {
            return null;
        }

        return {
            Authorization: `Bearer ${token}`,
        };
    }

    function persistAuth(authResponse) {
        localStorage.setItem(TOKEN_STORAGE_KEY, authResponse.token);
        setAuthToken(authResponse.token);
        setCurrentUser(authResponse.user);
    }

    function clearAuth() {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuthToken("");
        setCurrentUser(null);
        setExpenses([]);
        setIncomeSources([]);
    }

    async function loadAuthenticatedAppData(tokenOverride = authToken) {
        const authorizationHeader = getAuthorizationHeader(tokenOverride);

        if (!authorizationHeader) {
            throw new Error("Missing authentication token");
        }

        const [expensesResponse, incomeSourcesResponse] = await Promise.all([
            fetch(`${apiBaseUrl}/api/expenses`, {
                headers: authorizationHeader,
            }),
            fetch(`${apiBaseUrl}/api/income-sources`, {
                headers: authorizationHeader,
            }),
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
    }

    useEffect(() => {
        async function initializeApp() {
            try {
                setIsLoadingDashboard(true);

                const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

                if (!storedToken) {
                    clearAuth();
                    setStatus("Please log in to view your budget.");
                    return;
                }

                const meResponse = await fetch(`${apiBaseUrl}/api/auth/me`, {
                    headers: getAuthorizationHeader(storedToken),
                });

                if (!meResponse.ok) {
                    clearAuth();
                    setStatus("Please log in to view your budget.");
                    return;
                }

                const userData = await meResponse.json();
                setCurrentUser(userData);
                setAuthToken(storedToken);

                await loadAuthenticatedAppData(storedToken);
                setStatus("Dashboard data loaded successfully.");

            } catch (error) {
                console.error("Error loading dashboard data:", error);
                clearAuth();
                setStatus("Failed to load dashboard data.");
            }
            finally {
                setIsLoadingDashboard(false);
            }
        }

        initializeApp();
    }, []);


    function resetExpenseForm() {
        setTitle("");
        setAmount("");
        setCategory("");
        setEditingExpenseId(null);
    }

    function handleExpenseEditStart(expense) {
        setTitle(expense.title);
        setAmount(String(expense.amount));
        setCategory(expense.category);
        setEditingExpenseId(expense.id);
        setStatus(`Editing expense: ${expense.title}`);
    }

    function handleExpenseEditCancel() {
        resetExpenseForm();
        setStatus("Edit cancelled.");
    }

    function resetIncomeSourceForm() {
        setSourceName("");
        setIncomeAmount("");
        setFrequency("weekly");
        setPayDate1("");
        setPayDate2("");
        setEditingIncomeSourceId(null);
    }

    function handleIncomeSourceEditStart(source) {
        setSourceName(source.source_name);
        setIncomeAmount(String(source.amount));
        setFrequency(source.frequency);
        setPayDate1(String(source.pay_date_1));
        setPayDate2(source.pay_date_2 ? String(source.pay_date_2) : "");
        setEditingIncomeSourceId(source.id);
        setStatus(`Editing income source: ${source.source_name}`);
    }

    function handleIncomeSourceEditCancel() {
        resetIncomeSourceForm();
        setStatus("Income edit cancelled.");
    }

    function handlePageChange(nextPage) {
        setActivePage(nextPage);
        setIsMobileNavOpen(false);
    }


    async function handleExpenseSubmit(event) {
        event.preventDefault();
        setIsSavingExpenses(true);

        const expensePayload = {
            title,
            amount: parseFloat(amount),
            category,
        };

        const isEditing = editingExpenseId !== null;
        const endpoint = isEditing
            ? `${apiBaseUrl}/api/expenses/${editingExpenseId}`
            : `${apiBaseUrl}/api/expenses`;

        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    ...getAuthorizationHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expensePayload),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            resetExpenseForm();
            setStatus(isEditing ? "Expense updated successfully." : "Expense added successfully.");

            await loadExpenses();
        } catch (error) {
            console.error(isEditing ? "Error updating expense:" : "Error adding expense:", error);
            setStatus(isEditing ? "Failed to update expense." : "Failed to add expense.");
        } 
        finally {
            setIsSavingExpenses(false);
        }
    }



    async function handleExpenseDelete(expenseId) {
        setStatus("Deleting expense...");

        try {
            const response = await fetch(`${apiBaseUrl}/api/expenses/${expenseId}`, {
                method: "DELETE",
                headers: getAuthorizationHeader(),
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
                headers: getAuthorizationHeader(),
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
            const response = await fetch(`${apiBaseUrl}/api/expenses`, {
                headers: getAuthorizationHeader(),
            });

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
            const response = await fetch(`${apiBaseUrl}/api/income-sources`, {
                headers: getAuthorizationHeader(),
            });

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
        setIsSavingIncome(true);

        const incomeSourcePayload = {
            source_name: sourceName,
            amount: parseFloat(incomeAmount),
            frequency,
            pay_date_1: parseInt(payDate1),
            pay_date_2: payDate2 ? parseInt(payDate2) : null,
        };

        const isEditing = editingIncomeSourceId !== null;
        const endpoint = isEditing
            ? `${apiBaseUrl}/api/income-sources/${editingIncomeSourceId}`
            : `${apiBaseUrl}/api/income-sources`;

        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    ...getAuthorizationHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(incomeSourcePayload),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            resetIncomeSourceForm();
            setStatus(isEditing ? "Income source updated successfully." : "Income source added successfully.");

            await loadIncomeSources();
        } catch (error) {
            console.error(isEditing ? "Error updating income source:" : "Error adding income source:", error);
            setStatus(isEditing ? "Failed to update income source." : "Failed to add income source.");
        } finally {
            setIsSavingIncome(false);
        }

    }

    async function handleLogout() {
        setIsLoggingOut(true);
        try {
            clearAuth();
            setStatus("Logged out successfully.");
            setAuthMode("landing");
            setIsMobileNavOpen(false);
        } catch (error) {
            console.error("Error logging out:", error);
            setStatus("Failed to log out.");
        }
        finally {
            setIsLoggingOut(false);
        }
    }

    async function handlePasswordUpdate({ currentPassword, newPassword }) {
        setIsUpdatingPassword(true);

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/password`, {
                method: "PATCH",
                headers: {
                    ...getAuthorizationHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update password");
            }

            setStatus("Password updated successfully.");
            return { success: true };
        } catch (error) {
            console.error("Error updating password:", error);
            setStatus(error.message || "Failed to update password.");
            return { success: false, error: error.message || "Failed to update password." };
        } finally {
            setIsUpdatingPassword(false);
        }
    }

    return (
        <main className="page-shell">
            {currentUser && (
                <Sidebar
                    activePage={activePage}
                    currentUser={currentUser}
                    isMobileNavOpen={isMobileNavOpen}
                    onToggleMobileNav={() => setIsMobileNavOpen((isOpen) => !isOpen)}
                    onNavigate={handlePageChange}
                    handleLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                />
            )}
            <section className="main-panel">
                {!currentUser ? (
                    <div className="page-transition" key={authMode}>
                        {authMode === "landing" ? (
                        <LandingPage
                            onCreateAccount={() => setAuthMode("signup")}
                            onLogIn={() => setAuthMode("login")}
                        />
                        ) : authMode === "login" ? (
                        <LoginPage
                            apiBaseUrl={apiBaseUrl}
                            persistAuth={persistAuth}
                            setStatus={setStatus}
                            loadAuthenticatedAppData={loadAuthenticatedAppData}
                            onBackToLanding={() => setAuthMode("landing")}
                            onSwitchToSignup={() => setAuthMode("signup")}
                        />
                        ) : (
                            <SignupPage
                                apiBaseUrl={apiBaseUrl}
                                persistAuth={persistAuth}
                                loadAuthenticatedAppData={loadAuthenticatedAppData}
                                setStatus={setStatus}
                                onSwitchToLogin={() => setAuthMode("login")}
                            />
                        )}
                    </div>
                ) : (
                    <>
                        <div className="app-toolbar">
                            <p className="welcome-text">Signed in as {currentUser.username}</p>
                        </div>
                        <div className="page-transition" key={activePage}>
                            {activePage === "dashboard" && (
                                <DashboardPage
                                    totalIncome={totalIncome}
                                    totalExpenses={totalExpenses}
                                    remainingBalance={remainingBalance}
                                    recentExpenses={recentExpenses}
                                    recentIncomeSources={recentIncomeSources}
                                    expenseCategoryBreakdown={expenseCategoryBreakdown}
                                    topExpenseCategory={topExpenseCategory}
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
                                    handleIncomeSourceSubmit={handleIncomeSourceSubmit}
                                    handleIncomeSourceDelete={handleIncomeSourceDelete}
                                    editingIncomeSourceId={editingIncomeSourceId}
                                    handleIncomeSourceEditStart={handleIncomeSourceEditStart}
                                    handleIncomeSourceEditCancel={handleIncomeSourceEditCancel}
                                    isSavingIncome={isSavingIncome}
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
                                    handleExpenseDelete={handleExpenseDelete}
                                    editingExpenseId={editingExpenseId}
                                    handleExpenseEditStart={handleExpenseEditStart}
                                    handleExpenseEditCancel={handleExpenseEditCancel}
                                    isSavingExpenses={isSavingExpenses}
                                />
                            )}

                            {activePage === "insights" && (
                                <InsightsPage
                                    topExpenseCategory={topExpenseCategory}
                                    totalExpenseCount={totalExpenseCount}
                                    averageExpenseAmount={averageExpenseAmount}
                                    savingsRate={savingsRate}
                                />
                            )}

                            {activePage === "settings" && (
                            <SettingsPage
                                currentUser={currentUser}
                                handleLogout={handleLogout}
                                isLoggingOut={isLoggingOut}
                                handlePasswordUpdate={handlePasswordUpdate}
                                isUpdatingPassword={isUpdatingPassword}
                            />
                        )}
                        </div>
                    </>
                )}
            </section>
        </main >
    );

}

export default App;
