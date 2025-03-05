import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import UserModel from "./models/Users.js";
import RatingModel from "./models/Rating.js";
import adminRoute from "./routes/admin.js";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["https://movie-rating-ui.vercel.app"], // Change this to match your frontend URL
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use("/admin", adminRoute);

// ✅ MongoDB Connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};
connectDB(); // Call on startup

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🎬 Movie Rating API is running successfully!");
});

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate user ID
    const lastUser = await UserModel.findOne().sort({ userId: -1 }); // Get last user
    const userId = lastUser ? lastUser.userId + 1 : 1; // Auto-increment userId

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new UserModel({ username, email, password: hashedPassword, userId });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Signin Route
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      username: user.username,
      userId: user.userId,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Add Movie Rating
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

    // Generate rating ID
    const lastRating = await RatingModel.findOne().sort({ ratingId: -1 });
    const ratingId = lastRating ? lastRating.ratingId + 1 : 101; // Auto-increment ratingId

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
    console.error("Error saving rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Authentication Check Route
app.get("/api/authenticated", async (req, res) => {
  try {
    res.json({ authenticated: true });
  } catch (error) {
    console.error("Error checking authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Fetch Ratings for a Movie
app.get("/ratings", async (req, res) => {
  try {
    const { mediaId } = req.query;
    if (!mediaId) {
      return res.status(400).json({ message: "Media ID is required" });
    }

    const ratings = await RatingModel.find({ mediaId });
    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
