function ExpensesPage({
    title,
    setTitle,
    amount,
    setAmount,
    category,
    setCategory,
    expenses,
    handleExpenseSubmit,
    handleExpenseDelete,
    editingExpenseId,
    handleExpenseEditStart,
    handleExpenseEditCancel,
    isSavingExpenses
}) {
    const totalExpenseAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const topCategoryEntry = Object.entries(
        expenses.reduce((totals, expense) => {
            const categoryName = expense.category?.trim() || "Uncategorized";
            totals[categoryName] = (totals[categoryName] || 0) + Number(expense.amount);
            return totals;
        }, {})
    ).sort((a, b) => b[1] - a[1])[0] || null;

    return (
        <section className="panel-section workspace-layout">
            <div className="workspace-hero workspace-hero-expenses">
                <div className="workspace-hero-copy">
                    <p className="workspace-kicker">Spending Workspace</p>
                    <h2>Track expenses with more context.</h2>
                    <p>
                        Capture purchases, keep categories clean, and see where your money pressure
                        is building before it gets noisy.
                    </p>
                </div>

                <div className="workspace-stats">
                    <article className="workspace-stat-card">
                        <span>Logged expenses</span>
                        <strong>{expenses.length}</strong>
                    </article>
                    <article className="workspace-stat-card">
                        <span>Total tracked</span>
                        <strong>${totalExpenseAmount.toFixed(2)}</strong>
                    </article>
                    <article className="workspace-stat-card">
                        <span>Top category</span>
                        <strong>{topCategoryEntry ? topCategoryEntry[0] : "None yet"}</strong>
                    </article>
                </div>
            </div>

            <div className="workspace-grid">
                <section className="workspace-form-card">
                    <div className="workspace-section-header">
                        <div>
                            <p className="workspace-kicker">Entry</p>
                            <h3>{editingExpenseId ? "Edit expense" : "Add a new expense"}</h3>
                        </div>
                        {editingExpenseId && <span className="workspace-badge">Editing</span>}
                    </div>

                    <form onSubmit={handleExpenseSubmit}>
                        <label htmlFor="titleInput">Title</label>
                        <input
                            id="titleInput"
                            name="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Groceries, rent, coffee..."
                            required
                        />

                        <label htmlFor="amountInput">Amount</label>
                        <input
                            id="amountInput"
                            name="amount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                        />

                        <label htmlFor="categoryInput">Category</label>
                        <input
                            id="categoryInput"
                            name="category"
                            type="text"
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            placeholder="Food, Housing, Transportation..."
                            required
                        />

                        <div className="workspace-form-actions">
                            <button type="submit" className="button" disabled={isSavingExpenses}>
                                {isSavingExpenses
                                    ? editingExpenseId
                                        ? "Saving Changes..."
                                        : "Adding Expense..."
                                    : editingExpenseId
                                        ? "Save Changes"
                                        : "Add Expense"}
                            </button>

                            {editingExpenseId && (
                                <button
                                    type="button"
                                    className="button auth-switch-button"
                                    onClick={handleExpenseEditCancel}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    {isSavingExpenses && (
                        <p className="status">
                            {editingExpenseId
                                ? "Saving your expense changes..."
                                : "Saving your expense..."}
                        </p>
                    )}
                </section>

                <section className="workspace-list-card">
                    <div className="workspace-section-header">
                        <div>
                            <p className="workspace-kicker">Ledger</p>
                            <h3>Recent expense entries</h3>
                        </div>
                        <span className="workspace-count">{expenses.length} item(s)</span>
                    </div>

                    {expenses.length === 0 ? (
                        <p className="workspace-empty-state">
                            No expenses yet. Add your first entry to start building your spending
                            picture.
                        </p>
                    ) : (
                        <ul className="expenses-list workspace-record-list">
                            {expenses.map((expense) => (
                                <li key={expense.id}>
                                    <div className="workspace-record-copy">
                                        <strong>{expense.title}</strong>
                                        <span>{expense.category}</span>
                                    </div>

                                    <div className="workspace-record-side">
                                        <span className="workspace-record-amount">
                                            ${Number(expense.amount).toFixed(2)}
                                        </span>
                                        <div className="record-actions">
                                            <button
                                                type="button"
                                                className="button auth-switch-button"
                                                onClick={() => handleExpenseEditStart(expense)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() => handleExpenseDelete(expense.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </section>
    );
}

export default ExpensesPage;
