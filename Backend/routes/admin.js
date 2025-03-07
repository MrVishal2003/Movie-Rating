import express from "express";
import UserModel from "../models/Users.js";
import RatingModel from "../models/Rating.js";

const router = express.Router();

/** ✅ Get all users */
router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** ✅ Get user details by userId (including their ratings) */
router.get("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
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

/** ✅ Delete a user by userId (also deletes their ratings) */
router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const deletedUser = await UserModel.findOneAndDelete({ userId });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also delete the user's ratings
    const deletedRatings = await RatingModel.deleteMany({ userId });

    res.status(200).json({
      message: "User and their ratings deleted successfully",
      deletedUser,
      deletedRatingsCount: deletedRatings.deletedCount,
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/** ✅ Delete a rating by ratingId */
router.delete("/ratings/:ratingId", async (req, res) => {
  try {
    const ratingId = Number(req.params.ratingId);
    if (isNaN(ratingId)) {
      return res.status(400).json({ message: "Invalid ratingId format" });
    }

    const deletedRating = await RatingModel.findOneAndDelete({ ratingId });
    if (!deletedRating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({ message: "Rating deleted successfully", deletedRating });
  } catch (error) {
    console.error("❌ Error deleting rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
