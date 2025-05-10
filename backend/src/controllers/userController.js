const bcrypt = require('bcryptjs');
const { User } = require('../models');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'Користувач з такою поштою вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
         id: user.id,
         username: user.username,
         email: user.email,
         role: user.role
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Помилка сервера');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Невірні дані для входу' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Невірні дані для входу' });
    }

    res.json({
         id: user.id,
         username: user.username,
         email: user.email,
         role: user.role
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Помилка сервера');
  }
};

const getCurrentUser = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};