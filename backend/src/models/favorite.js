const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'users',
        key: 'id',
    },
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'movies',
        key: 'id',
    },
  },
}, {
  tableName: 'favorites',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'movieId'],
    },
  ],
});

module.exports = Favorite;