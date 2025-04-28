import { useFavorites } from '../../context/FavoritesContext';
import MovieCard from '../common/MovieCard';
import { Link } from 'react-router-dom';

function FavoritesPage() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Обрані фільми</h1>
        <p className="text-gray-600 mb-6">У вас поки немає обраних фільмів</p>
        <Link to="/" className="btn btn-primary">
          Переглянути фільми
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Обрані фільми</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;