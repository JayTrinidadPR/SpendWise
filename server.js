require("dotenv").config();
const express = require("express");

const app = express();// Create an Express application
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => { // sends a message when the root route is accessed
    res.send("Hello, World!");
    });

app.listen(PORT, () => { // Start the server and listen on the specified port
    console.log(`Server is running on http://localhost:${PORT}`);
    });