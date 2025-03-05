import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "./models/Users.js";
import RatingModel from "./models/Rating.js";
import adminRoute from "./routes/admin.js";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Allow only frontend domain for security
const allowedOrigins = [process.env.FRONTEND_URL];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

app.use("/admin", adminRoute);

// ✅ Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Signin with JWT
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { username: user.username, userId: user._id },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Add rating
app.post("/ratings", async (req, res) => {
  try {
    const { userId, username, rating, moviename, comment, mediaType, mediaId, day, month, year } = req.body;
    
    const newRating = new RatingModel({
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
    res.status(201).json({ message: "Rating saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get ratings
app.get("/ratings", async (req, res) => {
  try {
    const { mediaId } = req.query;
    const ratings = await RatingModel.find({ mediaId });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Export for Vercel
export default app;
