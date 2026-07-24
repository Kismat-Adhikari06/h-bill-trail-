const express = require("express");
const { getBillQR } = require("../controllers/qr.controller");

const router = express.Router();

router.get("/:id", getBillQR);

module.exports = router;
