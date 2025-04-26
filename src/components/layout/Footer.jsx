import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/*Опис проекту*/}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Film className="h-7 w-7 text-primary" />
              <span className="text-xl font-serif font-bold">Кіноафіша</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Ваше остаточне місце для перегляду фільмів і сеансів. Знаходьте найновіші випуски, купуйте квитки та насолоджуйтеся кінотеатром.
            </p>
          </div>

          {/*Посилання*/}
          <div>
            <h3 className="text-lg font-medium mb-4">Швидкі посилання</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Головна</Link></li>
              <li><Link to="/showtimes" className="text-gray-400 hover:text-white">Сеанси</Link></li>
              <li><Link to="/search" className="text-gray-400 hover:text-white">Пошук</Link></li>
              <li><Link to="/favorites" className="text-gray-400 hover:text-white">Улюблені</Link></li>
            </ul>
          </div>

          {/*Категорії*/}
          <div>
            <h3 className="text-lg font-medium mb-4">Категорії</h3>
            <ul className="space-y-2">
              {['Бойовик', 'Драма', 'Комедія', 'Жахи', 'Документальний'].map((genre) => (
                <li key={genre}>
                  <a href="#" className="text-gray-400 hover:text-white">{genre}</a>
                </li>
              ))}
            </ul>
          </div>

          {/*Доп інфа*/}
          <div>
            <h3 className="text-lg font-medium mb-4">Контакти</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">Мельник Євгеній</p>
              <p className="mb-2">вул.Михайла Бойчука 39, Київ, 01113</p>
              <p className="mb-2">Телефон: +380968848768</p>
              <p className="mb-2">Email: melnik19@gmail.com</p>
            </address>
          </div>
        </div>

        {/*Права проекту*/}
        <div className="border-t border-gray-800 pt-6 mt-6 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Кіноафіша. Всі права захищені тімлідом</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
