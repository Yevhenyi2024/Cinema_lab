import { useEffect, useState } from 'react';
import { getMovies } from "../../../services/movieService";

function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    id: '',
    title: '',
    poster: '',
    rating: '',
    overview: '',
    releaseDate: '',
    genres: '',
    trailer: '',
    duration: '',
    director: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const saved = JSON.parse(localStorage.getItem('kino_movies'));
    if (saved && saved.length) {
      setMovies(saved);
    } else {
      const fetched = await getMovies();
      setMovies(fetched);
      localStorage.setItem('kino_movies', JSON.stringify(fetched));
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = movie => {
    setForm({
      ...movie,
      genres: movie.genres.join(', '),
    });
    setIsEdit(true);
  };

  const handleDelete = id => {
    const updated = movies.filter(m => m.id !== id);
    localStorage.setItem('kino_movies', JSON.stringify(updated));
    setMovies(updated);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const movieData = {
      ...form,
      genres: form.genres.split(',').map(g => g.trim()),
      rating: parseFloat(form.rating),
    };

    const updatedMovies = isEdit
      ? movies.map(m => m.id === form.id ? { ...movieData, id: m.id } : m)
      : [...movies, { ...movieData, id: Date.now() }];

    localStorage.setItem('kino_movies', JSON.stringify(updatedMovies));
    setMovies(updatedMovies);
    alert(isEdit ? 'Фільм оновлено' : 'Фільм додано');
    setForm({ id: '', title: '', poster: '', rating: '', overview: '', releaseDate: '', genres: '', trailer: '', duration: '', director: '' });
    setIsEdit(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Керування фільмами</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input name="title" placeholder="Назва" value={form.title} onChange={handleChange} className="p-2 border rounded" required />
        <input name="poster" placeholder="Посилання на постер" value={form.poster} onChange={handleChange} className="p-2 border rounded" />
        <input name="rating" placeholder="Рейтинг" value={form.rating} onChange={handleChange} className="p-2 border rounded" />
        <input name="releaseDate" placeholder="Дата релізу (рррр-мм-дд)" value={form.releaseDate} onChange={handleChange} className="p-2 border rounded" />
        <input name="genres" placeholder="Жанри (через кому)" value={form.genres} onChange={handleChange} className="p-2 border rounded" />
        <input name="trailer" placeholder="Трейлер (YouTube)" value={form.trailer} onChange={handleChange} className="p-2 border rounded" />
        <input name="duration" placeholder="Тривалість (напр. 1год 40хв)" value={form.duration} onChange={handleChange} className="p-2 border rounded" />
        <input name="director" placeholder="Режисер" value={form.director} onChange={handleChange} className="p-2 border rounded" />
        <textarea name="overview" placeholder="Опис" value={form.overview} onChange={handleChange} className="p-2 border rounded col-span-full" />
        <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded font-semibold col-span-full">
          {isEdit ? 'Оновити фільм' : 'Додати фільм'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {movies.map(movie => (
          <div key={movie.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Рейтинг: {movie.rating} | Жанри: {movie.genres.join(', ')}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(movie)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded">Редагувати</button>
              <button onClick={() => handleDelete(movie.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">Видалити</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminMovies;
