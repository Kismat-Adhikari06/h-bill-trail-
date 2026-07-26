const express = require("express");
const { getAllBills, getBillById, createBill, updateBill } = require("../controllers/bill.controller");

const router = express.Router();

router.get("/", getAllBills);
router.get("/:id", getBillById);
router.post("/", createBill);
router.put("/:id", updateBill);

module.exports = router;
