import { Link } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../../services/authService';

function Header() {
  const user = getCurrentUser();

  return (
    <header className="bg-primary text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold flex items-center gap-1">
          <span className="text-yellow-400">Кіно</span>Афіша
        </Link>

        <nav className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-yellow-300 transition-colors">Головна</Link>
          <Link to="/search" className="hover:text-yellow-300 transition-colors">Пошук</Link>
          <Link to="/favorites" className="hover:text-yellow-300 transition-colors">Обране</Link>
          <Link to="/sessions" className="hover:text-yellow-300 transition-colors">Сеанси</Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-yellow-300 transition-colors">Адмін-Панель</Link>
          )}

          {user ? (
            <>
              <span className="text-sm italic ml-2">{user.username}</span>
              <button
                onClick={() => { logoutUser(); window.location.reload(); }}
                className="ml-4 hover:text-red-400 transition-colors"
              >
                Вийти
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-yellow-300 transition-colors">Вхід</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
