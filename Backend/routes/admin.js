import express from "express";
import UserModel from "../models/Users.js";
import RatingModel from "../models/Rating.js";

const router = express.Router();

// ✅ Fetch All Users
router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Fetch User Details Along with Ratings
router.get("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId); // Convert to Number
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRatings = await RatingModel.find({ userId });

    res.json({
      user,
      ratings: userRatings,
    });
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete User and Their Ratings
router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId); // Convert to Number
    const deletedUser = await UserModel.findOneAndDelete({ userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all ratings associated with the user
    await RatingModel.deleteMany({ userId });

    res.json({ message: "✅ User and ratings deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete Rating Entry
router.delete("/ratings/:ratingId", async (req, res) => {
  try {
    const ratingId = Number(req.params.ratingId); // Convert to Number
    const deletedRating = await RatingModel.findOneAndDelete({ ratingId });

    if (!deletedRating) {
      return res.status(404).json({ message: "Rating entry not found" });
    }

    res.json({ message: "✅ Rating entry deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting rating entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
