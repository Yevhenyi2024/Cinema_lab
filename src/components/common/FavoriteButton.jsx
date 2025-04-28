import { useFavorites } from '../../context/FavoritesContext';

function FavoriteButton({ movie, size = 'md' }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isInFavorites = isFavorite(movie.id);
  
  const handleToggleFavorite = () => {
    if (isInFavorites) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites({
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        rating: movie.rating
      });
    }
  };
  
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  return (
    <button 
      onClick={handleToggleFavorite}
      className={`focus:outline-none transition-transform hover:scale-110 ${isInFavorites ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
      aria-label={isInFavorites ? "Видалити з обраного" : "Додати до обраного"}
      title={isInFavorites ? "Видалити з обраного" : "Додати до обраного"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isInFavorites ? "currentColor" : "none"}
        stroke="currentColor" 
        strokeWidth="2"
        className={sizes[size]}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  );
}

export default FavoriteButton;