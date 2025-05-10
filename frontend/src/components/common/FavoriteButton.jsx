import { useFavorites } from '../../context/FavoritesContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState } from 'react';

function FavoriteButton({ movie, size = 'md' }) {
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    isAuthenticated,
    loading: contextLoading,
  } = useFavorites();

  const isInFavorites = isFavorite(movie.id);
  const [isToggling, setIsToggling] = useState(false);
  const iconSize = size === 'lg' ? 24 : 18;
  const userAuthenticated = isAuthenticated();

  const handleToggleFavorite = async () => {
    if (!userAuthenticated) {
      alert("Будь ласка, увійдіть, щоб додати фільм до обраного.");
      return;
    }

    if (isToggling) return;

    setIsToggling(true);

    try {
      if (isInFavorites) {
        await removeFromFavorites(movie.id);
      } else {
        await addToFavorites(movie);
      }
    } catch (error) {
      console.error("Помилка зміни стану обраного:", error);
      alert(`Не вдалося оновити обране: ${error.message}`);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={!userAuthenticated || isToggling || contextLoading}
      className={`
        p-2 rounded-full
        ${isInFavorites ? 'text-red-500 bg-red-100' : 'text-gray-500 bg-gray-100 hover:text-red-500 hover:bg-red-200'}
        ${(!userAuthenticated || isToggling || contextLoading) ? 'opacity-50 cursor-not-allowed' : ''}
        transition-colors duration-200
        flex items-center justify-center
      `}
      title={isInFavorites ? "Видалити з обраного" : (userAuthenticated ? "Додати до обраного" : "Увійдіть, щоб додати до обраного")}
      aria-label={isInFavorites ? "Видалити з обраного" : "Додати до обраного"}
    >
      {(isToggling || contextLoading) ? (
        <svg className={`animate-spin`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ height: iconSize, width: iconSize }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM6 17.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        isInFavorites ? <FaHeart size={iconSize} /> : <FaRegHeart size={iconSize} />
      )}
    </button>
  );
}

export default FavoriteButton;
