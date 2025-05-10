const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MovieActor = sequelize.define('MovieActor', {
  movieId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
     references: {
        model: 'movies',
        key: 'id',
    },
  },
  actorId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
     references: {
        model: 'actors',
        key: 'id',
    },
  },
  characters: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'movie_actors',
  timestamps: false,
});

module.exports = MovieActor;