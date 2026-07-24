const QRCode = require("qrcode");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

async function generateQR(billId) {
  const url = `${FRONTEND_URL}/bill/${billId}`;
  const dataUrl = await QRCode.toDataURL(url, { width: 300 });
  return { url, dataUrl };
}

module.exports = { generateQR };
