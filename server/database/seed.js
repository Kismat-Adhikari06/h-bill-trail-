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
  {
    name: "Manager",
    email: "manager@hbill.com",
    password: "manager123",
    role: "admin",
  },
  {
    name: "Staff",
    email: "staff@hbill.com",
    password: "staff123",
    role: "user",
  },
  {
    name: "Riya Singh",
    email: "riya@hbill.com",
    password: "riya123",
    role: "user",
  },
];

const bills = [
  {
    table_number: "T1",
    customer_name: "Rahul Sharma",
    restaurant_name: "Spice Garden",
    status: "closed",
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
    items: [
      { item_name: "Veg Biryani", quantity: 1, unit_price: 250.0 },
      { item_name: "Raita", quantity: 1, unit_price: 60.0 },
      { item_name: "Spring Rolls", quantity: 2, unit_price: 180.0 },
    ],
  },
  {
    table_number: "T2",
    customer_name: "Neha Gupta",
    restaurant_name: "Spice Garden",
    status: "open",
    items: [
      { item_name: "Chicken Biryani", quantity: 2, unit_price: 300.0 },
      { item_name: "Raita", quantity: 2, unit_price: 60.0 },
      { item_name: "Cold Coffee", quantity: 2, unit_price: 120.0 },
      { item_name: "French Fries", quantity: 1, unit_price: 150.0 },
      { item_name: "Cheese Burger", quantity: 1, unit_price: 200.0 },
    ],
  },
  {
    table_number: "T4",
    customer_name: "Vikram Reddy",
    restaurant_name: "Spice Garden",
    status: "closed",
    items: [
      { item_name: "Tandoori Chicken", quantity: 1, unit_price: 400.0 },
      { item_name: "Butter Naan", quantity: 3, unit_price: 70.0 },
      { item_name: "Palak Paneer", quantity: 1, unit_price: 250.0 },
      { item_name: "Lassi", quantity: 2, unit_price: 90.0 },
    ],
  },
  {
    table_number: "T6",
    customer_name: "Ananya Desai",
    restaurant_name: "Spice Garden",
    status: "paid",
    items: [
      { item_name: "Samosa", quantity: 4, unit_price: 40.0 },
      { item_name: "Chole Bhature", quantity: 2, unit_price: 120.0 },
      { item_name: "Gulab Jamun", quantity: 4, unit_price: 50.0 },
      { item_name: "Masala Chai", quantity: 4, unit_price: 40.0 },
    ],
  },
  {
    table_number: "T7",
    customer_name: "Arjun Mehta",
    restaurant_name: "Spice Garden",
    status: "open",
    items: [
      { item_name: "Fish Curry", quantity: 1, unit_price: 380.0 },
      { item_name: "Steamed Rice", quantity: 2, unit_price: 100.0 },
      { item_name: "Papad", quantity: 2, unit_price: 30.0 },
      { item_name: "Mango Shake", quantity: 1, unit_price: 100.0 },
    ],
  },
  {
    table_number: "T8",
    customer_name: "Kavitha Nair",
    restaurant_name: "Spice Garden",
    status: "closed",
    items: [
      { item_name: "Idli Sambhar", quantity: 4, unit_price: 80.0 },
      { item_name: "Dosa", quantity: 2, unit_price: 100.0 },
      { item_name: "Vada", quantity: 2, unit_price: 60.0 },
      { item_name: "Filter Coffee", quantity: 4, unit_price: 50.0 },
    ],
  },
  {
    table_number: "T9",
    customer_name: "Suresh Iyer",
    restaurant_name: "Spice Garden",
    status: "paid",
    items: [
      { item_name: "Mutton Rogan Josh", quantity: 1, unit_price: 450.0 },
      { item_name: "Garlic Naan", quantity: 4, unit_price: 60.0 },
      { item_name: "Jeera Rice", quantity: 2, unit_price: 150.0 },
      { item_name: "Raita", quantity: 1, unit_price: 60.0 },
      { item_name: "Gulab Jamun", quantity: 2, unit_price: 50.0 },
    ],
  },
  {
    table_number: "T10",
    customer_name: "Deepa Joshi",
    restaurant_name: "Spice Garden",
    status: "open",
    items: [
      { item_name: "Paneer Butter Masala", quantity: 2, unit_price: 300.0 },
      { item_name: "Roomali Roti", quantity: 4, unit_price: 50.0 },
      { item_name: "Aloo Gobi", quantity: 1, unit_price: 180.0 },
      { item_name: "Sweet Lassi", quantity: 2, unit_price: 80.0 },
      { item_name: "Gulab Jamun", quantity: 3, unit_price: 50.0 },
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
        total_amount: subtotal,
        items,
        created_at: now,
        updated_at: now,
      });

      console.log(`Bill ${result.insertedId} (${bill.table_number}) — ₹${subtotal}`);
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
