import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import itemsRouter from "./routes/items.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const { MONGO_CONNECTION_STRING, JWT_SECRET, CLIENT_ORIGIN } = process.env;

if (!JWT_SECRET) {
  console.warn(
    "JWT_SECRET is not set — protected /api/items routes cannot verify tokens"
  );
}

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "fabric")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(
  cors({
    origin: CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRouter);
app.use("/api/items", itemsRouter);

app.listen(process.env.PORT || port, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || port}`);
});
