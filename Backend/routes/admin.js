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

// Get user details by userId (including ratings)
router.get("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId); // Ensure userId is treated as a number
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

// Delete a user by userId
router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const deletedUser = await UserModel.findOneAndDelete({ userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a rating entry by ratingId
router.delete("/ratings/:ratingId", async (req, res) => {
  try {
    const ratingId = Number(req.params.ratingId);
    const deletedRating = await RatingModel.findOneAndDelete({ ratingId });

    if (!deletedRating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.json({ message: "Rating entry deleted successfully", deletedRating });
  } catch (error) {
    console.error("Error deleting rating entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
