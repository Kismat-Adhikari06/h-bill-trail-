const { getDb } = require("../config/database");
const { ObjectId } = require("mongodb");

const COLLECTION = "users";

async function findAll() {
  const db = getDb();
  const users = await db
    .collection(COLLECTION)
    .find({})
    .sort({ created_at: -1 })
    .toArray();

  return users.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    created_at: u.created_at,
    updated_at: u.updated_at,
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

  const user = await db.collection(COLLECTION).findOne({ _id: objectId });

  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    password: user.password,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

async function findByEmail(email) {
  const db = getDb();
  const user = await db.collection(COLLECTION).findOne({ email });

  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    password: user.password,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

async function create(data) {
  const db = getDb();
  const now = new Date();

  const result = await db.collection(COLLECTION).insertOne({
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role || "user",
    created_at: now,
    updated_at: now,
  });

  return {
    id: result.insertedId.toString(),
    name: data.name,
    email: data.email,
    role: data.role || "user",
    created_at: now,
    updated_at: now,
  };
}

module.exports = { findAll, findById, findByEmail, create };
