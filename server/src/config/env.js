const dotenv = require("dotenv");

dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
  MONGODB_DB: process.env.MONGODB_DB || "hbill",
};

module.exports = env;
