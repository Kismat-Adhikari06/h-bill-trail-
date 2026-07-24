const savedBillModel = require("../models/savedBill.model");
const { sendSuccess } = require("../utils/response");
const ApiError = require("../utils/ApiError");

async function saveBill(req, res, next) {
  try {
    const { user_id, bill_id } = req.body;

    if (!user_id || !bill_id) {
      throw new ApiError(400, "user_id and bill_id are required");
    }

    const result = await savedBillModel.saveBill(user_id, bill_id);

    if (result.alreadySaved) {
      return sendSuccess(res, null, "Bill already saved");
    }

    sendSuccess(res, { id: result.id }, "Bill saved successfully", 201);
  } catch (err) {
    next(err);
  }
}

async function getSavedBills(req, res, next) {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const bills = await savedBillModel.getSavedBills(userId);
    sendSuccess(res, bills, "Saved bills retrieved successfully");
  } catch (err) {
    next(err);
  }
}

async function unsaveBill(req, res, next) {
  try {
    const { user_id, bill_id } = req.body;

    if (!user_id || !bill_id) {
      throw new ApiError(400, "user_id and bill_id are required");
    }

    await savedBillModel.unsaveBill(user_id, bill_id);
    sendSuccess(res, null, "Bill removed from saved");
  } catch (err) {
    next(err);
  }
}

async function checkSaved(req, res, next) {
  try {
    const { userId, billId } = req.params;

    if (!userId || !billId) {
      throw new ApiError(400, "User ID and Bill ID are required");
    }

    const saved = await savedBillModel.isBillSaved(userId, billId);
    sendSuccess(res, { saved }, "Check complete");
  } catch (err) {
    next(err);
  }
}

module.exports = { saveBill, getSavedBills, unsaveBill, checkSaved };
