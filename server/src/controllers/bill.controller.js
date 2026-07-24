const billModel = require("../models/bill.model");
const { sendSuccess } = require("../utils/response");
const ApiError = require("../utils/ApiError");

async function getAllBills(req, res, next) {
  try {
    const bills = await billModel.findAll();
    sendSuccess(res, bills, "Bills retrieved successfully");
  } catch (err) {
    next(err);
  }
}

async function getBillById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      throw new ApiError(400, "Invalid bill ID");
    }

    const bill = await billModel.findById(id);

    if (!bill) {
      throw new ApiError(404, "Bill not found");
    }

    sendSuccess(res, bill, "Bill retrieved successfully");
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllBills, getBillById };
