import { useEffect, useState } from 'react';
import MovieCard from '../common/MovieCard';
import { searchMovies, getGenresList, getReleaseYearsList } from '../../services/movieService';

function SearchPage() {
  const [query, setQuery] = useState({ title: '', genre: '', year: '', rating: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const genreList = await getGenresList();
      const yearList = await getReleaseYearsList();
      setGenres(genreList);
      setYears(yearList);
    };
    fetchOptions();
  }, []);

  const handleInputChange = e => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleSearch = async e => {
    e.preventDefault();
    setLoading(true);
    const found = await searchMovies(query);
    setResults(found);
    setLoading(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Пошук фільмів</h1>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          name="title"
          onChange={handleInputChange}
          className="input px-3 py-2 border rounded-md"
          placeholder="Назва фільму"
        />

        <select name="genre" onChange={handleInputChange} className="input px-3 py-2 border rounded-md">
          <option value="">Усі жанри</option>
          {genres.map((g, idx) => (
            <option key={idx} value={g}>{g}</option>
          ))}
        </select>

        <select name="year" onChange={handleInputChange} className="input px-3 py-2 border rounded-md">
          <option value="">Усі роки</option>
          {years.map((y, idx) => (
            <option key={idx} value={y}>{y}</option>
          ))}
        </select>

        <input
          name="rating"
          type="number"
          min="0"
          max="10"
          step="0.1"
          onChange={handleInputChange}
          className="input px-3 py-2 border rounded-md"
          placeholder="Рейтинг від..."
        />

        <button type="submit" className="btn btn-primary col-span-full sm:col-span-1">Пошук</button>
      </form>

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map(movie => (
            <div className="p-4 border rounded-md shadow-sm" key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
          {results.length === 0 && <p>Нічого не знайдено</p>}
        </div>
      )}
    </div>
  );
}

export default SearchPage;