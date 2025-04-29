import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../common/MovieCard';
import { getMovies } from '../../services/movieService';
import LoadingSpinner from '../common/LoadingSpinner';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        setError('Не вдалося завантажити фільми. Спробуйте ще раз пізніше.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          className="btn btn-primary mt-4"
          onClick={() => window.location.reload()}
        >
          Спробувати знову
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">Актуальні фільми та новинки</h1>

        <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center">
          <input
            type="text"
            placeholder="Пошук за назвою фільму..."
            className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            Пошук
          </button>
        </form>

        {filteredMovies.length === 0 ? (
          <p className="text-gray-600">Фільми не знайдено.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;