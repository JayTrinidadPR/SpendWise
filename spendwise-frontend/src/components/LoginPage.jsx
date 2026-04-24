import { useState } from "react";
import LogoBadge from "./LogoBadge.jsx";

function LoginPage({
    apiBaseUrl,
    persistAuth,
    setStatus,
    onBackToLanding,
    onSwitchToSignup,
    loadAuthenticatedAppData
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    async function handleLoginSubmit(event) {
        setErrorMessage("");
        event.preventDefault();
        setIsLoggingIn(true);

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            persistAuth(data);
            await loadAuthenticatedAppData(data.token);
            setStatus("Logged in successfully.");
        } catch (error) {
            console.error("Error logging in:", error);
            setErrorMessage(error.message || "Failed to log in.");
            setStatus(error.message || "Failed to log in.");
        } finally {
            setIsLoggingIn(false);
        }
    }

    return (
        <section className="panel-section auth-panel">
            <LogoBadge />
            <h2>Login</h2>
            <p>Sign in to view and manage your personal budget.</p>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <form onSubmit={handleLoginSubmit}>
                <label htmlFor="loginEmailInput">Email</label>
                <input
                    id="loginEmailInput"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label htmlFor="loginPasswordInput">Password</label>
                <input
                    id="loginPasswordInput"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                <button type="submit" className="button" disabled={isLoggingIn}>
                    {isLoggingIn ? "Logging in..." : "Log In"}
                </button>
            </form>

            {isLoggingIn && <p className="status">Checking your account...</p>}

            <button type="button" className="button auth-switch-button" onClick={onSwitchToSignup}>
                Create an account
            </button>

            <button type="button" className="button auth-switch-button" onClick={onBackToLanding}>
                Back to landing page
            </button>
        </section>
    );
}

export default LoginPage;
