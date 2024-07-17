const Songs = require("../../model/songs");

exports.getAllSongs = async (req, res) => {
  let category = req.params.category;
  console.log(category);
  const isCategoryValid = category ? ["happy", "sad", "fear", "angry"].includes(category.toLowerCase()) : false;
  category = category && category[0].toUpperCase() + category.substring(1);
  console.log(category[0].toUpperCase() + category.substring(1));
  console.log(isCategoryValid);
  // try {
  //     const songs = await Songs.find({ Emotion: category })
  //         .sort({ 'Ratings.rating': -1 }) // Sort by average rating (descending)
  //         .populate('Ratings.userId', 'username'); // Populate userId with username from User model if needed
  //     res.json(songs);
  // } catch (err) {
  //     res.status(500).json({ message: err.message });
  // }

  try {
    // Fetch songs by emotion
    let songs = isCategoryValid ? await Songs.find({ Emotion: category }) : await Songs.find();
    const { userId } = req.query;
    console.log(userId);

    // Extract user ratings
    const userRatings = await songs.map((song) => {
      const userRating = song.Ratings.filter(
        (rating) => rating.userId.toString() === userId
      );
      if (userRating?.length > 0) {
        song.Ratings = userRating;
      }
      return song;
    });

    // Sort songs based on user-specific rating or default rating
    const n = songs.length;
    const arr = [...userRatings];

    // Outer loop for passes
    for (let i = 0; i < n - 1; i++) {
      // Inner loop for comparison and swapping
      for (let j = 0; j < n - i - 1; j++) {
        // Swap if the element found is greater than the next element
        const rating1 = arr[j]?.Ratings?.length > 0 ? arr[j]?.Ratings[0]?.rating : arr[j]?.Rating;
        const rating2 =
          arr[j + 1]?.Ratings?.length > 0
            ? arr[j + 1]?.Ratings[0]?.rating
            : arr[j + 1]?.Rating;
        //rating1 = arr[j]
        //rating2 = arr[j + 1]
        if (rating1 < rating2) {
          // Swap arr[j] and arr[j+1]
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    res.json(arr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.userRating = async (req, res) => {
  const { songId } = req.params;
  const { userId, rating } = req.body;
  try {
    // Find the song by ID
    let song = await Songs.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Check if user has already rated the song
    const userRatingIndex = await song.Ratings.findIndex(
      (r) => r.userId.toString() === userId
    );
    if (userRatingIndex !== -1) {
      // Update existing rating
      song.Ratings[userRatingIndex].rating = rating;
    } else {
      // Add new rating
      song.Ratings.push({ userId, rating });
    }

    // Calculate average rating
    // const totalRatings = song.Ratings.length;
    // const sumRatings = song.Ratings.reduce((acc, cur) => acc + cur.rating, 0);
    // song.Rating = totalRatings > 0 ? sumRatings / totalRatings : song.Rating;

    // Save the updated song
    await song.save();
    res.status(200).json({data: song, message: "Rating added successfully"});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};