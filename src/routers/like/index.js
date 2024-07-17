const express = require('express')
const router = express.Router()
const likeController = require("../../controllers/like");

router.get("/", likeController.getLikedSongs)
router.post("/", likeController.like)
router.post("/remove", likeController.unlike)

module.exports = router