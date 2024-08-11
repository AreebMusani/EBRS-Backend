const mongoose = require("mongoose");

const like = new mongoose.Schema({
  song: { type: mongoose.Schema.Types.ObjectId, ref: "Songs", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
}, {timestamps: true});

const Like = mongoose.model("like", like);

module.exports = Like;
