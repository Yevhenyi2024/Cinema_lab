const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Showtime = sequelize.define('Showtime', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'movies',
        key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hall: {
    type: DataTypes.STRING(50),
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  tableName: 'showtimes',
  timestamps: false,
});

module.exports = Showtime;