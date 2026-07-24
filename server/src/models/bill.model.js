const { getDb } = require("../config/database");
const { ObjectId } = require("mongodb");

const COLLECTION = "bills";

async function findAll() {
  const db = getDb();
  const bills = await db
    .collection(COLLECTION)
    .find({})
    .sort({ created_at: -1 })
    .toArray();

  return bills.map((bill) => ({
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
    updated_at: bill.updated_at,
  }));
}

async function findById(id) {
  const db = getDb();

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const bill = await db.collection(COLLECTION).findOne({ _id: objectId });

  if (!bill) return null;

  return {
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
    updated_at: bill.updated_at,
    items: (bill.items || []).map((item) => ({
      id: item.id ? item.id.toString() : undefined,
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      created_at: item.created_at,
    })),
  };
}

module.exports = { findAll, findById };
