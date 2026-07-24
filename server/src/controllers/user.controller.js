const userModel = require("../models/user.model");
const { sendSuccess } = require("../utils/response");
const ApiError = require("../utils/ApiError");

async function getAllUsers(req, res, next) {
  try {
    const users = await userModel.findAll();
    sendSuccess(res, users, "Users retrieved successfully");
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Invalid user ID");
    }

    const user = await userModel.findById(id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    sendSuccess(res, user, "User retrieved successfully");
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required");
    }

    if (role && !["admin", "user"].includes(role)) {
      throw new ApiError(400, "Role must be 'admin' or 'user'");
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      throw new ApiError(409, "Email already exists");
    }

    const user = await userModel.create({ name, email, password, role });
    sendSuccess(res, user, "User created successfully", 201);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllUsers, getUserById, createUser };
