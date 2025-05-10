const express = require('express');
const cors = require('cors');
const { connectDB, syncModels } = require('./models');
const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

connectDB();
syncModels();

module.exports = app;