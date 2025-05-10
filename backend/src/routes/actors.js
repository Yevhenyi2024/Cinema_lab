const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');

router.get('/movie/:movieId', actorController.getCastByMovieId);

module.exports = router;