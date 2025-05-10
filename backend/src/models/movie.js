const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poster: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
  },
  overview: {
    type: DataTypes.TEXT,
  },
  releaseDate: {
    type: DataTypes.DATEONLY,
  },
  director: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.STRING(50),
  },
  trailer: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'movies',
  timestamps: false,
});

module.exports = Movie;