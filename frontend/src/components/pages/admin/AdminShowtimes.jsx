import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { getMovies, getShowtimes, createShowtime, updateShowtime, deleteShowtime } from "../../../services/movieService";
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';


function AdminShowtimes() {
    const { currentUser, loadingInitial, isAuthenticated, isAdmin } = useAuth();

    const [movies, setMovies] = useState([]);
    const [showtimes, setShowtimes] = useState([]);

    const [loadingMovies, setLoadingMovies] = useState(false);
    const [moviesError, setMoviesError] = useState(null);
    const [loadingShowtimes, setLoadingShowtimes] = useState(false);
    const [showtimesError, setShowtimesError] = useState(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState(null);

    const [form, setForm] = useState({
        id: null,
        movieId: '', // ID фільму (число)
        date: '', // Дата (рядок 'YYYY-MM-DD')
        time: '', // Час (рядок 'HH:MM')
        hall: '', // Зал (рядок)
        price: '', // Ціна (число, може бути рядком для input)
    });
    const [isEdit, setIsEdit] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        if (loadingInitial || !isAdmin) {
            setLoadingMovies(false);
            setLoadingShowtimes(false);
            setMovies([]);
            setShowtimes([]);
            setMoviesError(null);
            setShowtimesError(null);
            return;
        }

        const loadInitialData = async () => {
            try {
                setLoadingMovies(true);
                setMoviesError(null);
                const moviesData = await getMovies();
                setMovies(moviesData);
            } catch (err) {
                setMoviesError(err);
                console.error("Помилка завантаження списку фільмів для сеансів:", err);
                setMovies([]);
            } finally {
                setLoadingMovies(false);
            }

            try {
                setLoadingShowtimes(true);
                setShowtimesError(null);
                const showtimesData = await getShowtimes();
                setShowtimes(showtimesData);
            } catch (err) {
                setShowtimesError(err);
                console.error("Помилка завантаження списку сеансів:", err);
                setShowtimes([]);
            } finally {
                setLoadingShowtimes(false);
            }
        };

        loadInitialData();
    }, [isAdmin, loadingInitial]);


    const handleChange = e => {
        setSubmitError(null);
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === 'movieId' || name === 'price' ? Number(value) : value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (form.price < 0 || isNaN(form.price)) {
            setSubmitError(new Error('Ціна повинна бути невід’ємним числом.'));
            return;
        }
        if (!form.movieId || isNaN(form.movieId)) {
            setSubmitError(new Error('Будь ласка, оберіть фільм.'));
            return;
        }
        if (!form.date) {
            setSubmitError(new Error('Будь ласка, оберіть дату.'));
            return;
        }
        if (!form.time) {
            setSubmitError(new Error('Будь ласка, оберіть час.'));
            return;
        }
        if (!form.hall.trim()) {
            setSubmitError(new Error('Будь ласка, введіть назву залу.'));
            return;
        }

        setSubmitting(true);
        setSubmitError(null);

        try {
            const showtimeDataToSend = {
                movieId: Number(form.movieId),
                date: form.date,
                time: form.time,
                hall: form.hall,
                price: Number(form.price),
            };

            let resultShowtime;
            if (isEdit && form.id !== null) {
                const showtimeIdToUpdate = form.id;
                if (showtimeIdToUpdate === null || showtimeIdToUpdate === undefined) {
                    throw new Error("Invalid showtime ID for update.");
                }
                resultShowtime = await updateShowtime(showtimeIdToUpdate, showtimeDataToSend);
                setShowtimes(showtimes.map(s => s.id === resultShowtime.id ? resultShowtime : s));
                alert('Сеанс успішно оновлено!');
            } else {
                resultShowtime = await createShowtime(showtimeDataToSend);
                setShowtimes([...showtimes, resultShowtime]);
                alert('Сеанс успішно додано!');
            }

            resetForm();

        } catch (err) {
            setSubmitError(err);
            console.error("Помилка відправки форми сеансу:", err);
            alert(`Не вдалося зберегти сеанс: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = show => {
        setForm({
            id: show.id,
            movieId: show.movieId,
            date: show.date,
            time: show.time,
            hall: show.hall,
            price: String(show.price),
        });
        setIsEdit(true);
        setSubmitError(null);
        setDeleteError(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей сеанс?")) {
            return;
        }

        setDeleteLoading(prev => ({ ...prev, [id]: true }));
        setDeleteError(null);

        try {
            await deleteShowtime(id);
            setShowtimes(showtimes.filter(s => s.id !== id));
            console.log(`Сеанс з ID ${id} успішно видалено.`);

            if (form.id === id) {
                resetForm();
            }

        } catch (err) {
            setDeleteError(err);
            console.error(`Помилка видалення сеансу з ID ${id}:`, err);
            alert(`Не вдалося видалити сеанс: ${err.message}`);
        } finally {
            setDeleteLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    const resetForm = () => {
        setForm({
            id: null,
            movieId: '',
            date: '',
            time: '',
            hall: '',
            price: '',
        });
        setIsEdit(false);
        setSubmitError(null);
        setDeleteError(null);
    };

    if (loadingInitial) {
        return <LoadingSpinner message="Завантаження даних користувача..." />;
    }

    if (!isAuthenticated() || !isAdmin) {
        return <ErrorMessage message="Доступ заборонено. Необхідні права адміністратора." />;
    }

    if (loadingMovies || loadingShowtimes) {
        return <LoadingSpinner message="Завантаження даних сеансів..." />;
    }

    if (moviesError || showtimesError) {
        return (
            <ErrorMessage message={`Не вдалося завантажити дані: ${moviesError?.message || showtimesError?.message}`} />
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Керування сеансами</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded shadow">
                <h3 className="text-xl font-semibold col-span-full mb-2">{isEdit ? 'Редагувати сеанс' : 'Додати новий сеанс'}</h3>

                <select name="movieId" value={form.movieId} onChange={handleChange} className="p-2 border rounded" required disabled={submitting || movies.length === 0}>
                    <option value="">Оберіть фільм</option>
                    {movies && movies.length > 0 ? (
                        movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)
                    ) : (
                        <option value="" disabled>Немає доступних фільмів</option>
                    )}
                </select>

                <input name="date" type="date" value={form.date} onChange={handleChange} className="p-2 border rounded" required disabled={submitting} />
                <input name="time" type="time" value={form.time} onChange={handleChange} className="p-2 border rounded" required disabled={submitting} />
                <input name="hall" placeholder="Зал" value={form.hall} onChange={handleChange} className="p-2 border rounded" required disabled={submitting} />
                <input name="price" type="number" placeholder="Ціна" value={form.price} onChange={handleChange} className="p-2 border rounded" required step="0.01" min="0" disabled={submitting} />

                {submitError && (
                    <ErrorMessage message={`Помилка: ${submitError.message}`} className="col-span-full" />
                )}

                <button type="submit" className={`bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded font-semibold col-span-full flex items-center justify-center ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={submitting}>
                    {submitting ? (
                        <svg className="animate-spin h-5 w-5 text-black mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        isEdit ? 'Оновити сеанс' : 'Додати сеанс'
                    )}
                </button>

                {isEdit && (
                    <button type="button" onClick={resetForm} className="bg-gray-300 hover:bg-gray-400 text-black py-2 rounded font-semibold col-span-full md:col-span-1">
                        Скасувати редагування
                    </button>
                )}
            </form>

            {deleteError && (
                <ErrorMessage message={`Помилка видалення: ${deleteError.message}`} className="mb-4" />
            )}

            <div className="grid grid-cols-1 gap-4">
                {showtimes && showtimes.length > 0 ? (
                    showtimes.map(show => {
                        const movieTitle = show.Movie?.title || 'Фільм видалено або не знайдено';

                        return (
                            <div key={show.id} className="border p-4 rounded shadow bg-white flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold mb-1">{movieTitle}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Дата: {show.date} | Час: {show.time} | Зал: {show.hall} | Ціна: {show.price} грн
                                    </p>
                                 </div>
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => handleEdit(show)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded" disabled={submitting || deleteLoading[show.id]}>
                                        Редагувати
                                    </button>
                                    <button onClick={() => handleDelete(show.id)} className={`bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded flex items-center justify-center ${deleteLoading[show.id] ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={submitting || deleteLoading[show.id]}>
                                        {deleteLoading[show.id] ? (
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        ) : (
                                            'Видалити'
                                        )}
                                    </button>
                                 </div>
                            </div>
                        );
                    })
                ) : (
                    !loadingShowtimes && !showtimesError && (
                        <p className="text-center text-gray-500 col-span-full">Сеансів для керування не знайдено.</p>
                    )
                )}
            </div>
        </div>
    );
}
export default AdminShowtimes;