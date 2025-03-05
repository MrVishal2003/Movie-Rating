import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
});

const UserModel = mongoose.model("Users", userSchema);
export default UserModel;
