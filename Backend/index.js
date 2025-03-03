import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";

import UserModel from "./models/Users.js"; // ✅ Fixed path
import RatingModel from "./models/Rating.js"; // ✅ Fixed path
import adminRoute from "./routes/admin.js"; // ✅ Fixed path

const app = express();
app.use(express.json());

// ✅ Configure CORS properly for Vercel
app.use(cors({
  origin: process.env.CLIENT_URL || "https://movie-rating-flax.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use("/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ✅ Fix MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUsers = await UserModel.find();
    let userId = existingUsers.length === 0 ? 1 : Math.max(...existingUsers.map(user => user.userId)) + 1;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, email, password: hashedPassword, userId });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sign-in Route
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      username: user.username,
      userId: user.userId,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Save Rating Route
app.post("/showmore", async (req, res) => {
  try {
    const ratingId = (await RatingModel.countDocuments()) + 101;
    const newRating = new RatingModel({ ...req.body, ratingId });

    await newRating.save();
    res.status(201).json({ message: "Rating saved successfully", ratingId });
  } catch (error) {
    console.error("Error saving rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Authentication Check
app.get("/api/authenticated", (req, res) => {
  res.json({ authenticated: true });
});

// Get Ratings
app.get("/ratings", async (req, res) => {
  try {
    const { mediaId } = req.query;
    const ratings = await RatingModel.find({ mediaId });
    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// **Export app for Vercel**
export default app;
