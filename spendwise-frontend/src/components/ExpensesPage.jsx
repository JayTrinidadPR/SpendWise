function ExpensesPage({
    title,
    setTitle,
    amount,
    setAmount,
    category,
    setCategory,
    expenses,
    loadExpenses,
    handleExpenseSubmit,
    handleExpenseDelete
}) {
    return (
        <section className="panel-section">
            <h2>Expenses</h2>

            <form onSubmit={handleExpenseSubmit}>
                <label htmlFor="titleInput">Title</label>
                <input
                    id="titleInput"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    required />

                <label htmlFor="categoryInput">Category</label>
                <input
                    id="categoryInput"
                    name="category"
                    type="text"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    required
                />

                <button type="submit" className="button">
                    Add Expense
                </button>
            </form>

            <button type="button" className="button" onClick={loadExpenses}>
                Load Expenses
            </button>

            <ul className="expenses-list">
                {expenses.map((expense) => (
                    <li key={expense.id}>
                        {expense.title} - ${expense.amount} ({expense.category})
                        <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleExpenseDelete(expense.id)}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default ExpensesPage;
