const express = require("express");
const { getAllBills, getBillById } = require("../controllers/bill.controller");

const router = express.Router();

router.get("/", getAllBills);
router.get("/:id", getBillById);

module.exports = router;
