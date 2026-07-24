const { connect, getDb, close } = require("../src/config/database");

const users = [
  {
    name: "Admin",
    email: "admin@hbill.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "User",
    email: "user@hbill.com",
    password: "user123",
    role: "user",
  },
];

const bills = [
  {
    table_number: "T1",
    customer_name: "Rahul Sharma",
    restaurant_name: "Spice Garden",
    status: "closed",
    vat_rate: 5.0,
    items: [
      { item_name: "Butter Chicken", quantity: 2, unit_price: 350.0 },
      { item_name: "Garlic Naan", quantity: 4, unit_price: 60.0 },
      { item_name: "Jeera Rice", quantity: 2, unit_price: 150.0 },
      { item_name: "Mango Lassi", quantity: 2, unit_price: 80.0 },
    ],
  },
  {
    table_number: "T3",
    customer_name: "Priya Patel",
    restaurant_name: "Spice Garden",
    status: "open",
    vat_rate: 5.0,
    items: [
      { item_name: "Paneer Tikka", quantity: 1, unit_price: 280.0 },
      { item_name: "Tandoori Roti", quantity: 3, unit_price: 40.0 },
      { item_name: "Dal Makhani", quantity: 1, unit_price: 220.0 },
      { item_name: "Green Salad", quantity: 1, unit_price: 90.0 },
      { item_name: "Masala Chai", quantity: 2, unit_price: 40.0 },
    ],
  },
  {
    table_number: "T5",
    customer_name: "Amit Kumar",
    restaurant_name: "Spice Garden",
    status: "paid",
    vat_rate: 5.0,
    items: [
      { item_name: "Veg Biryani", quantity: 1, unit_price: 250.0 },
      { item_name: "Raita", quantity: 1, unit_price: 60.0 },
      { item_name: "Spring Rolls", quantity: 2, unit_price: 180.0 },
    ],
  },
];

async function seed() {
  try {
    await connect();
    const db = getDb();

    await db.collection("bills").deleteMany({});
    await db.collection("users").deleteMany({});
    console.log("Cleared existing data.");

    const now = new Date();
    for (const user of users) {
      const result = await db.collection("users").insertOne({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        created_at: now,
        updated_at: now,
      });
      console.log(`User ${result.insertedId} (${user.name}) — ${user.role}`);
    }
    console.log(`Seeded ${users.length} users.`);

    for (const bill of bills) {
      const subtotal = bill.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      const vatAmount = parseFloat(((subtotal * bill.vat_rate) / 100).toFixed(2));
      const total = subtotal + vatAmount;

      const now = new Date();
      const items = bill.items.map((item) => ({
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
        created_at: now,
      }));

      const result = await db.collection("bills").insertOne({
        table_number: bill.table_number,
        customer_name: bill.customer_name,
        restaurant_name: bill.restaurant_name,
        status: bill.status,
        subtotal,
        vat_rate: bill.vat_rate,
        vat_amount: vatAmount,
        total_amount: total,
        items,
        created_at: now,
        updated_at: now,
      });

      console.log(`Bill ${result.insertedId} (${bill.table_number}) — ₹${total}`);
    }

    console.log(`\nSeeded ${bills.length} bills successfully.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    throw err;
  } finally {
    await close();
  }
}

seed();
