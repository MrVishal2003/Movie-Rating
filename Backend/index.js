import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import UserModel from "./models/Users.js";
import RatingModel from "./models/Rating.js";
import adminRoute from "./routes/admin.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS: Allow Frontend on Vercel & Local Dev
const allowedOrigins = [
  "https://movie-rating-ui.vercel.app", // ✅ Deployed frontend
  "http://localhost:5173", // ✅ Local development
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// ✅ Admin Routes
app.use("/admin", adminRoute);

// ✅ User Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email is already registered
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate unique user ID
    const existingUsers = await UserModel.find();
    let userId =
      existingUsers.length === 0
        ? 1
        : Math.max(...existingUsers.map((user) => user.userId)) + 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      userId,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("❌ Error in Signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ User Signin
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      username: user.username,
      userId: user.userId,
    });
  } catch (error) {
    console.error("❌ Error in Signin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Submit a Movie Rating
app.post("/showmore", async (req, res) => {
  try {
    const {
      userId,
      username,
      rating,
      moviename,
      comment,
      mediaType,
      mediaId,
      day,
      month,
      year,
    } = req.body;

    if (!userId || !moviename || !rating || !mediaId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ratingId = (await RatingModel.countDocuments()) + 101;

    const newRating = new RatingModel({
      ratingId,
      userId,
      username,
      rating,
      moviename,
      comment,
      mediaType,
      mediaId,
      day,
      month,
      year,
    });

    await newRating.save();
    res.status(201).json({ message: "Rating saved successfully", ratingId });
  } catch (error) {
    console.error("❌ Error saving rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Check Authentication Status
app.get("/api/authenticated", (req, res) => {
  res.json({ authenticated: true });
});

// ✅ Get Ratings for a Movie
app.get("/ratings", async (req, res) => {
  try {
    const { mediaId } = req.query;

    if (!mediaId) {
      return res.status(400).json({ error: "mediaId is required" });
    }

    const ratings = await RatingModel.find({ mediaId });
    res.json(ratings);
  } catch (error) {
    console.error("❌ Error fetching ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Export the Express app for Vercel (⚠️ Important for deployment)
export default app;
