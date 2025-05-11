import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { getMovies, createMovie, updateMovie, deleteMovie, getGenresList } from "../../../services/movieService";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';

function AdminMovies() {
    const { loadingInitial, isAuthenticated, isAdmin } = useAuth();

    const [movies, setMovies] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(false);
    const [moviesError, setMoviesError] = useState(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState({});
    const [deleteError, setDeleteError] = useState(null);

    const [availableGenres, setAvailableGenres] = useState([]);
    const [genresLoading, setGenresLoading] = useState(false);
    const [genresError, setGenresError] = useState(null);

    const [form, setForm] = useState({
        id: null,
        title: '',
        poster: '',
        rating: '',
        overview: '',
        releaseDate: '',
        genreIds: [],
        genreNames: [],
        trailer: '',
        duration: '',
        director: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (loadingInitial || !isAdmin) {
            setLoadingMovies(false);
            setGenresLoading(false);
            setMovies([]);
            setAvailableGenres([]);
            setMoviesError(null);
            setGenresError(null);
            return;
        }

        const loadData = async () => {
            try {
                setLoadingMovies(true);
                setMoviesError(null);
                const moviesData = await getMovies();
                setMovies(moviesData);
            } catch (err) {
                setMoviesError(err);
                console.error("Помилка завантаження списку фільмів:", err);
                setMovies([]);
            } finally {
                setLoadingMovies(false);
            }

            try {
                setGenresLoading(true);
                setGenresError(null);
                const genresData = await getGenresList();
                setAvailableGenres(genresData);
            } catch (err) {
                setGenresError(err);
                console.error("Помилка завантаження списку жанрів:", err);
                setAvailableGenres([]);
            } finally {
                setGenresLoading(false);
            }
        };

        loadData();
    }, [isAdmin, loadingInitial]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setSubmitError(null);
    };

    const handleGenreChange = (selectedGenreNames) => {
        setForm({ ...form, genreNames: selectedGenreNames });
        setSubmitError(null);
    };

    const handleEdit = movie => {
        const movieGenreNames = movie.genres ? movie.genres.map(genre => genre.name) : [];
        const movieGenreIds = movie.genres ? movie.genres.map(genre => genre.id) : [];

        setForm({
            id: movie.id,
            title: movie.title,
            poster: movie.poster,
            rating: movie.rating !== null && movie.rating !== undefined ? String(movie.rating) : '',
            overview: movie.overview,
            releaseDate: movie.releaseDate || '',
            genreIds: movieGenreIds,
            genreNames: movieGenreNames,
            trailer: movie.trailer || '',
            duration: movie.duration || '',
            director: movie.director || ''
        });
        setIsEdit(true);
        setSubmitError(null);
        setDeleteError(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей фільм?")) {
            return;
        }

        setDeleteLoading(prev => ({ ...prev, [id]: true }));
        setDeleteError(null);

        try {
            const movieIdToDelete = parseInt(id, 10);
            await deleteMovie(movieIdToDelete);
            setMovies(movies.filter(m => m.id !== movieIdToDelete));
            console.log(`Фільм з ID ${movieIdToDelete} успішно видалено.`);

            if (form.id === movieIdToDelete) {
                resetForm();
            }

        } catch (err) {
            setDeleteError(err);
            console.error(`Помилка видалення фільму з ID ${id}:`, err);
            alert(`Не вдалося видалити фільм: ${err.message}`);
        } finally {
            setDeleteLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        setSubmitting(true);
        setSubmitError(null);

        try {
            const ratingValue = form.rating === '' ? null : parseFloat(form.rating);
            const finalRating = (ratingValue !== null && !isNaN(ratingValue)) ? ratingValue : null;

            const selectedGenreIds = form.genreNames
                .map(name => {
                    const genre = availableGenres.find(g => g.name === name);
                    return genre ? genre.id : null;
                })
                .filter(id => id !== null);

            const movieDataToSend = {
                title: form.title,
                poster: form.poster,
                rating: finalRating,
                overview: form.overview,
                releaseDate: form.releaseDate || null,
                genreIds: selectedGenreIds,
                trailer: form.trailer || null,
                duration: form.duration || null,
                director: form.director || null
            };

            let resultMovie;
            if (isEdit) {
                const movieIdToUpdate = parseInt(form.id, 10);
                if (isNaN(movieIdToUpdate)) {
                    throw new Error("Invalid movie ID for update.");
                }
                resultMovie = await updateMovie(movieIdToUpdate, movieDataToSend);
                setMovies(movies.map(m => m.id === resultMovie.id ? resultMovie : m));
                alert('Фільм успішно оновлено!');
            } else {
                resultMovie = await createMovie(movieDataToSend);
                setMovies([...movies, resultMovie]);
                alert('Фільм успішно додано!');
            }

            resetForm();

        } catch (err) {
            setSubmitError(err);
            console.error("Помилка відправки форми фільму:", err);
            alert(`Не вдалося зберегти фільм: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({
            id: null,
            title: '',
            poster: '',
            rating: '',
            overview: '',
            releaseDate: '',
            genreIds: [],
            genreNames: [],
            trailer: '',
            duration: '',
            director: ''
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

    if (loadingMovies || genresLoading) {
        return <LoadingSpinner message="Завантаження даних фільмів та жанрів..." />;
    }

    if (moviesError || genresError) {
        return (
            <ErrorMessage message={`Не вдалося завантажити дані: ${moviesError?.message || genresError?.message}`} />
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Керування фільмами</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded shadow">
                <h3 className="text-xl font-semibold col-span-full mb-2">{isEdit ? 'Редагувати фільм' : 'Додати новий фільм'}</h3>

                <input name="title" placeholder="Назва" value={form.title} onChange={handleChange} className="p-2 border rounded" required disabled={submitting} />
                <input name="poster" placeholder="Посилання на постер" value={form.poster} onChange={handleChange} className="p-2 border rounded" disabled={submitting} />
                <input name="rating" placeholder="Рейтинг (число)" value={form.rating} onChange={handleChange} className="p-2 border rounded" type="number" step="0.1" min="0" max="10" disabled={submitting} />
                <input name="releaseDate" placeholder="Дата релізу" value={form.releaseDate} onChange={handleChange} className="p-2 border rounded" type="date" disabled={submitting} />

                <select
                    multiple
                    value={form.genreNames}
                    onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions);
                        const selectedValues = selectedOptions.map(option => option.value);
                        handleGenreChange(selectedValues);
                    }}
                    className="p-2 border rounded col-span-full md:col-span-1"
                    disabled={submitting || genresLoading || availableGenres.length === 0}
                    size="5"
                >
                    {genresLoading ? (
                        <option disabled value="">Завантаження жанрів...</option>
                    ) : genresError ? (
                        <option disabled value="" className="text-red-500">Помилка завантаження жанрів</option>
                    ) : availableGenres && availableGenres.length > 0 ? (
                        availableGenres.map(genre => (
                        <option key={genre.id} value={genre.name}>{genre.name}
</option>
                        ))
                    ) : (
                        <option disabled value="">Немає доступних жанрів</option>
                    )}
                </select>

                <input name="trailer" placeholder="Трейлер (посилання)" value={form.trailer} onChange={handleChange} className="p-2 border rounded" disabled={submitting} />
                <input name="duration" placeholder="Тривалість (напр. 1год 40хв)" value={form.duration} onChange={handleChange} className="p-2 border rounded" disabled={submitting} />
                <input name="director" placeholder="Режисер" value={form.director} onChange={handleChange} className="p-2 border rounded" disabled={submitting} />

                <textarea name="overview" placeholder="Опис" value={form.overview} onChange={handleChange} className="p-2 border rounded col-span-full" disabled={submitting} />

                {submitError && (
                    <ErrorMessage message={`Помилка: ${submitError.message}`} className="col-span-full" />
                )}

                <button type="submit" className={`bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded font-semibold col-span-full flex items-center justify-center ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={submitting}>
                    {submitting ? (
                        <svg className="animate-spin h-5 w-5 text-black mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        isEdit ? 'Оновити фільм' : 'Додати фільм'
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movies && movies.length > 0 ? (
                    movies.map(movie => (
                        <div key={movie.id} className="border p-4 rounded shadow bg-white flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-1 line-clamp-1">{movie.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Рейтинг: {typeof movie.rating === 'number' && !isNaN(movie.rating) ? movie.rating.toFixed(1) : 'N/A'} |
                                    Жанри: {movie.genres && Array.isArray(movie.genres) ? movie.genres.map(g => g.name).join(', ') : 'Не вказано'}
                                </p>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-3">{movie.overview}</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => handleEdit(movie)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded" disabled={submitting || deleteLoading[movie.id]}>
                                    Редагувати
                                </button>
                                <button onClick={() => handleDelete(movie.id)} className={`bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded flex items-center justify-center ${deleteLoading[movie.id] ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={submitting || deleteLoading[movie.id]}>
                                    {deleteLoading[movie.id] ? (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        'Видалити'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    !loadingMovies && !moviesError && (
                        <p className="text-center text-gray-500 col-span-full">Фільмів для керування не знайдено.</p>
                    )
                )}
            </div>
        </div>
    );
}

export default AdminMovies;
