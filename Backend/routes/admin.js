import express from "express";
import UserModel from "../models/Users.js";
import RatingModel from "../models/Rating.js";

const router = express.Router();

// ✅ Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get User by userId (with Ratings)
router.get("/users/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const user = await UserModel.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRatings = await RatingModel.find({ userId });
    res.status(200).json({ user, ratings: userRatings });
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete User by userId
router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const deletedUser = await UserModel.findOneAndDelete({ userId });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete Rating by ratingId
router.delete("/ratings/:ratingId", async (req, res) => {
  try {
    const ratingId = parseInt(req.params.ratingId);
    if (isNaN(ratingId)) {
      return res.status(400).json({ message: "Invalid ratingId format" });
    }

    const deletedRating = await RatingModel.findOneAndDelete({ ratingId });
    if (!deletedRating) {
      return res.status(404).json({ message: "Rating entry not found" });
    }

    res.status(200).json({ message: "Rating entry deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting rating entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
