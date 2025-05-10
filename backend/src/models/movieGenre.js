const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MovieGenre = sequelize.define('MovieGenre', {
  movieId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
     references: {
        model: 'movies',
        key: 'id',
    },
  },
  genreId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
     references: {
        model: 'genres',
        key: 'id',
    },
  },
}, {
  tableName: 'movie_genres',
  timestamps: false,
});

module.exports = MovieGenre;