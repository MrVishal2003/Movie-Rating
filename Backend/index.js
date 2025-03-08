import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "./models/Users.js";
import RatingModel from "./models/Rating.js";
import adminRoute from "./routes/admin.js";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URL.split(" ");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use("/admin", adminRoute);

const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Secure Middleware (JWT Verification)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ authenticated: false, message: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ authenticated: false, message: "Invalid token" });
  }
};

// ✅ Default API Route
app.get("/", (req, res) => {
  res.send("🎬 Movie Rating API is running 🚀");
});

// ✅ Signup API
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUsers = await UserModel.find();

    const userId = existingUsers.length === 0
      ? 1
      : Math.max(...existingUsers.map(user => user.userId)) + 1;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ username, email, password: hashedPassword, userId });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Signin API with JWT
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.userId,
      username: user.username,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Secure Authentication Check API
app.get("/api/authenticated", verifyToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// ✅ Start Server (For Development & Production)
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

// ✅ Export Express App for Vercel Deployment
export default app;
