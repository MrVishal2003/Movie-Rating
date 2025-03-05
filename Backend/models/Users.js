import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("Users", userSchema);

export default User;
