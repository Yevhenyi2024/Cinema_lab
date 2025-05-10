const { Showtime, Movie, Genre, MovieGenre, sequelize } = require('../models');
const { Op } = require('sequelize');

const getAllShowtimes = async (req, res) => {
  const { date, time, genre, movieId } = req.query;
  const whereClause = {};
  const includeClause = [{
      model: Movie,
      required: true, // Сеанс обов'язково повинен мати фільм
      as: 'Movie',
  }];

  if (date) {
      whereClause.date = date;
  }
  if (time) {
      whereClause.time = { [Op.gte]: time };
  }
  if (movieId) {
      whereClause.movieId = movieId;
  }

  // Логіка фільтрації за жанром
  if (genre) {
      includeClause[0].include = [{
          model: Genre,
          as: 'genres',
          through: { attributes: [] }, 
          required: true, 
          where: { name: genre } 
      }];
      includeClause[0].required = true; 
  }

  try {
      const showtimes = await Showtime.findAll({
          where: whereClause,
          include: includeClause,
          order: [['date', 'ASC'], ['time', 'ASC']],
      });

      res.json(showtimes);
  } catch (error) {
      console.error('Помилка сервера під час отримання сеансів:', error.message);
      res.status(500).send('Помилка сервера під час отримання сеансів');
  }
};

const getShowtimeById = async (req, res) => {
    try {
        const showtime = await Showtime.findByPk(req.params.id, {
            include: { model: Movie, as: 'Movie' }
        });
        if (showtime) {
            res.json(showtime);
        } else {
            res.status(404).json({ message: 'Сеанс не знайдено' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Функції для адмін-панелі
const createShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.create(req.body);
    res.status(201).json(showtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateShowtime = async (req, res) => {
  try {
    const [updatedRowsCount] = await Showtime.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedRowsCount > 0) {
       const updatedShowtime = await Showtime.findByPk(req.params.id);
       res.json(updatedShowtime);
    } else {
      res.status(404).json({ message: 'Сеанс не знайдено' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteShowtime = async (req, res) => {
  try {
    const deletedRowsCount = await Showtime.destroy({
      where: { id: req.params.id },
    });

    if (deletedRowsCount > 0) {
      res.json({ message: 'Сеанс успішно видалено' });
    } else {
      res.status(404).json({ message: 'Сеанс не знайдено' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllShowtimes,
  getShowtimeById,
  createShowtime,
  updateShowtime,
  deleteShowtime,
};