const express = require("express");
const { getDb } = require("../config/database");
const { sendSuccess } = require("../utils/response");
const billRoutes = require("./bill.routes");
const qrRoutes = require("./qr.routes");
const userRoutes = require("./user.routes");
const authRoutes = require("./auth.routes");
const savedBillRoutes = require("./savedBill.routes");

const router = express.Router();

router.get("/health", async (req, res, next) => {
  try {
    const db = getDb();
    const result = await db.command({ ping: 1 });
    sendSuccess(
      res,
      {
        status: "ok",
        database: db.databaseName,
        serverTime: new Date().toISOString(),
      },
      "Server and database are healthy"
    );
  } catch (err) {
    next(err);
  }
});

router.use("/bills", billRoutes);
router.use("/qr", qrRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/saved-bills", savedBillRoutes);

module.exports = router;
