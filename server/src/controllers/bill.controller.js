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
    const { id } = req.params;

    if (!id) {
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

async function createBill(req, res, next) {
  try {
    const { table_number, customer_name, restaurant_name, status, items } = req.body;

    if (!table_number || !customer_name || !items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "table_number, customer_name, and items are required");
    }

    for (const item of items) {
      if (!item.item_name || !item.quantity || !item.unit_price) {
        throw new ApiError(400, "Each item must have item_name, quantity, and unit_price");
      }
    }

    const bill = await billModel.create({
      table_number,
      customer_name,
      restaurant_name,
      status,
      items,
    });

    sendSuccess(res, bill, "Bill created successfully");
  } catch (err) {
    next(err);
  }
}

async function updateBill(req, res, next) {
  try {
    const { id } = req.params;
    const { table_number, customer_name, restaurant_name, status, items } = req.body;

    if (!id) {
      throw new ApiError(400, "Invalid bill ID");
    }

    if (!table_number || !customer_name || !items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "table_number, customer_name, and items are required");
    }

    for (const item of items) {
      if (!item.item_name || !item.quantity || !item.unit_price) {
        throw new ApiError(400, "Each item must have item_name, quantity, and unit_price");
      }
    }

    const result = await billModel.update(id, {
      table_number,
      customer_name,
      restaurant_name,
      status,
      items,
    });

    if (!result) {
      throw new ApiError(404, "Bill not found");
    }

    if (result.locked) {
      throw new ApiError(403, `Cannot edit bill — status is "${result.locked ? result.status : ""}". Only open bills can be edited.`);
    }

    sendSuccess(res, result, "Bill updated successfully");
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllBills, getBillById, createBill, updateBill };
