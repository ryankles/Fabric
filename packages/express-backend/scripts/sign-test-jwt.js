/**
 * Dev helper for Postman until /auth/login exists.
 * Usage: node scripts/sign-test-jwt.js <userId>
 */
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const userId = process.argv[2] ?? "test-user-a";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing from .env");
  process.exit(1);
}

const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
console.log(token);
