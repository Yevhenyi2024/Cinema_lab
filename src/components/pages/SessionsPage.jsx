import { useEffect, useState } from 'react';
import { getMovies, getGenresList, getShowtimes } from '../../services/movieService';

function SessionsPage() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({ date: '', time: '', genre: '', movieId: '' });
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const s = await getShowtimes();
      const m = await getMovies();
      const g = await getGenresList();
      setShowtimes(s);
      setMovies(m);
      setGenres(g);
      setFiltered(s);
    };
    fetchData();
  }, []);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = e => {
    e.preventDefault();
    const result = showtimes.filter(show => {
      const movie = movies.find(m => m.id === show.movieId);
      const matchDate = filters.date ? show.date === filters.date : true;
      const matchTime = filters.time ? show.time.startsWith(filters.time) : true;
      const matchGenre = filters.genre ? movie?.genres.includes(filters.genre) : true;
      const matchMovie = filters.movieId ? show.movieId === parseInt(filters.movieId) : true;
      return matchDate && matchTime && matchGenre && matchMovie;
    });
    setFiltered(result);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Розклад сеансів</h1>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <input type="date" name="date" onChange={handleChange} className="input px-3 py-2 border rounded-md" />
        <input type="time" name="time" onChange={handleChange} className="input px-3 py-2 border rounded-md" />
        <select name="genre" onChange={handleChange} className="input px-3 py-2 border rounded-md">
          <option value="">Усі жанри</option>
          {genres.map((g, i) => <option key={i} value={g}>{g}</option>)}
        </select>
        <select name="movieId" onChange={handleChange} className="input px-3 py-2 border rounded-md">
          <option value="">Усі фільми</option>
          {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <button type="submit" className="btn btn-primary w-full sm:w-auto">Пошук</button>
      </form>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Немає доступних сеансів.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map(show => {
            const movie = movies.find(m => m.id === show.movieId);
            return (
              <div key={show.id} className="p-4 border rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{movie?.title}</h2>
                  <p className="text-sm text-gray-600">
                    Дата: {show.date} | Час: {show.time} | Зал: {show.hall} | Ціна: {show.price} грн
                  </p>
                </div>
                <button className="btn btn-secondary">Купити квиток</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SessionsPage;
