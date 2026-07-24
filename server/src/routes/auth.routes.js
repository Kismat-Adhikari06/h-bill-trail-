const express = require("express");
const userModel = require("../models/user.model");
const { sendSuccess } = require("../utils/response");
const ApiError = require("../utils/ApiError");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await userModel.findByEmail(email);

    if (!user || user.password !== password) {
      throw new ApiError(401, "Invalid email or password");
    }

    sendSuccess(
      res,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Login successful"
    );
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required");
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      throw new ApiError(409, "Email already exists");
    }

    const user = await userModel.create({ name, email, password, role: "user" });

    sendSuccess(
      res,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Account created successfully",
      201
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
