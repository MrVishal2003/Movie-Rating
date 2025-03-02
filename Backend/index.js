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
app.use(
  cors({
    origin: ["https://movie-rating-flax.vercel.app"], // Replace with your frontend URL
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware for authentication
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Admin Route
app.use("/admin", adminRoute);

// User Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await UserModel.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const lastUser = await UserModel.findOne().sort({ userId: -1 });
    const userId = lastUser ? lastUser.userId + 1 : 1;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ username, email, password: hashedPassword, userId });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User Signin
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, username: user.username, userId: user.userId });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add Rating (Protected Route)
app.post("/showmore", authenticateUser, async (req, res) => {
  try {
    const { rating, moviename, comment, mediaType, mediaId, day, month, year } = req.body;

    const ratingId = (await RatingModel.countDocuments()) + 101;
    const newRating = new RatingModel({
      ratingId,
      userId: req.user.userId,
      username: req.user.username,
      rating,
      moviename,
      comment,
      mediaType,
      mediaId,
      day,
      month,
      year
    });

    await newRating.save();
    res.status(201).json({ message: "Rating saved successfully", ratingId });
  } catch (error) {
    console.error("Error saving rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Ratings by Media ID
app.get("/ratings", async (req, res) => {
  try {
    const { mediaId } = req.query;
    const ratings = await RatingModel.find({ mediaId });
    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Authentication Check
app.get("/api/authenticated", authenticateUser, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// Server Start
app.listen(3000, () => console.log("Server running on port 3000"));

export default app;
