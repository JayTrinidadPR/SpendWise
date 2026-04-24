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
    return (
        <section className="panel-section">
            <h2>Income</h2>

            <form onSubmit={handleIncomeSourceSubmit}>
                <label htmlFor="sourceNameInput">Source Name</label>
                <input
                    id="sourceNameInput"
                    name="source_name"
                    type="text"
                    value={sourceName}
                    onChange={(event) => setSourceName(event.target.value)}
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

                <label htmlFor="payDate1Input">Pay Date 1</label>
                <input
                    id="payDate1Input"
                    name="pay_date_1"
                    type="number"
                    value={payDate1}
                    onChange={(event) => setPayDate1(event.target.value)}
                    required
                />

                <label htmlFor="payDate2Input">Pay Date 2</label>
                <input
                    id="payDate2Input"
                    name="pay_date_2"
                    type="number"
                    value={payDate2}
                    onChange={(event) => setPayDate2(event.target.value)}
                />
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
            </form>

            {isSavingIncome && (
                <p className="status">
                    {editingIncomeSourceId
                        ? "Saving your income source changes..."
                        : "Saving your income source..."}
                </p>
            )}

            <ul className="income-sources-list">
                {incomeSources.map((source) => (
                    <li key={source.id}>
                        <span>
                            {source.source_name} - ${source.amount} ({source.frequency})
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
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default IncomePage;
