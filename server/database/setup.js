const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const env = require("../src/config/env");

async function setup() {
  // Step 1: Connect to default 'postgres' database to create 'hbill'
  const admin = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: "postgres",
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  });

  try {
    // Create database if it doesn't exist
    const dbCheck = await admin.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [env.DB_NAME]
    );

    if (dbCheck.rows.length === 0) {
      await admin.query(`CREATE DATABASE ${env.DB_NAME}`);
      console.log(`Database "${env.DB_NAME}" created.`);
    } else {
      console.log(`Database "${env.DB_NAME}" already exists.`);
    }
  } catch (err) {
    console.error("Failed to create database:", err.message);
    process.exit(1);
  } finally {
    await admin.end();
  }

  // Step 2: Connect to 'hbill' and run schema
  const db = new Pool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  });

  try {
    const schema = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf-8"
    );
    await db.query(schema);
    console.log("Schema applied successfully.");
  } catch (err) {
    console.error("Failed to apply schema:", err.message);
  } finally {
    await db.end();
  }
}

setup();
