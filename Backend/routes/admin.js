import express from "express";
import UserModel from "../models/Users.js";
import RatingModel from "../models/Rating.js";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user by userId with ratings
router.get("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId); // Ensure it's a number
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRatings = await RatingModel.find({ userId });

    res.json({ user, ratings: userRatings });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user and their ratings
router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserModel.deleteOne({ userId });
    await RatingModel.deleteMany({ userId }); // Delete associated ratings

    res.json({ message: "User and their ratings deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a rating entry
router.delete("/ratings/:ratingId", async (req, res) => {
  try {
    const ratingId = Number(req.params.ratingId);
    const rating = await RatingModel.findOne({ ratingId });

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    await RatingModel.deleteOne({ ratingId });
    res.json({ message: "Rating entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
