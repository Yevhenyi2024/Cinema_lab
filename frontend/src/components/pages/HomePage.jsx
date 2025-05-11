import { useState, useEffect, useCallback } from 'react';
import { getMovies, searchMovies } from '../../services/movieService';
import LoadingSpinner from '../common/LoadingSpinner';
import MovieCard from '../common/MovieCard';

function HomePage() {
    const [movies, setMovies] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchMovies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let data;
            if (searchQuery) {
                data = await searchMovies({ title: searchQuery });
            } else {
                data = await getMovies();
            }
            setMovies(data);

        } catch (err) {
            setError(new Error('Не вдалося завантажити фільми. Спробуйте ще раз пізніше.'));
            console.error('Помилка отримання або пошуку фільмів:', err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);


    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);


    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput.trim());
    };

    const handleClearSearch = () => {
         setSearchInput('');
         setSearchQuery('');
    };


    if (loading) {
        return <LoadingSpinner message="Завантаження фільмів..." />;
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 text-lg">{error.message}</p>
                <button
                    className="btn btn-primary mt-4"
                    onClick={fetchMovies}
                >
                    Спробувати завантажити знову
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <section>
                <h1 className="text-3xl font-bold mb-6">Актуальні фільми та новинки</h1>

                <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                    <input
                        type="text"
                        placeholder="Пошук за назвою фільму..."
                        className="w-full sm:flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={loading}>
                        Пошук
                    </button>
                     {searchQuery && (
                         <button type="button" onClick={handleClearSearch} className="btn btn-secondary w-full sm:w-auto" disabled={loading}>
                         Скинути пошук
                         </button>
                     )}
                </form>

                 {movies.length === 0 && searchQuery ? (
                      <p className="text-gray-600">За запитом "{searchQuery}" фільми не знайдено.</p>
                 ) : movies.length === 0 && !searchQuery ? (
                      <p className="text-gray-600">Наразі немає доступних фільмів.</p>
                 ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {movies.map(movie => (
                              <MovieCard key={movie.id} movie={movie} />
                          ))}
                       </div>
                 )}
            </section>

        </div>
    );
}

export default HomePage;