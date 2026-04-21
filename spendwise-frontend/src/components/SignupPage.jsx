import { useState } from "react";

function SignupPage({ apiBaseUrl, setCurrentUser, setStatus, onSwitchToLogin, loadAuthenticatedAppData }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSignupSubmit(event) {
        setErrorMessage("");
        event.preventDefault();

        try {
            const registerResponse = await fetch(`${apiBaseUrl}/api/auth/register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const registerData = await registerResponse.json();

            if (!registerResponse.ok) {
                throw new Error(registerData.error || "Signup failed");
            }

            const loginResponse = await fetch(`${apiBaseUrl}/api/auth/login`, {
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

            const loginData = await loginResponse.json();

            if (!loginResponse.ok) {
                throw new Error(loginData.error || "Auto-login failed");
            }

            setCurrentUser(loginData);
            await loadAuthenticatedAppData();
            setStatus("Account created successfully.");
        } catch (error) {
            console.error("Error signing up:", error);
            setStatus(error.message || "Failed to create account.");
            setErrorMessage(error.message || "Failed to create account.");
        }
    }

    return (
        <section className="panel-section auth-panel">
            <h2>Sign Up</h2>
            <p>Create an account to save and manage your own budget data.</p>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <form onSubmit={handleSignupSubmit}>
                <label htmlFor="signupUsernameInput">Username</label>
                <input
                    id="signupUsernameInput"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                />

                <label htmlFor="signupEmailInput">Email</label>
                <input
                    id="signupEmailInput"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label htmlFor="signupPasswordInput">Password</label>
                <input
                    id="signupPasswordInput"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                <button type="submit" className="button">
                    Create Account
                </button>
            </form>

            <button type="button" className="button auth-switch-button" onClick={onSwitchToLogin}>
                Back to login
            </button>
        </section>
    );
}

export default SignupPage;
