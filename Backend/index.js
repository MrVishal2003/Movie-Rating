import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./models/Users.js";
import bcrypt from "bcrypt";
import RatingModel from "./models/Rating.js";
import adminRoute from "./routes/admin.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// Enable CORS for frontend deployed on Vercel
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow requests only from frontend
    credentials: true,
  })
);

app.use("/admin", adminRoute);

// Connect to MongoDB (Replace with MongoDB Atlas URL)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if any users exist in the database
    const existingUsers = await UserModel.find();
    let userId = existingUsers.length ? Math.max(...existingUsers.map((user) => user.userId)) + 1 : 1;
    
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

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", username: user.username, userId: user.userId });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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

export default app; // Required for Vercel
