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

module.exports = router;
