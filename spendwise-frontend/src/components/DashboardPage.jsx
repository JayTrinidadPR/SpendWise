import { useState } from "react";

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
}

function describeDonutSegment(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle) {
    const outerStart = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const outerEnd = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerStart.x} ${innerStart.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
        "Z",
    ].join(" ");
}

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

    const visibleChartCategories = expenseCategoryBreakdown.slice(0, 4);
    const otherCategoryAmount = expenseCategoryBreakdown
        .slice(4)
        .reduce((sum, [, amount]) => sum + amount, 0);

    const chartSource =
        otherCategoryAmount > 0
            ? [...visibleChartCategories, ["Other", otherCategoryAmount]]
            : expenseCategoryBreakdown.slice(0, 5);

    const chartSegments = chartSource.map(([categoryName, amount], index, segments) => {
        const percentage = totalCategorizedExpenses === 0 ? 0 : (amount / totalCategorizedExpenses) * 100;
        const startPercentage = segments
            .slice(0, index)
            .reduce(
                (sum, [, currentAmount]) =>
                    sum + (totalCategorizedExpenses === 0 ? 0 : (currentAmount / totalCategorizedExpenses) * 100),
                0
            );
        const endPercentage = startPercentage + percentage;

        return {
            categoryName,
            amount,
            color: categoryColors[index % categoryColors.length],
            percentage,
            startAngle: (startPercentage / 100) * 360,
            endAngle: (endPercentage / 100) * 360,
        };
    });

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

    const balanceSummary =
        statusTone === "stable"
            ? "Healthy cushion"
            : statusTone === "watch"
                ? "Positive, but tighter"
                : "Spending ahead";

    const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [activeChartSegment, setActiveChartSegment] = useState(null);

    const hoveredSegment =
        activeChartSegment === null ? null : chartSegments[activeChartSegment];

    return (
        <section className="panel-section dashboard-layout">
            <div className="dashboard-hero dashboard-hero-section">
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
                <p className="loading-message dashboard-loading-row">
                    Loading your budget data. Render may take a few seconds to wake up.
                </p>
            )}

            <div className="summary-grid dashboard-summary-grid dashboard-summary-strip dashboard-summary-section">
                <article className="summary-card income-card dashboard-metric-card">
                    <p className="summary-label">
                        <span className="summary-label-full">Total Income</span>
                        <span className="summary-label-short">Income</span>
                    </p>
                    <h3>${totalIncome.toFixed(2)}</h3>
                </article>

                <article className="summary-card expense-card dashboard-metric-card">
                    <p className="summary-label">
                        <span className="summary-label-full">Total Expenses</span>
                        <span className="summary-label-short">Expenses</span>
                    </p>
                    <h3>${totalExpenses.toFixed(2)}</h3>
                </article>

                <article className="summary-card balance-card dashboard-metric-card">
                    <p className="summary-label">
                        <span className="summary-label-full">Remaining Balance</span>
                        <span className="summary-label-short">Balance</span>
                    </p>
                    <h3>${remainingBalance.toFixed(2)}</h3>
                    <p className="dashboard-metric-note">{balanceSummary}</p>
                </article>
            </div>

            <div className="dashboard-overview-grid dashboard-overview-section">
                <section className="dashboard-subsection dashboard-chart-card dashboard-chart-section">
                    <div className="workspace-section-header workspace-section-header-collapsible">
                        <div>
                            <h3>Expense Breakdown</h3>
                            <p>A quick visual read on where your spending is concentrated.</p>
                        </div>
                        <div className="workspace-section-controls">
                            <button
                                type="button"
                                className="button auth-switch-button workspace-toggle-button"
                                onClick={() => setIsBreakdownOpen((isOpen) => !isOpen)}
                            >
                                {isBreakdownOpen ? "Hide Breakdown" : "Show Breakdown"}
                            </button>
                        </div>
                    </div>

                    {chartSegments.length === 0 ? (
                        <p>No categorized expenses yet.</p>
                    ) : (
                        <div className="dashboard-chart-layout">
                            <div className="dashboard-donut-chart" role="img" aria-label="Expense breakdown chart">
                                <svg
                                    className="dashboard-donut-svg"
                                    viewBox="0 0 100 100"
                                    aria-hidden="true"
                                    focusable="false"
                                >
                                    {chartSegments.map((segment, index) => (
                                        <path
                                            key={segment.categoryName}
                                            d={describeDonutSegment(50, 50, 50, 28, segment.startAngle, segment.endAngle)}
                                            fill={segment.color}
                                            className={`dashboard-donut-segment${activeChartSegment === index ? " is-active" : ""}`}
                                            onMouseEnter={() => setActiveChartSegment(index)}
                                            onMouseLeave={() => setActiveChartSegment(null)}
                                            onFocus={() => setActiveChartSegment(index)}
                                            onBlur={() => setActiveChartSegment(null)}
                                            onClick={() =>
                                                setActiveChartSegment((currentIndex) =>
                                                    currentIndex === index ? null : index
                                                )
                                            }
                                            tabIndex={0}
                                        />
                                    ))}
                                </svg>
                                <div className="dashboard-donut-center">
                                    <span>{hoveredSegment ? hoveredSegment.categoryName : "Tracked"}</span>
                                    <strong>
                                        ${hoveredSegment
                                            ? hoveredSegment.amount.toFixed(0)
                                            : totalCategorizedExpenses.toFixed(0)}
                                    </strong>
                                    <small>
                                        {hoveredSegment
                                            ? `${hoveredSegment.percentage.toFixed(0)}% of spending`
                                            : "Hover or tap a slice"}
                                    </small>
                                </div>
                            </div>

                            {isBreakdownOpen && (
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
                            )}
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

                    <section className="dashboard-subsection dashboard-activity-section">
                        <div className="workspace-section-header workspace-section-header-collapsible">
                            <div>
                                <h3>Recent Activity</h3>
                                <p>Latest expense and income movement in one place.</p>
                            </div>
                            <div className="workspace-section-controls">
                                <button
                                    type="button"
                                    className="button auth-switch-button workspace-toggle-button"
                                    onClick={() => setIsActivityOpen((isOpen) => !isOpen)}
                                >
                                    {isActivityOpen ? "Hide Activity" : "Show Activity"}
                                </button>
                            </div>
                        </div>

                        {isActivityOpen && (
                            recentExpenses.length === 0 && recentIncomeSources.length === 0 ? (
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
                            )
                        )}
                    </section>
                </div>
            </div>
        </section>
    );
}

export default DashboardPage;
