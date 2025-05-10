const { Favorite, Movie } = require('../models');

const getUserFavorites = async (req, res) => {
  const userId = req.user.id;
  try {
    const favorites = await Favorite.findAll({
      where: { userId: userId },
      include: { model: Movie, as: 'Movie' },
    });
    res.json(favorites.map(fav => fav.Movie));
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Помилка сервера');
  }
};

const addFavorite = async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id;

  try {
    const existingFavorite = await Favorite.findOne({
      where: { userId, movieId },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Фільм вже додано до обраного' });
    }

    const favorite = await Favorite.create({ userId, movieId });

    const addedMovie = await Movie.findByPk(movieId);

    res.status(201).json(addedMovie);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Помилка сервера');
  }
};

const removeFavorite = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;

  try {
    const deletedRowsCount = await Favorite.destroy({
      where: { userId, movieId },
    });

    if (deletedRowsCount > 0) {
      res.json({ message: 'Фільм успішно видалено з обраного' });
    } else {
      res.status(404).json({ message: 'Фільм не знайдено в обраному користувача' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Помилка сервера');
  }
};

const checkFavoriteStatus = async (req, res) => {
    const { movieId } = req.params;
    const userId = req.user.id;

    try {
        const favorite = await Favorite.findOne({
            where: { userId, movieId }
        });
        res.json({ isFavorite: !!favorite });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Помилка сервера');
    }
};


module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkFavoriteStatus,
};