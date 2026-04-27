function IncomePage({
    sourceName,
    setSourceName,
    incomeAmount,
    setIncomeAmount,
    frequency,
    setFrequency,
    payDate1,
    setPayDate1,
    payDate2,
    setPayDate2,
    incomeSources,
    handleIncomeSourceSubmit,
    handleIncomeSourceDelete,
    editingIncomeSourceId,
    handleIncomeSourceEditStart,
    handleIncomeSourceEditCancel,
    isSavingIncome
}) {
    const totalIncomeAmount = incomeSources.reduce((sum, source) => sum + Number(source.amount), 0);
    const recurringCount = incomeSources.filter((source) => source.frequency !== "monthly").length;

    return (
        <section className="panel-section workspace-layout">
            <div className="workspace-hero workspace-hero-income">
                <div className="workspace-hero-copy">
                    <p className="workspace-kicker">Income Workspace</p>
                    <h2>Shape a steadier income picture.</h2>
                    <p>
                        Keep every pay source visible, map out timing, and make your budget feel
                        grounded before you spend against it.
                    </p>
                </div>

                <div className="workspace-stats">
                    <article className="workspace-stat-card">
                        <span>Income sources</span>
                        <strong>{incomeSources.length}</strong>
                    </article>
                    <article className="workspace-stat-card">
                        <span>Total tracked</span>
                        <strong>${totalIncomeAmount.toFixed(2)}</strong>
                    </article>
                    <article className="workspace-stat-card">
                        <span>Recurring streams</span>
                        <strong>{recurringCount}</strong>
                    </article>
                </div>
            </div>

            <div className="workspace-grid">
                <section className="workspace-form-card">
                    <div className="workspace-section-header">
                        <div>
                            <p className="workspace-kicker">Entry</p>
                            <h3>{editingIncomeSourceId ? "Edit income source" : "Add income source"}</h3>
                        </div>
                        {editingIncomeSourceId && <span className="workspace-badge">Editing</span>}
                    </div>

                    <form onSubmit={handleIncomeSourceSubmit}>
                        <label htmlFor="sourceNameInput">Source Name</label>
                        <input
                            id="sourceNameInput"
                            name="source_name"
                            type="text"
                            value={sourceName}
                            onChange={(event) => setSourceName(event.target.value)}
                            placeholder="Salary, freelance work, tutoring..."
                            required
                        />

                        <label htmlFor="incomeAmountInput">Amount</label>
                        <input
                            id="incomeAmountInput"
                            name="amount"
                            type="number"
                            step="0.01"
                            value={incomeAmount}
                            onChange={(event) => setIncomeAmount(event.target.value)}
                            placeholder="0.00"
                            required
                        />

                        <label htmlFor="frequencyInput">Frequency</label>
                        <select
                            id="frequencyInput"
                            name="frequency"
                            value={frequency}
                            onChange={(event) => setFrequency(event.target.value)}
                            required
                        >
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Biweekly</option>
                            <option value="monthly">Monthly</option>
                        </select>

                        <div className="workspace-inline-fields">
                            <div>
                                <label htmlFor="payDate1Input">Pay Date 1</label>
                                <input
                                    id="payDate1Input"
                                    name="pay_date_1"
                                    type="number"
                                    value={payDate1}
                                    onChange={(event) => setPayDate1(event.target.value)}
                                    placeholder="1"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="payDate2Input">Pay Date 2</label>
                                <input
                                    id="payDate2Input"
                                    name="pay_date_2"
                                    type="number"
                                    value={payDate2}
                                    onChange={(event) => setPayDate2(event.target.value)}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="workspace-form-actions">
                            <button type="submit" className="button" disabled={isSavingIncome}>
                                {isSavingIncome
                                    ? editingIncomeSourceId
                                        ? "Saving Changes..."
                                        : "Adding Income Source..."
                                    : editingIncomeSourceId
                                        ? "Save Changes"
                                        : "Add Income Source"}
                            </button>

                            {editingIncomeSourceId && (
                                <button
                                    type="button"
                                    className="button auth-switch-button"
                                    onClick={handleIncomeSourceEditCancel}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    {isSavingIncome && (
                        <p className="status">
                            {editingIncomeSourceId
                                ? "Saving your income source changes..."
                                : "Saving your income source..."}
                        </p>
                    )}
                </section>

                <section className="workspace-list-card">
                    <div className="workspace-section-header">
                        <div>
                            <p className="workspace-kicker">Streams</p>
                            <h3>Income schedule overview</h3>
                        </div>
                        <span className="workspace-count">{incomeSources.length} item(s)</span>
                    </div>

                    {incomeSources.length === 0 ? (
                        <p className="workspace-empty-state">
                            No income sources yet. Add one so the rest of the budget can anchor to
                            real cash flow.
                        </p>
                    ) : (
                        <ul className="income-sources-list workspace-record-list">
                            {incomeSources.map((source) => (
                                <li key={source.id}>
                                    <div className="workspace-record-copy">
                                        <strong>{source.source_name}</strong>
                                        <span>
                                            {source.frequency} · Pay date {source.pay_date_1}
                                            {source.pay_date_2 ? ` & ${source.pay_date_2}` : ""}
                                        </span>
                                    </div>

                                    <div className="workspace-record-side">
                                        <span className="workspace-record-amount">
                                            ${Number(source.amount).toFixed(2)}
                                        </span>
                                        <div className="record-actions">
                                            <button
                                                type="button"
                                                className="button auth-switch-button"
                                                onClick={() => handleIncomeSourceEditStart(source)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() => handleIncomeSourceDelete(source.id)}
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

export default IncomePage;
