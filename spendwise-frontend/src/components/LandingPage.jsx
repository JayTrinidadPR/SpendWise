import { useEffect, useState } from "react";
import LogoBadge from "./LogoBadge.jsx";

const landingStoryCards = [
    {
        kicker: "Clarity First",
        title: "See your budget pressure instantly.",
        copy: "Track how income, expenses, and categories interact before spending starts to feel noisy.",
        meta: "Live overview",
    },
    {
        kicker: "Multiple Streams",
        title: "Handle more than one paycheck cleanly.",
        copy: "SpendWise keeps salary, side work, and recurring income visible in one calmer workspace.",
        meta: "Income planning",
    },
    {
        kicker: "Smarter Signals",
        title: "Spot the categories shaping your month.",
        copy: "Your biggest spending patterns surface quickly so the largest decisions stay visible.",
        meta: "Category insight",
    },
];

const landingPreviewCards = [
    {
        title: "Monthly Outlook",
        amount: "$1,650",
        caption: "Remaining after planned expenses and recurring bills",
        income: "$3,650",
        expenses: "$2,000",
        meta: "Balanced month",
        bars: [48, 72, 58, 100, 64, 78],
        highlightIndex: 3,
    },
    {
        title: "Weekly Rhythm",
        amount: "$420",
        caption: "Available between your next pay cycle and current essentials",
        income: "$1,120",
        expenses: "$700",
        meta: "Short-term planning",
        bars: [62, 44, 76, 58, 84, 66],
        highlightIndex: 4,
    },
    {
        title: "Category Pressure",
        amount: "$980",
        caption: "Still free after housing and core recurring costs are covered",
        income: "$2,900",
        expenses: "$1,920",
        meta: "Spending visibility",
        bars: [54, 68, 50, 82, 60, 92],
        highlightIndex: 5,
    },
];

function LandingPage({ onCreateAccount, onLogIn }) {
    const [activeStoryCard, setActiveStoryCard] = useState(0);
    const [activePreviewCard, setActivePreviewCard] = useState(0);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setActiveStoryCard((currentCard) => (currentCard + 1) % landingStoryCards.length);
        }, 3600);

        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setActivePreviewCard((currentCard) => (currentCard + 1) % landingPreviewCards.length);
        }, 4200);

        return () => window.clearInterval(intervalId);
    }, []);

    const currentStoryCard = landingStoryCards[activeStoryCard];
    const currentPreviewCard = landingPreviewCards[activePreviewCard];

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

                    <section className="landing-story-card" aria-live="polite">
                        <p className="landing-story-kicker">{currentStoryCard.kicker}</p>
                        <h2>{currentStoryCard.title}</h2>
                        <p className="landing-story-copy">{currentStoryCard.copy}</p>

                        <div className="landing-story-footer">
                            <span className="landing-story-meta">{currentStoryCard.meta}</span>
                            <div className="landing-story-indicators" aria-hidden="true">
                                {landingStoryCards.map((card, index) => (
                                    <span
                                        key={card.kicker}
                                        className={
                                            index === activeStoryCard
                                                ? "landing-story-indicator is-active"
                                                : "landing-story-indicator"
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

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
                    <article className="landing-preview-card landing-preview-main landing-preview-rotating" aria-live="polite">
                        <h2>{currentPreviewCard.title}</h2>
                        <p className="landing-preview-amount">{currentPreviewCard.amount}</p>
                        <p className="landing-preview-caption">
                            {currentPreviewCard.caption}
                        </p>

                        <div className="landing-preview-stats">
                            <div>
                                <span>Income</span>
                                <strong>{currentPreviewCard.income}</strong>
                            </div>
                            <div>
                                <span>Expenses</span>
                                <strong>{currentPreviewCard.expenses}</strong>
                            </div>
                        </div>

                        <div className="landing-preview-bars" aria-hidden="true">
                            {currentPreviewCard.bars.map((height, index) => (
                                <span
                                    key={`${currentPreviewCard.title}-${height}-${index}`}
                                    className={
                                        index === currentPreviewCard.highlightIndex
                                            ? "landing-preview-bar is-highlighted"
                                            : "landing-preview-bar"
                                    }
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </div>

                        <div className="landing-preview-rotating-footer">
                            <span className="landing-preview-meta">{currentPreviewCard.meta}</span>
                            <div className="landing-story-indicators" aria-hidden="true">
                                {landingPreviewCards.map((card, index) => (
                                    <span
                                        key={card.title}
                                        className={
                                            index === activePreviewCard
                                                ? "landing-story-indicator is-active"
                                                : "landing-story-indicator"
                                        }
                                    />
                                ))}
                            </div>
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
