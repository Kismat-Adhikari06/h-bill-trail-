const { connect, getDb, close } = require("../src/config/database");

async function verify() {
  try {
    await connect();
    const db = getDb();

    console.log("--- BILLS ---\n");

    const bills = await db
      .collection("bills")
      .find({})
      .sort({ _id: 1 })
      .toArray();

    for (const bill of bills) {
      console.log(
        `Bill ${bill._id} | Table: ${bill.table_number} | Customer: ${bill.customer_name} | Status: ${bill.status} | Total: ₹${bill.total_amount}`
      );

      for (const item of bill.items || []) {
        console.log(
          `   └─ ${item.quantity}x ${item.item_name} @ ₹${item.unit_price} = ₹${item.total_price}`
        );
      }

      console.log("");
    }

    console.log("--- SUMMARY ---\n");
    console.log(`Total bills: ${bills.length}`);
    const grandTotal = bills.reduce((sum, b) => sum + b.total_amount, 0);
    console.log(`Grand total: ₹${grandTotal}`);
  } catch (err) {
    console.error("Verification failed:", err.message);
  } finally {
    await close();
  }
}

verify();
