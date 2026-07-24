const express = require("express");
const { pool } = require("../config/database");
const { sendSuccess } = require("../utils/response");
const billRoutes = require("./bill.routes");
const qrRoutes = require("./qr.routes");

const router = express.Router();

// Health check
router.get("/health", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT NOW() as time, current_database() as database");
    sendSuccess(res, {
      status: "ok",
      database: result.rows[0].database,
      serverTime: result.rows[0].time,
    }, "Server and database are healthy");
  } catch (err) {
    next(err);
  }
});

// Bills
router.use("/bills", billRoutes);

// QR codes
router.use("/qr", qrRoutes);

module.exports = router;
