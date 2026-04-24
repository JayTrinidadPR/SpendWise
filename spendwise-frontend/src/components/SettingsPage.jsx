import LogoBadge from "./LogoBadge.jsx";

function SettingsPage({ currentUser, handleLogout, isLoggingOut }) {
    return (
        <section className="panel-section">
            <LogoBadge compact />
            <h2>Settings</h2>
            <p>Manage your account details and current session.</p>

            <section className="settings-hero">
                <div>
                    <p className="summary-label">Signed In As</p>
                    <h3>{currentUser.username}</h3>
                    <p className="settings-email">{currentUser.email}</p>
                </div>

                <span className="settings-badge">Authenticated</span>
            </section>

            <div className="settings-grid">
                <section className="dashboard-subsection">
                    <h3>Account Details</h3>
                    <ul className="dashboard-list">
                        <li>
                            <span>Username</span>
                            <span>{currentUser.username}</span>
                        </li>
                        <li>
                            <span>Email</span>
                            <span>{currentUser.email}</span>
                        </li>
                        <li>
                            <span>Authentication</span>
                            <span>JWT token</span>
                        </li>
                    </ul>
                </section>

                <section className="dashboard-subsection">
                    <h3>Session</h3>
                    <p className="settings-session-text">
                        You are currently signed in to your SpendWise account.
                    </p>

                    <button type="button" className="delete-button" onClick={handleLogout} disabled={isLoggingOut}>
                        {isLoggingOut ? "Logging out..." : "Log Out"}
                    </button>

                    {isLoggingOut && <p className="status">Ending your session...</p>}
                </section>
            </div>
        </section>
    );
}

export default SettingsPage;
