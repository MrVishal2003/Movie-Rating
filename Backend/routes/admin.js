import express from "express";
import UserModel from "../models/Users.js";
import RatingModel from "../models/Rating.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userRatings = await RatingModel.find({ userId });
    const userDetailsWithRatings = {
      user,
      ratings: userRatings,
    };

    res.json(userDetailsWithRatings);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    await UserModel.deleteOne({ userId });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/ratings/:ratingId", async (req, res) => {
  try {
    const ratingId = req.params.ratingId;
    await RatingModel.deleteOne({ ratingId });

    res.json({ message: "Rating entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
