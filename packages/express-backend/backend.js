import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import itemsRouter from "./routes/items.js";
import coursesRouter from "./routes/courses.js";
import enrollmentsRouter from "./routes/enrollments.js";
import assignmentsRouter from "./routes/assignments.js";
import submissionsRouter from "./routes/submissions.js";
import gradesRouter from "./routes/grades.js";
import announcementsRouter from "./routes/announcements.js";
import materialsRouter from "./routes/materials.js";
import dashboardRouter from "./routes/dashboard.js";

dotenv.config();

const { MONGO_CONNECTION_STRING, JWT_SECRET, CLIENT_ORIGIN } =
  process.env;

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

app.use("/api/auth", authRouter);
app.use("/api/items", itemsRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/assignments", assignmentsRouter);
app.use("/api/submissions", submissionsRouter);
app.use("/api/grades", gradesRouter);
app.use("/api/announcements", announcementsRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/dashboard", dashboardRouter);

app.listen(process.env.PORT || port, () => {
  console.log(
    `Server running at http://localhost:${process.env.PORT || port}`
  );
});
