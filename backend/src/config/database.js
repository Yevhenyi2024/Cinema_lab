const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('З’єднання з базою даних успішно встановлено.');
  } catch (error) {
    console.error('Не вдається підключитися до бази даних:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };