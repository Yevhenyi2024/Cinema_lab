import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';

function Header() {
  const { favorites } = useFavorites();
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-secondary mr-1">Кіно</span>Афіша
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-secondary transition-colors">Головна</Link>
          <Link to="/search" className="hover:text-secondary transition-colors">Пошук</Link>
          <Link to="/sessions" className="hover:text-secondary transition-colors">Сеанси</Link>
          <Link to="/upcoming" className="hover:text-secondary transition-colors">Незабаром</Link>
          <Link to="/favorites" className="hover:text-secondary transition-colors flex items-center">
            Обране
            {favorites.length > 0 && (
              <span className="ml-1 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {favorites.length}
              </span>
            )}
          </Link>
          <Link to="/about" className="hover:text-secondary transition-colors">Про нас</Link>
        </nav>
        
        <div className="md:hidden flex items-center">
          <Link to="/favorites" className="mr-4 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {favorites.length}
              </span>
            )}
          </Link>
          
          <button className="text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;