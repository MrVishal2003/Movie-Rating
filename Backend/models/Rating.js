import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  ratingId: { type: Number, unique: true },
  userId: { type: Number, required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  moviename: { type: String, required: true },
  comment: { type: String },
  mediaType: { type: String, required: true },
  mediaId: { type: String, required: true },
  day: { type: Number },
  month: { type: String },
  year: { type: Number },
});

const RatingModel = mongoose.model("Rating", RatingSchema);
export default RatingModel;
