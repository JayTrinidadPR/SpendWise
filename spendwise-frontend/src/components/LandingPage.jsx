import LogoBadge from "./LogoBadge.jsx";

function LandingPage({ onCreateAccount, onLogIn }) {
    return (
        <section className="landing-shell">
            <header className="landing-header">
                <p className="landing-header-label">Personal Finance</p>
            </header>

            <div className="landing-grid">
                <section className="landing-hero">
                    <LogoBadge />

                    <h1>Money clarity with a calmer, more elegant command center.</h1>

                    <ul className="landing-feature-list">
                        <li>Multiple income streams</li>
                        <li>Category insights</li>
                        <li>Instant overspending alerts</li>
                    </ul>

                    <div className="landing-actions">
                        <button type="button" className="button" onClick={onCreateAccount}>
                            Create account
                        </button>
                        <button
                            type="button"
                            className="button auth-switch-button"
                            onClick={onLogIn}
                        >
                            Log in
                        </button>
                    </div>

                    <section className="landing-demo-card">
                        <div>
                            <p className="landing-demo-label">Demo Account</p>
                            <h2>Try the full app before signing up.</h2>
                            <p className="landing-demo-copy">
                                Use the preloaded demo account with sample income, expenses, and
                                insights already in place.
                            </p>
                        </div>

                        <dl className="landing-demo-credentials">
                            <div>
                                <dt>Email</dt>
                                <dd>demo@spendwise.app</dd>
                            </div>
                            <div>
                                <dt>Password</dt>
                                <dd>demo1234</dd>
                            </div>
                        </dl>

                    </section>
                </section>

                <section className="landing-preview">
                    <article className="landing-preview-card landing-preview-main">
                        <h2>Monthly Outlook</h2>
                        <p className="landing-preview-amount">$1,650</p>
                        <p className="landing-preview-caption">
                            Remaining after planned expenses and recurring bills
                        </p>

                        <div className="landing-preview-stats">
                            <div>
                                <span>Income</span>
                                <strong>$3,650</strong>
                            </div>
                            <div>
                                <span>Expenses</span>
                                <strong>$2,000</strong>
                            </div>
                        </div>

                        <div className="landing-preview-bars" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                            <span className="tall" />
                            <span />
                            <span />
                        </div>
                    </article>

                    <div className="landing-preview-secondary">
                        <article className="landing-preview-card">
                            <h3>Top Category</h3>
                            <strong>Housing</strong>
                            <p>Keep the largest spending pattern visible at a glance.</p>
                        </article>

                        <article className="landing-preview-card">
                            <h3>Alert Layer</h3>
                            <strong>Overspending appears instantly</strong>
                            <p>Warnings show when expenses exceed income.</p>
                        </article>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default LandingPage;
