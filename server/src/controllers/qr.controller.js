const qrService = require("../services/qr.service");
const billModel = require("../models/bill.model");
const { sendSuccess } = require("../utils/response");
const ApiError = require("../utils/ApiError");

async function getBillQR(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Invalid bill ID");
    }

    const bill = await billModel.findById(id);

    if (!bill) {
      throw new ApiError(404, "Bill not found");
    }

    const qr = await qrService.generateQR(id);

    sendSuccess(
      res,
      {
        billId: bill.id,
        tableNumber: bill.table_number,
        qrUrl: qr.url,
        qrImage: qr.dataUrl,
      },
      "QR code generated successfully"
    );
  } catch (err) {
    next(err);
  }
}

module.exports = { getBillQR };
