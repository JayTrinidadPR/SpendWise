import LogoBadge from "./LogoBadge.jsx";
import { useState } from "react";

function SettingsPage({
    currentUser,
    handleLogout,
    isLoggingOut,
    handlePasswordUpdate,
    isUpdatingPassword
}) {
    const isDemoAccount =
        currentUser.email?.toLowerCase() === "demo@spendwise.app" ||
        currentUser.username?.toLowerCase() === "demo";
    const [isPasswordPanelOpen, setIsPasswordPanelOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    async function onPasswordSubmit(event) {
        event.preventDefault();
        setPasswordMessage("");
        setPasswordError("");

        if (newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New password and confirmation do not match.");
            return;
        }

        const result = await handlePasswordUpdate({ currentPassword, newPassword });

        if (!result.success) {
            setPasswordError(result.error || "Failed to update password.");
            return;
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMessage("Password updated successfully.");
    }

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

            <section className="dashboard-subsection settings-password-section">
                <div className="settings-password-header">
                    <div>
                        <p className="workspace-kicker">Security</p>
                        <h3>Update Password</h3>
                    </div>
                    {!isDemoAccount && (
                        <button
                            type="button"
                            className="button auth-switch-button settings-password-toggle"
                            onClick={() => setIsPasswordPanelOpen((isOpen) => !isOpen)}
                        >
                            {isPasswordPanelOpen ? "Hide Form" : "Change Password"}
                        </button>
                    )}
                </div>

                <p className="settings-session-text">
                    {isDemoAccount
                        ? "Password changes are disabled for the demo account so the preview login stays stable for everyone."
                        : "Change your password here to keep your account secure."}
                </p>

                {!isDemoAccount && isPasswordPanelOpen && (
                    <>
                        <form onSubmit={onPasswordSubmit} className="settings-password-form">
                            <label htmlFor="currentPasswordInput">Current Password</label>
                            <input
                                id="currentPasswordInput"
                                type="password"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                required
                            />

                            <label htmlFor="newPasswordInput">New Password</label>
                            <input
                                id="newPasswordInput"
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                minLength={8}
                                required
                            />

                            <label htmlFor="confirmPasswordInput">Confirm New Password</label>
                            <input
                                id="confirmPasswordInput"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                minLength={8}
                                required
                            />

                            <button type="submit" className="button" disabled={isUpdatingPassword}>
                                {isUpdatingPassword ? "Updating password..." : "Update Password"}
                            </button>
                        </form>

                        {passwordError && <p className="auth-error settings-password-feedback">{passwordError}</p>}
                        {passwordMessage && (
                            <p className="loading-message settings-password-feedback">{passwordMessage}</p>
                        )}
                    </>
                )}
            </section>
        </section>
    );
}

export default SettingsPage;
