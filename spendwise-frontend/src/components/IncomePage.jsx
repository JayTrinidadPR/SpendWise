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
    loadIncomeSources,
    handleIncomeSourceSubmit,
    handleIncomeSourceDelete
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



                <button type="submit" className="button">
                    Add Income Source
                </button>
            </form>
            <button type="button" className="button" onClick={loadIncomeSources}>
                Load Income Sources
            </button>
            <ul className="income-sources-list">
                {incomeSources.map((source) => (
                    <li key={source.id}>
                        {source.source_name} - ${source.amount} ({source.frequency})
                        <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleIncomeSourceDelete(source.id)}
                        >
                            🗑️
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default IncomePage;