const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Actor = sequelize.define('Actor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'actors',
  timestamps: false,
});

module.exports = Actor;