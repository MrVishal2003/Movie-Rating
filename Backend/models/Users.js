import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: Number,
  username: String,
  email: String,
  password: String,
});

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
