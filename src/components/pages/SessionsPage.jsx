import { useEffect, useState } from 'react';
import { getSessions, getMovies, getGenresList } from '../../services/movieService';

function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({ date: '', time: '', genre: '', movieId: '' });
  const [filteredSessions, setFilteredSessions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const s = await getSessions();
      const m = await getMovies();
      const g = await getGenresList();
      setSessions(s);
      setMovies(m);
      setGenres(g);
      setFilteredSessions(s);
    };
    fetchData();
  }, []);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = e => {
    e.preventDefault();
    const result = sessions.filter(session => {
      const movie = movies.find(m => m.id === session.movieId);
      const matchDate = filters.date ? session.date === filters.date : true;
      const matchTime = filters.time ? session.time.startsWith(filters.time) : true;
      const matchGenre = filters.genre ? movie?.genres.includes(filters.genre) : true;
      const matchMovie = filters.movieId ? session.movieId === parseInt(filters.movieId) : true;
      return matchDate && matchTime && matchGenre && matchMovie;
    });
    setFilteredSessions(result);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Розклад сеансів</h1>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <input type="date" name="date" onChange={handleChange} className="input px-3 py-2 border rounded-md" />
        <input type="time" name="time" onChange={handleChange} className="input px-3 py-2 border rounded-md" />
        
        <select name="genre" onChange={handleChange} className="input px-3 py-2 border rounded-md">
          <option value="">Усі жанри</option>
          {genres.map((g, i) => (
            <option key={i} value={g}>{g}</option>
          ))}
        </select>

        <select name="movieId" onChange={handleChange} className="input px-3 py-2 border rounded-md">
          <option value="">Усі фільми</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>{movie.title}</option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary w-full sm:w-auto">Пошук</button>
      </form>

      {filteredSessions.length === 0 ? (
        <p className="text-gray-500">Немає доступних сеансів.</p>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map(s => {
            const movie = movies.find(m => m.id === s.movieId);
            return (
              <div key={s.id} className="p-4 border rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{movie?.title}</h2>
                  <p className="text-sm text-gray-600">
                    Дата: {s.date} | Час: {s.time} | Жанри: {movie?.genres.join(', ')} | Зал: {s.hall}
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