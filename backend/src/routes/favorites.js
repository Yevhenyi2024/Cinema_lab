const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, favoriteController.getUserFavorites);
router.post('/', protect, favoriteController.addFavorite);
router.delete('/:movieId', protect, favoriteController.removeFavorite);
router.get('/:movieId/status', protect, favoriteController.checkFavoriteStatus);

module.exports = router;