import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById, getMovieCast, getShowtimes } from '../../services/movieService';
import LoadingSpinner from '../common/LoadingSpinner';
import StarRating from '../common/StarRating';
import ActorCard from '../common/ActorCard';
import FavoriteButton from '../common/FavoriteButton';
import ErrorMessage from '../common/ErrorMessage';
import ShowtimeDisplay from './ShowtimeDisplay';


function MovieDetails() {
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [showtimes, setShowtimes] = useState([]);

    const [loadingMovie, setLoadingMovie] = useState(true);
    const [loadingCast, setLoadingCast] = useState(true);
    const [loadingShowtimes, setLoadingShowtimes] = useState(true);

    const [movieError, setMovieError] = useState(null);
    const [castError, setCastError] = useState(null);
    const [showtimesError, setShowtimesError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            setMovie(null);
            setCast([]);
            setShowtimes([]);
            setMovieError(null);
            setCastError(null);
            setShowtimesError(null);

            try {
                setLoadingMovie(true);
                const movieData = await getMovieById(id);
                setMovie(movieData);
            } catch (err) {
                setMovieError(err);
                console.error(`Помилка завантаження фільму з ID ${id}:`, err);
            } finally {
                setLoadingMovie(false);
            }

            try {
                setLoadingCast(true);
                const castData = await getMovieCast(id);
                setCast(castData);
            } catch (err) {
                setCastError(err);
                console.error(`Помилка завантаження акторського складу для фільму з ID ${id}:`, err);
            } finally {
                setLoadingCast(false);
            }

            try {
                setLoadingShowtimes(true);
                const showtimesData = await getShowtimes({ movieId: id });
                setShowtimes(showtimesData);
            } catch (err) {
                setShowtimesError(err);
                console.error(`Помилка завантаження сеансів для фільму з ID ${id}:`, err);
            } finally {
                setLoadingShowtimes(false);
            }
        };

        fetchData();
    }, [id]);


    if (loadingMovie || loadingCast || loadingShowtimes) {
        return <LoadingSpinner message="Завантаження даних фільму..." />;
    }

    if (movieError) {
         return (
             <div className="container mx-auto p-4">
                  <ErrorMessage message={`Не вдалося завантажити інформацію про фільм: ${movieError.message}`} />
                  <div className="text-center mt-4">
                      <Link to="/" className="btn btn-primary">
                           Повернутися на головну
                      </Link>
                   </div>
             </div>
         );
       }

    if (!movie) {
         return (
            <div className="text-center py-10">
                 <p className="text-gray-600 text-lg">Фільм не знайдено.</p>
                 <Link to="/" className="btn btn-primary mt-4">
                   Повернутися на головну
                 </Link>
             </div>
         );
    }

    const isValidRating = typeof movie.rating === 'number' && !isNaN(movie.rating);
    const formattedRating = isValidRating ? movie.rating.toFixed(1) : 'N/A';


    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
                <div className="md:w-1/3 relative">
                    <img
                        src={movie.poster}
                        alt={`Постер фільму ${movie.title}`}
                        className="w-full h-auto object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4">
                        <FavoriteButton movie={movie} size="lg" />
                    </div>
                </div>

                <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                    </div>

                     {isValidRating && (
                            <div className="flex items-center mb-4">
                                <StarRating rating={movie.rating} />
                                <span className="ml-2 text-gray-600">{formattedRating}/10</span>
                           </div>
                     )}


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {movie.releaseDate && (
                             <div>
                                 <p className="text-gray-600">Дата виходу:</p>
                                 <p>{movie.releaseDate} ({new Date(movie.releaseDate).getFullYear()})</p>
                             </div>
                        )}
                        {movie.director && (
                             <div>
                                 <p className="text-gray-600">Режисер:</p>
                                 <p>{movie.director}</p>
                             </div>
                        )}
                        {movie.genres && Array.isArray(movie.genres) && movie.genres.length > 0 && (
                              <div>
                                  <p className="text-gray-600">Жанри:</p>
                                  <p>{movie.genres.map(genre => genre.name).join(', ')}</p>
                              </div>
                        )}
                         {movie.duration && (
                                <div>
                                    <p className="text-gray-600">Тривалість:</p>
                                    <p>{movie.duration}</p>
                                </div>
                           )}
                        {movie.countries && Array.isArray(movie.countries) && movie.countries.length > 0 && (
                             <div>
                                 <p className="text-gray-600">Країни:</p>
                                 <p>{movie.countries.join(', ')}</p>
                             </div>
                        )}
                    </div>

                    {movie.overview && (
                           <div className="mb-6">
                               <h2 className="text-xl font-semibold mb-2">Опис</h2>
                               <p className="text-gray-700">{movie.overview}</p>
                           </div>
                    )}


                    <div className="flex flex-wrap gap-4">
                           <button className="btn btn-primary">
                              Купити квиток
                           </button>
                           <Link to="/" className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
                              Назад до списку
                           </Link>
                    </div>
                </div>
            </div>

             <div className="p-6 border-t border-gray-200">
                  <h2 className="text-2xl font-semibold mb-4">Сеанси</h2>
                  {loadingShowtimes ? (
                       <LoadingSpinner message="Завантаження сеансів..." />
                  ) : showtimesError ? (
                       <ErrorMessage message={`Не вдалося завантажити сеанси: ${showtimesError.message}`} />
                  ) : showtimes && showtimes.length > 0 ? (
                    <ShowtimeDisplay showtimes={showtimes} />
                  ) : (
                       <p className="text-gray-500">Наразі немає доступних сеансів для цього фільму.</p>
                  )}
             </div>


            {movie.trailer && (
                   <div className="p-6 border-t border-gray-200">
                       <h2 className="text-2xl font-semibold mb-4">Трейлер</h2>
                       {movie.trailer.includes('youtube.com') || movie.trailer.includes('youtu.be') ? (
                           <div className="aspect-w-16 aspect-h-9 relative h-0 pb-[56.25%]">
                                <iframe
                                   src={movie.trailer.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                   title={`Трейлер фільму ${movie.title}`}
                                   className="absolute top-0 left-0 w-full h-full rounded-lg"
                                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                   allowFullScreen
                                ></iframe>
                            </div>
                       ) : (
                           <a href={movie.trailer} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Переглянути трейлер ({movie.trailer})
                           </a>
                       )}
                   </div>
            )}


            <div className="p-6 border-t border-gray-200">
                <h2 className="text-2xl font-semibold mb-4">Акторський склад</h2>

                {loadingCast ? (
                    <LoadingSpinner message="Завантаження акторського складу..." />
                ) : castError ? (
                     <ErrorMessage message={`Не вдалося завантажити акторський склад: ${castError.message}`} />
                ) : cast && cast.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {cast.map(actor => (
                            <ActorCard key={actor.id} actor={actor} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Інформація про акторський склад відсутня.</p>
                )}
            </div>

             <div className="p-6 border-t border-gray-200 text-center">
                   <Link to="/" className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
                      Назад до списку фільмів
                   </Link>
             </div>

        </div>
    );
}

export default MovieDetails;