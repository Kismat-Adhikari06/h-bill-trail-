const { MongoClient } = require("mongodb");
const env = require("./env");

let client;
let db;

async function connect() {
  if (db) return db;

  const uri = env.MONGODB_URI || "";
  const masked = uri.replace(/:([^@]+)@/, ":****@");
  console.log("MONGODB_URI set:", !!env.MONGODB_URI, "| starts with:", masked.substring(0, 40));

  client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  db = client.db(env.MONGODB_DB);

  console.log(`MongoDB connected to database: ${env.MONGODB_DB}`);
  return db;
}

function getDb() {
  if (!db) throw new Error("Database not connected. Call connect() first.");
  return db;
}

async function testConnection() {
  try {
    const database = await connect();
    await database.command({ ping: 1 });
    console.log("Database ping successful");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}

async function close() {
  if (client) {
    await client.close();
    db = null;
    client = null;
  }
}

module.exports = { connect, getDb, testConnection, close };
