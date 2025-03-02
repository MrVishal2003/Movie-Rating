import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: Number,
  username: String,
  email: String,
  password: String,
});

export default mongoose.model("User", UserSchema);
