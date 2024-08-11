const like = require("../../model/likes");
const Songs = require("../../model/songs");
const User = require("../../model/user");

exports.like = async (req, res) => {
  const { songId, userId } = req.body;
  console.log(req.body);
  try {
    const exist = await like.findOne({song: songId, user: userId});
    if (exist) {
      throw new Error("Already liked");
    }
    const likeSong = await like.create({
      song: songId,
      user: userId,
    });

    if (!likeSong) {
      throw new Error("Something went wrong");
    }
    res.status(201).send({ message: "Added into Favourites..." });
  } catch (e) {
    res.status(400).send({ message: e?.message });
  }
};

exports.getLikedSongs = async (req, res) => {
  const { userId } = req.query;

  try {
    const likedSongs = await like
      .find({ user: userId })
      .populate('song')
      .populate('user');

    if (!likedSongs) {
        return res.status(200).send({ data: [] });
    }

    res.status(200).send({ message: "Fetched recommendation list...", data: likedSongs});
  } catch (e) {
    res.status(400).send({ message: e?.message });
  }
};

exports.unlike = async (req, res) => {
  const { songId, userId } = req.body;
  console.log(req.body);
  

  try {
    const exist = await like.findOne({ user: userId, song: songId });

    if (!exist) {
      throw new Error("This song is not like");
    }

    const unlikeSong = await like
      .findOneAndDelete({ user: userId, song: songId })

    if (!unlikeSong) {
      throw new Error("Something went wrong");
    }

    res.status(201).send({ message: "Removed from favourites..." });
  } catch (e) {
    res.status(400).send({ message: e?.message });
  }
}