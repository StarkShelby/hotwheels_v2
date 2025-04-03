const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  collection: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }], // Cars added to collection
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }], // Cars added to wishlist
});

const User = mongoose.model("User", userSchema);
module.exports = User;
