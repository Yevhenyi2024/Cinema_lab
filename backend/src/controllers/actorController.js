const { Movie, Actor } = require('../models');

const getCastByMovieId = async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const movie = await Movie.findByPk(movieId, {
      include: {
        model: Actor,
        as: 'cast',
        through: { attributes: ['characters'] }
      }
    });

    if (!movie) {
      return res.status(404).json({ message: 'Фільм не знайдено' });
    }

    const castWithCharacters = movie.cast.map(actor => ({
        id: actor.id,
        name: actor.name,
        photo: actor.photo,
        characters: actor.MovieActor.characters
    }));


    res.json(castWithCharacters);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Помилка сервера під час отримання акторського складу');
  }
};

module.exports = {
  getCastByMovieId,
};