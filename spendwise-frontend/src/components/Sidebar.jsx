
import LogoBadge from "./LogoBadge.jsx";

function Sidebar({ activePage, setActivePage }) {
    return (
        <aside className="sidebar">
            <div className="brand">
                <LogoBadge />
                <h1>Plan with clarity</h1>
            </div>

            <nav className="sidebar-nav">
                <button
                    type="button"
                    className={activePage === "dashboard" ? "nav-button active" : "nav-button"}
                    onClick={() => setActivePage("dashboard")}
                >
                    Dashboard
                </button>

                <button
                    type="button"
                    className={activePage === "income" ? "nav-button active" : "nav-button"}
                    onClick={() => setActivePage("income")}
                >
                    Income
                </button>

                <button
                    type="button"
                    className={activePage === "expenses" ? "nav-button active" : "nav-button"}
                    onClick={() => setActivePage("expenses")}
                >
                    Expenses
                </button>

                <button
                    type="button"
                    className={activePage === "insights" ? "nav-button active" : "nav-button"}
                    onClick={() => setActivePage("insights")}
                >
                    Insights
                </button>

                <button
                    type="button"
                    className={activePage === "settings" ? "nav-button active" : "nav-button"}
                    onClick={() => setActivePage("settings")}
                >
                    Settings
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;
