import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  ratingId: { type: Number, unique: true, required: true },
  userId: { type: Number, required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  moviename: { type: String, required: true },
  comment: { type: String },
  mediaType: { type: String },
  mediaId: { type: String },
  day: { type: Number },
  month: { type: Number },
  year: { type: Number },
});

export default mongoose.model("Rating", RatingSchema);
