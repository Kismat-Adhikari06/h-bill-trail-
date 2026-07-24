const { pool } = require("../config/database");

async function findAll() {
  const result = await pool.query(
    "SELECT id, table_number, customer_name, restaurant_name, status, subtotal, vat_rate, vat_amount, total_amount, created_at, updated_at FROM bills ORDER BY created_at DESC"
  );
  return result.rows;
}

async function findById(id) {
  const billResult = await pool.query(
    "SELECT id, table_number, customer_name, restaurant_name, status, subtotal, vat_rate, vat_amount, total_amount, created_at, updated_at FROM bills WHERE id = $1",
    [id]
  );

  if (billResult.rows.length === 0) {
    return null;
  }

  const itemsResult = await pool.query(
    "SELECT id, item_name, quantity, unit_price, total_price, created_at FROM bill_items WHERE bill_id = $1 ORDER BY id",
    [id]
  );

  return {
    ...billResult.rows[0],
    items: itemsResult.rows,
  };
}

module.exports = { findAll, findById };
