import { useEffect, useState, useCallback } from 'react';
import { getMovies, getGenresList, getShowtimes } from '../../services/movieService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';


function SessionsPage() {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [showtimes, setShowtimes] = useState([]);

    const [optionsLoading, setOptionsLoading] = useState(true);
    const [showtimesLoading, setShowtimesLoading] = useState(false);

    const [optionsError, setOptionsError] = useState(null);
    const [showtimesError, setShowtimesError] = useState(null);

    const [filters, setFilters] = useState({ date: '', time: '', genre: '', movieId: '' });

    const [searchPerformed, setSearchPerformed] = useState(false);


    // Завантаження списків фільмів та жанрів для фільтрів при монтуванні
    useEffect(() => {
        const loadOptions = async () => {
            try {
                setOptionsLoading(true);
                setOptionsError(null);

                const moviesData = await getMovies();
                const genreList = await getGenresList();

                setMovies(moviesData);
                setGenres(genreList);

            } catch (err) {
                setOptionsError(err);
                console.error('Помилка завантаження опцій фільтрів сеансів:', err);
                setMovies([]);
                setGenres([]);
            } finally {
                setOptionsLoading(false);
            }
        };

        loadOptions();
    }, []);


    const fetchShowtimes = useCallback(async (currentFilters) => {
        const searchParams = Object.fromEntries(
            Object.entries(currentFilters).filter(([_, value]) => value !== '')
        );

        try {
            setShowtimesLoading(true);
            setShowtimesError(null);

            const showtimesData = await getShowtimes(searchParams);

            setShowtimes(showtimesData);

        } catch (err) {
            setShowtimesError(err);
            console.error('Помилка завантаження або фільтрації сеансів:', err);
            setShowtimes([]);
        } finally {
            setShowtimesLoading(false);
        }

    }, []);

    useEffect(() => {
        if (!searchPerformed && !optionsLoading && !optionsError) {
            fetchShowtimes({});
        }
    }, [fetchShowtimes, optionsLoading, optionsError, searchPerformed]);


    const handleChange = e => {
        setShowtimesError(null);
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSearch = async e => {
        e.preventDefault();
        setSearchPerformed(true);
        fetchShowtimes(filters);
    };

    if (optionsLoading) {
        return <LoadingSpinner message="Завантаження фільтрів..." />;
    }

    if (optionsError) {
        return <ErrorMessage message={`Не вдалося завантажити опції фільтрів: ${optionsError.message}`} />;
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold mb-6">Розклад сеансів</h1>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 bg-gray-100 p-4 rounded shadow">
                <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleChange}
                    className="p-2 border rounded-md"
                    disabled={showtimesLoading}
                />
                <input
                    type="time"
                    name="time"
                    value={filters.time}
                    onChange={handleChange}
                    className="p-2 border rounded-md"
                    disabled={showtimesLoading}
                />

                {optionsLoading ? (
                    <select disabled className="p-2 border rounded-md">
                        <option value="">Завантаження жанрів...</option>
                    </select>
                ) : optionsError ? (
                    <select disabled className="p-2 border rounded-md text-red-600">
                        <option value="">Помилка завантаження жанрів</option>
                    </select>
                ) : (
                    <select name="genre" value={filters.genre} onChange={handleChange} className="p-2 border rounded-md" disabled={showtimesLoading}>
                        <option value="">Усі жанри</option>
                        {genres.map(g => (
                            <option key={g.id} value={g.name}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                )}

                {optionsLoading ? (
                    <select disabled className="p-2 border rounded-md">
                        <option value="">Завантаження фільмів...</option>
                    </select>
                ) : optionsError ? (
                    <select disabled className="p-2 border rounded-md text-red-600">
                        <option value="">Помилка завантаження фільмів</option>
                    </select>
                ) : (
                    <select name="movieId" value={filters.movieId} onChange={handleChange} className="p-2 border rounded-md" disabled={showtimesLoading}>
                        <option value="">Усі фільми</option>
                        {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                    </select>
                )}

                <button type="submit" className={`btn btn-primary w-full sm:w-auto col-span-full lg:col-span-1 flex items-center justify-center ${optionsLoading || showtimesLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={optionsLoading || showtimesLoading}>
                    {showtimesLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        'Пошук'
                    )}
                </button>
            </form>

            {showtimesError && <ErrorMessage message={`Не вдалося завантажити або відфільтрувати сеанси: ${showtimesError.message}`} className="mb-4" />}

            {showtimesLoading ? (
                <LoadingSpinner message="Завантаження сеансів..." />
            ) : showtimes && showtimes.length > 0 ? (
                <div className="space-y-4">
                    {showtimes.map(show => {
                        const movieTitle = show.Movie?.title || 'Фільм видалено або не знайдено';

                        return (
                            <div key={show.id} className="p-4 border rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-xl font-semibold">{movieTitle}</h3>
                                    <p className="text-sm text-gray-600">
                                        Дата: {show.date} | Час: {show.time} | Зал: {show.hall} | Ціна: {show.price} грн
                                    </p>
                                 </div>
                                <button className="btn btn-primary mt-2 sm:mt-0">Купити квиток</button>
                            </div>
                        );
                    })}
                  </div>
            ) : (
                  searchPerformed ? (
                      <p className="text-gray-600 text-center">Сеансів за заданими критеріями не знайдено.</p>
                  ) : (
                       <p className="text-gray-600 text-center">Наразі немає доступних сеансів.</p>
                   )
            )}
        </div>
    );
}

export default SessionsPage;