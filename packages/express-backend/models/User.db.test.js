import { describe, expect, test } from "@jest/globals";
import "../test/setupDb.js";
import User from "./User.js";

describe("User model (real Mongo)", () => {
  test("persists a valid user", async () => {
    const user = await User.create({
      name: "Ada Lovelace",
      email: "ada@example.com",
      passwordHash: "hash",
      role: "teacher"
    });

    expect(user._id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(await User.countDocuments()).toBe(1);
  });

  test("requires name, email, passwordHash and role", async () => {
    const error = await User.create({}).catch((err) => err);

    expect(error.name).toBe("ValidationError");
    expect(error.errors.name).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.passwordHash).toBeDefined();
    expect(error.errors.role).toBeDefined();
  });

  test("rejects a role outside the allowed enum", async () => {
    const error = await User.create({
      name: "Bad Role",
      email: "bad@example.com",
      passwordHash: "hash",
      role: "admin"
    }).catch((err) => err);

    expect(error.name).toBe("ValidationError");
    expect(error.errors.role).toBeDefined();
  });

  test("enforces the unique email index", async () => {
    // Ensure the unique index is built before relying on it.
    await User.init();

    await User.create({
      name: "First",
      email: "dup@example.com",
      passwordHash: "hash",
      role: "student"
    });

    const error = await User.create({
      name: "Second",
      email: "dup@example.com",
      passwordHash: "hash",
      role: "student"
    }).catch((err) => err);

    // Duplicate key error from the underlying Mongo unique index.
    expect(error.code).toBe(11000);
  });
});
