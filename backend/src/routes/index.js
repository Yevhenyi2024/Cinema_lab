const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const showtimeRoutes = require('./showtimes');
const favoriteRoutes = require('./favorites');
const actorRoutes = require('./actors');

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/actors', actorRoutes);

module.exports = router;