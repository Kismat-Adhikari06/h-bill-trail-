const { getDb } = require("../config/database");
const { ObjectId } = require("mongodb");

const COLLECTION = "saved_bills";

async function saveBill(userId, billId) {
  const db = getDb();

  const existing = await db.collection(COLLECTION).findOne({
    user_id: userId,
    bill_id: billId,
  });

  if (existing) {
    return { alreadySaved: true };
  }

  const result = await db.collection(COLLECTION).insertOne({
    user_id: userId,
    bill_id: billId,
    saved_at: new Date(),
  });

  return { id: result.insertedId.toString() };
}

async function getSavedBills(userId) {
  const db = getDb();

  const saved = await db
    .collection(COLLECTION)
    .find({ user_id: userId })
    .sort({ saved_at: -1 })
    .toArray();

  const billIds = saved.map((s) => {
    try {
      return new ObjectId(s.bill_id);
    } catch {
      return null;
    }
  }).filter(Boolean);

  if (billIds.length === 0) return [];

  const bills = await db
    .collection("bills")
    .find({ _id: { $in: billIds } })
    .toArray();

  const billMap = {};
  bills.forEach((b) => {
    billMap[b._id.toString()] = b;
  });

  return saved.map((s) => {
    const bill = billMap[s.bill_id];
    return {
      saved_id: s._id.toString(),
      saved_at: s.saved_at,
      bill: bill
        ? {
            id: bill._id.toString(),
            table_number: bill.table_number,
            customer_name: bill.customer_name,
            restaurant_name: bill.restaurant_name,
            status: bill.status,
            subtotal: bill.subtotal,
            vat_rate: bill.vat_rate,
            vat_amount: bill.vat_amount,
            total_amount: bill.total_amount,
            created_at: bill.created_at,
          }
        : null,
    };
  }).filter((s) => s.bill !== null);
}

async function unsaveBill(userId, billId) {
  const db = getDb();
  await db.collection(COLLECTION).deleteOne({
    user_id: userId,
    bill_id: billId,
  });
}

async function isBillSaved(userId, billId) {
  const db = getDb();
  const existing = await db.collection(COLLECTION).findOne({
    user_id: userId,
    bill_id: billId,
  });
  return !!existing;
}

module.exports = { saveBill, getSavedBills, unsaveBill, isBillSaved };
