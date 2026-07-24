const express = require("express");
const savedBillController = require("../controllers/savedBill.controller");

const router = express.Router();

router.post("/", savedBillController.saveBill);
router.get("/:userId", savedBillController.getSavedBills);
router.get("/check/:userId/:billId", savedBillController.checkSaved);
router.delete("/", savedBillController.unsaveBill);

module.exports = router;
