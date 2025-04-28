import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById, getMovieCast } from '../../services/movieService';
import LoadingSpinner from '../common/LoadingSpinner';
import StarRating from '../common/StarRating';
import ActorCard from '../common/ActorCard';
import FavoriteButton from '../common/FavoriteButton';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [castLoading, setCastLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieById(id);
        setMovie(movieData);

        setCastLoading(true);
        const castData = await getMovieCast(parseInt(id));
        setCast(castData);
      } catch (err) {
        setError('Не вдалося завантажити інформацію про фільм.');
        console.error(`Error fetching movie with ID ${id}:`, err);
      } finally {
        setLoading(false);
        setCastLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !movie) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-lg">{error || 'Фільм не знайдено'}</p>
        <Link to="/" className="btn btn-primary mt-4">
          Повернутися на головну
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Шапка з постером та основною інформацією */}
      <div className="md:flex">
        <div className="md:w-1/3 relative">
          <img
            src={movie.poster}
            alt={`Постер фільму ${movie.title}`}
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-4 right-4">
            <FavoriteButton movie={movie} size="lg" />
          </div>
        </div>

        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          </div>

          <div className="flex items-center mb-4">
            <StarRating rating={movie.rating} />
            <span className="ml-2 text-gray-600">{movie.rating.toFixed(1)}/10</span>
          </div>

          {/* Основна інформація про фільм */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Дата виходу:</p>
              <p>{movie.releaseDate} ({new Date(movie.releaseDate).getFullYear()})</p>
            </div>
            <div>
              <p className="text-gray-600">Режисер:</p>
              <p>{movie.director}</p>
            </div>
            <div>
              <p className="text-gray-600">Жанри:</p>
              <p>{movie.genres.join(', ')}</p>
            </div>
            <div>
              <p className="text-gray-600">Тривалість:</p>
              <p>{movie.duration}</p>
            </div>
            {movie.countries && (
              <div>
                <p className="text-gray-600">Країни:</p>
                <p>{movie.countries.join(', ')}</p>
              </div>
            )}
          </div>

          {/* Опис фільму */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Опис</h2>
            <p className="text-gray-700">{movie.overview}</p>
          </div>

          {/* Кнопки дій */}
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

      {/* Трейлер фільму */}
      {movie.trailer && (
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Трейлер</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={movie.trailer}
              title={`Трейлер фільму ${movie.title}`}
              className="w-full h-96 rounded-lg"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Акторський склад */}
      <div className="p-6 border-t border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Акторський склад</h2>

        {castLoading ? (
          <LoadingSpinner />
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
    </div>
  );
}

export default MovieDetails;