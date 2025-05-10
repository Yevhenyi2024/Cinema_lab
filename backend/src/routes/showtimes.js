const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', showtimeController.getAllShowtimes);
router.get('/:id', showtimeController.getShowtimeById);

router.post('/', protect, authorize('admin'), showtimeController.createShowtime);
router.put('/:id', protect, authorize('admin'), showtimeController.updateShowtime);
router.delete('/:id', protect, authorize('admin'), showtimeController.deleteShowtime);

module.exports = router;