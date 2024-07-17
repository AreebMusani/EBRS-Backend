const mongoose = require("mongoose");

const like = new mongoose.Schema({
  song: { type: mongoose.Schema.Types.ObjectId, ref: "Songs" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Like = mongoose.model("like", like);

module.exports = Like;
