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
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get User by ID + Their Ratings
router.get("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRatings = await RatingModel.find({ userId });

    res.status(200).json({ user, ratings: userRatings });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete User (Also Deletes Their Ratings)
router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await UserModel.deleteOne({ userId });

    // Delete user's ratings
    await RatingModel.deleteMany({ userId });

    res.status(200).json({ message: "User and their ratings deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete Rating by ID
router.delete("/ratings/:ratingId", async (req, res) => {
  try {
    const ratingId = Number(req.params.ratingId);
    const rating = await RatingModel.findOne({ ratingId });

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    await RatingModel.deleteOne({ ratingId });

    res.status(200).json({ message: "Rating entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
