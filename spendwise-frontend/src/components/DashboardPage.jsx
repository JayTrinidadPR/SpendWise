function DashboardPage({
    totalIncome,
    totalExpenses,
    remainingBalance,
    recentExpenses,
    isLoadingDashboard,
    recentIncomeSources,
    expenseCategoryBreakdown,
    topExpenseCategory
}) {
    const categoryColors = [
        "#f4a261",
        "#7fb3d5",
        "#89c89a",
        "#e7c36a",
        "#d6a6c1",
    ];

    const totalCategorizedExpenses = expenseCategoryBreakdown.reduce((sum, [, amount]) => sum + amount, 0);

    const chartSegments = expenseCategoryBreakdown
        .slice(0, 5)
        .map(([categoryName, amount], index) => ({
            categoryName,
            amount,
            color: categoryColors[index % categoryColors.length],
            percentage: totalCategorizedExpenses === 0 ? 0 : (amount / totalCategorizedExpenses) * 100,
        }));

    const chartBackground = chartSegments.length
        ? `conic-gradient(${chartSegments
            .map((segment, index) => {
                const start = chartSegments
                    .slice(0, index)
                    .reduce((sum, currentSegment) => sum + currentSegment.percentage, 0);
                const end = start + segment.percentage;

                return `${segment.color} ${start}% ${end}%`;
            })
            .join(", ")})`
        : "conic-gradient(#eef3f7 0% 100%)";

    const statusTone =
        remainingBalance > totalIncome * 0.2 ? "stable" : remainingBalance >= 0 ? "watch" : "alert";

    const statusTitle =
        statusTone === "stable"
            ? "On track"
            : statusTone === "watch"
                ? "Watch spending"
                : "Needs attention";

    const statusMessage =
        statusTone === "stable"
            ? "Income is still ahead of spending and your balance has good breathing room."
            : statusTone === "watch"
                ? "You still have a positive balance, but expenses are starting to crowd your budget."
                : "Spending is ahead of income right now, so this month needs a reset plan.";

    return (
        <section className="panel-section dashboard-layout">
            <div className="dashboard-hero">
                <div className="dashboard-hero-copy">
                    <p className="dashboard-kicker">Dashboard</p>
                    <h2>Budget overview</h2>
                    <p>
                        See how income, expenses, and category pressure are shaping your current
                        money picture.
                    </p>
                </div>

                <aside className={`dashboard-status dashboard-status-${statusTone}`}>
                    <p className="dashboard-kicker">Status</p>
                    <h3>{statusTitle}</h3>
                    <p>{statusMessage}</p>
                </aside>
            </div>

            {isLoadingDashboard && (
                <p className="loading-message">
                    Loading your budget data. Render may take a few seconds to wake up.
                </p>
            )}

            <div className="summary-grid dashboard-summary-grid">
                <article className="summary-card income-card dashboard-metric-card">
                    <p className="summary-label">Total Income</p>
                    <h3>${totalIncome.toFixed(2)}</h3>
                </article>

                <article className="summary-card expense-card dashboard-metric-card">
                    <p className="summary-label">Total Expenses</p>
                    <h3>${totalExpenses.toFixed(2)}</h3>
                </article>

                <article className="summary-card balance-card dashboard-metric-card">
                    <p className="summary-label">Remaining Balance</p>
                    <h3>${remainingBalance.toFixed(2)}</h3>
                </article>
            </div>

            <div className="dashboard-overview-grid">
                <section className="dashboard-subsection dashboard-chart-card">
                    <h3>Expense Breakdown</h3>
                    <p>A quick visual read on where your spending is concentrated.</p>

                    {chartSegments.length === 0 ? (
                        <p>No categorized expenses yet.</p>
                    ) : (
                        <div className="dashboard-chart-layout">
                            <div
                                className="dashboard-donut-chart"
                                style={{ background: chartBackground }}
                                aria-hidden="true"
                            >
                                <div className="dashboard-donut-center">
                                    <span>Tracked</span>
                                    <strong>${totalCategorizedExpenses.toFixed(0)}</strong>
                                </div>
                            </div>

                            <ul className="dashboard-chart-legend">
                                {chartSegments.map((segment) => (
                                    <li key={segment.categoryName}>
                                        <span
                                            className="dashboard-legend-swatch"
                                            style={{ backgroundColor: segment.color }}
                                        />
                                        <div>
                                            <strong>{segment.categoryName}</strong>
                                            <span>
                                                ${segment.amount.toFixed(2)} ·{" "}
                                                {segment.percentage.toFixed(0)}%
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                <div className="dashboard-insight-stack">
                    <section className="dashboard-subsection dashboard-top-card">
                        <h3>Top Categories</h3>
                        <p>Your biggest categories surface first so the largest decisions stay visible.</p>

                        {!topExpenseCategory ? (
                            <p>No spending insight yet.</p>
                        ) : (
                            <div className="dashboard-top-content">
                                <p className="insight-title">{topExpenseCategory[0]}</p>
                                <p className="insight-value">${topExpenseCategory[1].toFixed(2)} total</p>

                                <ul className="dashboard-top-list">
                                    {expenseCategoryBreakdown.slice(0, 3).map(([categoryName, amount]) => {
                                        const width =
                                            topExpenseCategory[1] === 0
                                                ? 0
                                                : (amount / topExpenseCategory[1]) * 100;

                                        return (
                                            <li key={categoryName}>
                                                <div className="dashboard-top-row">
                                                    <span>{categoryName}</span>
                                                    <span>${amount.toFixed(0)}</span>
                                                </div>
                                                <div className="dashboard-top-bar">
                                                    <span style={{ width: `${Math.max(width, 8)}%` }} />
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </section>

                    <section className="dashboard-subsection">
                        <h3>Recent Activity</h3>

                        {recentExpenses.length === 0 && recentIncomeSources.length === 0 ? (
                            <p>No budget activity yet.</p>
                        ) : (
                            <div className="dashboard-activity-columns">
                                <div>
                                    <p className="dashboard-mini-heading">Recent Expenses</p>
                                    <ul className="dashboard-list dashboard-compact-list">
                                        {recentExpenses.slice(0, 3).map((expense) => (
                                            <li key={expense.id}>
                                                <span>{expense.title}</span>
                                                <span>${Number(expense.amount).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <p className="dashboard-mini-heading">Recent Income</p>
                                    <ul className="dashboard-list dashboard-compact-list">
                                        {recentIncomeSources.slice(0, 3).map((source) => (
                                            <li key={source.id}>
                                                <span>{source.source_name}</span>
                                                <span>${Number(source.amount).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </section>
    );
}

export default DashboardPage;
