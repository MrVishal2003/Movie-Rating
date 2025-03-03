import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "../models/Users.js";
import bcrypt from "bcrypt";
import RatingModel from "../models/Rating.js";
import adminRoute from "../routes/admin.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();

// Enable CORS for all origins or specify allowed origins
app.use(cors({
  origin: "https://movie-rating-flax.vercel.app/", // Change "*" to your frontend URL if needed
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use("/admin", adminRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUsers = await UserModel.find();
    let userId = existingUsers.length ? Math.max(...existingUsers.map(user => user.userId)) + 1 : 1;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, email, password: hashedPassword, userId });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", username: user.username, userId: user.userId });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/showmore", async (req, res) => {
  try {
    const ratingId = (await RatingModel.countDocuments()) + 101;
    const newRating = new RatingModel({ ratingId, ...req.body });
    await newRating.save();

    res.status(201).json({ message: "Rating saved successfully", ratingId });
  } catch (error) {
    console.error("Error saving rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/authenticated", async (req, res) => {
  res.json({ authenticated: true });
});

app.get("/ratings", async (req, res) => {
  try {
    const ratings = await RatingModel.find({ mediaId: req.query.mediaId });
    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export app for Vercel
export default app;
