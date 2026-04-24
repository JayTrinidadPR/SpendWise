const client = require("./client");

const DEMO_EMAIL = "demo@spendwise.app";

const demoExpenses = [
    { title: "Rent", amount: 1200.0, category: "Housing" },
    { title: "Groceries", amount: 220.0, category: "Food" },
    { title: "Utilities", amount: 160.0, category: "Bills" },
    { title: "Gas", amount: 120.0, category: "Transportation" },
    { title: "Gym Membership", amount: 85.0, category: "Health" },
    { title: "Streaming + Entertainment", amount: 95.0, category: "Lifestyle" },
    { title: "Weekend Fund", amount: 120.0, category: "Lifestyle" },
];

const demoIncomeSources = [
    {
        source_name: "Primary Salary",
        amount: 3000.0,
        frequency: "monthly",
        pay_date_1: 1,
        pay_date_2: null,
    },
    {
        source_name: "Freelance Design",
        amount: 450.0,
        frequency: "monthly",
        pay_date_1: 12,
        pay_date_2: null,
    },
    {
        source_name: "Tutoring",
        amount: 200.0,
        frequency: "monthly",
        pay_date_1: 20,
        pay_date_2: null,
    },
];

async function seedDemoData() {
    try {
        await client.connect();
        console.log("Connected to the database.");

        const userResult = await client.query(
            `
            SELECT id, username, email
            FROM users
            WHERE email = $1 OR username = 'demo'
            ORDER BY id
            LIMIT 1;
            `,
            [DEMO_EMAIL]
        );

        if (!userResult.rows.length) {
            throw new Error(
                `Demo user not found. Create ${DEMO_EMAIL} first or run the full database seed.`
            );
        }

        const demoUser = userResult.rows[0];

        await client.query("BEGIN");

        await client.query("DELETE FROM income_sources WHERE user_id = $1;", [demoUser.id]);
        await client.query("DELETE FROM expenses WHERE user_id = $1;", [demoUser.id]);

        for (const expense of demoExpenses) {
            await client.query(
                `
                INSERT INTO expenses (user_id, title, amount, category)
                VALUES ($1, $2, $3, $4);
                `,
                [demoUser.id, expense.title, expense.amount, expense.category]
            );
        }

        for (const source of demoIncomeSources) {
            await client.query(
                `
                INSERT INTO income_sources (
                    user_id,
                    source_name,
                    amount,
                    frequency,
                    pay_date_1,
                    pay_date_2
                )
                VALUES ($1, $2, $3, $4, $5, $6);
                `,
                [
                    demoUser.id,
                    source.source_name,
                    source.amount,
                    source.frequency,
                    source.pay_date_1,
                    source.pay_date_2,
                ]
            );
        }

        await client.query("COMMIT");

        console.log(`Demo data refreshed for ${demoUser.email}.`);
        console.log("Income total: $3,650.00");
        console.log("Expense total: $2,000.00");
        console.log("Remaining balance: $1,650.00");
    } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        console.error("Error seeding demo data:", error);
    } finally {
        await client.end();
        console.log("Database connection closed.");
    }
}

seedDemoData();
