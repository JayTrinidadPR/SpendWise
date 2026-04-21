const client = require("./client");
const bcrypt = require("bcrypt");
const { createTables } = require("./schema");


async function seedDatabase() {
    try {
        await client.connect();
        console.log("Connected to the database.");

        await client.query("DROP TABLE IF EXISTS income_sources;");
        await client.query("DROP TABLE IF EXISTS expenses;");
        await client.query("DROP TABLE IF EXISTS users;");

        const alicePasswordHash = await bcrypt.hash("password123", 10);
        const bobPasswordHash = await bcrypt.hash("password123", 10);

        console.log("Dropped old tables.");

        await createTables();

        await client.query(
            `
            INSERT INTO users (username, email, password_hash)
            VALUES
            ($1, $2, $3),
            ($4, $5, $6);
        `, [
            "alice",
            "alice@example.com",
            alicePasswordHash,
            "bob",
            "bob@example.com",
            bobPasswordHash,
        ]
        );

        await client.query(`
            INSERT INTO expenses(user_id, title, amount, category)
        VALUES
            (1, 'Rent', 1200.00, 'Housing'),
            (1, 'Groceries', 84.50, 'Food'),
            (1, 'Gas', 45.00, 'Transportation');
        `);

        await client.query(`
            INSERT INTO income_sources(user_id, source_name, amount, frequency, pay_date_1, pay_date_2)
        VALUES
            (1, 'Full-time Job', 1500.00, 'biweekly', 15, 30),
            (1, 'Freelance Work', 300.00, 'monthly', 1, NULL);
        `);

        console.log("Database seeded with initial data.");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await client.end();
        console.log("Database connection closed.");
    }
}

seedDatabase();
