import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  ratingId: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  moviename: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  mediaType: {
    type: String,
    required: true,
  },
  mediaId: {
    type: String,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

const RatingModel = mongoose.model("Rating", ratingSchema);

export default RatingModel;
