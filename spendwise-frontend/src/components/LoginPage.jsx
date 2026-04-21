import { useState } from "react";

function LoginPage({ apiBaseUrl, setCurrentUser, setStatus, onSwitchToSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLoginSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: "POST",
                credentials: "include",
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

            setCurrentUser(data);
            setStatus("Logged in successfully.");
        } catch (error) {
            console.error("Error logging in:", error);
            setStatus(error.message || "Failed to log in.");
        }
    }

    return (
        <section className="panel-section auth-panel">
            <h2>Login</h2>
            <p>Sign in to view and manage your personal budget.</p>

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

                <button type="submit" className="button">
                    Log In
                </button>
            </form>

            <button type="button" className="button auth-switch-button" onClick={onSwitchToSignup}>
                Create an account
            </button>
        </section>
    );
}

export default LoginPage;
