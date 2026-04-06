const client = require("./client");
const { createTables } = require("./schema");

async function seedDatabase() {
    try {
        await client.connect();
        console.log("Connected to the database.");

       
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

        console.log("Database seeded with initial data.");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await client.end();
        console.log("Database connection closed.");
    }
}

seedDatabase();