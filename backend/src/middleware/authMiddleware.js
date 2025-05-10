const { User } = require('../models');

const protect = async (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ message: 'Ідентифікатор користувача відсутній, авторизація відсутня' });
  }

  try {
    const user = await User.findByPk(userId, {
       attributes: { exclude: ['password'] }
    });

    if (!user) {
        return res.status(401).json({ message: 'Користувач не знайдений' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Помилка в middleware protect:", error.message);
    res.status(500).json({ message: 'Помилка сервера під час авторизації' });
  }
};

// Middleware для перевірки ролі адміністратора
const authorize = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: `Користувач не має прав ${role}` });
        }
        next();
    };
};


module.exports = { protect, authorize };