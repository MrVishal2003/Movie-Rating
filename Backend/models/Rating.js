import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  ratingId: { type: Number, unique: true },
  userId: { type: Number, required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  moviename: { type: String, required: true },
  comment: { type: String },
  mediaType: { type: String, required: true },
  mediaId: { type: Number, required: true },
  day: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
});

export default mongoose.model("Rating", RatingSchema);
