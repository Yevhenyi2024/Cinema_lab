import { Link } from 'react-router-dom';
import StarRating from './StarRating';

function MovieCard({ movie }) {
  const { id, title, poster, rating, overview } = movie;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <img 
        src={poster} 
        alt={`Постер фільму ${title}`} 
        className="w-full h-64 object-cover"
      />
      
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1 line-clamp-1">{title}</h2>
        
        <div className="flex items-center mb-2">
          <StarRating rating={rating} />
          <span className="ml-1 text-gray-600">{rating.toFixed(1)}</span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{overview}</p>
        
        <Link 
          to={`/movie/${id}`}
          className="btn btn-primary block text-center"
        >
          Детальніше
        </Link>
      </div>
    </div>
  );
}

export default MovieCard;