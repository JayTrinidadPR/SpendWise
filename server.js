require("dotenv").config();// Load environment variables from .env file
const express = require("express");// Import the Express framework
const client = require("./db/client"); // Import the database client
const path = require("path");// Import the path module for handling file paths



const app = express();// Create an Express application
const PORT = process.env.PORT || 3000;


app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" directory


app.get("/users", async (req, res) => { // sends a message when the /users route is accessed
    try {
        const result = await client.query("SELECT * FROM users;"); // Query the database to get all users
        res.json(result.rows); // Send the retrieved users as a JSON response
    }
    catch (error) { // Handle any errors that occur during the database query
        console.error("Error fetching users:", error); // Log the error to the console for debugging
        res.status(500).json({ error: "Server Error" }); // Send a 500 Internal Server Error response with a JSON error message
    }
});

async function startServer() { // Connect to the database before starting the server
    try {
        await client.connect(); // Connect to the database
        console.log("Connected to the database."); //   Log a message indicating successful database connection

        app.listen(PORT, () => { // Start the server and listen on the specified port
            console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating that the server 
            // is running and provide the URL to access it
        });
    } catch (error) {
        console.error("Error connecting to the database:", error); // Log any errors that occur during the database connection attempt
    }
}

startServer(); // Start the server and connect to the database 