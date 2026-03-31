const client = require("./client");

async function createTables() {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL
            );
        `);

        console.log("Tables created.");
    } catch (error) {
        console.error("Error creating tables:", error);
        throw error;
    }
}
module.exports = {
    createTables
};
