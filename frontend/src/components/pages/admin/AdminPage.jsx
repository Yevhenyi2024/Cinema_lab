import { useState } from 'react';
import AdminMovies from './AdminMovies';
import AdminShowtimes from './AdminShowtimes';

function AdminPage() {
  const [tab, setTab] = useState('movies');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Адмін-Панель</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('movies')}
          className={`px-4 py-2 font-semibold rounded ${
            tab === 'movies' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Фільми
        </button>

        <button
          onClick={() => setTab('showtimes')}
          className={`px-4 py-2 font-semibold rounded ${
            tab === 'showtimes' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Сеанси
        </button>
      </div>

      <div>
        {tab === 'movies' ? <AdminMovies /> : <AdminShowtimes />}
      </div>
    </div>
  );
}

export default AdminPage;