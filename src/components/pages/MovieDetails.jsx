import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../../services/movieService';
import LoadingSpinner from '../common/LoadingSpinner';
import StarRating from '../common/StarRating';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        setError('Не вдалося завантажити інформацію про фільм.');
        console.error(`Error fetching movie with ID ${id}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={movie.poster} 
            alt={`Постер фільму ${movie.title}`} 
            className="w-full h-auto object-cover"
          />
        </div>
        
        <div className="md:w-2/3 p-6">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          
          <div className="flex items-center mb-4">
            <StarRating rating={movie.rating} />
            <span className="ml-2 text-gray-600">{movie.rating.toFixed(1)}/10</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Дата виходу:</p>
              <p>{movie.releaseDate}</p>
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
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Опис</h2>
            <p className="text-gray-700">{movie.overview}</p>
          </div>
          
          {movie.trailer && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Трейлер</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  src={movie.trailer} 
                  title={`Трейлер фільму ${movie.title}`}
                  className="w-full h-64 rounded-lg"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button className="btn btn-primary">
              Купити квиток
            </button>
            <Link to="/" className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
              Назад до списку
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;