const express = require('express')
const router = express.Router()
const songsController = require("../../controllers/songs");

router.get('/:category', songsController.getAllSongs)
router.post('/:songId/rate', songsController.userRating)

module.exports = router;