const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', movieController.getAllMovies);
router.get('/search', movieController.searchMovies);
router.get('/genres', movieController.getGenresList);
router.get('/years', movieController.getReleaseYearsList);
router.get('/:id', movieController.getMovieById);

router.post('/', protect, authorize('admin'), movieController.createMovie);
router.put('/:id', protect, authorize('admin'), movieController.updateMovie);
router.delete('/:id', protect, authorize('admin'), movieController.deleteMovie);

module.exports = router;