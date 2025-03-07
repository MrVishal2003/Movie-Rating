import express from "express";
import UserModel from "../models/Users.js";
import RatingModel from "../models/Rating.js";

const router = express.Router();

// ✅ Middleware to Check Admin Access
const isAdmin = (req, res, next) => {
  const { adminSecret } = req.headers; // Use a secure token-based authentication instead
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
};

// ✅ Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get User Details by userId (Including Ratings)
router.get("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = await UserModel.findOne({ userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    const userRatings = await RatingModel.find({ userId });

    res.json({ user, ratings: userRatings });
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete User (With Ratings)
router.delete("/users/:userId", isAdmin, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const deletedUser = await UserModel.findOneAndDelete({ userId });

    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    // Cascade delete user ratings
    await RatingModel.deleteMany({ userId });

    res.json({ message: "User and their ratings deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete Rating by ratingId
router.delete("/ratings/:ratingId", isAdmin, async (req, res) => {
  try {
    const ratingId = Number(req.params.ratingId);
    const deletedRating = await RatingModel.findOneAndDelete({ ratingId });

    if (!deletedRating) return res.status(404).json({ message: "Rating not found" });

    res.json({ message: "Rating entry deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting rating entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
