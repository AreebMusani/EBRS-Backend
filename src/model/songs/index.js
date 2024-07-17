const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true }
});

const songSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Artist: { type: String, required: true },
    Album: { type: String, required: true },
    URL: { type: String, required: true },
    Image: { type: String, required: true },
    Emotion: { type: String, enum: ['Happy', 'Sad', 'Angry', 'Fear'], required: true },
    Rating: {type: Number, default: 0},
    Ratings: [ratingSchema] // Array of user ratings
});

const Songs = mongoose.model("Songs", songSchema);

module.exports = Songs;
