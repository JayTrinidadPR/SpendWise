function DashboardPage({ totalIncome, totalExpenses, remainingBalance, recentExpenses }) {
    return (
        <section className="panel-section">
            <h2>Dashboard</h2>
            <p>Here is your current budget overview based on your income and expenses:</p>

            <div className="summary-grid">
                <article className="summary-card income-card">
                    <p className="summary-label">Total Income</p>
                    <h3>${totalIncome.toFixed(2)}</h3>
                </article>

                <article className="summary-card expense-card">
                    <p className="summary-label">Total Expenses</p>
                    <h3>${totalExpenses.toFixed(2)}</h3>
                </article>

                <article className="summary-card balance-card">
                    <p className="summary-label">Remaining Balance</p>
                    <h3>${remainingBalance.toFixed(2)}</h3>
                </article>
            </div>

            <section className="dashboard-subsection">
                <h3>Recent Expenses</h3>

                {recentExpenses.length === 0 ? (
                    <p>No expenses yet.</p>
                ) : (
                    <ul className="dashboard-list">
                        {recentExpenses.map((expense) => (
                            <li key={expense.id}>
                                <span>{expense.title}</span>
                                <span>
                                    ${Number(expense.amount).toFixed(2)} - {expense.category}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </section>
    );
}

export default DashboardPage;
