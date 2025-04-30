
import { useEffect, useState } from 'react';
import { getMovies } from "../../../services/movieService";

function AdminShowtimes() {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [form, setForm] = useState({ id: '', movieId: '', date: '', time: '', hall: '', price: '' });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const m = await getMovies();
    const s = JSON.parse(localStorage.getItem('kino_showtimes')) || [];
    setMovies(m);
    setShowtimes(s);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'movieId' ? Number(value) : value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (form.price < 0) {
      alert('Ціна не може бути від’ємною');
      return;
    }

    let updated;
    if (isEdit) {
      updated = showtimes.map(s => s.id === form.id ? { ...form } : s);
    } else {
      updated = [...showtimes, { ...form, id: Date.now().toString() }];
    }

    localStorage.setItem('kino_showtimes', JSON.stringify(updated));
    setShowtimes(updated);
    alert(isEdit ? 'Сеанс оновлено' : 'Сеанс додано');

    setForm({ id: '', movieId: '', date: '', time: '', hall: '', price: '' });
    setIsEdit(false);
  };

  const handleEdit = show => {
    setForm({ ...show });
    setIsEdit(true);
  };

  const handleDelete = id => {
    const updated = showtimes.filter(s => s.id !== id);
    localStorage.setItem('kino_showtimes', JSON.stringify(updated));
    setShowtimes(updated);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Керування сеансами</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select name="movieId" value={form.movieId} onChange={handleChange} className="p-2 border rounded" required>
          <option value="">Оберіть фільм</option>
          {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <input name="date" type="date" value={form.date} onChange={handleChange} className="p-2 border rounded" required />
        <input name="time" type="time" value={form.time} onChange={handleChange} className="p-2 border rounded" required />
        <input name="hall" placeholder="Зал" value={form.hall} onChange={handleChange} className="p-2 border rounded" required />
        <input name="price" type="number" placeholder="Ціна" value={form.price} onChange={handleChange} className="p-2 border rounded" required />
        <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded font-semibold col-span-full">
          {isEdit ? 'Оновити сеанс' : 'Додати сеанс'}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {showtimes.map(show => {
          const movie = movies.find(m => m.id == show.movieId);
          return (
            <div key={show.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-1">{movie?.title || 'Фільм видалено'}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Дата: {show.date} | Час: {show.time} | Зал: {show.hall} | Ціна: {show.price} грн
              </p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(show)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded">Редагувати</button>
                <button onClick={() => handleDelete(show.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">Видалити</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminShowtimes;