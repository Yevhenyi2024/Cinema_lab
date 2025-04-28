import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-secondary mr-1">Кіно</span>Афіша
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-secondary transition-colors">Головна</Link>
          <Link to="/categories" className="hover:text-secondary transition-colors">Жанри</Link>
          <Link to="/upcoming" className="hover:text-secondary transition-colors">Незабаром</Link>
          <Link to="/about" className="hover:text-secondary transition-colors">Про нас</Link>
        </nav>
        
        <div className="md:hidden">
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