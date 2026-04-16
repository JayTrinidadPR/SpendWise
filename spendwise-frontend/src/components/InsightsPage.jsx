function InsightsPage({
    topExpenseCategory,
    totalExpenseCount,
    averageExpenseAmount,
    savingsRate,
}) {
    return (
        <section className="panel-section">
            <h2>Insights</h2>
            <p>Here is a quick look at your current spending patterns.</p>

            <div className="insights-grid">
                <article className="summary-card insight-card">
                    <p className="summary-label">Top Spending Category</p>
                    {!topExpenseCategory ? (
                        <h3>No data yet</h3>
                    ) : (
                        <h3>{topExpenseCategory[0]}</h3>
                    )}
                </article>

                <article className="summary-card insight-card">
                    <p className="summary-label">Total Expenses Logged</p>
                    <h3>{totalExpenseCount}</h3>
                </article>

                <article className="summary-card insight-card">
                    <p className="summary-label">Average Expense</p>
                    <h3>${averageExpenseAmount.toFixed(2)}</h3>
                </article>

                <article className="summary-card insight-card">
                    <p className="summary-label">Savings Rate</p>
                    <h3>{savingsRate.toFixed(1)}%</h3>
                </article>
            </div>

            {topExpenseCategory && (
                <section className="dashboard-subsection">
                    <h3>Top Category Detail</h3>
                    <p className="insight-title">{topExpenseCategory[0]}</p>
                    <p className="insight-value">
                        ${topExpenseCategory[1].toFixed(2)} total spent
                    </p>
                </section>
            )}
        </section>
    );
}

export default InsightsPage;
