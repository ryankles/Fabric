import { afterAll, afterEach, beforeAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer;

// Spin up a throwaway in-memory MongoDB once for the whole test file, so the
// real Mongoose models/queries run against a genuine Mongo instance instead of
// being mocked. Backend-agnostic: nothing here knows about Express.
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// Keep tests isolated by wiping every collection between them.
afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
