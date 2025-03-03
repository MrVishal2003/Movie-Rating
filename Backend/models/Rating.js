import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  ratingId: Number,
  userId: Number,
  username: String,
  rating: Number,
  moviename: String,
  comment: String,
  mediaType: String,
  mediaId: String,
  day: Number,
  month: Number,
  year: Number,
});

const RatingModel = mongoose.model("Rating", RatingSchema);
export default RatingModel;
