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
    total_amount: bill.total_amount,
    created_at: bill.created_at,
    updated_at: bill.updated_at,
    items: (bill.items || []).map((item) => ({
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    })),
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

async function create(billData) {
  const db = getDb();

  const items = billData.items.map((item) => ({
    item_name: item.item_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price,
    created_at: new Date(),
  }));

  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);

  const now = new Date();
  const result = await db.collection(COLLECTION).insertOne({
    table_number: billData.table_number,
    customer_name: billData.customer_name,
    restaurant_name: billData.restaurant_name || "Spice Garden",
    status: billData.status || "open",
    subtotal,
    total_amount: subtotal,
    items,
    created_at: now,
    updated_at: now,
  });

  return {
    id: result.insertedId.toString(),
    table_number: billData.table_number,
    customer_name: billData.customer_name,
    restaurant_name: billData.restaurant_name || "Spice Garden",
    status: billData.status || "open",
    subtotal,
    total_amount: subtotal,
    items: items.map((item) => ({
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    })),
    created_at: now,
    updated_at: now,
  };
}

async function update(id, billData) {
  const db = getDb();

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const existing = await db.collection(COLLECTION).findOne({ _id: objectId });
  if (!existing) return null;

  if (existing.status !== "open") {
    return { locked: true, status: existing.status };
  }

  const items = billData.items.map((item) => ({
    item_name: item.item_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price,
    created_at: item.created_at || new Date(),
  }));

  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);

  const now = new Date();
  await db.collection(COLLECTION).updateOne(
    { _id: objectId },
    {
      $set: {
        table_number: billData.table_number,
        customer_name: billData.customer_name,
        restaurant_name: billData.restaurant_name || existing.restaurant_name,
        status: billData.status || existing.status,
        subtotal,
        total_amount: subtotal,
        items,
        updated_at: now,
      },
    }
  );

  return {
    id: objectId.toString(),
    table_number: billData.table_number,
    customer_name: billData.customer_name,
    restaurant_name: billData.restaurant_name || existing.restaurant_name,
    status: billData.status || existing.status,
    subtotal,
    total_amount: subtotal,
    items: items.map((item) => ({
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    })),
    created_at: existing.created_at,
    updated_at: now,
  };
}

module.exports = { findAll, findById, create, update };
