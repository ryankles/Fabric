import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Cookie options — httpOnly means JS can't read it (more secure)
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // set to true when deployed with HTTPS
  maxAge: 24 * 60 * 60 * 1000 // 1 day, matches token expiry
};

function generateAccessToken(userId) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      }
    );
  });
}

// POST /auth/signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ email, hashedPassword });

    const token = await generateAccessToken(String(user._id));

    // Set token as a cookie instead of sending in JSON body
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

// POST /auth/signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const matched = await bcrypt.compare(password, user.hashedPassword);
    if (!matched) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = await generateAccessToken(String(user._id));

    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Signin failed" });
  }
});

// POST /auth/logout — clears the cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.status(200).json({ message: "Logged out" });
});

export default router;
