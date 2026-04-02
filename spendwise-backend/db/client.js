require("dotenv").config();
const { Client } = require("pg");

const isRemoteDatabase =
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("localhost") &&
  !process.env.DATABASE_URL.includes("127.0.0.1");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isRemoteDatabase ? { rejectUnauthorized: false } : false,
});

module.exports = client;
