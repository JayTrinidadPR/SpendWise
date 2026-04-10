const client = require("./client");
const { createTables } = require("./schema");

async function seedDatabase() {
    try {
        await client.connect();
        console.log("Connected to the database.");

        await client.query("DROP TABLE IF EXISTS income_sources;");
        await client.query("DROP TABLE IF EXISTS expenses;");
        await client.query("DROP TABLE IF EXISTS users;");
        

        console.log("Dropped old tables.");

        await createTables();

        await client.query(`
            INSERT INTO users (username, email)
            VALUES
            ('alice', 'alice@example.com'),
            ('bob', 'bob@example.com');
        `);

        await client.query(`
            INSERT INTO expenses (title, amount, category)
            VALUES
            ('Rent', 1200.00, 'Housing'),
            ('Groceries', 84.50, 'Food'),
            ('Gas', 45.00, 'Transportation');
        `);

        await client.query(`
            INSERT INTO income_sources (source_name, amount, frequency, pay_date_1, pay_date_2)
            VALUES
            ('Full-time Job', 1500.00, 'biweekly', 15, 30),
            ('Freelance Work', 300.00, 'monthly', 1, NULL);
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
