const { pool } = require("../src/config/database");

const bills = [
  {
    table_number: "T1",
    customer_name: "Rahul Sharma",
    restaurant_name: "Spice Garden",
    status: "closed",
    vat_rate: 5.00,
    items: [
      { item_name: "Butter Chicken", quantity: 2, unit_price: 350.00 },
      { item_name: "Garlic Naan", quantity: 4, unit_price: 60.00 },
      { item_name: "Jeera Rice", quantity: 2, unit_price: 150.00 },
      { item_name: "Mango Lassi", quantity: 2, unit_price: 80.00 },
    ],
  },
  {
    table_number: "T3",
    customer_name: "Priya Patel",
    restaurant_name: "Spice Garden",
    status: "open",
    vat_rate: 5.00,
    items: [
      { item_name: "Paneer Tikka", quantity: 1, unit_price: 280.00 },
      { item_name: "Tandoori Roti", quantity: 3, unit_price: 40.00 },
      { item_name: "Dal Makhani", quantity: 1, unit_price: 220.00 },
      { item_name: "Green Salad", quantity: 1, unit_price: 90.00 },
      { item_name: "Masala Chai", quantity: 2, unit_price: 40.00 },
    ],
  },
  {
    table_number: "T5",
    customer_name: "Amit Kumar",
    restaurant_name: "Spice Garden",
    status: "paid",
    vat_rate: 5.00,
    items: [
      { item_name: "Veg Biryani", quantity: 1, unit_price: 250.00 },
      { item_name: "Raita", quantity: 1, unit_price: 60.00 },
      { item_name: "Spring Rolls", quantity: 2, unit_price: 180.00 },
    ],
  },
];

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const bill of bills) {
      const subtotal = bill.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      const vatAmount = parseFloat(((subtotal * bill.vat_rate) / 100).toFixed(2));
      const total = subtotal + vatAmount;

      const billResult = await client.query(
        `INSERT INTO bills (table_number, customer_name, restaurant_name, status, subtotal, vat_rate, vat_amount, total_amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [bill.table_number, bill.customer_name, bill.restaurant_name, bill.status, subtotal, bill.vat_rate, vatAmount, total]
      );

      const billId = billResult.rows[0].id;

      for (const item of bill.items) {
        await client.query(
          `INSERT INTO bill_items (bill_id, item_name, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [billId, item.item_name, item.quantity, item.unit_price]
        );
      }

      console.log(`Bill #${billId} (${bill.table_number}) — ₹${total}`);
    }

    await client.query("COMMIT");
    console.log(`\nSeeded ${bills.length} bills successfully.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
