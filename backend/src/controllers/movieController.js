const { Movie, Genre, MovieGenre, sequelize } = require('../models');
const { Op } = require('sequelize');

const processMovieForResponse = (movie) => {
    if (!movie) return null;

    const plainMovie = movie.get ? movie.get({ plain: true }) : movie;

    const ratingValue = plainMovie.rating;
    const numericRating = typeof ratingValue === 'string' && !isNaN(parseFloat(ratingValue))
        ? parseFloat(ratingValue)
        : (ratingValue === null || ratingValue === undefined ? null : ratingValue);

    const processedGenres = plainMovie.genres && Array.isArray(plainMovie.genres)
        ? plainMovie.genres.map(genre => genre.get ? genre.get({ plain: true }) : genre)
        : plainMovie.genres; 

    return {
        ...plainMovie,
        rating: numericRating, 
        genres: processedGenres 
    };
};

const processMoviesForResponse = (movies) => {
    if (!Array.isArray(movies)) return null;
    return movies.map(processMovieForResponse);
};

const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.findAll({
            include: {
                model: Genre,
                as: 'genres',
                through: { attributes: [] }
            }
        });
        const processedMovies = processMoviesForResponse(movies);
        res.json(processedMovies);
    } catch (error) {
        console.error('Помилка отримання фільмів:', error.message);
        res.status(500).json({ message: error.message });
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id, {
            include: {
                model: Genre,
                as: 'genres',
                through: { attributes: [] }
            }
        });
        if (movie) {
            const processedMovie = processMovieForResponse(movie);
            res.json(processedMovie);
        } else {
            res.status(404).json({ message: 'Фільм не знайдено' });
        }
    } catch (error) {
        console.error(`Помилка отримання фільму з ID ${req.params.id}:`, error.message);
        res.status(500).json({ message: error.message });
    }
};

const searchMovies = async (req, res) => {
    const { title, genre, year, rating } = req.query;
    const whereClause = {};
    const includeClause = [{
        model: Genre,
        as: 'genres',
        attributes: ['id', 'name'],
        through: { attributes: [] },
        required: false
    }];

    if (title) {
        whereClause.title = { [Op.like]: `%${title}%` };
    }
    if (year) {
        const startOfYear = `${year}-01-01`;
        const endOfYear = `${year}-12-31`;
        whereClause.releaseDate = {
            [Op.between]: [startOfYear, endOfYear]
        };
    }
    if (rating) {

        whereClause.rating = { [Op.gte]: parseFloat(rating) };
    }

    if (genre) {
        includeClause[0].where = { name: genre };
        includeClause[0].required = true;
    }

    try {
        const movies = await Movie.findAll({
            where: whereClause,
            include: includeClause,
        });
        const processedMovies = processMoviesForResponse(movies);
        res.json(processedMovies);
    } catch (error) {
        console.error('Помилка під час пошуку фільмів:', error.message);
        res.status(500).send('Помилка сервера під час пошуку');
    }
};

const createMovie = async (req, res) => {
    const { genreIds, ...movieData } = req.body;
    try {

        const movie = await Movie.create(movieData);

        if (genreIds && Array.isArray(genreIds) && genreIds.length > 0) {
            const genres = await Genre.findAll({ where: { id: genreIds } });
            if (genres.length !== genreIds.length) {
                 console.warn("Деякі ID жанрів для нового фільму не знайдено в БД");
            }
            await movie.addGenres(genres);
        }

        const createdMovieWithGenres = await Movie.findByPk(movie.id, {
            include: {
                model: Genre,
                as: 'genres',
                through: { attributes: [] }
            }
        });

        const processedMovie = processMovieForResponse(createdMovieWithGenres);
        res.status(201).json(processedMovie);
    } catch (error) {
        console.error('Помилка створення фільму:', error.message);
        res.status(400).json({ message: error.message });
    }
};

const updateMovie = async (req, res) => {
   const { genreIds, ...movieData } = req.body;
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
             return res.status(404).json({ message: 'Фільм не знайдено' });
        }

        await movie.update(movieData);

        if (genreIds !== undefined) {
            if (genreIds === null || (Array.isArray(genreIds) && genreIds.length === 0)) {
                 await movie.setGenres([]);
            } else if (Array.isArray(genreIds) && genreIds.length > 0) {
                 const genres = await Genre.findAll({ where: { id: genreIds } });
                 if (genres.length !== genreIds.length) {
                     console.warn("Деякі ID жанрів для оновлення фільму не знайдено в БД");
                 }
                 await movie.setGenres(genres);
            }
        }

        const updatedMovieWithGenres = await Movie.findByPk(movie.id, {
             include: {
                 model: Genre,
                 as: 'genres',
                 through: { attributes: [] }
             }
        });

        const processedMovie = processMovieForResponse(updatedMovieWithGenres);
        res.json(processedMovie);
    } catch (error) {
        console.error(`Помилка оновлення фільму з ID ${req.params.id}:`, error.message);
        res.status(400).json({ message: error.message });
    }
};

const getGenresList = async (req, res) => {
    try {
        const genres = await Genre.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']]
        });
        res.json(genres);
    } catch (error) {
        console.error('Помилка сервера під час отримання жанрів:',error.message);
        res.status(500).send('Помилка сервера під час отримання жанрів');
    }
};

const getReleaseYearsList = async (req, res) => {
    try {
            const movies = await Movie.findAll({
                attributes: ['releaseDate'],
                where: {
                    releaseDate: {
                        [Op.not]: null
                    }
                },
                group: ['releaseDate']
            });
            const years = new Set();
            movies.forEach(movie => {
                if (movie.releaseDate) {
                    const dateObj = new Date(movie.releaseDate);
                    if (!isNaN(dateObj.getTime())) {
                        const year = dateObj.getFullYear();
                        years.add(year.toString());
                    } else {
                        const yearMatch = movie.releaseDate.match(/^(\d{4})/);
                        if(yearMatch && yearMatch[1]) {
                            years.add(yearMatch[1]);
                        }
                    }
                }
            });
            const sortedYears = Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
            res.json(sortedYears);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Помилка сервера під час отримання років випуску');
        }
};


const deleteMovie = async (req, res) => {
  try {
    const deletedRowsCount = await Movie.destroy({
      where: { id: req.params.id },
    });

    if (deletedRowsCount > 0) {
      res.json({ message: 'Фільм успішно видалено' });
    } else {
      res.status(404).json({ message: 'Фільм не знайдено' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  searchMovies,
  getGenresList,
  getReleaseYearsList,
  createMovie,
  updateMovie,
  deleteMovie,
};