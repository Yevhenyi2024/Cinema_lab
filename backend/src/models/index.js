const { sequelize, connectDB } = require('../config/database');
const User = require('./user');
const Movie = require('./movie');
const Showtime = require('./showtime');
const Favorite = require('./favorite');
const Actor = require('./actor');
const MovieActor = require('./movieActor');
const Genre = require('./genre');
const MovieGenre = require('./movieGenre');

// Визначення зв'язків
Movie.hasMany(Showtime, { foreignKey: 'movieId', onDelete: 'CASCADE' });
Showtime.belongsTo(Movie, { foreignKey: 'movieId' });

User.hasMany(Favorite, { foreignKey: 'userId', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Movie.hasMany(Favorite, { foreignKey: 'movieId', onDelete: 'CASCADE' });
Favorite.belongsTo(Movie, { foreignKey: 'movieId' });

User.belongsToMany(Movie, { through: Favorite, foreignKey: 'userId' });
Movie.belongsToMany(User, { through: Favorite, foreignKey: 'movieId' });

Movie.belongsToMany(Actor, { through: MovieActor, foreignKey: 'movieId', as: 'cast' });
Actor.belongsToMany(Movie, { through: MovieActor, foreignKey: 'actorId' });

Movie.hasMany(MovieActor, { foreignKey: 'movieId' });
MovieActor.belongsTo(Movie, { foreignKey: 'movieId' });

Actor.hasMany(MovieActor, { foreignKey: 'actorId' });
MovieActor.belongsTo(Actor, { foreignKey: 'actorId' });

Movie.belongsToMany(Genre, { through: MovieGenre, foreignKey: 'movieId', as: 'genres' });
Genre.belongsToMany(Movie, { through: MovieGenre, foreignKey: 'genreId' });

Movie.hasMany(MovieGenre, { foreignKey: 'movieId' });
MovieGenre.belongsTo(Movie, { foreignKey: 'movieId' });

Genre.hasMany(MovieGenre, { foreignKey: 'genreId' });
MovieGenre.belongsTo(Genre, { foreignKey: 'genreId' });

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('БД синхронізувалась');
  } catch (error) {
    console.error('Помилка синхронізації БД', error);
  }
};

module.exports = {
  sequelize,
  connectDB,
  syncModels,
  User,
  Movie,
  Showtime,
  Favorite,
  Actor,
  MovieActor,
  Genre,
  MovieGenre,
};