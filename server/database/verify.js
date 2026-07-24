const { pool } = require("../src/config/database");

async function verify() {
  try {
    console.log("--- BILLS ---\n");

    const billsResult = await pool.query(
      "SELECT id, table_number, customer_name, status, total_amount, created_at FROM bills ORDER BY id"
    );

    for (const bill of billsResult.rows) {
      console.log(`Bill #${bill.id} | Table: ${bill.table_number} | Customer: ${bill.customer_name} | Status: ${bill.status} | Total: ₹${bill.total_amount}`);

      const itemsResult = await pool.query(
        "SELECT item_name, quantity, unit_price, total_price FROM bill_items WHERE bill_id = $1 ORDER BY id",
        [bill.id]
      );

      for (const item of itemsResult.rows) {
        console.log(`   └─ ${item.quantity}x ${item.item_name} @ ₹${item.unit_price} = ₹${item.total_price}`);
      }

      console.log("");
    }

    console.log("--- SUMMARY ---\n");

    const summary = await pool.query(`
      SELECT
        COUNT(*) AS total_bills,
        SUM(total_amount) AS grand_total
      FROM bills
    `);

    console.log(`Total bills: ${summary.rows[0].total_bills}`);
    console.log(`Grand total: ₹${summary.rows[0].grand_total}`);
  } catch (err) {
    console.error("Verification failed:", err.message);
  } finally {
    await pool.end();
  }
}

verify();
