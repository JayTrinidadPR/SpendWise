
import LogoBadge from "./LogoBadge.jsx";

function Sidebar({
    activePage,
    currentUser,
    isMobileNavOpen,
    onToggleMobileNav,
    onNavigate,
    handleLogout,
    isLoggingOut
}) {
    return (
        <aside className={`sidebar ${isMobileNavOpen ? "sidebar-mobile-open" : ""}`}>
            <div className="sidebar-header">
                <div className="brand">
                    <LogoBadge />
                    <h1>Plan with clarity</h1>
                </div>

                <button
                    type="button"
                    className="sidebar-toggle"
                    onClick={onToggleMobileNav}
                    aria-expanded={isMobileNavOpen}
                    aria-controls="sidebar-navigation"
                >
                    {isMobileNavOpen ? "Close" : "Menu"}
                </button>
            </div>

            <div className="sidebar-content" id="sidebar-navigation">
                <div className="sidebar-mobile-meta">
                    <p className="eyebrow">Active View</p>
                    <strong>{activePage}</strong>
                    <span>{currentUser.email}</span>
                </div>

                <nav className="sidebar-nav">
                    <button
                        type="button"
                        className={activePage === "dashboard" ? "nav-button active" : "nav-button"}
                        onClick={() => onNavigate("dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        type="button"
                        className={activePage === "income" ? "nav-button active" : "nav-button"}
                        onClick={() => onNavigate("income")}
                    >
                        Income
                    </button>

                    <button
                        type="button"
                        className={activePage === "expenses" ? "nav-button active" : "nav-button"}
                        onClick={() => onNavigate("expenses")}
                    >
                        Expenses
                    </button>

                    <button
                        type="button"
                        className={activePage === "insights" ? "nav-button active" : "nav-button"}
                        onClick={() => onNavigate("insights")}
                    >
                        Insights
                    </button>

                    <button
                        type="button"
                        className={activePage === "settings" ? "nav-button active" : "nav-button"}
                        onClick={() => onNavigate("settings")}
                    >
                        Settings
                    </button>
                </nav>

                <div className="sidebar-session">
                    <p className="eyebrow">Signed In</p>
                    <strong>{currentUser.username}</strong>
                    <span>{currentUser.email}</span>
                    <button
                        type="button"
                        className="delete-button sidebar-logout-button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? "Logging out..." : "Log Out"}
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
