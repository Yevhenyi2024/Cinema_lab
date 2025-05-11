import { useState, useEffect, useCallback } from 'react';
import { searchMovies, getGenresList, getReleaseYearsList } from '../../services/movieService';
import MovieCard from '../common/MovieCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';


function SearchPage() {
    const [query, setQuery] = useState({ title: '', genre: '', year: '', rating: '' });
    const [results, setResults] = useState([]);

    const [optionsLoading, setOptionsLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);

    const [optionsError, setOptionsError] = useState(null);
    const [searchError, setSearchError] = useState(null);


    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);


    useEffect(() => {
        const loadOptions = async () => {
            try {
                setOptionsLoading(true);
                setOptionsError(null);

                const genreList = await getGenresList();
                const yearList = await getReleaseYearsList();

                setGenres(genreList);
                setYears(yearList);

            } catch (err) {
                setOptionsError(err);
                console.error('Помилка завантаження опцій пошуку:', err);
            } finally {
                setOptionsLoading(false);
            }
        };

        loadOptions();
    }, []);


    const handleInputChange = e => {
        setSearchError(null);
        const { name, value } = e.target;
        setQuery({ ...query, [name]: value });
    };


    const handleSearch = async e => {
        e.preventDefault();

        setResults([]);
        setSearchError(null);
        setSearchLoading(true);

        const searchParams = Object.fromEntries(
             Object.entries(query).filter(([_, value]) => value !== '')
        );

        if (Object.keys(searchParams).length === 0) {
             setSearchLoading(false);
             return;
        }


        try {
            const found = await searchMovies(searchParams);
            setResults(found);
        } catch (err) {
            setSearchError(err);
            console.error('Помилка під час пошуку фільмів:', err);
        } finally {
            setSearchLoading(false);
        }
    };


    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold mb-6">Пошук фільмів</h1>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-gray-100 p-4 rounded shadow">
                <input
                    name="title"
                    value={query.title}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    placeholder="Назва фільму"
                    disabled={optionsLoading || searchLoading}
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
                    <select name="genre" value={query.genre} onChange={handleInputChange} className="p-2 border rounded-md" disabled={searchLoading}>
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
                           <option value="">Завантаження років...</option>
                      </select>
                 ) : optionsError ? (
                      <select disabled className="p-2 border rounded-md text-red-600">
                           <option value="">Помилка завантаження років</option>
                      </select>
                 ) : (
                      <select name="year" value={query.year} onChange={handleInputChange} className="p-2 border rounded-md" disabled={searchLoading}>
                           <option value="">Усі роки</option>
                           {years.map((y, idx) => (
                               <option key={idx} value={y}>{y}</option>
                           ))}
                      </select>
                 )}


                <input
                    name="rating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={query.rating}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md"
                    placeholder="Рейтинг від..."
                    disabled={optionsLoading || searchLoading}
                />

               <button type="submit" className={`btn btn-primary col-span-full sm:col-span-1 flex items-center justify-center ${searchLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={optionsLoading || searchLoading}>
                   {searchLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   ) : (
                       'Пошук'
                   )}
                </button>
            </form>

            {searchError && <ErrorMessage message={`Не вдалося виконати пошук: ${searchError.message}`} className="mb-4" />}
             {optionsError && <ErrorMessage message={`Не вдалося завантажити опції фільтрів: ${optionsError.message}`} className="mb-4" />}


            {searchLoading ? (
                  <LoadingSpinner message="Виконання пошуку..." />
            ) : results.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {results.map(movie => (
                       <MovieCard key={movie.id} movie={movie} />
                   ))}
                </div>
            ) : (
                Object.keys(query).some(key => query[key] !== '') || results.length === 0 && !searchError ? (
                      <p className="text-gray-600 text-center">Нічого не знайдено за заданими критеріями.</p>
                ) : (
                      <p className="text-gray-600 text-center">Введіть критерії та натисніть "Пошук".</p>
                )
            )}
        </div>
    );
}

export default SearchPage;
